import { Ionicons } from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react"
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native"
import { useAuth } from "../../context/AuthContext"
import { supabase } from "../../lib/supabase"
import { colors } from "../../theme"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

export default function Dashboard() {
  const { storeId, storeName, session } = useAuth()
  const [counts, setCounts] = useState({ products: 0, customers: 0, suppliers: 0, invoices: 0 })
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    if (!storeId) return
    setError("")
    const count = (table: string, active?: boolean) => {
      let q = supabase.from(table).select("id", { count: "exact", head: true }).eq("store_id", storeId)
      if (active) q = q.eq("is_active", true)
      return q
    }
    const [p, c, s, i] = await Promise.all([
      count("products", true), count("customers"), count("suppliers"), count("invoices"),
    ])
    const firstError = [p, c, s, i].find((r) => r.error)?.error
    if (firstError) setError(firstError.message)
    setCounts({ products: p.count || 0, customers: c.count || 0, suppliers: s.count || 0, invoices: i.count || 0 })
    setRefreshing(false)
  }, [storeId])

  useEffect(() => { load() }, [load])

  const stat = (label: string, value: number, icon: IconName) => (
    <View style={styles.stat}>
      <View style={styles.iconCircle}><Ionicons name={icon} size={20} color={colors.navy} /></View>
      <Text style={styles.value}>{value.toLocaleString("en-IN")}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  )

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} />}>
      <View style={styles.hero}>
        <Text style={styles.heroSmall}>Welcome back</Text>
        <Text style={styles.heroTitle}>{storeName || "Your store"}</Text>
        <Text style={styles.heroEmail}>{session?.user.email}</Text>
      </View>

      {!storeId && (
        <Text style={styles.warn}>No store found for this account. Check store_members in Supabase.</Text>
      )}
      {!!error && <Text style={styles.warn}>Could not load some numbers: {error}</Text>}

      <View style={styles.grid}>
        {stat("Products", counts.products, "cube-outline")}
        {stat("Customers", counts.customers, "people-outline")}
        {stat("Suppliers", counts.suppliers, "business-outline")}
        {stat("Invoices", counts.invoices, "receipt-outline")}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.navy, borderRadius: 20, padding: 20, marginBottom: 16 },
  heroSmall: { color: "#cbd5e1", fontSize: 13 },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 4 },
  heroEmail: { color: colors.lime, fontSize: 13, marginTop: 4 },
  warn: { color: colors.red, marginBottom: 12, fontSize: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  stat: { width: "48%", flexGrow: 1, backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.limeSoft, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  value: { fontSize: 30, fontWeight: "800", color: colors.text },
  label: { fontSize: 13, color: colors.muted, marginTop: 2 },
})