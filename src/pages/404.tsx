import Image from "next/image";
import Link from "next/link";
import error from "../../images/404.svg";
import Layout from "@/components/common/layout/layout";

export default function Error() {
  return (
    <Layout pageTitle="404">
      <div className="container text-center pb-10">
        <h3 className="font-semibold text-3xl text-[#0057FF] pt-20">
          Oops! Page not found
        </h3>
        <Image src={error} alt="Error" className="mx-auto w-2/5" />
        <Link href="/">
          <button className="font-medium text-base text-center mt-6 flex py-[10px] px-[60px] rounded mx-auto  bg-[#0057FF] text-white">
            Go To Home
          </button>
        </Link>
      </div>
    </Layout>
  );
}
