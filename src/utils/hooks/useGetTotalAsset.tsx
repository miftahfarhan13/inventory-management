import { getTotalAssetComparison } from "@/networks/libs/dashboard";
import { useEffect, useState } from "react";

export default function useGetTotalAssetComparison({ year }: { year: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();

  const getTotalAsset = async (token: string) => {
    setIsLoading(true);
    await getTotalAssetComparison(token, year)
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
      getTotalAsset(token || "");
    }
  }, [year]);

  return {
    data,
    isLoading,
  };
}
