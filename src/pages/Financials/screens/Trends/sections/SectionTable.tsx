import React from 'react';
import { CardContent, useTheme } from '@mui/material';
import { Sparkline } from './Sparkline';
import {
  deltaColor,
  toText,
  getDeltaLabel,
  type TrendColumn,
  type SectionRow,
} from '../helpers/depositReconciliationHelpers';
import * as styles from './SectionTable.styles';

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
  const deltaLabel = getDeltaLabel(columns, compareMode);

  return (
    <styles.StyledCard>
      <CardContent>
        <styles.TitleText variant="h6">{title}</styles.TitleText>
        <styles.DescriptionText variant="body2" color="text.secondary">
          {description}
        </styles.DescriptionText>
        <styles.TableContainer>
          <styles.TableElement component="table">
            <styles.TableElement component="thead">
              <styles.TableElement component="tr">
                {[
                  '',
                  'Trend',
                  deltaLabel,
                  ...columns.map((col) =>
                    col.kind === 'PARTIAL' ? `${col.label} (MTD)` : col.label,
                  ),
                ].map((label, idx) => {
                  const isPartialCol = idx >= 3 && columns[idx - 3].kind === 'PARTIAL';
                  const isForecastCol = idx >= 3 && columns[idx - 3].kind === 'FORECAST';

                  return (
                    <styles.TableHeaderCell
                      component="th"
                      key={`${label}-${idx}`}
                      align={idx === 0 ? 'left' : 'right'}
                      showBorderLeft={isPartialCol || isForecastCol}
                    >
                      {label}
                    </styles.TableHeaderCell>
                  );
                })}
              </styles.TableElement>
            </styles.TableElement>
            <styles.TableElement component="tbody">
              {rows.map((row) => {
                if (row.isGroupHeader) {
                  return (
                    <styles.TableElement component="tr" key={row.id}>
                      <styles.TableCell
                        component="td"
                        colSpan={columns.length + 3}
                        fontWeight={600}
                        color="text.primary"
                      >
                        {row.name}
                      </styles.TableCell>
                    </styles.TableElement>
                  );
                }

                const isBoldRow = row.isTotal || row.isSubtotal;

                return (
                  <styles.TableRowElement component="tr" key={row.id} isBoldRow={isBoldRow}>
                    <styles.TableCell
                      component="td"
                      pl={row.isSubtotal || row.isTotal ? 1 : 2.5}
                      fontWeight={isBoldRow ? 700 : 500}
                    >
                      {row.name}
                    </styles.TableCell>
                    <styles.TableCell component="td" align="right">
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
                    {row.amounts.map((value, idx) => {
                      const col = columns[idx];
                      const isForecast = col.kind === 'FORECAST';
                      const isPartial = col.kind === 'PARTIAL';
                      return (
                        <styles.TableCell
                          component="td"
                          key={`${row.id}-${idx}`}
                          align="right"
                          showBorderLeft={isPartial || isForecast}
                          color={
                            isForecast || isPartial
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary
                          }
                          fontStyle={isForecast || isPartial ? 'italic' : 'normal'}
                          fontWeight={isBoldRow ? 700 : 500}
                        >
                          {value}
                        </styles.TableCell>
                      );
                    })}
                  </styles.TableRowElement>
                );
              })}
            </styles.TableElement>
          </styles.TableElement>
        </styles.TableContainer>
      </CardContent>
    </styles.StyledCard>
  );
};
