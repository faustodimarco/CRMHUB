export const InvoiceListHeader = () => {
  return (
    <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-medium text-muted-foreground items-center px-4">
      <div className="flex items-center">Select</div>
      <div className="font-medium">Invoice #</div>
      <div className="font-medium">Client</div>
      <div className="text-muted-foreground">Date</div>
      <div className="text-muted-foreground">Due Date</div>
      <div className="font-medium">Amount</div>
      <div>Status</div>
    </div>
  );
};