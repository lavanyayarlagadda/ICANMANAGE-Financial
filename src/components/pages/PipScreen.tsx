import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import StatusBadge from "@/components/atoms/StatusBadge";

import { useAppSelector } from "@/store";
import { PipRecord } from "@/types/financials";
import DataTable, { DataColumn } from "../molecules/DataTable";
import { Box, Typography, Chip,IconButton } from "@mui/material";
import { NpiAllocation } from "@/types/financials";
import { formatCurrency, formatPercent } from "@/utils/formatters";

interface Props {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<Props> = ({ allocation }) => {

  const columns: DataColumn<NpiAllocation['claims'][number]>[] = [
    {
      id: "claimId",
      label: "CLAIM ID",
      accessor: (row) => row.claimId,
      render: (row) => row.claimId,
    },
    {
      id: "patientName",
      label: "PATIENT NAME",
      accessor: (row) => row.patientName,
      render: (row) => row.patientName,
    },
    {
      id: "allowedAmt",
      label: "ALLOWED AMOUNT",
      align: "right",
      accessor: (row) => row.allowedAmt,
      render: (row) => formatCurrency(row.allowedAmt),
    },
    {
      id: "appliedToPipBalance",
      label: "APPLIED TO PIP BALANCE",
      align: "right",
      accessor: (row) => row.appliedToPipBalance,
      render: (row) => (
        <span style={{ color: "#d32f2f" }}>
          {formatCurrency(row.appliedToPipBalance)}
        </span>
      ),
    },
  ];

  return (
    <Box
      sx={{
        mb: 2,
        ml: { xs: 0, md: 4 },
        p: 2,
        borderRadius: 1,
        border: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      {/* NPI Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          NPI: {allocation.npi} – {allocation.name}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ fontFamily: "monospace", fontWeight: 600 }}>
            {formatCurrency(allocation.allocatedAmount)}
          </Typography>

          <Chip
            label={`${formatPercent(allocation.allocatedPercent, 2)} Allocated`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Claims Table */}
      <DataTable
        columns={columns}
        data={allocation.claims}
        rowKey={(row) => row.claimId}
        paginated={false}
        searchable={false}
        exportTitle="NPI Claims"
      />
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