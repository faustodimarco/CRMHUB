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
import { uploadInvoice } from "@/services/invoiceService";
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

type InvoiceStatus = 'draft' | 'pending' | 'paid';

const AddInvoiceForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [issueDate, setIssueDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [invoice, setInvoice] = useState({
    invoice_number: "",
    client_name: "",
    amount: "",
    status: "draft" as InvoiceStatus,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!file || !issueDate || !dueDate) throw new Error("Missing required fields");
      return uploadInvoice(file, {
        ...invoice,
        amount: parseFloat(invoice.amount),
        issue_date: issueDate.toISOString(),
        due_date: dueDate.toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      // Reset form
      setFile(null);
      setIssueDate(undefined);
      setDueDate(undefined);
      setInvoice({
        invoice_number: "",
        client_name: "",
        amount: "",
        status: "draft",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create invoice",
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
            value={invoice.invoice_number}
            onChange={(e) => setInvoice({ ...invoice, invoice_number: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_name">Client Name</Label>
          <Input
            id="client_name"
            value={invoice.client_name}
            onChange={(e) => setInvoice({ ...invoice, client_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={invoice.amount}
            onChange={(e) => setInvoice({ ...invoice, amount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={invoice.status}
            onValueChange={(value: InvoiceStatus) => 
              setInvoice({ ...invoice, status: value })
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

      <div className="space-y-2">
        <Label htmlFor="file">Invoice PDF</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      <Button type="submit" disabled={isPending}>
        Create Invoice
      </Button>
    </form>
  );
};

export default AddInvoiceForm;