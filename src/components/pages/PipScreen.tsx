import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@/components/atoms/Accordion";
import StatusBadge from "@/components/atoms/StatusBadge";
import { PipRecord, NpiAllocation } from "@/types/financials";
import DataTable, { DataColumn } from "../molecules/DataTable";
import RangeDropdown from "@/components/atoms/RangeDropdown";
import { Box, Typography, IconButton, Chip, CircularProgress } from "@mui/material";
import MultiValueDisplay from "@/components/atoms/MultiValueDisplay";
import { formatCurrency, formatPercent } from "@/utils/formatters";
import { useSearchPipQuery, useLazyExportPipQuery } from "@/store/api/financialsApi";
import { subMonths, format } from 'date-fns';
import { useAppSelector, useAppDispatch } from "@/store";
import { setActiveExportType, setIsGlobalFetching, setIsReloading } from "@/store/slices/uiSlice";
import { useRef } from 'react';
import { downloadFileFromBlob } from "@/utils/downloadHelper";

interface Props {
  allocation: NpiAllocation;
}

export const NpiSection: React.FC<Props> = ({ allocation }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Accordion
        defaultExpanded={false}
        summary={
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            width: "100%",
            gap: { xs: 1, sm: 2 },
          }}>
            <Typography fontSize={13} fontWeight={600} sx={{ flex: 1, wordBreak: "break-word" }}>
              {allocation.npiPayerName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'space-between', sm: 'flex-end' }, width: { xs: '100%', sm: 'auto' } }}>
              <Typography textAlign="right" fontSize={13} fontWeight={600}>
                {formatCurrency(Number(allocation.totalPayment))}
              </Typography>
              <Box sx={{ textAlign: "right", pr: 1 }}>
                <Chip
                  label={`${formatPercent(Number(allocation.allocatedPercent ?? 0), 2)} Allocated`}
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
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
            minWidth: 500, px: 2, py: 1,
            background: "#fafafa", borderBottom: "1px solid #eee",
          }}>
            <Typography fontSize={12} fontWeight={600}>CLAIM ID</Typography>
            <Typography fontSize={12} fontWeight={600}>PATIENT NAME</Typography>
            <Typography textAlign="right" fontSize={12} fontWeight={600}>ALLOWED AMT</Typography>
            <Typography textAlign="right" fontSize={12} fontWeight={600}>APPLIED TO PIP BALANCE</Typography>
          </Box>
          {allocation.claims.map((claim) => (
            <Box key={claim.claimId} sx={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 1fr 1fr",
              minWidth: 500, px: 2, py: 1,
              borderBottom: "1px solid #f1f1f1",
            }}>
              <Typography fontSize={13} color="primary">{claim.claimId}</Typography>
              <Typography fontSize={13}>{claim.patientName}</Typography>
              <Typography fontSize={13} textAlign="right">{formatCurrency(Number(claim.allowedAmt))}</Typography>
              <Typography fontSize={13} textAlign="right" color="success.main">{formatCurrency(Number(claim.appliedToPipBalance))}</Typography>
            </Box>
          ))}
        </Box>
      </Accordion>
    </Box>
  );
};

const PipScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { actionTriggers, activeExportType, isReloading } = useAppSelector(s => s.ui);

  // Refs to prevent mount calls
  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  // Search parameters state
  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 10,
    sortField: '',
    sortOrder: 'desc' as 'asc' | 'desc',
    fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data, isLoading, isError, isFetching, refetch } = useSearchPipQuery({
    page: queryParams.page,
    size: queryParams.size,
    sort: queryParams.sortField,
    desc: queryParams.sortOrder === 'desc',
    fromDate: queryParams.fromDate,
    toDate: queryParams.toDate
  });

  const pipRecords = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;

  const [triggerExport] = useLazyExportPipQuery();

  const handleExport = async (formatType: 'pdf' | 'xlsx') => {
    try {
      dispatch(setActiveExportType(formatType));
      const result = await triggerExport({
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        format: formatType
      }).unwrap();

      if (result !== undefined) {
        downloadFileFromBlob(
          result as unknown as Blob,
          `PIP_Report_${queryParams.fromDate}_to_${queryParams.toDate}.${formatType}`
        );
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      dispatch(setActiveExportType(null));
    }
  };

  // Sync isFetching to global store
  useEffect(() => {
    dispatch(setIsGlobalFetching(isFetching));
    return () => {
      dispatch(setIsGlobalFetching(false));
    };
  }, [isFetching, dispatch]);

  // Global triggers
  useEffect(() => {
    if (actionTriggers.export > exportCount.current) {
      handleExport('xlsx');
      exportCount.current = actionTriggers.export;
    }
  }, [actionTriggers.export]);

  useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      handleExport('pdf');
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print]);

  useEffect(() => {
    if (actionTriggers.reload > reloadCount.current) {
      const doReload = async () => {
        try {
          dispatch(setIsReloading(true));
          await refetch();
        } finally {
          dispatch(setIsReloading(false));
        }
      };
      doReload();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload, refetch, dispatch]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getRowId = (row: PipRecord) => row.id || row.ptan;

  const handleRangeChange = (range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setQueryParams(prev => {
        if (prev.fromDate === from && prev.toDate === to) return prev;
        return { ...prev, fromDate: from, toDate: to, page: 0 };
      });
    }
  };

  const handleSortChange = (colId: string, direction: 'asc' | 'desc') => {
    setQueryParams(prev => {
      if (prev.sortField === colId && prev.sortOrder === direction) return prev;
      return { ...prev, sortField: colId, sortOrder: direction, page: 0 };
    });
  };

  const columns: DataColumn<PipRecord>[] = [
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
  ];

  const renderExpandedContent = (row: PipRecord) => {
    if (!row.npiDetails?.length) return null;
    return (
      <Box>
        {row.npiDetails.map((allocation) => (
          <NpiSection key={allocation.npiPayerName} allocation={allocation} />
        ))}
      </Box>
    );
  };

  // if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: '60vh' }}><CircularProgress /></Box>;
  if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading PIP records.</Box>;

  return (
    <Box sx={{ position: 'relative' }}>
      <DataTable
        columns={columns} data={pipRecords} rowKey={getRowId} expandedRows={expandedRows}
        expandedContent={renderExpandedContent} exportTitle="PIP Records" dictionaryId="statements"
        serverSide totalElements={totalElements} page={queryParams.page} rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField} sortDir={queryParams.sortOrder}
        onPageChange={(p) => setQueryParams(prev => prev.page === p ? prev : ({ ...prev, page: p }))}
        onRowsPerPageChange={(s) => setQueryParams(prev => prev.size === s ? prev : ({ ...prev, size: s, page: 0 }))}
        onSortChange={handleSortChange} customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
        download={false}
        onDownload={() => handleExport('xlsx')}
      />
    </Box>
  );
};

export default PipScreen;