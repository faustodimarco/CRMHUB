import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/services/taskService";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{task.title}</h4>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
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
  );
};

export default TaskCard;