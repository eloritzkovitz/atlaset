import React, { useRef, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { ArcElement, Chart, Legend, Tooltip, type Chart as ChartJS } from "chart.js";

// Register required elements for pie/doughnut charts
Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  labels: string[];
  data: number[];
  colors: string[];
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  tooltipLabel?: (label: string, value: number, percent: string) => string[];
}

export const PieChart: React.FC<PieChartProps> = ({
  labels,
  data,
  colors,
  hoveredIdx,
  setHoveredIdx,
}) => {
  const pieRef = useRef<ChartJS<"pie"> | null>(null);

  const total = data.reduce((sum, val) => sum + val, 0);

  // Chart data
  const pieData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: (ctx: any) => (ctx.active ? "#14b8a6" : "rgba(0,0,0,0.2)"),
        borderWidth: (ctx: any) => (ctx.active ? 4 : 2),
        hoverOffset: 16,
      },
    ],
  };

  // Chart options
  const pieOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#f3f4f6",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => [],
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed;
            const percent = total ? ((value / total) * 100).toFixed(1) : 0;
            return [`\u2B24 ${label}`, `${percent}%`];
          },
          labelTextColor: function (context: any) {
            return (
              context.dataset.backgroundColor[context.dataIndex] || "#cccccc"
            );
          },
        },
      },
    },
    maintainAspectRatio: false,
    radius: "85%",
    responsive: true,
    onHover: (_event: any, elements: any[]) => {
      if (elements && elements.length > 0) {
        setHoveredIdx(elements[0].index);
      } else {
        setHoveredIdx(null);
      }
    },
  };

  // Update active segment on hover change
  useEffect(() => {
    const chart = pieRef.current;
    if (chart && chart.setActiveElements) {
      if (hoveredIdx !== null) {
        chart.setActiveElements([{ datasetIndex: 0, index: hoveredIdx }]);
      } else {
        chart.setActiveElements([]);
      }
      chart.update();
    }
  }, [hoveredIdx]);

  return (
    <div
      className="relative mx-auto mb-6 overflow-visible"
      style={{
        width: "min(90vw, 292px)",
        height: "min(90vw, 292px)",
      }}
    >
      <Pie ref={pieRef} data={pieData} options={pieOptions} />
    </div>
  );
};
