import Layout from "@/components/common/layout/layout";
import Loading from "@/components/common/loading/loading";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import login from "../../../images/login.png";
import { setAccessToken } from "@/components/common/token/auth";

interface FormValues {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const [passwordType, setPasswordType] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  // console.log(data);
  const handleLogin = async (data: FormValues) => {
    setLoading(true);
    const toastId = toast.loading("Processing, Please wait...");

    const FormData = {
      username: data.username,
      password: data.password,
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res?.success === true) {
            setAccessToken(res.data.token);
            localStorage.setItem("User_Id", `${res?.data?.user?._id}`);
            toast.success(res?.message, { id: toastId, duration: 2000 });
            setLoading(false);
            setError("");
            router.push("/");
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
  };

  return (
    <Layout pageTitle="ATG | Login">
      {loading && <Loading />}
      <section className=" grid lg:grid-cols-2 light:border-[1px] border-blue-600">
        <div className="py-20 bg-blue-50">
        
          <div className="lg:w-2/3 mx-auto p-4">
            <p className="text-center text-2xl lg:text-3xl text-[#555] font-semibold font-[Poppins] mb-10 underline">
              Login Your Account
            </p>

            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="flex lg:flex-row flex-col justify-between gap-[50px] lg:gap-[100px] mb-[1.5rem]">
                <div className="w-full">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-lg font-medium font-[Poppins] text-[#555]"
                  >
                    User name
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="info@gmail.com"
                      {...register("username", {
                        required: "Username is required",
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
              </div>

              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block mb-2 text-lg  font-[Poppins] text-[#555] "
                >
                  Password
                </label>
                <div className="flex relative">
                  <input
                    type={passwordType === false ? `password` : "text"}
                    placeholder="your password"
                    {...register("password", {
                      required: "Password is required",
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
                      className="cursor-pointer text-blue-600  absolute right-5 top-1/3 text-xl"
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

              <p
                onClick={() => router.push("/forget-password")}
                className="text-end mt-5 mb-8 text-blue-600 underline hover:font-medium hover:cursor-pointer"
              >
                Forgot password?
              </p>

              {error && (
                <p className="my-5 font-semibold text-red-600">{error}</p>
              )}

              <button className="w-full bg-blue-800 text-center text-lg text-white font-[Poppins] font-semibold  py-3 rounded-lg cursor-pointer border-[1px] border-[#1E2772] hover:bg-blue-600">
                Login now
              </button>

              <div className="flex items-center gap-8 py-10">
                <p className="border-b-2 border-[#C2C2C2] w-1/2"></p>
                <span className="">OR</span>
                <p className="border-b-2 border-[#C2C2C2] w-1/2"></p>
              </div>

              <p
                onClick={() => router.push("/signup")}
                className=" text-center text-lg text-blue-600 font-[Poppins] font-semibold  py-3 rounded-lg cursor-pointer border-[1px] border-[#1E2772] hover:border-[2px] "
              >
                SignUp Now
              </p>
            </form>
          </div>
        </div>
        <div className="pl-5 hidden relative lg:block lg:flex justify-center items-center bg-gradient-to-r from-[#5233eed7] from-30% to-[#2CD4D9] to-120% ">
          <div>
            <Image
              className=" mx-auto"
              src={login}
              priority
              alt="social logo"
            />
          </div>
        </div>
      </section>
      <Toaster />
    </Layout>
  );
};

export default Login;
