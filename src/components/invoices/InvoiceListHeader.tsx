export const InvoiceListHeader = () => {
  return (
    <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-medium text-muted-foreground">
      <div className="col-span-1 w-12">Select</div>
      <div className="col-span-1">Invoice #</div>
      <div className="col-span-2">Client</div>
      <div>Date</div>
      <div>Due Date</div>
      <div>Amount</div>
      <div>Status</div>
    </div>
  );
};