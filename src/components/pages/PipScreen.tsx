import React, { useState, useMemo, useCallback } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@/components/atoms/Accordion";
import StatusBadge from "@/components/atoms/StatusBadge";
import { useAppSelector } from "@/store";
import { PipRecord, NpiAllocation } from "@/types/financials";
import DataTable, { DataColumn } from "../molecules/DataTable";
import RangeDropdown from "@/components/atoms/RangeDropdown";
import { Box, Typography, IconButton, Chip, useTheme } from "@mui/material";
import { formatCurrency, formatPercent } from "@/utils/formatters";

interface Props {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<Props> = ({ allocation }) => {
  const theme = useTheme();
  
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
        <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderTop: "none", overflowX: "auto" }}>
          {/* Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
              minWidth: 500,
              px: 2,
              py: 1,
              background: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography fontSize={12} fontWeight={600}>CLAIM ID</Typography>
            <Typography fontSize={12} fontWeight={600}>PATIENT NAME</Typography>
            <Typography textAlign="right" fontSize={12} fontWeight={600}>ALLOWED AMT</Typography>
            <Typography textAlign="right" fontSize={12} fontWeight={600}>APPLIED TO PIP BALANCE</Typography>
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
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography fontSize={13} color="primary">{claim.claimId}</Typography>
              <Typography fontSize={13}>{claim.patientName}</Typography>
              <Typography fontSize={13} textAlign="right">{formatCurrency(claim.allowedAmt)}</Typography>
              <Typography fontSize={13} textAlign="right" color="success.main">{formatCurrency(claim.appliedToPipBalance)}</Typography>
            </Box>
          ))}
        </Box>
      </Accordion>
    </Box>
  );
};

const PipScreen: React.FC = () => {
  const pipRecords = useAppSelector((s) => s.financials.pipRecords || []);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const columns = useMemo<DataColumn<PipRecord>[]>(() => [
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
    { id: "ptan", label: "PTAN", accessor: (row) => row.ptan },
    { id: "paymentDate", label: "PAYMENT DATE", accessor: (row) => row.paymentDate },
    { id: "checkEftNumber", label: "CHECK/EFT NUMBER", accessor: (row) => row.checkEftNumber },
    { id: "paymentAmount", label: "PAYMENT AMOUNT", align: "right", accessor: (row) => row.paymentAmount, render: (row) => formatCurrency(row.paymentAmount) },
    { id: "suspenseBalance", label: "SUSPENSE BALANCE", align: "right", accessor: (row) => row.suspenseBalance, render: (row) => formatCurrency(row.suspenseBalance) },
    { id: "status", label: "STATUS", accessor: (row) => row.status, render: (row) => <StatusBadge status={row.status} /> },
  ], [expandedRows, toggleRow]);

  const renderExpandedContent = useCallback((row: PipRecord) => {
    if (!row.npiAllocations?.length) return null;
    return (
      <Box>
        {row.npiAllocations.map((allocation) => (
          <NpiSection key={allocation.npi} allocation={allocation} />
        ))}
      </Box>
    );
  }, []);

  return (
    <DataTable
      columns={columns}
      data={pipRecords}
      rowKey={(row) => row.id}
      expandedRows={expandedRows}
      expandedContent={renderExpandedContent}
      exportTitle="PIP Records"
      paginated
      customToolbarContent={<RangeDropdown />}
      dictionaryId="statements"
    />
  );
};

export default PipScreen;