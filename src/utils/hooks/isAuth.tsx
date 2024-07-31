import { fetchLoggedUser } from "@/networks/libs/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useIsAuth() {
  const [me, setMe] = useState<any>();
  const router = useRouter();

  const getLoggedUser = async (token: string) => {
    await fetchLoggedUser(token)
      .then((response) => {
        setMe(response?.data?.result);
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

  return {
    me,
  };
}
