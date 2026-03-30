import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LabelList,
} from 'recharts';
import { useTrendChart } from './TrendChart.hook';
import * as styles from './TrendChart.styles';

interface TrendChartProps<T extends Record<string, unknown>> {
  title: string;
  data: T[];
  xKey: string;
  yKey: string;
  yLabel?: string;
  height?: number;
  barColors?: string[];
  lineColor?: string;
  highlightLastBar?: boolean;
  yDomain?: [number | string, number | string];
  tooltipFormatter?: (value: number) => string;
  labelFormatter?: (value: number) => string;
  defaultChartType?: 'bar' | 'line';
}

function TrendChart<T extends Record<string, unknown>>({
  title,
  data,
  xKey,
  yKey,
  yLabel,
  height = 250,
  barColors,
  lineColor,
  highlightLastBar = true,
  yDomain,
  tooltipFormatter,
  labelFormatter,
  defaultChartType = 'bar',
}: TrendChartProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { chartType, handleChartTypeChange } = useTrendChart(defaultChartType);

  const defaultBarColors = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.main,
    theme.palette.primary.dark,
    theme.palette.primary.dark,
    theme.palette.primary.dark,
  ];
  const colors = barColors || defaultBarColors;
  const stroke = lineColor || theme.palette.primary.main;
  const lastIdx = data.length - 1;

  return (
    <Card>
      <CardContent>
        <Box sx={styles.headerBoxStyles}>
          <Typography variant="subtitle2" sx={styles.titleStyles}>{title}</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            size="small"
          >
            <ToggleButton value="bar" sx={styles.toggleButtonStyles}><BarChartIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="line" sx={styles.toggleButtonStyles}><ShowChartIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <ResponsiveContainer width="100%" height={height}>
          {chartType === 'bar' ? (
            <BarChart data={data} barCategoryGap="20%">
              <XAxis 
                dataKey={xKey} 
                tick={{ fontSize: 10 }} 
                axisLine={false} 
                tickLine={false}
                interval={isMobile ? 0 : 'preserveStartEnd'}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
              />
              <YAxis hide domain={yDomain || [0, 'auto']} />
              <RechartsTooltip formatter={tooltipFormatter ? (v: number) => tooltipFormatter(v as number) : undefined} />
              <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
                {!isMobile && (
                  <LabelList
                    dataKey={yKey}
                    position="top"
                    formatter={labelFormatter}
                    style={{ fontSize: 10, fontWeight: 600, fill: theme.palette.text.primary }}
                  />
                )}
                {data.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={
                      highlightLastBar && idx === lastIdx
                        ? theme.palette.success.main
                        : colors[Math.min(idx, colors.length - 1)]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey={xKey} 
                tick={{ fontSize: 10 }}
                interval={isMobile ? 0 : 'preserveStartEnd'}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
              />
              <YAxis domain={yDomain || [0, 'auto']} tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={yKey}
                name={yLabel || yKey}
                stroke={stroke}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TrendChart;
