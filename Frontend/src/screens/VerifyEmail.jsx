import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Console from "../utils/console";
import { MailCheck, MailWarning } from "lucide-react";
import { Button, Spinner } from "../components";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { userType } = useParams();
  const emailVerificationToken = searchParams.get("token");

  const [response, setResponse] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/${userType}/verify-email`, {
        token: emailVerificationToken,
      });
      if (response.status === 200) {
        Console.log("Email verified successfully:", response.data);
        setSuccess(true);
        setResponse("Your email is verified successfully. You can continue using the application.");
      }
    } catch (error) {
      Console.error("Error verifying email:", error);
      if (error.response?.data?.message === "Token Expired") {
        setResponse("Your verification link is expired. Please request a new verification link.");
      } else if (error.response && error.response.data && error.response.data.message) {
        setResponse(error.response.data.message || "An error occurred while verifying your email.");
      } else {
        setResponse("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailVerificationToken) {
      verifyEmail();
    } else {
      setResponse("Invalid verification link.");
    }
  }, [emailVerificationToken]);

  return (
    <div className="flex h-dvh w-full flex-col justify-center bg-ink-100 px-6">
      <div className="card animate-slide-up p-6 text-center">
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
            loading ? "bg-ink-100 text-ink-500" : success ? "bg-brand-50 text-brand-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          {loading ? <Spinner size="md" /> : success ? <MailCheck size={36} /> : <MailWarning size={36} />}
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {loading ? "Verifying your email…" : success ? "Email verified" : "Email verification"}
        </h1>
        {!loading && <p className="mb-6 mt-2 text-sm text-ink-500">{response}</p>}
        <Button
          title={"Go to home"}
          classes={loading ? "mt-6" : ""}
          variant={success ? "brand" : "primary"}
          fun={() => navigate(userType === "captain" ? "/captain/home" : "/home")}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default VerifyEmail;
