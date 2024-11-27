import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRevenue } from "@/services/financeService";
import { useToast } from "@/components/ui/use-toast";

const AddRevenueForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [revenue, setRevenue] = useState({
    month: new Date().toISOString().slice(0, 7),
    amount: "",
  });

  const { mutate } = useMutation({
    mutationFn: addRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenue'] });
      toast({
        title: "Success",
        description: "Revenue added successfully",
      });
      setRevenue({ month: new Date().toISOString().slice(0, 7), amount: "" });
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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Input
            id="month"
            type="month"
            value={revenue.month}
            onChange={(e) => setRevenue({ ...revenue, month: e.target.value })}
            required
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
          />
        </div>
      </div>
      <Button type="submit">Add Revenue</Button>
    </form>
  );
};

export default AddRevenueForm;