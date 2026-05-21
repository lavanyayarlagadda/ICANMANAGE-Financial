import React from "react";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";

interface DepositReconciliationHeaderProps {
  title: string;
  subtitle: string;
  updatedAt: string;
  trailingWindow: string;
  setTrailingWindow: (value: string) => void;
  forecastWindow: string;
  setForecastWindow: (value: string) => void;
  compareMode: string;
  setCompareMode: (value: string) => void;
  controls?: {
    trailingWindow?: { options?: string[] };
    forecastWindow?: { options?: string[] };
    comparisonMode?: { options?: string[] };
  };
}

export const DepositReconciliationHeader: React.FC<
  DepositReconciliationHeaderProps
> = ({
  title,
  subtitle,
  updatedAt,
  trailingWindow,
  setTrailingWindow,
  forecastWindow,
  setForecastWindow,
  compareMode,
  setCompareMode,
  controls,
}) => {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle} Updated {new Date(String(updatedAt)).toLocaleString()}.
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ flexWrap: "wrap", rowGap: 1, justifyContent: "flex-end" }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            Trailing window
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            {(
              controls?.trailingWindow?.options || ["3m", "6m", "12m", "24m"]
            ).map((opt) => (
              <Button
                key={opt}
                onClick={() => setTrailingWindow(opt)}
                variant={trailingWindow === opt ? "contained" : "outlined"}
                sx={{ minWidth: 40 }}
              >
                {opt}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            Forecast
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            {(controls?.forecastWindow?.options || ["off", "3m", "6m"]).map(
              (opt) => (
                <Button
                  key={opt}
                  onClick={() => setForecastWindow(opt)}
                  variant={forecastWindow === opt ? "contained" : "outlined"}
                  sx={{ minWidth: 40 }}
                >
                  {opt}
                </Button>
              ),
            )}
          </ButtonGroup>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            Compare
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            {(controls?.comparisonMode?.options || ["MoM", "YoY"]).map(
              (opt) => (
                <Button
                  key={opt}
                  onClick={() => setCompareMode(opt)}
                  variant={compareMode === opt ? "contained" : "outlined"}
                  sx={{ minWidth: 48 }}
                >
                  {opt}
                </Button>
              ),
            )}
          </ButtonGroup>
        </Box>
      </Stack>
    </Box>
  );
};
