import React from 'react';
import * as styles from './KpiCard.styles';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
}) => {
  return (
    <styles.StyledCard>
      <styles.StyledCardContent>
        <styles.HeaderContainer>
          <styles.LabelTypography variant="caption" color="text.secondary">
            {label}
          </styles.LabelTypography>
          {icon && <styles.IconContainer>{icon}</styles.IconContainer>}
        </styles.HeaderContainer>
        <styles.ValueTypography variant="h4" color="text.primary">
          {value}
        </styles.ValueTypography>
        {change && (
          <styles.ChangeTypography variant="caption" changeType={changeType}>
            {change}
          </styles.ChangeTypography>
        )}
      </styles.StyledCardContent>
    </styles.StyledCard>
  );
};

export default KpiCard;
