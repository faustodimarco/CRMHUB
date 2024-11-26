import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { getTasks, addTask, updateTask, deleteTask, type Task } from "@/services/taskService";
import TaskDialog from "./task/TaskDialog";
import TaskCard from "./task/TaskCard";

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
    mutationFn: (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => addTask(taskData),
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

    // Optimistically update the UI
    queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
      const newTasks = [...oldTasks];
      const taskIndex = newTasks.findIndex(t => t.id === taskToMove.id);
      if (taskIndex !== -1) {
        const [removed] = newTasks.splice(taskIndex, 1);
        removed.status = destinationColumnId;
        removed.position = destinationIndex;
        newTasks.splice(destinationIndex, 0, removed);
      }
      return newTasks;
    });

    // Update the server
    const updates: Partial<Task> = {
      position: destinationIndex,
      status: destinationColumnId,
    };

    try {
      await updateTaskMutation.mutateAsync({ id: taskToMove.id, ...updates });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
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
      } as Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>);
    }
    setIsDialogOpen(false);
    setEditTask(undefined);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setIsDialogOpen(true);
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
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditTask(undefined);
        }}>
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
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[200px] p-4 rounded-lg transition-all duration-200 ${
                      snapshot.isDraggingOver ? 'bg-muted/50' : 'bg-transparent'
                    }`}
                  >
                    {columnTasks.map((task: Task, index: number) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transform transition-all duration-200 ${
                              snapshot.isDragging ? 'rotate-[2deg] scale-105 shadow-lg' : ''
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              transitionDuration: '0.2s',
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={handleEdit}
                              onDelete={(id) => deleteTaskMutation.mutate(id)}
                            />
                          </div>
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
