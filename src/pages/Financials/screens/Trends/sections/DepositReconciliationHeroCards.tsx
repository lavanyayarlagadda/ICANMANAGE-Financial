import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { Sparkline } from "./Sparkline";
import {
  deltaColor,
  toText,
  type HeroCard,
} from "../helpers/depositReconciliationHelpers";

interface DepositReconciliationHeroCardsProps {
  heroCards: HeroCard[];
}

export const DepositReconciliationHeroCards: React.FC<
  DepositReconciliationHeroCardsProps
> = ({ heroCards }) => {
  const theme = useTheme();

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {heroCards.slice(0, 4).map((card, idx) => (
          <Grid key={`${card.id}-${idx}`} size={{ xs: 12, md: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.4 }}>
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: deltaColor(
                      card.delta,
                      theme.palette.success.main,
                      theme.palette.error.main,
                      theme.palette.text.secondary,
                    ),
                    fontWeight: 700,
                  }}
                >
                  {toText(card.delta)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.subLabel}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {card.sparkline && card.sparkline.length > 1 ? (
                    <Sparkline
                      values={card.sparkline}
                      color={
                        card.deltaTrend === "up"
                          ? theme.palette.success.main
                          : card.deltaTrend === "down"
                            ? theme.palette.error.main
                            : theme.palette.primary.main
                      }
                    />
                  ) : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {heroCards[4] && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {heroCards[4].title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.4 }}>
                  {heroCards[4].value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: deltaColor(
                      heroCards[4].delta,
                      theme.palette.success.main,
                      theme.palette.error.main,
                      theme.palette.text.secondary,
                    ),
                    fontWeight: 700,
                  }}
                >
                  {toText(heroCards[4].delta)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {heroCards[4].subLabel}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {heroCards[4].sparkline &&
                  heroCards[4].sparkline.length > 1 ? (
                    <Sparkline
                      values={heroCards[4].sparkline}
                      color={
                        heroCards[4].deltaTrend === "up"
                          ? theme.palette.success.main
                          : heroCards[4].deltaTrend === "down"
                            ? theme.palette.error.main
                            : theme.palette.primary.main
                      }
                    />
                  ) : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};
