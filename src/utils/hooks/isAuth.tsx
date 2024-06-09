import { fetchLoggedUser } from "@/networks/libs/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useIsAuth() {
  const router = useRouter();

  const getLoggedUser = async (token: string) => {
    await fetchLoggedUser(token)
      .then((response) => {
        // console.log(response);
        router.push("/");
      })
      .catch((error) => {
        router.push("/authentication/login");
      });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      getLoggedUser(token || "");
    }
  }, []);
}
