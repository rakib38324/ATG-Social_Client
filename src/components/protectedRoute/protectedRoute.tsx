import { ReactNode, useEffect } from "react";
import { handleLogout } from "../common/token/auth";
import { useRouter } from "next/router";

interface ProtectedRouteProps {
  children: ReactNode;
  permittedRoutes?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permittedRoutes = [
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
  ],
}) => {
    
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken && !permittedRoutes.includes(router.pathname || "")) {
        router.push("/login");
      }
      if (accessToken) {
        const storedTime = localStorage.getItem("access_token_timestamp");

        if (storedTime) {
          const storedDate = new Date(storedTime);
          const currentTime = new Date();
          const timeDifference = currentTime.getTime() - storedDate.getTime();

          if (timeDifference >= 3600000) {
            handleLogout();
          }
        }
      } else {
        if (!accessToken && !permittedRoutes.includes(router.pathname || "")) {
          router.push("/login");
        }
      }
    };

    const intervalId = setInterval(() => {
      verifyUser();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [router, permittedRoutes]);

  return <>{children}</>;
};

export default ProtectedRoute;
