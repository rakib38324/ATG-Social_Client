import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Layout from "@/components/common/layout/layout";
import Loading from "@/components/common/loading/loading";
import login from "../../../images/login.png";

interface FormValues {
  email: string;
}

const ForgetPassword = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleForgetPassword = async (data: FormValues) => {
    setLoading(true)
    const toastId = toast.loading("Processing, Please wait...");

    const FormData = {
      email: data.email,
    };

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res?.success === true) {
            toast.success(`${res?.message} and ${res?.data}`, { id: toastId, duration: 10000 });
            setLoading(false);
            setError("");
            setMessage(`${res?.message} and ${res?.data}`)
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
    <Layout pageTitle="ATG | Forget Password">
      {loading && <Loading />}
      <section className=" grid lg:grid-cols-2 light:border-[1px] border-blue-600">
        <div className="py-20 bg-blue-50 ">
          <div className="lg:w-1/2 mx-auto p-4">
            <p className="text-center text-3xl text-[#555]  font-semibold font-[Poppins] mb-10 underline">
              Reset Your Password
            </p>

            <form onSubmit={handleSubmit(handleForgetPassword)}>
              <div className="flex lg:flex-row flex-col justify-between gap-[50px] lg:gap-[100px] mb-[1.5rem]">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-lg font-medium font-[Poppins] text-[#555] "
                  >
                    Email
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="info@gmail.com"
                      {...register("email", {
                        required: "Email is required",
                      })}
                      className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)]  p-3 focus:outline-none rounded-lg`}
                    />
                   
                  </div>
                  {errors?.email && (
                    <p className="text-red-600 my-2 ml-2 font-semibold">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <p className="my-5 font-semibold text-red-600">{error}</p>
              )}
              {message && (
                <p className="my-5 font-semibold text-blue-600">{message}</p>
              )}

              <button className="w-full bg-blue-800 text-center text-lg text-white font-[Poppins] font-semibold  py-3 rounded-lg cursor-pointer border-[1px] border-[#1E2772] hover:bg-blue-600">
                Reset Password
              </button>
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

export default ForgetPassword;
