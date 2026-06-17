import React from 'react';
import { CardContent, Typography, useTheme } from '@mui/material';
import {
  agingRiskColor,
  toText,
  type AgingSummary,
  type AgingRow,
} from '../helpers/depositReconciliationHelpers';
import * as styles from './DepositReconciliationAging.styles';

interface DepositReconciliationAgingProps {
  agingData: {
    title?: unknown;
    description?: unknown;
  };
  agingSummary: AgingSummary | null;
  agingRows: AgingRow[];
}

export const DepositReconciliationAging: React.FC<DepositReconciliationAgingProps> = ({
  agingData,
  agingSummary,
  agingRows,
}) => {
  const theme = useTheme();

  return (
    <styles.StyledCard>
      <CardContent>
        <styles.TitleText variant="h6">{String(agingData.title || '')}</styles.TitleText>
        <styles.DescriptionText variant="body2" color="text.secondary">
          {String(agingData.description || '')}
        </styles.DescriptionText>
        <styles.HeadlineText variant="h5">{agingSummary?.headlineValue || '—'}</styles.HeadlineText>
        <Typography variant="caption" color="text.secondary">
          {agingSummary?.headlineMeta || ''}
        </Typography>

        <styles.TableContainer>
          <styles.TableElement component="table">
            <styles.TableElement component="thead">
              <styles.TableElement component="tr">
                {['Age Bucket', 'Deposits', 'Amount', '% of $', 'Distribution'].map((label) => (
                  <styles.TableHeaderCell
                    component="th"
                    key={label}
                    align={label === 'Age Bucket' || label === 'Distribution' ? 'left' : 'right'}
                  >
                    {label}
                  </styles.TableHeaderCell>
                ))}
              </styles.TableElement>
            </styles.TableElement>
            <styles.TableElement component="tbody">
              {agingRows.map((row) => {
                const percent =
                  Number(
                    toText(row.share, '0')
                      .replace('%', '')
                      .replace(/[^\d.-]/g, ''),
                  ) || 0;
                const barColor = row.riskLevel
                  ? agingRiskColor(row.riskLevel, theme)
                  : percent < 20
                    ? theme.palette.success.main
                    : percent < 30
                      ? theme.palette.warning.main
                      : theme.palette.error.main;

                return (
                  <styles.TableElement component="tr" key={row.bucket}>
                    <styles.TableCell component="td">{row.bucket}</styles.TableCell>
                    <styles.TableCell component="td" align="right">
                      {row.deposits}
                    </styles.TableCell>
                    <styles.TableCell component="td" align="right">
                      {row.amount}
                    </styles.TableCell>
                    <styles.TableCell component="td" align="right">
                      {toText(row.share)}
                    </styles.TableCell>
                    <styles.TableCell component="td">
                      <styles.ProgressBarContainer>
                        <styles.ProgressBar percent={percent} barColor={barColor} />
                      </styles.ProgressBarContainer>
                    </styles.TableCell>
                  </styles.TableElement>
                );
              })}
            </styles.TableElement>
          </styles.TableElement>
        </styles.TableContainer>
      </CardContent>
    </styles.StyledCard>
  );
};
