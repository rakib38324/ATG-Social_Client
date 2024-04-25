import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { handleLogout } from "../common/token/auth";
import Link from "next/link";
import { useRouter } from "next/router";

type AccessToken = string | null; // Define type for accessToken

const Header = () => {
  const [data, setData] = useState<AccessToken>("");
  const router = useRouter();

  useEffect(() => {
    const accessToken: AccessToken = localStorage.getItem("accessToken");
    setData(accessToken);
  }, []);

  const Logout = () => {
    handleLogout();
  };
  return (
    <div className="max-w-7xl mx-auto  navbar bg-blue-100 rounded">
      <div className="flex-1">
        <a
          onClick={() => router.push("/")}
          className="btn btn-ghost text-2xl font-bold"
        >
          ATG Social
        </a>
        {data && (
          <div className="flex gap-4 md:gap-6 text-sm md:text-lg font-semibold my-auto mx-auto">
            <p
              onClick={() => router.push("/")}
              className="uppercase cursor-pointer hover:bg-blue-200 md:px-4 py-2 rounded-md"
            >
              Home
            </p>
            <p
              onClick={() => router.push("/add-post")}
              className="uppercase cursor-pointer hover:bg-blue-200 md:px-4 py-2 rounded-md"
            >
              Add Post
            </p>
          </div>
        )}
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="mt-1 avatar">
            <div className="w-10 rounded-full">
              <div>
                <FaUserCircle className="text-4xl" />
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            {data ? (
              <li onClick={() => Logout()}>
                <a>Logout</a>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login">login</Link>
                </li>
                <li>
                  <Link href="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
