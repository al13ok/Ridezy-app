// Turns any axios error into a readable message.
// The backend replies in different shapes:
//   [{ msg }]              -> express-validator errors (e.g. register / update)
//   { errors: [{ msg }] }  -> ride routes
//   { message }            -> everything else (e.g. "User already exists")
// and on a network failure / server down there is no `response` at all.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (Array.isArray(data) && data[0]?.msg) return data[0].msg;
  if (Array.isArray(data?.errors) && data.errors[0]?.msg) return data.errors[0].msg;
  if (typeof data?.message === "string" && data.message) return data.message;
  if (!error?.response) return "Can't reach the server. Check your internet and try again.";

  return fallback;
}
