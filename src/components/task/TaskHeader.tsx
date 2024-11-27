import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "@/services/taskService";
import TaskDialog from "./TaskDialog";

interface TaskHeaderProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  setEditTask: (task: Task | undefined) => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  editTask?: Task;
}

const TaskHeader = ({
  isDialogOpen,
  setIsDialogOpen,
  setEditTask,
  onSubmit,
  editTask,
}: TaskHeaderProps) => {
  return (
    <div className="flex justify-between items-center border-b border-border/50 pb-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Tasks</h2>
      </div>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editTask ? "Edit" : "Add"} Task</DialogTitle>
          </DialogHeader>
          <TaskDialog
            task={editTask}
            onSubmit={onSubmit}
            onClose={() => {
              setIsDialogOpen(false);
              setEditTask(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskHeader;