import { Card } from "@/components/ui/card";

const Tasks = () => {
  const columns = ["To Do", "In Progress", "Review", "Done"];
  
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 min-w-[1200px]">
        {columns.map((column) => (
          <div key={column} className="kanban-column">
            <h3 className="font-semibold mb-4">{column}</h3>
            
            {[1, 2, 3].map((task) => (
              <div key={task} className="task-card">
                <h4 className="font-medium mb-2">Task {task}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Description for task {task}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    Design
                  </span>
                  <span className="text-xs text-muted-foreground">2d</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;