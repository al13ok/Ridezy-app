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

function UserLogin() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();

  const loginUser = async (data) => {
    if (data.email.trim() !== "" && data.password.trim() !== "") {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/login`, data);
        Console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            type: "user",
            data: response.data.user,
          })
        );
        navigation("/home");
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
      footer={
        <RoleSwitch
          to="/captain/login"
          title="Driving with Ridezy?"
          subtitle="Log in to your captain account"
        />
      }
    >
      <Heading title={"Welcome back"} subtitle={"Log in to book your next ride."} />
      <form onSubmit={handleSubmit(loginUser)}>
        <Input label={"Email"} type={"email"} name={"email"} placeholder="you@example.com" icon={Mail} register={register} error={errors.email} />
        <Input label={"Password"} type={"password"} name={"password"} placeholder="Your password" icon={Lock} register={register} error={errors.password} />
        <div className="-mt-1 mb-5 flex justify-end">
          <Link to="/user/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>
        {responseError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">{responseError}</p>
        )}
        <Button title={"Log in"} loading={loading} type="submit" size="lg" />
      </form>
      <DemoLogin label="Try instantly as a demo rider" loading={loading} onClick={() => loginUser(DEMO_ACCOUNTS.rider)} />
      <p className="mt-5 text-center text-sm text-ink-500">
        New to Ridezy?{" "}
        <Link to={"/signup"} className="font-bold text-ink-900 underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default UserLogin;
