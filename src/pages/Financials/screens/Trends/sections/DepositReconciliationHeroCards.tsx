import React from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import * as styles from './DepositReconciliationHeroCards.styles';
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
    <styles.StyledGridContainer container spacing={2}>
      {heroCards.map((card, idx) => (
        <Grid key={`${card.id}-${idx}`} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" component={styles.HeaderBox}>
                <Box component="span">
                  <styles.BadgeDot
                    color={deltaColor(
                      card.delta,
                      theme.palette.success.main,
                      theme.palette.error.main,
                      theme.palette.warning.main,
                    )}
                  />
                  {card.title}
                </Box>
              </Typography>
              <styles.ValueBox>
                <styles.TitleTypography variant="h5">{card.value}</styles.TitleTypography>
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
              </styles.ValueBox>
              <Typography variant="caption" color="text.secondary">
                {card.subLabel}
              </Typography>
              <styles.MarginBox>
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
              </styles.MarginBox>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </styles.StyledGridContainer>
  );
};
