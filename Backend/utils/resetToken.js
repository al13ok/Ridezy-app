const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");

// token for /reset-password. accepts the reset mail token or a normal login token
// (change password from profile). rejects verify-email tokens, the other
// account type and blacklisted tokens.
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

// blacklist the token after use so the link can't be reused
async function consumeResetToken(token) {
  try {
    await blacklistTokenModel.create({ token });
  } catch (err) {
    // already blacklisted
  }
}

module.exports = { verifyResetToken, consumeResetToken };
