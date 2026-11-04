// backend errors come as [{ msg }], { errors: [{ msg }] } or { message }
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (Array.isArray(data) && data[0]?.msg) return data[0].msg;
  if (Array.isArray(data?.errors) && data.errors[0]?.msg) return data.errors[0].msg;
  if (typeof data?.message === "string" && data.message) return data.message;
  if (!error?.response) return "Can't reach the server. Check your internet and try again.";

  return fallback;
}
