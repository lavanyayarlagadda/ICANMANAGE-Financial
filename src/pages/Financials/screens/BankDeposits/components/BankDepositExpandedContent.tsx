import React from 'react';
import { Box, Grid, Typography, Tooltip } from '@mui/material';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { RowHistoryData } from '@/interfaces/financials';
import {
  HoverExpandedContentBox,
  LoadingWrapperBox,
  FullHeightSubSectionWrapper,
  SubSectionHeader,
  SubSectionHeaderTitle,
  DataRowBox,
  RowFlexBox,
  EmptySectionBox,
  StyledPostingItemBox,
  BoldPrimaryTypography,
  BoldFlexTypography,
  AmountValueTypography,
  BlockCaptionTypography,
  DescTypography,
  NormalSpanBox,
  BoldCaptionFlexTypography,
  PostingListContainerBox,
  RowFlexAlignCenteredBox,
  SemiboldTypography,
  BlockCaptionMarginTypography,
} from '../BankDepositsScreen.styles';

interface BankDepositExpandedContentProps {
  historyData: RowHistoryData | null;
  isLoading: boolean;
  isMindPath?: boolean;
}

const BankDepositExpandedContent: React.FC<BankDepositExpandedContentProps> = ({
  historyData,
  isLoading,
  isMindPath,
}) => {
  if (isLoading) {
    return (
      <HoverExpandedContentBox>
        <LoadingWrapperBox>
          <BoldPrimaryTypography variant="body2">Loading History...</BoldPrimaryTypography>
          <Typography variant="caption" color="text.secondary">
            Fetching detailed reconciliation data
          </Typography>
        </LoadingWrapperBox>
      </HoverExpandedContentBox>
    );
  }

  return (
    <HoverExpandedContentBox>
      <Grid container spacing={2}>
        {/* Section A: BANK DEPOSIT (BAI) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <FullHeightSubSectionWrapper>
            <SubSectionHeader>
              <SubSectionHeaderTitle variant="caption">
                (A) BANK DEPOSIT (BAI)
              </SubSectionHeaderTitle>
            </SubSectionHeader>
            <Box padding={0}>
              {historyData?.baiDataRecords?.map((bai, idx: number) => (
                <DataRowBox key={idx}>
                  <RowFlexBox>
                    <BoldFlexTypography variant="body2">
                      {bai.bankName || 'Unknown Bank'}
                    </BoldFlexTypography>
                    <AmountValueTypography variant="body2">
                      {formatCurrency(bai.amountPaid)}
                    </AmountValueTypography>
                  </RowFlexBox>
                  <BlockCaptionTypography variant="caption" color="text.secondary">
                    <Box component="span" fontWeight={800} color="text.primary">
                      Acc:
                    </Box>{' '}
                    {bai.accountId || '-'} |{' '}
                    <Box component="span" fontWeight={800} color="text.primary">
                      Date:
                    </Box>{' '}
                    {bai.fileReceivedDate ? formatDate(bai.fileReceivedDate) : '-'} |{' '}
                    {isMindPath ? (
                      <>
                        <Box component="span" fontWeight={800} color="text.primary">
                          BAI CODE:
                        </Box>{' '}
                        {bai.transactionCode || '-'}
                      </>
                    ) : (
                      <>
                        <Box component="span" fontWeight={800} color="text.primary">
                          Type:
                        </Box>{' '}
                        {bai.transactionType || '-'}
                      </>
                    )}
                  </BlockCaptionTypography>
                  {!isMindPath && (
                    <BlockCaptionTypography variant="caption" color="text.secondary">
                      <Box component="span" fontWeight={800} color="text.primary">
                        Branch:
                      </Box>{' '}
                      {bai.branchName || '-'} |{' '}
                      <Box component="span" fontWeight={800} color="text.primary">
                        Brand:
                      </Box>{' '}
                      {bai.brandName || '-'}
                    </BlockCaptionTypography>
                  )}
                  <BlockCaptionTypography variant="caption" color="text.secondary">
                    <Box component="span" fontWeight={800} color="text.primary">
                      File:
                    </Box>{' '}
                    {bai.fileName || '-'}
                  </BlockCaptionTypography>
                  {!isMindPath && (
                    <Tooltip title={bai.description || ''}>
                      <DescTypography variant="caption" color="text.secondary">
                        <NormalSpanBox>Desc:</NormalSpanBox>{' '}
                        {bai.description && bai.description.length > 30
                          ? bai.description.substring(0, 30) + '...'
                          : bai.description || '-'}
                      </DescTypography>
                    </Tooltip>
                  )}
                </DataRowBox>
              )) || (
                <EmptySectionBox>
                  <Typography variant="caption" color="text.secondary">
                    No BAI data found
                  </Typography>
                </EmptySectionBox>
              )}
            </Box>
          </FullHeightSubSectionWrapper>
        </Grid>

        {/* Section B: REMITTANCE ADVICE */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <FullHeightSubSectionWrapper>
            <SubSectionHeader>
              <SubSectionHeaderTitle variant="caption">(B) REMITTANCE ADVICE</SubSectionHeaderTitle>
            </SubSectionHeader>
            <Box padding={0}>
              <DataRowBox>
                <RowFlexBox>
                  <BoldCaptionFlexTypography variant="caption" color="text.secondary">
                    PAYER / DATE
                  </BoldCaptionFlexTypography>
                  <AmountValueTypography variant="caption" color="text.secondary">
                    AMOUNT
                  </AmountValueTypography>
                </RowFlexBox>
              </DataRowBox>
              {historyData?.remitDataRecords?.map((remit, idx: number) => (
                <DataRowBox key={idx}>
                  <RowFlexBox>
                    <BoldFlexTypography variant="body2">{remit.payerName}</BoldFlexTypography>
                    <AmountValueTypography variant="body2">
                      {formatCurrency(remit.amount)}
                    </AmountValueTypography>
                  </RowFlexBox>
                  <BlockCaptionTypography variant="caption" color="text.secondary">
                    Date: {remit.receivedDate ? formatDate(remit.receivedDate) : '-'} | File:{' '}
                    {remit.fileName}
                  </BlockCaptionTypography>
                </DataRowBox>
              )) || (
                <EmptySectionBox>
                  <Typography variant="caption" color="text.secondary">
                    No remittance advice found
                  </Typography>
                </EmptySectionBox>
              )}
            </Box>
          </FullHeightSubSectionWrapper>
        </Grid>

        {/* Section C: POSTING & APPLICATION */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <FullHeightSubSectionWrapper>
            <SubSectionHeader>
              <SubSectionHeaderTitle variant="caption">
                (C) POSTING & APPLICATION
              </SubSectionHeaderTitle>
            </SubSectionHeader>
            <PostingListContainerBox>
              {historyData?.cashPostingRecords?.map((post, idx: number) => (
                <StyledPostingItemBox key={idx}>
                  <RowFlexBox>
                    <BoldFlexTypography variant="body2">
                      {post.payerName || 'Unknown Payer'}
                    </BoldFlexTypography>
                    <BoldFlexTypography variant="body2">
                      {formatCurrency(post.amount)}
                    </BoldFlexTypography>
                  </RowFlexBox>
                  <RowFlexAlignCenteredBox>
                    <Typography variant="caption" color="text.secondary">
                      {post.depositDate ? formatDate(post.depositDate) : '-'} | {post.paymentMethod}
                    </Typography>
                    <SemiboldTypography variant="caption" color="text.secondary">
                      Batch: {post.batchId}
                    </SemiboldTypography>
                  </RowFlexAlignCenteredBox>
                  <BlockCaptionMarginTypography variant="caption" color="text.secondary">
                    {post.fileName} | {post.paymentType}
                  </BlockCaptionMarginTypography>
                </StyledPostingItemBox>
              )) || (
                <EmptySectionBox>
                  <Typography variant="caption" color="text.secondary">
                    No posting application data found
                  </Typography>
                </EmptySectionBox>
              )}
            </PostingListContainerBox>
          </FullHeightSubSectionWrapper>
        </Grid>
      </Grid>
    </HoverExpandedContentBox>
  );
};

export default BankDepositExpandedContent;
