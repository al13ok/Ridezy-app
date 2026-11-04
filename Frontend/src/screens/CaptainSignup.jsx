import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { ArrowLeft, ArrowRight, Hash, Lock, Mail, Palette, Phone, Users } from "lucide-react";
import Console from "../utils/console";
import { AuthLayout, VehicleTypePicker } from "../components/ui";
import RoleSwitch from "../components/RoleSwitch";
import { getErrorMessage } from "../utils/errorMessage";

function CaptainSignup() {
  const [responseError, setResponseError] = useState("");
  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigation = useNavigate();
  const signupCaptain = async (data) => {
    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: data.type,
      },
    };
    Console.log(captainData);

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/captain/register`, captainData);
      Console.log(response);
      localStorage.setItem("token", response.data.token);
      navigation("/captain/home");
    } catch (error) {
      setResponseError(getErrorMessage(error));
      setShowVehiclePanel(false);
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

  const step = showVehiclePanel ? 2 : 1;

  return (
    <AuthLayout
      badge="Captain"
      footer={<RoleSwitch to="/signup" title="Just want to ride?" subtitle="Create a rider account" captain={false} />}
    >
      <div className="mb-5 flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-brand-500" : "bg-ink-200"}`} />
        ))}
      </div>
      <p className="eyebrow mb-1">Step {step} of 2</p>
      <Heading
        title={step === 1 ? "Become a captain" : "Your vehicle"}
        subtitle={step === 1 ? "Tell us a little about yourself." : "Riders will see these details when you arrive."}
      />

      <form onSubmit={handleSubmit(signupCaptain)}>
        {!showVehiclePanel && (
          <div className="animate-fade-in">
            <div className="flex gap-3">
              <Input label={"First name"} name={"firstname"} placeholder="Aman" register={register} error={errors.firstname} />
              <Input label={"Last name"} name={"lastname"} placeholder="Singh" register={register} error={errors.lastname} />
            </div>
            <Input label={"Phone number"} type={"number"} name={"phone"} placeholder="10-digit mobile number" icon={Phone} register={register} error={errors.phone} />
            <Input label={"Email"} type={"email"} name={"email"} placeholder="you@example.com" icon={Mail} register={register} error={errors.email} />
            <Input label={"Password"} type={"password"} name={"password"} placeholder="At least 8 characters" icon={Lock} register={register} error={errors.password} />
            {responseError && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">{responseError}</p>
            )}
            <Button title={"Continue"} icon={<ArrowRight size={18} />} size="lg" fun={() => setShowVehiclePanel(true)} />
          </div>
        )}
        {showVehiclePanel && (
          <div className="animate-fade-in">
            <VehicleTypePicker register={register} error={errors.type} />
            <div className="flex gap-3">
              <Input label={"Colour"} name={"color"} placeholder="White" icon={Palette} register={register} error={errors.color} />
              <Input label={"Seats"} type={"number"} name={"capacity"} placeholder="4" icon={Users} register={register} error={errors.capacity} />
            </div>
            <Input label={"Vehicle number"} name={"number"} placeholder="DL 01 AB 1234" icon={Hash} register={register} error={errors.number} />

            {responseError && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">{responseError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Back"
                onClick={() => setShowVehiclePanel(false)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-ink-200 bg-white text-ink-900 transition hover:border-ink-900 active:scale-95"
              >
                <ArrowLeft size={20} />
              </button>
              <Button title={"Create captain account"} loading={loading} type="submit" variant="brand" size="lg" />
            </div>
          </div>
        )}
      </form>
      <p className="mt-5 text-center text-sm text-ink-500">
        Already a captain?{" "}
        <Link to={"/captain/login"} className="font-bold text-ink-900 underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default CaptainSignup;
