import React, { useRef, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  ArcElement,
  Chart,
  Legend,
  Tooltip,
  type Chart as ChartJS,
  type TooltipItem,
} from "chart.js";
import { formatPercent } from "@utils";

// Register required elements for pie/doughnut charts
Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  labels: string[];
  data: number[];
  colors: string[];
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  tooltipLabel?: (label: string, value: number, percent: string) => string[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({
  labels,
  data,
  colors,
  hoveredIdx,
  setHoveredIdx,
  size = 292,
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
        borderColor: "transparent",
        borderWidth: 0,
        hoverOffset: 32,
      },
    ],
  };

  // Chart options
  const pieOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => [],
          label: function (context: TooltipItem<"pie">) {
            const label = context.label || "";
            const value = context.parsed as number;
            const percent = formatPercent(value, total, { decimals: 1 });
            return [`\u2B24 ${label}`, percent];
          },
          labelTextColor: function (context: TooltipItem<"pie">) {
            const dataset = context.dataset;
            const bg = dataset.backgroundColor;
            if (Array.isArray(bg)) {
              return bg[context.dataIndex] || "#cccccc";
            }
            if (typeof bg === "string") {
              return bg;
            }
            return "#cccccc";
          },
        },
      },
    },
    maintainAspectRatio: false,
    radius: "85%",
    responsive: true,
    onHover: (_event: unknown, elements: Array<{ index: number }>) => {
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
        width: `min(90vw, ${size}px)`,
        height: `min(90vw, ${size}px)`,
      }}
    >
      <Pie ref={pieRef} data={pieData} options={pieOptions} />
    </div>
  );
};

export default PieChart;
