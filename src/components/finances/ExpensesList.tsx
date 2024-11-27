import { Expense } from "@/services/financeService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Repeat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import EditExpenseForm from "./EditExpenseForm";
import { UseMutateFunction } from "@tanstack/react-query";

interface ExpensesListProps {
  expenses: Expense[];
  onDelete: UseMutateFunction<void, Error, number, unknown>;
}

const ExpensesList = ({ expenses, onDelete }: ExpensesListProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Filter out future expenses
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  
  const filteredExpenses = expenses.filter(expense => {
    return expense.month <= currentMonth;
  });

  return (
    <>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Expenses List</h3>
        <div className="space-y-2">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{expense.title}</p>
                  {expense.is_recurring && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      <Repeat className="h-3 w-3" />
                      <span>Recurring</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{expense.month}</span>
                  <span>•</span>
                  <span>{expense.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium">${expense.amount.toLocaleString()}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingExpense(expense)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <EditExpenseForm
              expense={editingExpense}
              onClose={() => setEditingExpense(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpensesList;