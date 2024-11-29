import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInvoice } from "@/services/invoiceService";
import type { Invoice } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditInvoiceFormProps {
  invoice: Invoice;
  onClose: () => void;
}

type InvoiceStatus = 'draft' | 'pending' | 'paid';

const EditInvoiceForm = ({ invoice, onClose }: EditInvoiceFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [issueDate, setIssueDate] = useState<Date>(new Date(invoice.issue_date));
  const [dueDate, setDueDate] = useState<Date>(new Date(invoice.due_date));
  const [formData, setFormData] = useState({
    invoice_number: invoice.invoice_number,
    client_name: invoice.client_name,
    amount: invoice.amount.toString(),
    status: invoice.status as InvoiceStatus,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateInvoice(invoice.id, {
      ...formData,
      amount: parseFloat(formData.amount),
      issue_date: issueDate.toISOString(),
      due_date: dueDate.toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice_number">Invoice Number</Label>
          <Input
            id="invoice_number"
            value={formData.invoice_number}
            onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_name">Client Name</Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: InvoiceStatus) => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Issue Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !issueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={issueDate}
                onSelect={setIssueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                disabled={(date) => date < (issueDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          Update Invoice
        </Button>
      </div>
    </form>
  );
};

export default EditInvoiceForm;