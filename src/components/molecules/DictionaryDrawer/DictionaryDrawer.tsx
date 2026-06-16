import React from 'react';
import { TableDescription } from '@/services/descriptionService';
import * as styles from './DictionaryDrawer.styles';

interface DictionaryDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedField: TableDescription | null;
}

const DictionaryDrawer: React.FC<DictionaryDrawerProps> = ({ open, onClose, selectedField }) => {
  if (!selectedField) return null;

  return (
    <styles.StyledDrawer anchor="right" open={open} onClose={onClose}>
      <styles.DrawerContainer>
        <styles.HeaderBox>
          <styles.TitleTypography variant="h6">Description</styles.TitleTypography>
          <styles.CloseIconButton onClick={onClose}>
            <styles.CloseIconStyled />
          </styles.CloseIconButton>
        </styles.HeaderBox>

        <styles.ContentBox>
          <styles.CardBox>
            <styles.HeadingTypography variant="subtitle2">
              {selectedField.heading}
            </styles.HeadingTypography>

            <styles.StyledDivider />

            <styles.DescriptionTypography variant="body1">
              {selectedField.description}
            </styles.DescriptionTypography>

            {selectedField.usageTip && (
              <styles.TipBox>
                <styles.TipTitle>Usage Tip:</styles.TipTitle>
                <styles.TipDescription>{selectedField.usageTip}</styles.TipDescription>
              </styles.TipBox>
            )}
          </styles.CardBox>

          {selectedField.statuses && selectedField.statuses.length > 0 && (
            <styles.StatusContainer>
              <styles.StatusSectionTitle variant="subtitle2">
                <styles.StatusIndicatorBar />
                STATUS EXPLANATIONS
              </styles.StatusSectionTitle>
              {selectedField.statuses.map((status, idx) => (
                <styles.StatusRow key={idx}>
                  <styles.StatusLabel variant="body2">{status.label}</styles.StatusLabel>
                  <styles.StatusExplanation variant="body2">
                    {status.explanation}
                  </styles.StatusExplanation>
                </styles.StatusRow>
              ))}
            </styles.StatusContainer>
          )}
        </styles.ContentBox>

        <styles.FooterBox>
          <styles.FooterHelpText variant="caption">
            Need more help? Contact your administrator.
          </styles.FooterHelpText>
          <styles.FooterBadge>
            <styles.FooterBadgeDot />
            <styles.FooterBadgeText variant="caption">ICANMANAGE Support</styles.FooterBadgeText>
          </styles.FooterBadge>
        </styles.FooterBox>
      </styles.DrawerContainer>
    </styles.StyledDrawer>
  );
};

export default DictionaryDrawer;
