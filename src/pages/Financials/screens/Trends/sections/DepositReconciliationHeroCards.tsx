import React from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { Sparkline } from './Sparkline';
import { deltaColor, toText, type HeroCard } from '../helpers/depositReconciliationHelpers';

interface DepositReconciliationHeroCardsProps {
  heroCards: HeroCard[];
}

export const DepositReconciliationHeroCards: React.FC<DepositReconciliationHeroCardsProps> = ({
  heroCards,
}) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {heroCards.map((card, idx) => (
        <Grid key={`${card.id}-${idx}`} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: deltaColor(
                      card.delta,
                      theme.palette.success.main,
                      theme.palette.error.main,
                      theme.palette.warning.main,
                    ),
                  }}
                />
                {card.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
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
              </Box>
              <Typography variant="caption" color="text.secondary">
                {card.subLabel}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {card.sparkline && card.sparkline.length > 1 ? (
                  <Sparkline
                    values={card.sparkline}
                    color={
                      card.deltaTrend === 'up'
                        ? theme.palette.success.main
                        : card.deltaTrend === 'down'
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
  );
};
