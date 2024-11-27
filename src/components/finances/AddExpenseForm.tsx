import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense } from "@/services/financeService";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AddExpenseForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [recurringEndDate, setRecurringEndDate] = useState<Date>();
  const [expense, setExpense] = useState({
    title: "",
    month: new Date().toISOString().slice(0, 7),
    amount: "",
    category: "",
    is_recurring: false,
    recurring_end_date: null as string | null,
  });

  const { mutate } = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      setExpense({
        title: "",
        month: new Date().toISOString().slice(0, 7),
        amount: "",
        category: "",
        is_recurring: false,
        recurring_end_date: null,
      });
      setDate(undefined);
      setRecurringEndDate(undefined);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      title: expense.title,
      month: expense.month,
      amount: parseFloat(expense.amount),
      category: expense.category,
      is_recurring: expense.is_recurring,
      recurring_end_date: expense.recurring_end_date,
    });
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setExpense({
        ...expense,
        month: date.toISOString().slice(0, 7)
      });
    }
  };

  const handleRecurringEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setRecurringEndDate(date);
      setExpense({
        ...expense,
        recurring_end_date: date.toISOString().slice(0, 10)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={expense.title}
            onChange={(e) => setExpense({ ...expense, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Month</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            required
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={expense.category}
            onValueChange={(value) => setExpense({ ...expense, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="salaries">Salaries</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="recurring"
          checked={expense.is_recurring}
          onCheckedChange={(checked) => 
            setExpense({ ...expense, is_recurring: checked as boolean })
          }
        />
        <Label htmlFor="recurring">Recurring expense</Label>
      </div>

      {expense.is_recurring && (
        <div className="space-y-2">
          <Label>End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !recurringEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {recurringEndDate ? format(recurringEndDate, "PP") : <span>Pick an end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={recurringEndDate}
                onSelect={handleRecurringEndDateSelect}
                initialFocus
                disabled={(date) => date <= new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Button type="submit">Add Expense</Button>
    </form>
  );
};

export default AddExpenseForm;