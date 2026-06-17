import React from 'react';
import { CardContent, useTheme } from '@mui/material';
import { Sparkline } from './Sparkline';
import {
  deltaColor,
  toText,
  getDeltaLabel,
  type PayerRow,
  type TrendColumn,
} from '../helpers/depositReconciliationHelpers';
import * as styles from './DepositReconciliationTopPayers.styles';

interface DepositReconciliationTopPayersProps {
  topPayersData: {
    title?: unknown;
    description?: unknown;
  };
  topPayers: PayerRow[];
  compareMode?: string;
  columns?: TrendColumn[];
}

export const DepositReconciliationTopPayers: React.FC<DepositReconciliationTopPayersProps> = ({
  topPayersData,
  topPayers,
  compareMode,
  columns,
}) => {
  const theme = useTheme();

  return (
    <styles.StyledCard>
      <CardContent>
        <styles.TitleText variant="h6">{String(topPayersData.title || '')}</styles.TitleText>
        <styles.DescriptionText variant="body2" color="text.secondary">
          {String(topPayersData.description || '')}
        </styles.DescriptionText>
        <styles.TableContainer>
          <styles.TableElement component="table">
            <styles.TableElement component="thead">
              <styles.TableElement component="tr">
                {[
                  'Payer',
                  'Total $',
                  '% of Total',
                  'Match Rate',
                  getDeltaLabel(columns || [], compareMode),
                  '6-months Trend',
                ].map((label) => (
                  <styles.TableHeaderCell
                    component="th"
                    key={label}
                    align={label === 'Payer' || label === '6-months Trend' ? 'left' : 'right'}
                  >
                    {label}
                  </styles.TableHeaderCell>
                ))}
              </styles.TableElement>
            </styles.TableElement>
            <styles.TableElement component="tbody">
              {topPayers.map((row, idx) => (
                <styles.TableElement component="tr" key={`${row.payer}-${idx}`}>
                  <styles.TableCell component="td">{row.payer}</styles.TableCell>
                  <styles.TableCell component="td" align="right">
                    {row.total}
                  </styles.TableCell>
                  <styles.TableCell component="td" align="right">
                    {row.share}
                  </styles.TableCell>
                  <styles.TableCell component="td" align="right">
                    {row.matchRate}
                  </styles.TableCell>
                  <styles.TableCell
                    component="td"
                    align="right"
                    color={deltaColor(
                      row.momDelta,
                      theme.palette.success.main,
                      theme.palette.error.main,
                      theme.palette.text.secondary,
                    )}
                    fontWeight={700}
                  >
                    {toText(row.momDelta)}
                  </styles.TableCell>
                  <styles.TableCell component="td">
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
                  </styles.TableCell>
                </styles.TableElement>
              ))}
            </styles.TableElement>
          </styles.TableElement>
        </styles.TableContainer>
      </CardContent>
    </styles.StyledCard>
  );
};
