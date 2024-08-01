import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

export default function PieChart({ labels, datasets }: PieChartProps) {
  const data = {
    labels,
    datasets,
  };

  return <Pie data={data} />;
}
