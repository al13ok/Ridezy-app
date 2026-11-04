import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Input } from "../components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Console from "../utils/console";
import { getErrorMessage } from "../utils/errorMessage";
import axios from "axios";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";
import { Lock, LockKeyhole } from "lucide-react";
import { PageHeader } from "../components/ui";

const allowedParams = ["user", "captain"];

function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { userType } = useParams();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { alert, showAlert, hideAlert } = useAlert();

  if (!allowedParams.includes(userType)) {
    return <Navigate to={"/not-found"} replace />;
  }

  const resetPassword = async (data) => {
    if (data.password.length < 8 || data.confirmPassword.length < 8) {
      showAlert("Incorrect Password Length", "Password must be at least 8 characters long", "failure");
      return;
    }
    if (data.password !== data.confirmPassword) {
      showAlert(
        "Passwords Mismatch",
        "The password and confirm password fields must be identical. Please re-enter them",
        "failure"
      );
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/${userType}/reset-password`, {
        token: token,
        password: data.password,
      });
      showAlert("Password reset successfully!", response.data.message, "success");
      Console.log(response);
      // reset link is single use, so go back to login
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      showAlert("Some error occured!", getErrorMessage(error), "failure");
      setTimeout(() => {
        navigate("/" + userType + "/forgot-password");
      }, 5000);
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-dvh w-full flex-col bg-ink-100">
      <Alert heading={alert.heading} text={alert.text} isVisible={alert.isVisible} onClose={hideAlert} type={alert.type} />
      <PageHeader title="New password" onBack={() => navigate(-1)} />
      <div className="flex flex-1 flex-col justify-center px-6 pb-10">
        <div className="card animate-slide-up p-6">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-ink-900 text-white">
            <LockKeyhole size={34} />
          </div>
          <h1 className="text-center text-2xl font-extrabold tracking-tight">Create a new password</h1>
          <p className="mb-6 mt-2 text-center text-sm text-ink-500">
            Use at least 8 characters. You&apos;ll be asked to log in again afterwards.
          </p>
          <form onSubmit={handleSubmit(resetPassword)}>
            <Input label={"New password"} type={"password"} name={"password"} icon={Lock} register={register} error={errors.password} />
            <Input
              label={"Confirm password"}
              type={"password"}
              name={"confirmPassword"}
              icon={Lock}
              register={register}
              error={errors.confirmPassword}
            />
            <Button title={"Update password"} loading={loading} type="submit" size="lg" classes="mt-1" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
