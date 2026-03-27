import { useState, useCallback } from 'react';

export const useTrendChart = (defaultChartType: 'bar' | 'line' = 'bar') => {
  const [chartType, setChartType] = useState<'bar' | 'line'>(defaultChartType);

  const handleChartTypeChange = useCallback((_: any, v: 'bar' | 'line' | null) => {
    if (v) setChartType(v);
  }, []);

  return {
    chartType,
    handleChartTypeChange,
  };
};
