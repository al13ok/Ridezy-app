import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import Console from "../utils/console";
import { Lock, Mail, Phone } from "lucide-react";
import { AuthLayout } from "../components/ui";
import RoleSwitch from "../components/RoleSwitch";
import { getErrorMessage } from "../utils/errorMessage";

function UserSignup() {
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();
  const signupUser = async (data) => {
    const userData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/register`, userData);
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      navigation("/home");
    } catch (error) {
      setResponseError(getErrorMessage(error));
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setResponseError("");
    }, 5000);
  }, [responseError]);
  return (
    <AuthLayout
      footer={<RoleSwitch to="/captain/signup" title="Want to earn with Ridezy?" subtitle="Sign up as a captain" />}
    >
      <Heading title={"Create your account"} subtitle={"It takes less than a minute."} />
      <form onSubmit={handleSubmit(signupUser)}>
        <div className="flex gap-3">
          <Input label={"First name"} name={"firstname"} placeholder="Riya" register={register} error={errors.firstname} />
          <Input label={"Last name"} name={"lastname"} placeholder="Sharma" register={register} error={errors.lastname} />
        </div>
        <Input label={"Phone number"} type={"number"} name={"phone"} placeholder="10-digit mobile number" icon={Phone} register={register} error={errors.phone} />
        <Input label={"Email"} type={"email"} name={"email"} placeholder="you@example.com" icon={Mail} register={register} error={errors.email} />
        <Input label={"Password"} type={"password"} name={"password"} placeholder="At least 8 characters" icon={Lock} register={register} error={errors.password} />
        {responseError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">{responseError}</p>
        )}
        <Button title={"Create account"} loading={loading} type="submit" size="lg" classes="mt-1" />
      </form>
      <p className="mt-5 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link to={"/login"} className="font-bold text-ink-900 underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default UserSignup;
