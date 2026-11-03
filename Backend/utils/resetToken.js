const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");

// Verifies a token used on /reset-password for the given account type.
// Accepted:
//   - a "password-reset" token from the forgot-password email
//   - a normal login token (the in-app "Change Password" option uses it)
// Rejected:
//   - email-verification tokens (different purpose)
//   - tokens of the other account type (a user token can't reset a captain)
//   - blacklisted (logged-out) tokens
// Returns { payload } on success or { error, expired } on failure.
async function verifyResetToken(token, expectedUserType) {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return { error: err, expired: err.name === "TokenExpiredError" };
  }

  const purposeOk = !payload.purpose || payload.purpose === "password-reset";
  const typeOk = payload.userType === expectedUserType;
  if (!purposeOk || !typeOk) {
    return { error: new Error("Invalid token for password reset") };
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return { error: new Error("Token already used") };
  }

  return { payload };
}

// Make a reset token single-use: once the password is changed, the same link
// can't be used again. The blacklist TTL (24h) is longer than the token's life.
async function consumeResetToken(token) {
  try {
    await blacklistTokenModel.create({ token });
  } catch (err) {
    // duplicate key = already blacklisted, safe to ignore
  }
}

module.exports = { verifyResetToken, consumeResetToken };
