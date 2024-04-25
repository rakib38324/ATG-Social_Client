import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiTwotoneLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

export type TPost = {
  image: string;
  title: string;
  description: string;
  date?: string;
  author?: { username: string };
  actions: number;
  InteractedPeopleId: String[];
  _id: string;
};

export interface PostProps {
  posts: TPost[] | undefined;
  refetch: any;
  singleRefetch: any;
}

export type UserId = string | null;

const AllPost: React.FC<PostProps> = ({ posts, refetch, singleRefetch }) => {
  const [userId, setUserId] = useState<UserId>("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("User_Id");
    setUserId(userId);
  }, []);

  const handleLikePodcast = async (id: string, type: string) => {
    const toastId = toast.loading("Processing, Please wait...");

    const FormData = {
      postId: id,
      interactionType: type,
    };

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/interaction/like-unlike`,
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
            toast.success(res?.message, { id: toastId, duration: 2000 });
            refetch();
          }

          if (res?.success === false) {
            toast.error(res?.errorMessage, { id: toastId, duration: 6000 });
          }
        });
    } catch (error) {
      console.log(error);
      toast.error("Oops! Some thing went wrong.", {
        id: toastId,
        duration: 4000,
      });
    }
  };
  return (
    <section className="md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 rounded-md p-2">
      {posts &&
        posts?.map((p, i) => (
          <div key={i} className="bg-gray-100">
            <Image
              className="mx-auto w-full h-48 rounded-md"
              width={600}
              height={400}
              src={p.image}
              priority
              alt="post logo"
            />

            <div className="p-2">
              <p className="text-lg font-semibold my-1">Title: {p?.title}</p>
              <p className="text-lg font-semibold my-1">
                Author: {p?.author?.username}
              </p>
              <p className="mt-4 italic text-justify">
                {p?.description?.slice(0, 40) + "..."}
              </p>
              <p
                onClick={() => router.push(`/single-post?id=${p?._id}`)}
                className="my-2 font-semibold text-end cursor-pointer underline"
              >
                Ream more
              </p>
            </div>

            <div className="flex justify-around my-5 py-2 bg-gray-100 border-y">
              <p
                onClick={() => {
                  userId && p?.InteractedPeopleId?.includes(userId)
                    ? handleLikePodcast(p?._id, "unlike")
                    : handleLikePodcast(p?._id, "like");
                }}
                className={`cursor-pointer flex gap-2 font-semibold 
                ${
                  userId && p?.InteractedPeopleId.includes(userId)
                    ? `text-blue-600`
                    : ""
                }`}
              >
                <AiTwotoneLike className="my-auto text-xl" />
                {p?.actions}
              </p>
              <p
                onClick={() => {
                  router.push(`/single-post?id=${p?._id}`);
                  singleRefetch();
                }}
                className="cursor-pointer flex gap-2 font-semibold  "
              >
                <FaComment className="my-auto text-xl" /> Comment
              </p>
              {/* <p onClick={() => setCommentDrawer(!commentDrawer)} className="cursor-pointer flex gap-2 font-semibold  " >{P_Comments ? P_Comments?.comments?.length : "0"} <FaComment className="my-auto text-xl" /> Wish</p> */}
            </div>
          </div>
        ))}
    </section>
  );
};

export default AllPost;
