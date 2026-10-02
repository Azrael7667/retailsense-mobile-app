import axios from "axios"
import { supabase } from "./supabase"

let activeStoreId: string | null = null
export const setActiveStoreId = (id: string | null) => { activeStoreId = id }

const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_BASE_URL })

// Same pattern as the web app: bearer token + X-Store-Id header
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (activeStoreId) config.headers["X-Store-Id"] = activeStoreId
  return config
})

export default api