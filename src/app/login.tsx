import { useState } from "react"
import {
    ActivityIndicator,
    KeyboardAvoidingView, Platform,
    Pressable, StyleSheet,
    Text, TextInput,
    View,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { colors } from "../theme"

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!email || !password) return setError("Enter your email and password")
    setBusy(true)
    setError("")
    const err = await signIn(email, password)
    if (err) setError(err)
    setBusy(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.brandRow}>
        <View style={styles.logo}><Text style={styles.logoText}>RS</Text></View>
        <Text style={styles.brand}>RetailSense</Text>
      </View>
      <Text style={styles.sub}>Sign in to manage your store</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#94a3b8"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Your password"
          placeholderTextColor="#94a3b8"
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={[styles.button, busy && { opacity: 0.6 }]} onPress={submit} disabled={busy}>
          {busy ? <ActivityIndicator color={colors.lime} /> : <Text style={styles.buttonText}>Sign in</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, justifyContent: "center", padding: 24 },
  brandRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  logo: { width: 40, height: 40, borderRadius: 11, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center" },
  logoText: { color: colors.navy, fontWeight: "800", fontSize: 16 },
  brand: { color: "#fff", fontSize: 28, fontWeight: "800" },
  sub: { color: "#cbd5e1", textAlign: "center", marginTop: 6, marginBottom: 28 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 15, color: colors.text, backgroundColor: "#f9fafb" },
  error: { color: colors.red, marginTop: 12, fontSize: 13 },
  button: { backgroundColor: colors.navy, borderRadius: 12, height: 50, alignItems: "center", justifyContent: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
})
