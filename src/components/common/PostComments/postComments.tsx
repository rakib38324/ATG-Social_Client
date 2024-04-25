import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormValues {
  comment: string;
}

export interface PostProps {
    postId: string | string[];
    commentRefetch: any;
  }
  

const PostComments: React.FC<PostProps> = ({ postId, commentRefetch }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const handleComment = async (data: FormValues) => {
    setLoading(true);
    const toastId = toast.loading("Processing, Please wait...");

    const FormData = {
      comment: data.comment,
      postId
    };

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/comment/create-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(FormData),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res?.success === true) {
            commentRefetch();
            toast.success(res?.message, { id: toastId, duration: 2000 });
            setLoading(false);
            setError("");
            reset();
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
    <div>
      <form
         onSubmit={handleSubmit(handleComment)}
      >
        <div className="w-full my-10">
          <div className="flex">
            <textarea
            //   type="text"
              placeholder="Put you comment..."
              {...register("comment", {
                required: "Comment is required",
              })}
              className={`w-full border border-blue-400 bg-[rgba(245,247,248,1)] p-3 focus:outline-none rounded-lg`}
            />
          </div>
          {errors?.comment && (
            <p className="text-red-600 my-2 ml-2 font-semibold">
              {errors?.comment?.message}
            </p>
          )}

          <button className="my-3 px-4 py-2 bg-blue-500 text-white border rounded-[50px] text-center">
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostComments;
