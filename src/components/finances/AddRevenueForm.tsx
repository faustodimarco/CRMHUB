import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRevenue } from "@/services/financeService";
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

const AddRevenueForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [revenue, setRevenue] = useState({
    month: new Date().toISOString().slice(0, 7),
    amount: "",
    title: "",
    invoice_number: "",
  });

  const { mutate } = useMutation({
    mutationFn: addRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenue'] });
      toast({
        title: "Success",
        description: "Revenue added successfully",
      });
      setRevenue({ 
        month: new Date().toISOString().slice(0, 7), 
        amount: "", 
        title: "",
        invoice_number: "" 
      });
      setDate(undefined);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to add revenue",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      month: revenue.month,
      amount: parseFloat(revenue.amount),
      title: revenue.title,
      invoice_number: revenue.invoice_number || null,
    });
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setRevenue({
        ...revenue,
        month: date.toISOString().slice(0, 7)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={revenue.title}
            onChange={(e) => setRevenue({ ...revenue, title: e.target.value })}
            placeholder="Revenue title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={revenue.amount}
            onChange={(e) => setRevenue({ ...revenue, amount: e.target.value })}
            required
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice_number">Invoice Number (Optional)</Label>
          <Input
            id="invoice_number"
            value={revenue.invoice_number}
            onChange={(e) => setRevenue({ ...revenue, invoice_number: e.target.value })}
            placeholder="e.g., INV-001"
          />
        </div>
      </div>
      <Button type="submit">Add Revenue</Button>
    </form>
  );
};

export default AddRevenueForm;