import React from "react";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { Sparkline } from "./Sparkline";
import {
  deltaColor,
  toText,
  type TrendColumn,
  type SectionRow,
} from "../helpers/depositReconciliationHelpers";

interface SectionTableProps {
  title: string;
  description: string;
  columns: TrendColumn[];
  rows: SectionRow[];
  compareMode?: string;
}

export const SectionTable: React.FC<SectionTableProps> = ({
  title,
  description,
  columns,
  rows,
  compareMode,
}) => {
  const theme = useTheme();
  const firstForecastIdx = columns.findIndex((col) => col.kind === "FORECAST");
  const deltaLabel = compareMode?.toUpperCase() === "YOY" ? "Δ YoY" : "Δ MoM";

  return (
    <Card sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ 
          overflowX: "auto",
          maxWidth: "100%",
          "&::-webkit-scrollbar": { height: '8px' },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { 
            background: theme.palette.grey[300], 
            borderRadius: '10px', 
            "&:hover": { background: theme.palette.grey[400] } 
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.grey[300]} transparent`,
        }}>
          <Box
            component="table"
            sx={{ width: "100%", borderCollapse: "collapse", minWidth: "max-content" }}
          >
            <Box component="thead">
              <Box component="tr">
                {["", "Trend", deltaLabel, ...columns.map((col) => col.label)].map(
                  (label, idx) => (
                    <Box
                      component="th"
                      key={`${label}-${idx}`}
                      sx={{
                        py: 1,
                        px: 1,
                        textAlign: idx === 0 ? "left" : "right",
                        color: theme.palette.text.secondary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        borderLeft:
                          firstForecastIdx >= 0 && idx === firstForecastIdx + 3
                            ? `1px dotted ${theme.palette.divider}`
                            : "none",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </Box>
                  ),
                )}
              </Box>
            </Box>
            <Box component="tbody">
              {rows.map((row) => {
                if (row.isGroupHeader) {
                  return (
                    <Box component="tr" key={row.id}>
                      <Box
                        component="td"
                        colSpan={columns.length + 3}
                        sx={{
                          py: 1,
                          px: 1,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.name}
                      </Box>
                    </Box>
                  );
                }

                const isBoldRow = row.isTotal || row.isSubtotal;

                return (
                  <Box
                    component="tr"
                    key={row.id}
                    sx={{
                      backgroundColor: isBoldRow
                        ? theme.palette.action.hover
                        : "transparent",
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        py: 1,
                        px: 1,
                        pl: row.isSubtotal || row.isTotal ? 1 : 2.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontWeight: isBoldRow ? 700 : 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.name}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        py: 1,
                        px: 1,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        textAlign: "right",
                      }}
                    >
                      {row.sparkline && row.sparkline.length > 0 ? (
                        <Sparkline
                          values={row.sparkline}
                          color={deltaColor(
                            row.momDelta,
                            theme.palette.success.main,
                            theme.palette.error.main,
                            theme.palette.primary.main,
                          )}
                        />
                      ) : null}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        py: 1,
                        px: 1,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        textAlign: "right",
                        color: deltaColor(
                          row.momDelta,
                          theme.palette.success.main,
                          theme.palette.error.main,
                          theme.palette.text.secondary,
                        ),
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {toText(row.momDelta)}
                    </Box>
                    {row.amounts.map((value, idx) => {
                      const isForecast =
                        firstForecastIdx >= 0 && idx >= firstForecastIdx;
                      return (
                        <Box
                          component="td"
                          key={`${row.id}-${idx}`}
                          sx={{
                            py: 1,
                            px: 1,
                            textAlign: "right",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            borderLeft:
                              idx === firstForecastIdx
                                ? `1px dotted ${theme.palette.divider}`
                                : "none",
                            color: isForecast
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary,
                            fontStyle: isForecast ? "italic" : "normal",
                            fontWeight: isBoldRow ? 700 : 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {value}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
