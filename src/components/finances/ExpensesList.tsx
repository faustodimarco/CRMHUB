import { Expense } from "@/services/financeService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { UseMutateFunction } from "@tanstack/react-query";

interface ExpensesListProps {
  expenses: Expense[];
  onDelete: UseMutateFunction<void, Error, number, unknown>;
}

const ExpensesList = ({ expenses, onDelete }: ExpensesListProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Expenses List</h3>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">{expense.title}</p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{expense.month}</span>
                <span>•</span>
                <span>{expense.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium">${expense.amount.toLocaleString()}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (expense.id) {
                    onDelete(expense.id);
                  }
                }}
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

export default ExpensesList;