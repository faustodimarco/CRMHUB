import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Download, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvoices, deleteInvoice, downloadInvoices } from "@/services/invoiceService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddInvoiceForm from "./invoices/AddInvoiceForm";
import EditInvoiceForm from "./invoices/EditInvoiceForm";
import type { Invoice } from "@/services/invoiceService";

const Invoices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: ({ id, filePath }: { id: string; filePath: string }) => 
      deleteInvoice(id, filePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
  });

  const handleDownload = async () => {
    try {
      const selectedInvoiceData = invoices.filter(inv => 
        selectedInvoices.includes(inv.id)
      );
      
      const blob = await downloadInvoices(selectedInvoiceData);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedInvoiceData.length === 1 
        ? selectedInvoiceData[0].file_path
        : 'invoices.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download invoices",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <div className="flex gap-2">
          {selectedInvoices.length > 0 && (
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download {selectedInvoices.length > 1 ? 'Selected' : 'Invoice'}
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
              </DialogHeader>
              <AddInvoiceForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <div className="grid grid-cols-8 gap-4 mb-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-1"></div>
            <div className="col-span-1">Invoice #</div>
            <div className="col-span-2">Client</div>
            <div>Date</div>
            <div>Due Date</div>
            <div>Amount</div>
            <div>Status</div>
            <div></div>
          </div>

          <div className="space-y-1">
            {invoices.map((invoice) => (
              <div 
                key={invoice.id} 
                className="grid grid-cols-8 gap-4 p-4 text-sm items-center rounded-lg transition-all hover:bg-muted/50 border border-transparent hover:border-border"
              >
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={(checked) => {
                      setSelectedInvoices(prev =>
                        checked
                          ? [...prev, invoice.id]
                          : prev.filter(id => id !== invoice.id)
                      );
                    }}
                  />
                </div>
                <div className="col-span-1 font-medium">{invoice.invoice_number}</div>
                <div className="col-span-2 font-medium text-foreground">{invoice.client_name}</div>
                <div className="text-muted-foreground">{new Date(invoice.issue_date).toLocaleDateString()}</div>
                <div className="text-muted-foreground">{new Date(invoice.due_date).toLocaleDateString()}</div>
                <div className="font-medium">${invoice.amount.toLocaleString()}</div>
                <div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid'
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                      : invoice.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingInvoice(invoice)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation({ 
                      id: invoice.id, 
                      filePath: invoice.file_path 
                    })}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={!!editingInvoice} onOpenChange={() => setEditingInvoice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          {editingInvoice && (
            <EditInvoiceForm
              invoice={editingInvoice}
              onClose={() => setEditingInvoice(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;