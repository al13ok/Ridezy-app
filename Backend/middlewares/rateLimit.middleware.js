// simple in-memory rate limiter for login / mail routes
// key is ip + route + email. per instance only, use redis if we scale
function rateLimit({ windowMs, max, message }) {
  const hits = new Map(); // key -> { count, resetAt }

  // cleanup old entries
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const email = (req.body && req.body.email ? String(req.body.email) : "").toLowerCase();
    const key = `${req.ip}|${req.baseUrl}${req.path}|${email}`;
    const now = Date.now();

    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > max) {
      res.set("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ message });
    }
    next();
  };
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many email requests. Please try again later.",
});

module.exports = { rateLimit, loginLimiter, mailLimiter };
