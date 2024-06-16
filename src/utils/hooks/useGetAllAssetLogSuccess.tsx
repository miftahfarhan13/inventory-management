import { getAllAssetLogSuccess } from "@/networks/libs/dashboard";
import { useEffect, useRef, useState } from "react";

export default function useGetAllAssetLogSuccess() {
  const firstRun = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>();

  const getTotalAsset = async (token: string) => {
    await getAllAssetLogSuccess(token)
      .then((response) => {
        setIsLoading(false);
        setData(response?.data?.result);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && firstRun.current) {
      const token = localStorage.getItem("token");
      getTotalAsset(token || "");
      firstRun.current = false;
    }
  }, []);

  return {
    data,
    isLoading,
  };
}
