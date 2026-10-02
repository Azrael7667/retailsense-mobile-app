import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"
import { colors } from "../theme"

type Row = { title: string; subtitle?: string; right?: string; rightColor?: string }

type Props = {
  table: string
  select: string
  orderBy: string
  ascending?: boolean
  activeOnly?: boolean
  emptyText: string
  render: (r: any) => Row
}

export default function StoreList({ table, select, orderBy, ascending = false, activeOnly, emptyText, render }: Props) {
  const { storeId } = useAuth()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    if (!storeId) return
    setError("")
    let q = supabase.from(table).select(select).eq("store_id", storeId)
    if (activeOnly) q = q.eq("is_active", true)
    const { data, error } = await q.order(orderBy, { ascending }).limit(100)
    if (error) setError(error.message)
    else setRows(data || [])
    setLoading(false)
    setRefreshing(false)
  }, [storeId, table, select, orderBy, ascending, activeOnly])

  useEffect(() => { load() }, [load])

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.navy} /></View>
  }

  return (
    <FlatList
      data={rows}
      keyExtractor={(r) => String(r.id)}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      style={{ backgroundColor: colors.bg }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} />
      }
      ListEmptyComponent={
        <Text style={styles.empty}>{error ? `Could not load: ${error}` : emptyText}</Text>
      }
      renderItem={({ item }) => {
        const r = render(item)
        return (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{r.title}</Text>
              {!!r.subtitle && <Text style={styles.subtitle} numberOfLines={1}>{r.subtitle}</Text>}
            </View>
            {!!r.right && <Text style={[styles.right, r.rightColor ? { color: r.rightColor } : null]}>{r.right}</Text>}
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 },
  title: { fontSize: 15, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  right: { fontSize: 14, fontWeight: "800", color: colors.text },
  empty: { textAlign: "center", color: colors.muted, marginTop: 40, paddingHorizontal: 20 },
})