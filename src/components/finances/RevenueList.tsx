import { Revenue } from "@/services/financeService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import EditRevenueForm from "./EditRevenueForm";

interface RevenueListProps {
  revenue: Revenue[];
  onDelete: (id: number) => void;
}

const RevenueList = ({ revenue, onDelete }: RevenueListProps) => {
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);

  return (
    <>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Revenue List</h3>
        <div className="space-y-2">
          {revenue.map((rev) => (
            <div key={rev.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{rev.title || 'Untitled Revenue'}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{rev.month}</span>
                  {rev.invoice_number && (
                    <>
                      <span>•</span>
                      <span>Invoice: {rev.invoice_number}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium">${rev.amount.toLocaleString()}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingRevenue(rev)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
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

      <Dialog open={!!editingRevenue} onOpenChange={() => setEditingRevenue(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Revenue</DialogTitle>
          </DialogHeader>
          {editingRevenue && (
            <EditRevenueForm
              revenue={editingRevenue}
              onClose={() => setEditingRevenue(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RevenueList;