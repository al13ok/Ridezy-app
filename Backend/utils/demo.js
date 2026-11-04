// demo accounts share a public password, so don't let anyone change them
const isDemoAccount = (email = "") => /@ridezy-demo\.com$/i.test(String(email));

const DEMO_LOCKED_MESSAGE =
  "This is a shared demo account, so its password and profile can't be changed. Sign up to get your own account.";

module.exports = { isDemoAccount, DEMO_LOCKED_MESSAGE };
