import Layout from "@/components/common/layout/layout";
import Loading from "@/components/common/loading/loading";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import login from "../../../images/login.png";
import Image from "next/image";
import toast from "react-hot-toast";

interface FormValues {
  title: string;
  description: string;
  image: String;
}

const AddPost = () => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleCreatePost = async (data: FormValues) => {
    setLoading(true);
    const toastId = toast.loading("Processing, Please wait...");

    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;
    try {
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((imgData) => {
          console.log(imgData);

          const PostData = {
            title: data.title,
            description: data.description,
            image: imgData?.data?.url,
          };

          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/post/create-post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(PostData),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if (res?.success === true) {
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
    <Layout pageTitle="ATG | Add Post">
      {loading && <Loading />}
      <section className=" grid lg:grid-cols-2 light:border-[1px] border-blue-600">
        <div className="py-20 bg-blue-50">
          <div className="lg:w-2/3 mx-auto p-4">
            <p className="text-center text-2xl lg:text-3xl text-[#555] font-semibold font-[Poppins] mb-10 underline">
              Create Your Post
            </p>

            <form onSubmit={handleSubmit(handleCreatePost)}>
              <div className="flex lg:flex-row flex-col justify-between gap-[50px] lg:gap-[100px] mb-[1.5rem]">
                <div className="w-full">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-lg font-medium font-[Poppins] text-[#555]"
                  >
                    Title
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Post title"
                      {...register("title", {
                        required: "Title is required",
                      })}
                      className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)] p-3 focus:outline-none rounded-lg`}
                    />
                  </div>
                  {errors?.title && (
                    <p className="text-red-600 my-2 ml-2 font-semibold">
                      {errors?.title?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex lg:flex-row flex-col justify-between gap-[50px] lg:gap-[100px] mb-[1.5rem]">
                <div className="w-full">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-lg font-medium font-[Poppins] text-[#555]"
                  >
                    Image
                  </label>
                  <div className="flex">
                    <input
                      type="file"
                      {...register("image", {
                        required: "Image is Required",
                      })}
                      className={`w-full border cursor-pointer border-blue-400 bg-[rgba(245,247,248,1)] p-3 focus:outline-none rounded-lg`}
                      
                    />
                  </div>
                  {errors?.image && (
                    <p className="text-red-600 my-2 ml-2 font-semibold">
                      {errors?.image?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="description"
                  className="block mb-2 text-lg  font-[Poppins] text-[#555] "
                >
                  Description
                </label>
                <div className="flex relative">
                  <textarea
                    //   type="text"
                    placeholder="Put you comment..."
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)] p-3 focus:outline-none rounded-lg`}
                  />
                </div>
                {errors?.description && (
                  <p className="text-red-600 my-2 ml-2 font-semibold">
                    {errors?.description?.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="my-5 font-semibold text-red-600">{error}</p>
              )}

              <button className="w-full mt-10 bg-blue-800 text-center text-lg text-white font-[Poppins] font-semibold  py-3 rounded-lg cursor-pointer border-[1px] border-[#1E2772] hover:bg-blue-600">
                Create
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
    </Layout>
  );
};

export default AddPost;
