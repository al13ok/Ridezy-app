import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import Console from "../utils/console";
import { Lock, Mail } from "lucide-react";
import { AuthLayout } from "../components/ui";
import RoleSwitch from "../components/RoleSwitch";
import { getErrorMessage } from "../utils/errorMessage";
import { DEMO_ACCOUNTS } from "../utils/demo";
import DemoLogin from "../components/DemoLogin";

function CaptainLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();

  const loginCaptain = async (data) => {
    if (data.email.trim() !== "" && data.password.trim() !== "") {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/captain/login`, data);
        Console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            type: "captain",
            data: response.data.captain,
          })
        );
        navigation("/captain/home");
      } catch (error) {
        setResponseError(getErrorMessage(error));
        Console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setResponseError("");
    }, 5000);
  }, [responseError]);
  return (
    <AuthLayout
      badge="Captain"
      footer={<RoleSwitch to="/login" title="Need a ride instead?" subtitle="Log in as a rider" captain={false} />}
    >
      <Heading title={"Ready to drive?"} subtitle={"Log in to start receiving ride requests."} />
      <form onSubmit={handleSubmit(loginCaptain)}>
        <Input label={"Email"} type={"email"} name={"email"} placeholder="you@example.com" icon={Mail} register={register} error={errors.email} />
        <Input label={"Password"} type={"password"} name={"password"} placeholder="Your password" icon={Lock} register={register} error={errors.password} />
        <div className="-mt-1 mb-5 flex justify-end">
          <Link to="/captain/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>
        {responseError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">{responseError}</p>
        )}
        <Button title={"Log in as captain"} loading={loading} type="submit" size="lg" />
      </form>
      <DemoLogin label="Try instantly as a demo captain" loading={loading} onClick={() => loginCaptain(DEMO_ACCOUNTS.captain)} />
      <p className="mt-5 text-center text-sm text-ink-500">
        New captain?{" "}
        <Link to={"/captain/signup"} className="font-bold text-ink-900 underline-offset-4 hover:underline">
          Sign up to drive
        </Link>
      </p>
    </AuthLayout>
  );
}

export default CaptainLogin;
