import { Revenue } from "@/services/financeService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Repeat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import EditRevenueForm from "./EditRevenueForm";
import { motion, AnimatePresence } from "framer-motion";

interface RevenueListProps {
  revenue: Revenue[];
  onDelete: (id: number) => void;
}

const RevenueList = ({ revenue, onDelete }: RevenueListProps) => {
  const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Revenue List</h3>
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {revenue.map((rev) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{rev.title || 'Untitled Revenue'}</p>
                      {rev.is_recurring && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
                        >
                          <Repeat className="h-3 w-3" />
                          <span>Recurring</span>
                        </motion.div>
                      )}
                    </div>
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
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </Card>
      </motion.div>

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