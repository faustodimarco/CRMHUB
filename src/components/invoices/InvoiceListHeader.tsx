export const InvoiceListHeader = () => {
  return (
    <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-medium text-muted-foreground items-center">
      <div>Select</div>
      <div>Invoice #</div>
      <div>Client</div>
      <div>Date</div>
      <div>Due Date</div>
      <div>Amount</div>
      <div>Status</div>
    </div>
  );
};