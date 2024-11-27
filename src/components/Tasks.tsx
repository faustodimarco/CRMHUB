import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasks, addTask, updateTask, deleteTask, type Task } from "@/services/taskService";
import TaskCard from "./task/TaskCard";
import TaskHeader from "./task/TaskHeader";

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

    const taskToMove = tasks.find((t: Task) => t.id === parseInt(result.draggableId));
    if (!taskToMove) return;

    // Optimistically update the UI
    queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => {
      const newTasks = [...oldTasks];
      const taskIndex = newTasks.findIndex(t => t.id === taskToMove.id);
      if (taskIndex !== -1) {
        const [removed] = newTasks.splice(taskIndex, 1);
        removed.status = result.destination.droppableId;
        removed.position = result.destination.index;
        newTasks.splice(result.destination.index, 0, removed);
      }
      return newTasks;
    });

    // Update the server
    try {
      await updateTaskMutation.mutateAsync({ 
        id: taskToMove.id,
        position: result.destination.index,
        status: result.destination.droppableId,
      });
    } catch (error) {
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

  if (isLoading) return <div>Loading tasks...</div>;

  const columns = {
    todo: tasks.filter((t: Task) => t.status === 'todo'),
    in_progress: tasks.filter((t: Task) => t.status === 'in_progress'),
    review: tasks.filter((t: Task) => t.status === 'review'),
    done: tasks.filter((t: Task) => t.status === 'done'),
  };

  return (
    <div className="space-y-6">
      <TaskHeader
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setEditTask={setEditTask}
        onSubmit={handleSubmit}
        editTask={editTask}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(columns).map(([columnId, columnTasks]) => (
            <div key={columnId} className="space-y-4">
              <h3 className="font-semibold capitalize text-muted-foreground">
                {columnId.replace('_', ' ')}
              </h3>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] p-4 rounded-lg border border-border/50 transition-all duration-200 ${
                      snapshot.isDraggingOver ? 'bg-muted/50 border-primary/50' : 'bg-card/50 backdrop-blur-sm'
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
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging
                                ? provided.draggableProps.style?.transform
                                : 'translate(0, 0)',
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={() => {
                                setEditTask(task);
                                setIsDialogOpen(true);
                              }}
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