import { Revenue } from "@/services/financeService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface RevenueListProps {
  revenue: Revenue[];
  onDelete: (id: number) => void;
}

const RevenueList = ({ revenue, onDelete }: RevenueListProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Revenue List</h3>
      <div className="space-y-2">
        {revenue.map((rev) => (
          <div key={rev.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{rev.month}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">${rev.amount.toLocaleString()}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(rev.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RevenueList;