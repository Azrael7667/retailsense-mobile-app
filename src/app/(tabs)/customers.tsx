import StoreList from "../../components/StoreList"
import { colors, fmt } from "../../theme"

export default function Customers() {
  return (
    <StoreList
      table="customers"
      select="id,name,phone,balance"
      orderBy="name"
      ascending
      emptyText="No customers yet"
      render={(c) => ({
        title: c.name,
        subtitle: c.phone || undefined,
        right: Number(c.balance) > 0 ? fmt(c.balance) : "Settled",
        rightColor: Number(c.balance) > 0 ? colors.red : colors.muted,
      })}
    />
  )
}