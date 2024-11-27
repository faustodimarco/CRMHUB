import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AddExpenseForm from "./AddExpenseForm";
import AddRevenueForm from "./AddRevenueForm";
import CsvUploader from "./CsvUploader";

const FinanceHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Finances</h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Add Revenue
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Revenue</DialogTitle>
              </DialogHeader>
              <AddRevenueForm />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Add Expense
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <AddExpenseForm />
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Import Revenue CSV
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Revenue CSV</DialogTitle>
              </DialogHeader>
              <CsvUploader type="revenue" />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Import Expenses CSV
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Expenses CSV</DialogTitle>
              </DialogHeader>
              <CsvUploader type="expenses" />
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FinanceHeader;