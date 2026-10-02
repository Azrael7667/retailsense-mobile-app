import StoreList from "../../components/StoreList"
import { fmt } from "../../theme"

export default function Sales() {
  return (
    <StoreList
      table="invoices"
      select="*"
      orderBy="created_at"
      emptyText="No invoices yet"
      render={(i) => ({
        title: i.invoice_number || i.doc_number || "Invoice",
        subtitle: i.invoice_date || String(i.created_at || "").slice(0, 10),
        right: fmt(i.total ?? i.total_amount ?? i.grand_total),
      })}
    />
  )
}