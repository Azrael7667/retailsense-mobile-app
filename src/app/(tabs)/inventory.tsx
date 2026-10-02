import StoreList from "../../components/StoreList"

export default function Inventory() {
  return (
    <StoreList
      table="products"
      select="id,name"
      orderBy="name"
      ascending
      activeOnly
      emptyText="No products yet"
      render={(p) => ({ title: p.name })}
    />
  )
}