import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@/components/atoms/Accordion";

import StatusBadge from "@/components/atoms/StatusBadge";

import { PipRecord } from "@/types/financials";
import DataTable, { DataColumn } from "../molecules/DataTable";
import RangeDropdown from "@/components/atoms/RangeDropdown";
import { Box, Typography, IconButton, Chip } from "@mui/material";


import { NpiAllocation } from "@/types/financials";
import { formatCurrency, formatPercent } from "@/utils/formatters";

interface Props {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<Props> = ({ allocation }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Accordion
        defaultExpanded={false}
        summary={
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              width: "100%",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Typography fontSize={13} fontWeight={600} sx={{ flex: 1, wordBreak: "break-word" }}>
              NPI {allocation.npi} – {allocation.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'space-between', sm: 'flex-end' }, width: { xs: '100%', sm: 'auto' } }}>
              <Typography textAlign="right" fontSize={13} fontWeight={600}>
                {formatCurrency(allocation.allocatedAmount)}
              </Typography>

              <Box sx={{ textAlign: "right", pr: 1 }}>
                <Chip
                  label={`${formatPercent(allocation.allocatedPercent, 2)} Allocated`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </Box>
          </Box>
        }
      >
        <Box sx={{ border: "1px solid #eee", borderTop: "none", overflowX: "auto" }}>
          {/* Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
              minWidth: 500,
              px: 2,
              py: 1,
              background: "#fafafa",
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography fontSize={12} fontWeight={600}>
              CLAIM ID
            </Typography>
            <Typography fontSize={12} fontWeight={600}>
              PATIENT NAME
            </Typography>
            <Typography textAlign="right" fontSize={12} fontWeight={600}>
              ALLOWED AMT
            </Typography>
            <Typography textAlign="right" fontSize={12} fontWeight={600}>
              APPLIED TO PIP BALANCE
            </Typography>
          </Box>

          {/* Claims */}
          {allocation.claims.map((claim) => (
            <Box
              key={claim.claimId}
              sx={{
                display: "grid",
                gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
                minWidth: 500,
                px: 2,
                py: 1,
                borderBottom: "1px solid #f1f1f1",
              }}
            >
              <Typography fontSize={13} color="primary">
                {claim.claimId}
              </Typography>

              <Typography fontSize={13}>{claim.patientName}</Typography>

              <Typography fontSize={13} textAlign="right">
                {formatCurrency(claim.allowedAmt)}
              </Typography>

              <Typography fontSize={13} textAlign="right" color="success.main">
                {formatCurrency(claim.appliedToPipBalance)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Accordion>
    </Box>
  );
};





import { useSearchPipQuery } from "@/store/api/financialsApi";
import { CircularProgress } from "@mui/material";
import { subMonths, format } from 'date-fns';

const PipScreen: React.FC = () => {
  // Default to 4 months ago for PIP as per user example range
  const defaultTo = new Date();
  const defaultFrom = subMonths(defaultTo, 4);

  // API Payload State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [fromDate, setFromDate] = useState(format(defaultFrom, 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(defaultTo, 'yyyy-MM-dd'));

  const { data, isLoading, isError, isFetching } = useSearchPipQuery({
    page: page, // API appears to be 0-indexed for PIP based on request example
    size: size,
    sort: sortField,
    desc: sortOrder === 'desc',
    fromDate,
    toDate
  });

  const pipRecords = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleRangeChange = (range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setFromDate(from);
      setToDate(to);
      setPage(0);
    }
  };

  const handleSortChange = (colId: string, direction: 'asc' | 'desc') => {
    setSortField(colId);
    setSortOrder(direction);
    setPage(0);
  };

  const columns: DataColumn<PipRecord>[] = [
    {
      id: "expand",
      label: "",
      render: (row) =>
        row.npiAllocations.length > 0 ? (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleRow(row.id);
            }}
          >
            {expandedRows.has(row.id) ? (
              <KeyboardArrowDownIcon fontSize="small" />
            ) : (
              <KeyboardArrowRightIcon fontSize="small" />
            )}
          </IconButton>
        ) : null,
    },
    { id: "ptan", label: "PTAN", accessor: (row) => row.ptan, render: (row) => row.ptan },
    { id: "paymentDate", label: "PAYMENT DATE", accessor: (row) => row.paymentDate, render: (row) => row.paymentDate },
    { id: "checkEftNumber", label: "CHECK/EFT NUMBER", accessor: (row) => row.checkEftNumber, render: (row) => row.checkEftNumber },
    { id: "paymentAmount", label: "PAYMENT AMOUNT", align: "right", accessor: (row) => row.paymentAmount, render: (row) => formatCurrency(row.paymentAmount) },
    { id: "suspenseBalance", label: "SUSPENSE BALANCE", align: "right", accessor: (row) => row.suspenseBalance, render: (row) => formatCurrency(row.suspenseBalance) },
    { id: "status", label: "STATUS", accessor: (row) => row.status, render: (row) => <StatusBadge status={row.status} /> },
  ];

  const renderExpandedContent = (row: PipRecord) => {
    if (!row.npiAllocations?.length) return null;
    return (
      <Box>
        {row.npiAllocations.map((allocation) => (
          <NpiSection key={allocation.npi} allocation={allocation} />
        ))}
      </Box>
    );
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: '60vh' }}><CircularProgress /></Box>;
  if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading PIP records. Please try again later.</Box>;

  return (
    <Box sx={{ position: 'relative' }}>
      {isFetching && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress size={40} thickness={4} />
        </Box>
      )}
      <DataTable
        columns={columns}
        data={pipRecords}
        rowKey={(row) => row.id}
        expandedRows={expandedRows}
        expandedContent={renderExpandedContent}
        exportTitle="PIP Records"
        dictionaryId="statements"
        serverSide
        totalElements={totalElements}
        page={page}
        rowsPerPage={size}
        sortCol={sortField}
        sortDir={sortOrder}
        onPageChange={setPage}
        onRowsPerPageChange={setSize}
        onSortChange={handleSortChange}
        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
      />
    </Box>
  );
};

export default PipScreen;