import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { Hash, Mail, Palette, Phone, Users } from "lucide-react";
import { Avatar, PageHeader, VehicleTypePicker } from "../components/ui";
import Console from "../utils/console";

function CaptainEditProfile() {
  const token = localStorage.getItem("token");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { captain } = useCaptain();

  const navigation = useNavigate();

  const updateUserProfile = async (data) => {
    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: data.type.toLowerCase(),
      },
    };
    Console.log(captainData);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/update`,
        { captainData },
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      navigation("/captain/home");
    } catch (error) {
      setResponseError(error.response.data[0].msg);
      Console.log(error.response);
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
    <div className="h-dvh w-full overflow-y-auto bg-ink-100">
      <PageHeader title="Edit profile" subtitle="Captain account" onBack={() => navigation(-1)} />
      <div className="px-4 pb-8">
        <div className="mb-4 flex flex-col items-center pt-2 text-center">
          <Avatar firstname={captain?.fullname?.firstname} lastname={captain?.fullname?.lastname} size="xl" tone="ink" />
          <p className="mt-3 text-lg font-extrabold tracking-tight">
            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
          </p>
          <p className="text-xs text-ink-500">{captain?.email}</p>
        </div>

        <Input
          label={"Email"}
          type={"email"}
          name={"email"}
          icon={Mail}
          register={register}
          error={errors.email}
          defaultValue={captain.email}
          disabled={true}
        />
        <form onSubmit={handleSubmit(updateUserProfile)}>
          <div className="card mb-3 p-5">
            <p className="eyebrow mb-3">Personal details</p>
            <div className="flex gap-3">
              <Input
                label={"First name"}
                name={"firstname"}
                register={register}
                error={errors.firstname}
                defaultValue={captain.fullname.firstname}
              />
              <Input
                label={"Last name"}
                name={"lastname"}
                register={register}
                error={errors.lastname}
                defaultValue={captain.fullname.lastname}
              />
            </div>
            <Input
              label={"Phone number"}
              type={"number"}
              name={"phone"}
              icon={Phone}
              register={register}
              error={errors.phone}
              defaultValue={captain.phone}
            />
          </div>

          <div className="card mb-4 p-5">
            <p className="eyebrow mb-3">Vehicle details</p>
            <VehicleTypePicker register={register} error={errors.type} defaultValue={captain.vehicle.type} />
            <div className="flex gap-3">
              <Input
                label={"Colour"}
                name={"color"}
                icon={Palette}
                register={register}
                error={errors.color}
                defaultValue={captain.vehicle.color}
              />
              <Input
                label={"Seats"}
                type={"number"}
                name={"capacity"}
                icon={Users}
                register={register}
                error={errors.capacity}
                defaultValue={captain.vehicle.capacity}
              />
            </div>
            <Input
              label={"Vehicle number"}
              name={"number"}
              icon={Hash}
              register={register}
              error={errors.number}
              defaultValue={captain.vehicle.number}
            />
          </div>
          {responseError && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">
              {responseError}
            </p>
          )}
          <Button title={"Save changes"} loading={loading} type="submit" size="lg" />
        </form>
      </div>
    </div>
  );
}

export default CaptainEditProfile;
