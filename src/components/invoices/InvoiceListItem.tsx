import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Invoice } from "@/services/invoiceService";

interface InvoiceListItemProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string, filePath: string) => void;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export const InvoiceListItem = ({
  invoice,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
}: InvoiceListItemProps) => {
  return (
    <div className="grid grid-cols-7 gap-4 px-4 py-3 text-sm items-center rounded-lg transition-all hover:bg-muted/50 border border-transparent hover:border-border">
      <div className="flex items-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </div>
      <div className="font-medium truncate">{invoice.invoice_number}</div>
      <div className="font-medium text-foreground truncate">{invoice.client_name}</div>
      <div className="text-muted-foreground truncate">{new Date(invoice.issue_date).toLocaleDateString()}</div>
      <div className="text-muted-foreground truncate">{new Date(invoice.due_date).toLocaleDateString()}</div>
      <div className="font-medium truncate">${invoice.amount.toLocaleString()}</div>
      <div className="flex items-center justify-between space-x-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          invoice.status === 'paid'
            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
            : invoice.status === 'pending'
            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
        }`}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onEdit(invoice)}
              className="flex items-center"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(invoice.id, invoice.file_path)}
              className="flex items-center text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};