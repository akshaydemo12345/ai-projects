import { CreditCard, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const invoices = [
  { id: "INV-001", date: "2024-01-01", amount: "$0.00", status: "Paid" },
  { id: "INV-002", date: "2024-02-01", amount: "$0.00", status: "Paid" },
];

const BillingPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Billing</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your payment methods and invoices.</p>

      <div className="max-w-2xl space-y-6">
        {/* Current Plan */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Current Plan</h2>
              <p className="text-xs text-muted-foreground mt-1">Starter — Free</p>
            </div>
            <Button size="sm" variant="outline">Change Plan</Button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Payment Method</h2>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">No payment method added</span>
            <Button size="sm" variant="ghost" className="ml-auto text-xs">Add Card</Button>
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Invoices</h2>
            <Button size="sm" variant="ghost" className="gap-1 text-xs"><Download className="h-3 w-3" /> Download All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground py-2">Invoice</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground py-2">Amount</th>
                  <th className="text-right text-xs font-medium text-muted-foreground py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border">
                    <td className="py-3 text-sm text-foreground">{inv.id}</td>
                    <td className="py-3 text-sm text-muted-foreground">{inv.date}</td>
                    <td className="py-3 text-sm text-muted-foreground">{inv.amount}</td>
                    <td className="py-3 text-right">
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
