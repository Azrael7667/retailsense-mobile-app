import type { Session } from "@supabase/supabase-js"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { setActiveStoreId } from "../lib/api"
import { supabase } from "../lib/supabase"

type AuthCtx = {
  session: Session | null
  storeId: string | null
  storeName: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({} as AuthCtx)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [storeName, setStoreName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Find the user's store: store_members first, then stores.owner_id as a fallback
  async function loadStore(userId: string) {
    let id: string | null = null

    const m = await supabase.from("store_members").select("store_id").eq("user_id", userId).limit(1)
    if (m.data?.length) id = m.data[0].store_id

    if (!id) {
      const o = await supabase.from("stores").select("id").eq("owner_id", userId).limit(1)
      if (o.data?.length) id = o.data[0].id
    }

    setStoreId(id)
    setActiveStoreId(id)

    if (id) {
      const s = await supabase.from("stores").select("name").eq("id", id).single()
      setStoreName(s.data?.name ?? null)
    } else {
      setStoreName(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      if (data.session) await loadStore(data.session.user.id)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s) loadStore(s.user.id)
      else { setStoreId(null); setStoreName(null); setActiveStoreId(null) }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error ? error.message : null
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <Ctx.Provider value={{ session, storeId, storeName, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  )
}
