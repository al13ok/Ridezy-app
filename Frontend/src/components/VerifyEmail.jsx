import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { getErrorMessage } from "../utils/errorMessage";
import { MailCheck } from "lucide-react";
import Button from "./Button";
import useCooldownTimer from "../hooks/useCooldownTimer";
import { Alert } from "../components";
import { useAlert } from "../hooks/useAlert";
import { PageHeader } from "./ui";

function VerifyEmail({ user, role }) {
  const navigation = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const { timeLeft, isActive, startCooldown } = useCooldownTimer(60000, "forgot-password-cooldown");

  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/mail/verify-${role}-email`, {
        headers: {
          token: token,
        },
      });
      if (response.status === 200) {
        showAlert(
          "Verification email sent successfully!",
          "Please check your inbox and click on the received link to verify your account",
          "success"
        );
        startCooldown();
      }
    } catch (error) {
      showAlert("Some error occured", getErrorMessage(error), "failure");
      Console.error("Error sending verification email:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonTitle = () => {
    if (isActive) {
      return `Resend in ${timeLeft}s`;
    }
    return "Send verification email";
  };
  return (
    <div className="relative flex h-dvh w-full flex-col bg-ink-100">
      <Alert heading={alert.heading} text={alert.text} isVisible={alert.isVisible} onClose={hideAlert} type={alert.type} />
      <PageHeader title="Verify your email" onBack={() => navigation(-1)} />
      <div className="flex flex-1 flex-col justify-center px-6 pb-10">
        <div className="card animate-slide-up p-6 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <MailCheck size={38} />
          </div>
          <p className="text-sm text-ink-500">Hi {user?.fullname?.firstname},</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">One last step</h1>
          <p className="mt-2 text-sm text-ink-500">
            We&apos;ll send a verification link to activate your account.
          </p>
          <span className="my-5 inline-block max-w-full truncate rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-900">
            {user?.email}
          </span>
          <Button
            title={getButtonTitle()}
            variant="brand"
            loading={loading}
            loadingMessage={"Sending email…"}
            fun={sendVerificationEmail}
            disabled={loading || isActive}
          />
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
