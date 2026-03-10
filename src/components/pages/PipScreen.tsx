import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@/components/atoms/Accordion";

import StatusBadge from "@/components/atoms/StatusBadge";

import { useAppSelector } from "@/store";
import { PipRecord } from "@/types/financials";
import DataTable, { DataColumn } from "../molecules/DataTable";
import { Box, Typography, IconButton, Chip } from "@mui/material";


import { NpiAllocation } from "@/types/financials";
import { formatCurrency, formatPercent } from "@/utils/formatters";

interface Props {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<Props> = ({ allocation }) => {
  return (
    <Box sx={{ ml: 5, mb: 1 }}>
      <Accordion
        defaultExpanded={false}
        summary={
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography fontSize={13} fontWeight={600}>
              NPI {allocation.npi} – {allocation.name}
            </Typography>

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
        }
      >
        <Box sx={{ border: "1px solid #eee", borderTop: "none" }}>
          {/* Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
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





const PipScreen: React.FC = () => {
  const pipRecords = useAppSelector((s) => s.financials.pipRecords);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      return newSet;
    });
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

    {
      id: "ptan",
      label: "PTAN",
      accessor: (row) => row.ptan,
      render: (row) => row.ptan,
    },

    {
      id: "paymentDate",
      label: "PAYMENT DATE",
      accessor: (row) => row.paymentDate,
      render: (row) => row.paymentDate,
    },

    {
      id: "checkEftNumber",
      label: "CHECK/EFT NUMBER",
      accessor: (row) => row.checkEftNumber,
      render: (row) => row.checkEftNumber,
    },

    {
      id: "paymentAmount",
      label: "PAYMENT AMOUNT",
      align: "right",
      accessor: (row) => row.paymentAmount,
      render: (row) => formatCurrency(row.paymentAmount),
    },

    {
      id: "suspenseBalance",
      label: "SUSPENSE BALANCE",
      align: "right",
      accessor: (row) => row.suspenseBalance,
      render: (row) => formatCurrency(row.suspenseBalance),
    },

    {
      id: "status",
      label: "STATUS",
      accessor: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const renderExpandedContent = (row: PipRecord) => {
    if (!row.npiAllocations?.length) return null;

    return (
      <Box sx={{ py: 2, px: 1 }}>
        {row.npiAllocations.map((allocation) => (
          <NpiSection key={allocation.npi} allocation={allocation} />
        ))}
      </Box>
    );
  };

  return (
    <DataTable
      columns={columns}
      data={pipRecords}
      rowKey={(row) => row.id}
      expandedRows={expandedRows}
      expandedContent={renderExpandedContent}
      exportTitle="PIP Records"
      paginated
      searchable
    />
  );
};

export default PipScreen;