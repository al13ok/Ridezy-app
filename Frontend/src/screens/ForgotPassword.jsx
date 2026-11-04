import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "../components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Console from "../utils/console";
import { getErrorMessage } from "../utils/errorMessage";
import axios from "axios";
import useCooldownTimer from "../hooks/useCooldownTimer";
import { KeyRound, Mail } from "lucide-react";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";
import { PageHeader } from "../components/ui";

const allowedParams = ["user", "captain"];

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();
  const { userType } = useParams();
  const { alert, showAlert, hideAlert } = useAlert();
  const { timeLeft, isActive, startCooldown } = useCooldownTimer(60000, "forgot-password-cooldown");

  if (!allowedParams.includes(userType)) {
    return <Navigate to={"/not-found"} replace />;
  }

  const forgotPassword = async (data) => {
    if (data.email.trim() !== "") {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/mail/${userType}/reset-password`, data);
        Console.log(response);
        showAlert(
          "Reset password email sent successfully!",
          "Please check your inbox and click on the received link to reset the password",
          "success"
        );
        startCooldown();
      } catch (error) {
        showAlert("Some error occured", getErrorMessage(error), "failure");
        Console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getButtonTitle = () => {
    if (isActive) {
      return `Resend in ${timeLeft}s`;
    }
    return "Send reset link";
  };

  return (
    <div className="relative flex h-dvh w-full flex-col bg-ink-100">
      <Alert heading={alert.heading} text={alert.text} isVisible={alert.isVisible} onClose={hideAlert} type={alert.type} />
      <PageHeader title="Forgot password" onBack={() => navigation(-1)} />
      <div className="flex flex-1 flex-col justify-center px-6 pb-10">
        <div className="card animate-slide-up p-6">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <KeyRound size={36} />
          </div>
          <h1 className="text-center text-2xl font-extrabold tracking-tight">Reset your password</h1>
          <p className="mb-6 mt-2 text-balance text-center text-sm text-ink-500">
            Enter the email linked to your {userType === "captain" ? "captain" : "rider"} account and we&apos;ll send
            you a reset link.
          </p>

          <form onSubmit={handleSubmit(forgotPassword)}>
            <Input placeholder={"you@example.com"} type={"email"} name={"email"} icon={Mail} register={register} error={errors.email} />
            <Button
              title={getButtonTitle()}
              loading={loading}
              loadingMessage={"Sending…"}
              type="submit"
              variant="brand"
              size="lg"
              disabled={loading || isActive}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
