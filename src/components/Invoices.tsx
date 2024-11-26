import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Invoices = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="grid grid-cols-6 gap-4 mb-4 text-sm font-medium text-muted-foreground">
            <div>Invoice #</div>
            <div>Client</div>
            <div>Date</div>
            <div>Due Date</div>
            <div>Amount</div>
            <div>Status</div>
          </div>

          {[1, 2, 3, 4, 5].map((invoice) => (
            <div key={invoice} className="grid grid-cols-6 gap-4 py-4 border-t text-sm">
              <div className="font-medium">INV-{String(invoice).padStart(4, '0')}</div>
              <div>Client {invoice}</div>
              <div>2024-02-{String(invoice).padStart(2, '0')}</div>
              <div>2024-03-{String(invoice).padStart(2, '0')}</div>
              <div>${(Math.random() * 10000).toFixed(2)}</div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  invoice % 3 === 0 
                    ? 'bg-success/10 text-success' 
                    : invoice % 2 === 0 
                    ? 'bg-warning/10 text-warning'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {invoice % 3 === 0 ? 'Paid' : invoice % 2 === 0 ? 'Pending' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Invoices;