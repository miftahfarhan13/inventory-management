import { fetchLoggedUser } from "@/networks/libs/auth";
import { useEffect, useRef, useState } from "react";

export default function useGetMe() {
  const firstRun = useRef(true);

  const [user, setUser] = useState<any>();

  const getLoggedUser = async (token: string) => {
    await fetchLoggedUser(token)
      .then((response) => {
        setUser(response?.data?.result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (typeof window !== "undefined" && firstRun.current) {
      const token = localStorage.getItem("token");
      getLoggedUser(token || "");
      firstRun.current = false;
    }
  }, []);

  return {
    user,
  };
}
