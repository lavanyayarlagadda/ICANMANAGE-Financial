import React from 'react';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as styles from './DetailCard.styles';

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
    <Box sx={styles.labelContainerStyles}>
        <Typography variant="caption" color="text.secondary" sx={styles.labelStyles}>
            {label}
        </Typography>
        <Box sx={styles.valueStyles}>{value}</Box>
    </Box>
);

const DetailCard: React.FC<DetailCardProps> = ({ title, sections, footer }) => {
    return (
        <Card sx={styles.cardStyles}>
            <CardContent sx={styles.cardContentStyles}>
                {title && (
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
                        {title}
                    </Typography>
                )}
                {sections.map((section, sIndex) => (
                    <React.Fragment key={sIndex}>
                        {section.title && (
                            <Typography variant="body2" color="primary" sx={styles.sectionTitleStyles}>
                                {section.title}
                            </Typography>
                        )}
                        <Grid container spacing={2}>
                            {section.fields.map((field, fIndex) => (
                                <Grid key={fIndex}>
                                    <LabelValue label={field.label} value={field.value} />
                                </Grid>
                            ))}
                        </Grid>
                        {sIndex < sections.length - 1 && <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />}
                    </React.Fragment>
                ))}
                {footer && (
                    <Box sx={styles.footerContainerStyles}>
                        {footer}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default DetailCard;
