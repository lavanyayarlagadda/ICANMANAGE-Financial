import React from "react";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { Sparkline } from "./Sparkline";
import {
  deltaColor,
  toText,
  type PayerRow,
} from "../helpers/depositReconciliationHelpers";

interface DepositReconciliationTopPayersProps {
  topPayersData: {
    title?: unknown;
    description?: unknown;
  };
  topPayers: PayerRow[];
  compareMode?: string;
}

export const DepositReconciliationTopPayers: React.FC<
  DepositReconciliationTopPayersProps
> = ({ topPayersData, topPayers, compareMode }) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {String(topPayersData.title || "")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {String(topPayersData.description || "")}
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
                {[
                  "Payer",
                  "Total $",
                  "% of Total",
                  "Match Rate",
                  compareMode?.toUpperCase() === "YOY" ? "Δ YoY" : "Δ MoM",
                  "6-months Trend",
                ].map((label) => (
                  <Box
                    component="th"
                    key={label}
                    sx={{
                      py: 1,
                      px: 1,
                      textAlign:
                        label === "Payer" || label === "6-months Trend"
                          ? "left"
                          : "right",
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {topPayers.map((row, idx) => (
                <Box component="tr" key={`${row.payer}-${idx}`}>
                  <Box
                    component="td"
                    sx={{
                      py: 1,
                      px: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.payer}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      py: 1,
                      px: 1,
                      textAlign: "right",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.total}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      py: 1,
                      px: 1,
                      textAlign: "right",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.share}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      py: 1,
                      px: 1,
                      textAlign: "right",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.matchRate}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      py: 1,
                      px: 1,
                      textAlign: "right",
                      borderBottom: `1px solid ${theme.palette.divider}`,
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
                  <Box
                    component="td"
                    sx={{
                      py: 1,
                      px: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.sixMonthTrend && row.sixMonthTrend.length > 1 ? (
                      <Sparkline
                        values={row.sixMonthTrend}
                        color={deltaColor(
                          row.momDelta,
                          theme.palette.success.main,
                          theme.palette.error.main,
                          theme.palette.primary.main,
                        )}
                      />
                    ) : null}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
