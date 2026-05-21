import React from "react";

interface SparklineProps {
  values: number[];
  color: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ values, color }) => {
  const points =
    values.length <= 1
      ? ""
      : (() => {
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min || 1;
          return values
            .map((point, idx) => {
              const y = 22 - ((point - min) / range) * 18;
              return `${(idx * 120) / (values.length - 1)},${y}`;
            })
            .join(" ");
        })();

  return (
    <svg
      viewBox="0 0 120 24"
      preserveAspectRatio="none"
      style={{ width: 92, height: 18 }}
    >
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
    </svg>
  );
};
