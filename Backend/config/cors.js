// CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
// falls back to * if not set
function getAllowedOrigins() {
  const origins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return origins.length > 0 ? origins : "*";
}

module.exports = { getAllowedOrigins };
