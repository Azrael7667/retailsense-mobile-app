export const colors = {
  navy: "#0d1726",
  navy2: "#16233a",
  lime: "#a3e635",
  limeSoft: "#ecfccb",
  bg: "#f6f7f9",
  card: "#ffffff",
  border: "#e6e8ec",
  text: "#0f172a",
  muted: "#566070",
  red: "#dc2626",
}

export const fmt = (n: any) =>
  "Rs. " + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })