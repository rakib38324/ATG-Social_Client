import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { handleLogout } from "../common/token/auth";
import Link from "next/link";

type AccessToken = string | null; // Define type for accessToken

const Header = () => {
  const [data, setData] = useState<AccessToken>("");

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
        <a className="btn btn-ghost text-2xl font-bold">ATG Social</a>
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
