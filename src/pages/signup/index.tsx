import Layout from "@/components/common/layout/layout";
import Loading from "@/components/common/loading/loading";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import login from "../../../images/login.png";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormValues {
  username: string;
  password: string;
  cPassword: string;
  email: string;
}

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(false);
  const [passwordType2, setPasswordType2] = useState(false);

  const handleRegistration = async (data: FormValues) => {
    setLoading(true);
    const toastId = toast.loading("Processing, Please wait...");

    if (data?.password === data?.cPassword) {
      const FormData = {
        username: data.username,
        email: data.email,
        password: data.password,
      };


      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/register/user-registration`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(FormData),
          }
        )
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res?.success === true) {
              toast.success(res?.message, { id: toastId, duration: 2000 });
              setLoading(false);
              setError("");
              router.push("/login");
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
    } else {
      toast.error("Confirm password are not match with password.", {
        id: toastId,
        duration: 6000,
      });
      setError("Password are not match.");
    }
  };
  return (
    <Layout pageTitle="ATG | SignUp">
      {loading && <Loading />}

      <section className="grid lg:grid-cols-2  border-[1px] border-blue-600">
        <div className="hidden lg:block lg:flex justify-center items-center bg-gradient-to-r from-[#5233ee] from-30% to-[#2CD4D9] to-120%">
          <div>
            <Image
              className=" mx-auto"
              src={login}
              priority
              alt="social logo"
            />
          </div>
        </div>

        <div className="mt-10 mb-20">
          <div className=" mx-auto p-4 ">
            <p className="text-center underline mb-10 text-3xl md:text-4xl text-[#555] font-semibold font-[Poppins]">
              Create Account
            </p>

            <form onSubmit={handleSubmit(handleRegistration)}>
              <div className="w-10/12 mx-auto grid md:grid-cols-2 gap-5 mb-[1.5rem]">
                <div className="w-full ">
                  <label
                    htmlFor="username"
                    className="block text-black  mb-2 text-lg md:text-xl font-medium font-[Poppins] "
                  >
                    Username
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Username."
                      {...register("username", {
                        required: "User name is required",
                      })}
                      className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)] p-3 focus:outline-none rounded-lg`}
                    />
                  </div>

                  {errors?.username && (
                    <p className="text-red-600 my-2 ml-2 font-semibold">
                      {errors?.username?.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-black mb-2 text-lg md:text-xl font-medium font-[Poppins] "
                  >
                    Email
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Email address"
                      {...register("email", {
                        required: "Email is required",
                      })}
                      className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)] p-3 focus:outline-none rounded-lg`}
                    />
                  </div>
                  {errors?.email && (
                    <p className="text-red-600 my-2 ml-2 font-semibold">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="block text-black  mb-2 text-lg md:text-xl font-medium font-[Poppins] "
                  >
                    Password
                  </label>
                  <div className="w-full relative">
                    <input
                      type={passwordType === false ? `password` : "text"}
                      id="password"
                      placeholder="*******"
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
                      className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)] p-3 focus:outline-none rounded-lg`}
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

                <div className="w-full">
                  <label
                    htmlFor="cPassword"
                    className="block text-black mb-2 text-lg md:text-xl font-medium font-[Poppins] "
                  >
                    Confirm Password
                  </label>
                  <div className="w-full relative">
                    <input
                      type={passwordType2 === false ? `password` : "text"}
                      id="cPassword"
                      placeholder="*******"
                      {...register("cPassword", {
                        required: "Confirm Password is required",
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

                    {passwordType2 === false ? (
                      <div
                        onClick={() => setPasswordType2(!passwordType2)}
                        className="cursor-pointer text-blue-600 absolute right-5 top-1/3 text-xl"
                      >
                        <FaEyeSlash />
                      </div>
                    ) : (
                      <div
                        onClick={() => setPasswordType2(!passwordType2)}
                        className="cursor-pointer text-blue-600 absolute right-5 top-1/3 text-xl"
                      >
                        <FaEye />
                      </div>
                    )}
                  </div>
                  {errors?.cPassword && (
                    <p className="text-red-600 my-2 ml-2 font-semibold">
                      {errors?.cPassword?.message}
                    </p>
                  )}
                  {error === "Password are not match." && (
                    <p className="text-red-600 my-2 ml-2 font-semibold">
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-10/12 mx-auto">
                {error && (
                  <div className="my-5 text-red-600 font-semibold">
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-5 bg-blue-900 text-center text-lg text-white font-[Poppins] font-semibold  py-3 rounded-lg cursor-pointer border-[1px] border-[#1E2772] hover:bg-[#3c23b8]"
                >
                  Registration Now
                </button>

                <div className=" mx-auto flex items-center gap-8 py-5">
                  <p className="border-b-2 border-[#C2C2C2] w-1/2"></p>
                  <span className="">OR</span>
                  <p className="border-b-2 border-[#C2C2C2] w-1/2"></p>
                </div>

                <p
                  onClick={() => router.push("/login")}
                  className=" text-center text-lg text-[#6447EF] font-[Poppins] font-semibold  py-3 rounded-lg cursor-pointer border-[1px] border-[#1E2772] hover:bg-gray-200 "
                >
                  Login Now
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Toaster />
    </Layout>
  );
};

export default SignUp;
