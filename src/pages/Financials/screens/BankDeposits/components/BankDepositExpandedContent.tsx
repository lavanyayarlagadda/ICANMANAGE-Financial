import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { RowHistoryData } from '@/interfaces/financials';
import { 
    ExpandedContentBox, 
    SubSectionWrapper, 
    SubSectionHeader, 
    PostingItemBox 
} from '../BankDepositsScreen.styles';

interface BankDepositExpandedContentProps {
    historyData: RowHistoryData | null;
    isLoading: boolean;
}

const BankDepositExpandedContent: React.FC<BankDepositExpandedContentProps> = ({ historyData, isLoading }) => {
    const theme = useTheme();

    if (isLoading) {
        return (
            <ExpandedContentBox sx={{ backgroundColor: theme.palette.action.hover, p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 1 }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>Loading History...</Typography>
                    <Typography variant="caption" color="text.secondary">Fetching detailed reconciliation data</Typography>
                </Box>
            </ExpandedContentBox>
        );
    }

    return (
        <ExpandedContentBox sx={{ backgroundColor: theme.palette.action.hover, p: 2 }}>
            <Grid container spacing={2}>
                {/* Section B: REMITTANCE ADVICE */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <SubSectionWrapper sx={{ height: '100%' }}>
                        <SubSectionHeader>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.main, letterSpacing: '0.05em' }}>(B) REMITTANCE ADVICE</Typography>
                        </SubSectionHeader>
                        <Box sx={{ p: 0 }}>
                            <Box sx={{ display: 'flex', px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="caption" color="text.secondary" sx={{ flex: 1, fontWeight: 700 }}>PAYER / DATE</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ width: 100, textAlign: 'right', fontWeight: 700 }}>AMOUNT</Typography>
                            </Box>
                            {historyData?.remitDataRecords?.map((remit, idx: number) => (
                                <Box key={idx} sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>{remit.payerName}</Typography>
                                        <Typography variant="body2" sx={{ width: 100, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(remit.amount)}</Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Date: {remit.receivedDate ? formatDate(remit.receivedDate) : '-'} | File: {remit.fileName}</Typography>
                                </Box>
                            )) || (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">No remittance advice found</Typography>
                                    </Box>
                                )}
                        </Box>
                    </SubSectionWrapper>
                </Grid>

                {/* Section C: POSTING & APPLICATION */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <SubSectionWrapper sx={{ height: '100%' }}>
                        <SubSectionHeader>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.main, letterSpacing: '0.05em' }}>(C) POSTING & APPLICATION</Typography>
                        </SubSectionHeader>
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {historyData?.cashPostingRecords?.map((post, idx: number) => (
                                <PostingItemBox key={idx} sx={{ p: 1.5, borderRadius: '8px', borderLeft: `4px solid ${theme.palette.warning.main}`, backgroundColor: theme.palette.background.paper, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.payerName || 'Unknown Payer'}</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(post.amount)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {post.depositDate ? formatDate(post.depositDate) : '-'} | {post.paymentMethod}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            Batch: {post.batchId}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                        {post.fileName} | {post.paymentType}
                                    </Typography>
                                </PostingItemBox>
                            )) || (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">No posting application data found</Typography>
                                    </Box>
                                )}
                        </Box>
                    </SubSectionWrapper>
                </Grid>
            </Grid>
        </ExpandedContentBox>
    );
};

export default BankDepositExpandedContent;
