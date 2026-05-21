import React from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';

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
    <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {label}
        </Typography>
        <Box sx={{ typography: 'body2', fontWeight: 500 }}>{value}</Box>
    </Box>
);

const DetailCard: React.FC<DetailCardProps> = ({ title, sections, footer }) => {
    return (
        <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                {title && (
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
                        {title}
                    </Typography>
                )}
                {sections.map((section, sIndex) => (
                    <React.Fragment key={sIndex}>
                        {section.title && (
                            <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                                {section.title}
                            </Typography>
                        )}
                        <Grid container spacing={2}>
                            {section.fields.map((field, fIndex) => (
                                <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={fIndex}>
                                    <LabelValue label={field.label} value={field.value} />
                                </Grid>
                            ))}
                        </Grid>
                        {sIndex < sections.length - 1 && <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.08)' }} />}
                    </React.Fragment>
                ))}
                {footer && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                        {footer}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default DetailCard;
