import AllPost, { PostProps, TPost } from "@/components/common/allPost/allPost";
import Layout from "@/components/common/layout/layout";
import Loading from "@/components/common/loading/loading";
import { useQuery } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
 

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
  
 
  return (
    <section>
      <Layout pageTitle="Home">
        {
          isLoading && <Loading />
        }
        <p className="text-center my-5 p-2 bg-red-100 font-semibold">If you want to Edit and Delete Post you need to create a post. Because Only Post Author have access to EDIT and DELETE. Thank You.</p>
        <section>
          <AllPost posts={posts.data} refetch={refetch} singleRefetch={refetch}/>
        </section>
      </Layout>
    </section>
  );
}
