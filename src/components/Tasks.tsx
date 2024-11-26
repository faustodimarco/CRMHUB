import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getTasks, addTask, updateTask, deleteTask, updateTaskPosition, type Task } from "@/services/taskService";

const TaskDialog = ({ 
  task, 
  onSubmit, 
  onClose 
}: { 
  task?: Task; 
  onSubmit: (data: Partial<Task>) => void; 
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState(task?.status ?? "todo");
  const [priority, setPriority] = useState(task?.priority ?? "medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="w-full p-2 border rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value as Task['status'])}
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>
      <select
        className="w-full p-2 border rounded"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task['priority'])}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button type="submit">{task ? "Update" : "Create"} Task</Button>
    </form>
  );
};

const Tasks = () => {
  const [editTask, setEditTask] = useState<Task | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const addTaskMutation = useMutation({
    mutationFn: (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => addTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "Task added successfully" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: number } & Partial<Task>) => updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "Task updated successfully" });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "Task deleted successfully" });
    },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceColumnId = result.source.droppableId;
    const destinationColumnId = result.destination.droppableId;

    const taskToMove = tasks.find((t: Task) => t.id === parseInt(result.draggableId));
    if (!taskToMove) return;

    const updates: Partial<Task> = {
      position: destinationIndex,
    };

    if (sourceColumnId !== destinationColumnId) {
      updates.status = destinationColumnId;
    }

    await updateTaskMutation.mutateAsync({ id: taskToMove.id, ...updates });
  };

  const handleSubmit = async (data: Partial<Task>) => {
    if (editTask) {
      await updateTaskMutation.mutateAsync({ id: editTask.id, ...data });
    } else {
      await addTaskMutation.mutateAsync({
        ...data,
        position: tasks.length,
        client_id: null,
        assigned_to: null,
        due_date: null,
      } as Omit<Task, 'id' | 'created_at' | 'updated_at'>);
    }
    setIsDialogOpen(false);
    setEditTask(undefined);
  };

  if (isLoading) return <div>Loading tasks...</div>;

  const columns = {
    todo: tasks.filter((t: Task) => t.status === 'todo'),
    in_progress: tasks.filter((t: Task) => t.status === 'in_progress'),
    review: tasks.filter((t: Task) => t.status === 'review'),
    done: tasks.filter((t: Task) => t.status === 'done'),
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditTask(undefined)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editTask ? "Edit" : "Add"} Task</DialogTitle>
            </DialogHeader>
            <TaskDialog
              task={editTask}
              onSubmit={handleSubmit}
              onClose={() => {
                setIsDialogOpen(false);
                setEditTask(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(columns).map(([columnId, columnTasks]) => (
            <div key={columnId} className="space-y-4">
              <h3 className="font-semibold capitalize">{columnId.replace('_', ' ')}</h3>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 min-h-[200px]"
                  >
                    {columnTasks.map((task: Task, index: number) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{task.title}</h4>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditTask(task);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteTaskMutation.mutate(task.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded ${
                                task.priority === 'high' 
                                  ? 'bg-destructive/10 text-destructive' 
                                  : task.priority === 'medium'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-primary/10 text-primary'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Tasks;