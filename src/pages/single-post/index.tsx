import PostComments from "@/components/common/PostComments/postComments";
import AllPost, { UserId } from "@/components/common/allPost/allPost";
import Layout from "@/components/common/layout/layout";
import Loading from "@/components/common/loading/loading";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiTwotoneLike } from "react-icons/ai";
import { FaComment, FaEdit, FaTrashAlt, FaUserCircle } from "react-icons/fa";

const SinglePost = () => {
  const [userId, setUserId] = useState<UserId>("");
  const [seeMore, setSeeMore] = useState(false);
  const [commentDrawer, setCommentDrawer] = useState(false);
  const [postDeleteId, setPostDeleteId] = useState<string | string[]>("");
  const router = useRouter();
  const postId = router?.query?.id;

  useEffect(() => {
    const userId = localStorage.getItem("User_Id");
    setUserId(userId);
  }, []);

  const {
    data: posts = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/POST`, {
        headers: {
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      return data;
    },
  });

  const {
    data: singlePost = {},
    refetch: oneRefetch,
    isRefetching: oneRefetching,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/POST/${postId}`,
        {
          headers: {
            authorization: `${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (postId && !singlePost) {
      oneRefetch();
    }

    if(!singlePost){
      
    }
  }, [postId, oneRefetch, singlePost]);

  const { data: comments = [], refetch: commentRefetch } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/comment/get-comments/${postId}`,
        {
          headers: {
            authorization: `${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      return data;
    },
  });

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
            oneRefetch();
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

  const post = singlePost?.data;

  const singleRefetch = () => {
    setTimeout(oneRefetch, 1000);
    setTimeout(commentRefetch, 1000);
    setSeeMore(false);
  };

  const handleDeletePodcast = async () => {
    const toastId = toast.loading("Processing, Please wait...");

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/post/${postDeleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res?.success === true) {
            toast.success(res?.message, { id: toastId, duration: 2000 });
            router.push("/");
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
  // console.log(post);
  return (
    <Layout pageTitle={"ATG | Single Post"}>
      {oneRefetching && <Loading />}
      <p className="text-center my-5 p-2 bg-red-100 font-semibold">If you want to Edit and Delete Post you need to create a post. Because Only Post Author have access to EDIT and DELETE. Thank You.</p>
      <section className="grid md:grid-cols-3">
        <div className="p-2">
          <p className="text-center text-2xl m-4 font-bold">Post Details</p>
          <div className="bg-gray-100">
            <Image
              className="mx-auto w-full h-48 rounded-md"
              width={600}
              height={400}
              src={post?.image}
              priority
              alt="post logo"
            />

            <div className="p-2">
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold my-1">
                    Title: {post?.title}
                  </p>
                  <p className="text-lg font-semibold my-1">
                    Author: {post?.author?.username}
                  </p>
                </div>

                { 
                 post?.author?._id === userId &&
                  <div className="flex gap-4">
                    <p onClick={() => router.push(`/edit-post?id=${post?._id}`)} className="my-auto mr-5 text-2xl text-blue-600 cursor-pointer">
                      <FaEdit />
                    </p>

                    <p
                      onClick={() => {
                        postId && setPostDeleteId(postId);
                        const modal = document.getElementById(
                          "delete_modal"
                        ) as HTMLDialogElement | null;
                        if (modal) {
                          modal.showModal();
                        }
                      }}
                      className="my-auto mr-5 text-2xl text-red-600 cursor-pointer"
                    >
                      <FaTrashAlt />
                    </p>
                  </div>
                }
              </div>

              <p className="mt-4 italic text-justify">
                {seeMore === false
                  ? post?.description?.slice(0, 40) + "..."
                  : post?.description}
              </p>

              {seeMore === false && (
                <p
                  onClick={() => setSeeMore(true)}
                  className="font-semibold text-end cursor-pointer underline"
                >
                  See more
                </p>
              )}
            </div>

            <div className="flex justify-around my-5 py-2 bg-gray-100 border-y">
              <p
                onClick={() => {
                  userId && post?.InteractedPeopleId?.includes(userId)
                    ? handleLikePodcast(post?._id, "unlike")
                    : handleLikePodcast(post?._id, "like");
                }}
                className={`cursor-pointer flex gap-2 font-semibold 
                ${
                  userId && post?.InteractedPeopleId?.includes(userId)
                    ? `text-blue-600`
                    : ""
                }`}
              >
                <AiTwotoneLike className="my-auto text-xl" />
                {post?.actions}
              </p>
              <p
                onClick={() => setCommentDrawer(!commentDrawer)}
                className="cursor-pointer flex gap-2 font-semibold  "
              >
                {comments?.data?.length}
                <FaComment className="my-auto text-xl" /> Comment
              </p>
              {/* <p onClick={() => setCommentDrawer(!commentDrawer)} className="cursor-pointer flex gap-2 font-semibold  " >{P_Comments ? P_Comments?.comments?.length : "0"} <FaComment className="my-auto text-xl" /> Wish</p> */}
            </div>
          </div>

          {commentDrawer && (
            <section className="my-5 p-2 ">
              <p className="text-2xl my-5">Comments</p>
              <div
                className={`border rounded border-blue-400 ${
                  comments?.data?.length > 5 &&
                  "w-full h-[500px] overflow-y-auto overflow-x-auto"
                }`}
              >
                {comments &&
                  comments?.data?.map((comment: any, i: number) => (
                    <div key={i}>
                      <div className="m-1 bg-gray-100 p-2 my-4 rounded-md">
                        <div className="gap-2">
                          <div className="flex gap-2">
                            <FaUserCircle className="text-5xl" />

                            <div className="w-full">
                              <div className="flex justify-between">
                                <p className=" font-semibold">
                                  {comment?.commentAuthor?.username}
                                </p>
                              </div>
                              <p>{comment?.commentAuthor?.email}</p>
                            </div>
                          </div>

                          <p className="mt-2 italic text-justify">
                            {comment?.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {postId && (
                <PostComments postId={postId} commentRefetch={commentRefetch} />
              )}
            </section>
          )}
        </div>

        <div className="md:col-span-2">
          <p className="text-center text-2xl m-3 font-bold">Latest Post</p>
          <AllPost
            posts={posts.data}
            refetch={refetch}
            singleRefetch={singleRefetch}
          />
        </div>

        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <dialog id="delete_modal" className="modal">
          <div className="modal-box py-10">
            <h3 className="font-bold text-lg text-center">
              Are you sure to delete it?
            </h3>

            <div className="flex justify-center gap-4">
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button
                    onClick={handleDeletePodcast}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Yes
                  </button>
                </form>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button
                    onClick={() => {
                      setPostDeleteId("");
                    }}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
                  >
                    No
                  </button>
                </form>
              </div>
            </div>
          </div>
        </dialog>
      </section>
    </Layout>
  );
};

export default SinglePost;
