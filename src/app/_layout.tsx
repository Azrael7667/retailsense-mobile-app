import { Stack, useRouter, useSegments } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { AuthProvider, useAuth } from "../context/AuthContext"
import { colors } from "../theme"

function Gate() {
  const { session, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

    useEffect(() => {
    if (loading) return
    const onLogin = (segments[0] as string) === "login"
    if (!session && !onLogin) router.replace("/login" as any)
    else if (session && onLogin) router.replace("/" as any)
  }, [session, loading, segments])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.lime} size="large" />
        </View>
      )}
    </>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
})