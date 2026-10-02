import { Pressable, StyleSheet, Text, View } from "react-native"
import { useAuth } from "../../context/AuthContext"
import { colors } from "../../theme"

export default function More() {
  const { session, storeName, signOut } = useAuth()
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{session?.user.email}</Text>
        <Text style={[styles.label, { marginTop: 14 }]}>Store</Text>
        <Text style={styles.value}>{storeName || "No store found"}</Text>
      </View>
      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16, gap: 16 },
  card: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 18 },
  label: { fontSize: 12, color: colors.muted, fontWeight: "600" },
  value: { fontSize: 16, color: colors.text, fontWeight: "700", marginTop: 2 },
  button: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: colors.red, alignItems: "center", justifyContent: "center" },
  buttonText: { color: colors.red, fontWeight: "700", fontSize: 16 },
})