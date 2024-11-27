import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, MoreHorizontal, Pencil, Trash2, CheckCircle2, Circle, Timer, AlertTriangle } from "lucide-react";
import type { Task } from "@/services/taskService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-destructive/10 text-destructive',
          icon: <AlertCircle className="w-3 h-3" />
        };
      case 'medium':
        return {
          color: 'bg-yellow-500/10 text-yellow-600',
          icon: <AlertTriangle className="w-3 h-3" />
        };
      default:
        return {
          color: 'bg-primary/10 text-primary',
          icon: <CheckCircle2 className="w-3 h-3" />
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'in_progress':
        return <Timer className="w-3 h-3" />;
      case 'review':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <Card className="group relative p-4 space-y-3 hover:shadow-md transition-all duration-200 border-l-4 hover:scale-[1.02]" 
         style={{ 
           borderLeftColor: task.priority === 'high' ? 'rgb(239, 68, 68)' : 
                           task.priority === 'medium' ? 'rgb(234, 179, 8)' : 
                           'rgb(34, 197, 94)' 
         }}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-base line-clamp-2">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${priorityConfig.color}`}>
            {priorityConfig.icon}
            {task.priority}
          </span>
          <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
            {getStatusIcon(task.status)}
            {task.status.replace('_', ' ')}
          </span>
        </div>

        {task.due_date && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;