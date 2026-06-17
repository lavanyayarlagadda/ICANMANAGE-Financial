import React from 'react';
import { ButtonGroup, Typography } from '@mui/material';
import { formatDateTime } from '@/utils/formatters';
import * as styles from './DepositReconciliationHeader.styles';

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

export const DepositReconciliationHeader: React.FC<DepositReconciliationHeaderProps> = ({
  title,
  subtitle,
  updatedAt,
  trailingWindow,
  setTrailingWindow,
  // forecastWindow,
  // setForecastWindow,
  compareMode,
  setCompareMode,
  controls,
}) => {
  return (
    <styles.HeaderWrapper>
      <styles.ControlBox>
        <styles.TitleText variant="h5">{title}</styles.TitleText>
        <Typography variant="body2" color="text.secondary">
          {subtitle} Updated {formatDateTime(updatedAt)}.
        </Typography>
      </styles.ControlBox>

      <styles.StackWrapper direction="row" spacing={1.5}>
        <styles.ControlBox>
          <styles.LabelText variant="caption" color="text.secondary">
            Trailing window
          </styles.LabelText>
          <ButtonGroup size="small" variant="outlined">
            {(controls?.trailingWindow?.options || ['3m', '6m', '12m', '24m']).map((opt) => (
              <styles.Button40
                key={opt}
                onClick={() => setTrailingWindow(opt)}
                variant={trailingWindow === opt ? 'contained' : 'outlined'}
              >
                {opt}
              </styles.Button40>
            ))}
          </ButtonGroup>
        </styles.ControlBox>
        {/* <styles.ControlBox>
          <styles.LabelText
            variant="caption"
            color="text.secondary"
          >
            Forecast
          </styles.LabelText>
          <ButtonGroup size="small" variant="outlined">
            {(controls?.forecastWindow?.options || ["off", "3m", "6m"]).map(
              (opt) => (
                <styles.Button40
                  key={opt}
                  onClick={() => setForecastWindow(opt)}
                  variant={forecastWindow === opt ? "contained" : "outlined"}
                >
                  {opt}
                </styles.Button40>
              ),
            )}
          </ButtonGroup>
        </styles.ControlBox> */}

        <styles.ControlBox>
          <styles.LabelText variant="caption" color="text.secondary">
            Compare
          </styles.LabelText>
          <ButtonGroup size="small" variant="outlined">
            {(controls?.comparisonMode?.options || ['MoM', 'YoY']).map((opt) => (
              <styles.Button48
                key={opt}
                onClick={() => setCompareMode(opt)}
                variant={compareMode === opt ? 'contained' : 'outlined'}
              >
                {opt}
              </styles.Button48>
            ))}
          </ButtonGroup>
        </styles.ControlBox>
      </styles.StackWrapper>
    </styles.HeaderWrapper>
  );
};
