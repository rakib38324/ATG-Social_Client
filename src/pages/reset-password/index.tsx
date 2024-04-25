import Image from "next/image";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaQuestionCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Layout from "@/components/common/layout/layout";
import Loading from "@/components/common/loading/loading";
import login from "../../../images/login.png";

interface FormValues {
  password: string;
}

const ResetPassword = () => {
  const [passwordType, setPasswordType] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const token = router?.query?.token;
  const email = router?.query?.email;

  const handleSetPassword = async (data: FormValues) => {
    setLoading(true);
    if (token) {
      const toastId = toast.loading("Processing, Please wait...");

      const FormData = {
        newPassword: data.password,
        email: email,
      };

      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
          body: JSON.stringify(FormData),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res?.success === true) {
              toast.success(`${res?.message}`, {
                id: toastId,
                duration: 10000,
              });
              setLoading(false);
              setError("");
              setMessage(`${res?.data}`)
            }

            if (res?.success === false) {
              toast.error(res?.errorMessage, { id: toastId, duration: 6000 });
              setError(res?.errorMessage);
              setLoading(false);
            }
          });
      } catch (error) {
        console.log(error);
        toast.error("Oops! Some thing went wrong.", {
          id: toastId,
          duration: 4000,
        });
        setLoading(false);
      }
    }
  };
  return (
    <Layout pageTitle="ATG | Reset Password">
        {loading && <Loading />}
      <section className=" grid lg:grid-cols-2 light:border-[1px] border-blue-600">
        <div className="py-20 bg-blue-50 ">
          <div className="lg:w-1/2 mx-auto p-4">
            <p className="text-center text-3xl text-[#555]  font-semibold font-[Poppins] mb-10 underline">
              Set your Password
            </p>

            <form onSubmit={handleSubmit(handleSetPassword)}>
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block mb-2 text-lg  font-[Poppins] text-[#555] "
                >
                  New Password
                </label>
                <div className="flex relative">
                  <input
                    type={passwordType === false ? `password` : "text"}
                    placeholder="new password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be 6 characters long",
                      },
                      pattern: {
                        value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                        message:
                          "Password must have uppercase, number and special characters",
                      },
                    })}
                    className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)]  p-3 focus:outline-none rounded-lg`}
                  />

                  {passwordType === false ? (
                    <div
                      onClick={() => setPasswordType(!passwordType)}
                      className="cursor-pointer text-blue-600 absolute right-5 top-1/3 text-xl"
                    >
                      <FaEyeSlash />
                    </div>
                  ) : (
                    <div
                      onClick={() => setPasswordType(!passwordType)}
                      className="cursor-pointer text-blue-600 absolute right-5 top-1/3 text-xl"
                    >
                      <FaEye />
                    </div>
                  )}
                  
                </div>
                {errors?.password && (
                  <p className="text-red-600 my-2 ml-2 font-semibold">
                    {errors?.password?.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="my-5 font-semibold text-red-600">{error}</p>
              )}

              <button className="w-full mt-10 bg-blue-800 text-center text-lg text-white font-[Poppins] font-semibold  py-3 rounded-lg cursor-pointer border-[1px] border-[#1E2772] hover:bg-blue-600">
                Reset Password
              </button>
            </form>
          </div>
        </div>
        <div className="pl-5 hidden relative lg:block lg:flex justify-center items-center bg-gradient-to-r from-[#5233eed7] from-30% to-[#2CD4D9] to-120% dark:bg-gradient-to-r">
          <div>
            <Image
              className="w-1/2 mx-auto"
              src={login}
              priority
              alt="podcast_logo"
            />
           
          </div>
        </div>
      </section>
      <Toaster />
    </Layout>
  );
};

export default ResetPassword;
