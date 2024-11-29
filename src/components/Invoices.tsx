import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText } from "lucide-react";
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
import type { Invoice } from "@/types";
import { InvoiceListHeader } from "./invoices/InvoiceListHeader";
import { InvoiceListItem } from "./invoices/InvoiceListItem";
import AddInvoiceForm from "./invoices/AddInvoiceForm";
import EditInvoiceForm from "./invoices/EditInvoiceForm";

const Invoices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const data = await getInvoices();
      return data.map(invoice => ({
        ...invoice,
        status: invoice.status as 'draft' | 'pending' | 'paid'
      })) as Invoice[];
    },
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
      <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Invoices</h2>
        </div>
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
          <InvoiceListHeader />
          <div className="space-y-1">
            {invoices.map((invoice) => (
              <InvoiceListItem
                key={invoice.id}
                invoice={invoice}
                onEdit={setEditingInvoice}
                onDelete={(id, filePath) => deleteMutation({ id, filePath })}
                isSelected={selectedInvoices.includes(invoice.id)}
                onSelect={(checked) => {
                  setSelectedInvoices(prev =>
                    checked
                      ? [...prev, invoice.id]
                      : prev.filter(id => id !== invoice.id)
                  );
                }}
              />
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