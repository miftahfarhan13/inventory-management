import { getRepairTimeAsset } from "@/networks/libs/dashboard";
import { useEffect, useState } from "react";

export default function useGetRepairTimeAsset({ year }: { year: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();

  const getRepairTime = async (token: string) => {
    setIsLoading(true);
    await getRepairTimeAsset(token, year)
      .then((response) => {
        setIsLoading(false);
        setData(response?.data?.result);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && year) {
      const token = localStorage.getItem("token");
      getRepairTime(token || "");
    }
  }, [year]);

  return {
    data,
    isLoading,
  };
}
