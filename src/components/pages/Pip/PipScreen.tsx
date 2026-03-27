import React, { useMemo, useCallback } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@/components/atoms/Accordion/Accordion";
import StatusBadge from "@/components/atoms/StatusBadge/StatusBadge";
import { PipRecord, NpiAllocation } from "@/interfaces/financials";
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from "@/components/atoms/RangeDropdown/RangeDropdown";
import { Box, Typography, IconButton, Chip, Grid } from "@mui/material";
import MultiValueDisplay from "@/components/atoms/MultiValueDisplay/MultiValueDisplay";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import SummaryCard from "@/components/atoms/SummaryCard/SummaryCard";
import { NpiSectionWrapper, NpiHeaderRow, NpiDataRow } from "./PipScreen.styles";
import { usePipScreen } from "./PipScreen.hook";

interface NpiProps {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<NpiProps> = ({ allocation }) => (
  <Box sx={{ mb: 1 }}>
    <Accordion
      defaultExpanded={false}
      summary={
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", width: "100%", gap: { xs: 1, sm: 2 } }}>
          <Typography fontSize={13} fontWeight={600} sx={{ flex: 1, wordBreak: "break-word" }}>{allocation.npiPayerName}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'space-between', sm: 'flex-end' }, width: { xs: '100%', sm: 'auto' } }}>
            <Typography textAlign="right" fontSize={13} fontWeight={600}>{formatCurrency(Number(allocation.totalPayment))}</Typography>
            <Box sx={{ textAlign: "right", pr: 1 }}><Chip label={`${formatPercent(Number(allocation.allocatedPercent ?? 0), 2)} Allocated`} size="small" variant="outlined" color="primary" /></Box>
          </Box>
        </Box>
      }
    >
      <NpiSectionWrapper>
        <NpiHeaderRow>
          <Typography fontSize={12} fontWeight={600}>CLAIM ID</Typography>
          <Typography fontSize={12} fontWeight={600}>PATIENT NAME</Typography>
          <Typography textAlign="right" fontSize={12} fontWeight={600}>ALLOWED AMT</Typography>
          <Typography textAlign="right" fontSize={12} fontWeight={600}>APPLIED TO PIP BALANCE</Typography>
        </NpiHeaderRow>
        {allocation.claims.map((claim) => (
          <NpiDataRow key={claim.claimId}>
            <Typography fontSize={13} color="primary">{claim.claimId}</Typography>
            <Typography fontSize={13}>{claim.patientName}</Typography>
            <Typography fontSize={13} textAlign="right">{formatCurrency(Number(claim.allowedAmt))}</Typography>
            <Typography fontSize={13} textAlign="right" color="success.main">{formatCurrency(Number(claim.appliedToPipBalance))}</Typography>
          </NpiDataRow>
        ))}
      </NpiSectionWrapper>
    </Accordion>
  </Box>
);

const PipScreen: React.FC = () => {
  const {
    canViewPip,
    pipRecords,
    totalElements,
    pipSummary,
    queryParams,
    expandedRows,
    toggleRow,
    handleRangeChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleExport,
    isError,
  } = usePipScreen();

  const getRowId = useCallback((row: PipRecord) => row.id || row.ptan, []);

  const columns = useMemo<DataColumn<PipRecord>[]>(() => [
    {
      id: "expand",
      label: "",
      render: (row) =>
        (row.npiDetails?.length ?? 0) > 0 ? (
          <IconButton size="small" onClick={(e) => toggleRow(getRowId(row), e)}>
            {expandedRows.has(getRowId(row)) ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </IconButton>
        ) : null,
    },
    { id: "ptan", label: "PTAN", accessor: (row) => row.ptan, render: (row) => row.ptan },
    { id: "paymentDate", label: "PAYMENT DATE", accessor: (row) => row.paymentDate, render: (row) => row.paymentDate },
    { id: "checkEftNumber", label: "CHECK/EFT NUMBER", accessor: (row) => row.checkEftNumber, render: (row) => <MultiValueDisplay value={row.checkEftNumber} /> },
    { id: "paymentAmount", label: "PAYMENT AMOUNT", align: "right", accessor: (row) => row.paymentAmount, render: (row) => formatCurrency(Number(row.paymentAmount)) },
    { id: "suspenseBalance", label: "SUSPENSE BALANCE", align: "right", accessor: (row) => row.suspenseBalance, render: (row) => formatCurrency(Number(row.suspenseBalance)) },
    { id: "status", label: "STATUS", accessor: (row) => row.status, render: (row) => <StatusBadge status={row.status} /> },
  ], [expandedRows, toggleRow, getRowId]);

  const renderExpandedContent = useCallback((row: PipRecord) => {
    if (!row.npiDetails?.length) return null;
    return <Box>{row.npiDetails.map((allocation) => <NpiSection key={allocation.npiPayerName} allocation={allocation} />)}</Box>;
  }, []);

  if (!canViewPip) return null;
  if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading PIP records.</Box>;

  return (
    <Box sx={{ position: 'relative' }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL PAID AMOUNT" value={formatCurrency(pipSummary?.totalPaidAmount ?? 0)} backgroundColor="#fff" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL SUSPENSE BALANCE" value={formatCurrency(pipSummary?.totalSuspenseBalance ?? 0)} backgroundColor="#fff" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="ACTION REQUIRED" value={pipSummary?.actionRequired?.toString() || '0'} variant="default" backgroundColor="#fff" /></Grid>
      </Grid>
      <DataTable
        columns={columns} data={pipRecords} rowKey={getRowId} expandedRows={expandedRows}
        expandedContent={renderExpandedContent} exportTitle="PIP Records" dictionaryId="statements"
        serverSide totalElements={totalElements} page={queryParams.page} rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField} sortDir={queryParams.sortOrder}
        onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} onSortChange={handleSortChange}
        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
        download={false} onDownload={() => handleExport('xlsx')}
      />
    </Box>
  );
};

export default PipScreen;
