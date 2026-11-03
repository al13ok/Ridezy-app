// Allowed frontend origins for CORS (REST + Socket.IO).
// Set CORS_ORIGINS="https://your-frontend.vercel.app,http://localhost:5173" in .env.
// If it is not set, falls back to "*" so existing deployments keep working.
function getAllowedOrigins() {
  const origins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return origins.length > 0 ? origins : "*";
}

module.exports = { getAllowedOrigins };
