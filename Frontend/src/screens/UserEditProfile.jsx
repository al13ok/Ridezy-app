import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { Mail, Phone } from "lucide-react";
import { Avatar, PageHeader } from "../components/ui";
import Console from "../utils/console";
import { getErrorMessage } from "../utils/errorMessage";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

function UserEditProfile() {
  const token = localStorage.getItem("token");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user } = useUser();

  const navigation = useNavigate();

  const updateUserProfile = async (data) => {
    const userData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      phone: data.phone,
    };
    Console.log(userData);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/update`,
        userData,
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      showAlert('Edit Successful', 'Your profile details has been successfully updated', 'success');

      setTimeout(() => {
        navigation("/home");
      }, 5000)
    } catch (error) {
      showAlert('Some Error occured', getErrorMessage(error), 'failure');

      Console.log(error.response);
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
    <div className="relative h-dvh w-full overflow-y-auto bg-ink-100">
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <PageHeader title="Edit profile" subtitle="Rider account" onBack={() => navigation(-1)} />
      <div className="px-4 pb-8">
        <div className="mb-4 flex flex-col items-center pt-2 text-center">
          <Avatar firstname={user?.fullname?.firstname} lastname={user?.fullname?.lastname} size="xl" />
          <p className="mt-3 text-lg font-extrabold tracking-tight">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </p>
          <p className="text-xs text-ink-500">{user?.email}</p>
        </div>

        <div className="card p-5">
          <Input
            label={"Email"}
            type={"email"}
            name={"email"}
            icon={Mail}
            register={register}
            error={errors.email}
            defaultValue={user.email}
            disabled={true}
          />
          <form onSubmit={handleSubmit(updateUserProfile)}>
            <div className="flex gap-3">
              <Input
                label={"First name"}
                name={"firstname"}
                register={register}
                error={errors.firstname}
                defaultValue={user.fullname.firstname}
              />
              <Input
                label={"Last name"}
                name={"lastname"}
                register={register}
                error={errors.lastname}
                defaultValue={user.fullname.lastname}
              />
            </div>
            <Input
              label={"Phone number"}
              type={"number"}
              name={"phone"}
              icon={Phone}
              register={register}
              error={errors.phone}
              defaultValue={user.phone}
            />
            {responseError && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">
                {responseError}
              </p>
            )}
            <Button title={"Save changes"} loading={loading} type="submit" size="lg" classes={"mt-2"} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserEditProfile;
