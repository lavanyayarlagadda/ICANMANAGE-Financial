import React from 'react';
import { Box } from '@mui/material';
import {
  StyledCard,
  StyledCardContent,
  LabelContainer,
  StyledLabel,
  StyledValue,
  SectionTitle,
  FooterContainer,
  CardMainTitle,
  StyledDivider,
} from './DetailCard.styles';

export interface DetailField {
  label: string;
  value: React.ReactNode;
}

export interface DetailSection {
  title?: string;
  fields: DetailField[];
}

export interface DetailCardProps {
  title?: string;
  sections: DetailSection[];
  footer?: React.ReactNode;
}

const LabelValue: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <LabelContainer>
    <StyledLabel variant="caption" color="text.secondary">
      {label}
    </StyledLabel>
    <StyledValue>{value}</StyledValue>
  </LabelContainer>
);

const DetailCard: React.FC<DetailCardProps> = ({ title, sections, footer }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        {title && <CardMainTitle variant="subtitle1">{title}</CardMainTitle>}
        {sections.map((section, sIndex) => (
          <React.Fragment key={sIndex}>
            {section.title && (
              <SectionTitle variant="body2" color="primary">
                {section.title}
              </SectionTitle>
            )}
            <Box display="flex" flexWrap="wrap" gap={2}>
              {section.fields.map((field, fIndex) => (
                <Box key={fIndex}>
                  <LabelValue label={field.label} value={field.value} />
                </Box>
              ))}
            </Box>
            {sIndex < sections.length - 1 && <StyledDivider />}
          </React.Fragment>
        ))}
        {footer && <FooterContainer>{footer}</FooterContainer>}
      </StyledCardContent>
    </StyledCard>
  );
};

export default DetailCard;
