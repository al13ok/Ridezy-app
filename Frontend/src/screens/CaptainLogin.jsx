import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import Console from "../utils/console";
import { getErrorMessage } from "../utils/errorMessage";
import { DEMO_ACCOUNTS } from "../utils/demo";

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
        setLoading(true)
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/captain/login`,
          data
        );
        Console.log(response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userData", JSON.stringify({
          type: "captain",
          data: response.data.captain,
        }));
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
    <div className="w-full h-dvh flex flex-col justify-between p-4 pt-6">
      <div>
        <Heading title={"Captain Login🚕"} />
        <form onSubmit={handleSubmit(loginCaptain)}>
          <Input
            label={"Email"}
            type={"email"}
            name={"email"}
            register={register}
            error={errors.email}
          />
          <Input
            label={"Password"}
            type={"password"}
            name={"password"}
            register={register}
            error={errors.password}
          />
          {responseError && (
            <p className="text-sm text-center mb-4 text-red-500">
              {responseError}
            </p>
          )}
          <Link to="/captain/forgot-password" className="text-sm mb-2 inline-block">
            Forgot Password?
          </Link>
          <Button title={"Login"} loading={loading} type="submit" />
        </form>
        {/* One-click demo: no signup, no email verification */}
        <div className="flex items-center gap-3 my-4 text-xs text-zinc-400"><div className="h-px flex-1 bg-zinc-200"></div>OR<div className="h-px flex-1 bg-zinc-200"></div></div>
        <Button
          title={"Try instantly as Demo Captain"}
          loading={loading}
          fun={() => loginCaptain(DEMO_ACCOUNTS.captain)}
          classes={"bg-green-600"}
        />
        <p className="text-sm font-normal text-center mt-4">
          Don't have an account?{" "}
          <Link to={"/captain/signup"} className="font-semibold">
            Sign up
          </Link>
        </p>

      </div>
      <div>
        <Button
          type={"link"}
          path={"/login"}
          title={"Login as User"}
          classes={"bg-green-500"}
        />
        <p className="text-xs font-normal text-center self-end mt-6">
          This site is protected by reCAPTCHA and the Google{" "}
          <span className="font-semibold underline">Privacy Policy</span> and{" "}
          <span className="font-semibold underline">Terms of Service</span>{" "}
          apply.
        </p>
      </div>
    </div>
  );
}

export default CaptainLogin;
