import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Grid, InputAdornment } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PlbDetailRecord, AssociatedEraFile } from '@/interfaces/api/transactions';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import { themeConfig } from '@/theme/themeConfig';
import { useFbRecoupScreen, useFbRecoupTable } from './FbRecoupScreen.hook';
import {
  FilesSectionWrapperBox,
  FilesSectionTitleText,
  FilesContainerBox,
  FilesHeaderGridBox,
  FilesRowGridBox,
  FlexCenterBox,
  FileLinkTextTypography,
  LeftMarginFileIcon,
  FontWeight500Typography,
  BoldTextTypography,
  TypeChip,
  BoldText500Typography,
  AmountTypography,
  SuspenseBalanceTypography,
  ScreenHeaderBox,
  ScreenHeaderTitleText,
  SummaryGrid,
  ToolbarWrapper,
  SearchWrapper,
  SearchField,
  SearchIconStyled,
  SearchButton,
  EmptyEraBox,
  FilterFormControl,
  FilterIconButton,
  FilterTextField,
  _ErrorAlert,
  AdornmentBox,
} from './FbRecoupScreen.styles';
import { useTheme } from '@mui/material/styles';

const AssociatedEraFilesSection: React.FC<{
  files: AssociatedEraFile[];
  isCareHospice: boolean;
}> = ({ files }) => (
  <FilesSectionWrapperBox>
    <FilesSectionTitleText variant="subtitle2">Associated ERA Files</FilesSectionTitleText>
    <FilesContainerBox>
      <FilesHeaderGridBox>
        <Typography fontSize={12} fontWeight={700} color="text.primary" textAlign="center">
          TRANSACTION NO
        </Typography>
        <Typography fontSize={12} fontWeight={700} color="text.primary" textAlign="center">
          NPI
        </Typography>
        <Typography fontSize={12} fontWeight={700} color="text.primary" textAlign="center">
          REMIT DATE
        </Typography>
        <Typography fontSize={12} fontWeight={700} color="text.primary" textAlign="center">
          AMOUNT
        </Typography>
      </FilesHeaderGridBox>
      {files.map((file, idx) => (
        <FilesRowGridBox key={idx} isLast={idx === files.length - 1}>
          <FlexCenterBox>
            <FileLinkTextTypography fontSize={13} color="primary">
              <LeftMarginFileIcon />
              {file.transactionNo}
            </FileLinkTextTypography>
          </FlexCenterBox>
          <FontWeight500Typography fontSize={13} textAlign="center">
            {file.npi}
          </FontWeight500Typography>
          <FontWeight500Typography fontSize={13} textAlign="center">
            {formatDate(file.remitDate)}
          </FontWeight500Typography>
          <FontWeight500Typography fontSize={13} textAlign="center" color="text.primary">
            {formatCurrency(file.amount)}
          </FontWeight500Typography>
        </FilesRowGridBox>
      ))}
    </FilesContainerBox>
  </FilesSectionWrapperBox>
);

const FbRecoupScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const theme = useTheme();

  const {
    plbDetails,
    totalElements,
    queryParams,
    handleRangeChange,
    handleSortChange,
    onPageChange,
    onRowsPerPageChange,
    handleFilterChange,
    payerOptions,
    stats,
    globalFilters,
    isFetching,
    // isError,
    isCareHospice,
    setSearchTerm,
    filterNpiPtan,
    setFilterNpiPtan,
    brandOrStateOptions,
    applyFilters,
    onSearch,
    searchTerm,
    statusOptions,
  } = useFbRecoupScreen({ skip });

  const { expandedRows, toggleRow } = useFbRecoupTable();

  const getTypeBadgeColors = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('forward')) {
      return { bg: themeConfig.colors.amber + '18', text: themeConfig.colors.amberDark };
    }
    if (t.includes('recoup')) {
      return { bg: themeConfig.colors.accent + '18', text: themeConfig.colors.accentDark };
    }
    return { bg: themeConfig.colors.charts.teal + '18', text: themeConfig.colors.charts.tealDark };
  };

  const columns = useMemo<DataColumn<PlbDetailRecord>[]>(
    () => [
      {
        id: 'expand',
        label: '',
        align: 'center',
        render: (row) => (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleRow(row.id);
            }}
          >
            {expandedRows.has(row.id) ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        ),
      },
      {
        id: 'date',
        label: 'DATE',
        align: 'center',
        accessor: (row) => row.date,
        render: (row) => (
          <BoldTextTypography variant="body2">{formatDate(row.date)}</BoldTextTypography>
        ),
      },
      {
        id: 'transactionNo',
        label: 'TRANSACTION NO.',
        align: 'center',
        accessor: (row) => row.transactionNo,
        render: (row) => (
          <BoldTextTypography variant="body2">{row.transactionNo}</BoldTextTypography>
        ),
      },
      {
        id: 'type',
        label: 'TYPE',
        align: 'center',
        accessor: (row) => row.type,
        render: (row) => {
          const colors = getTypeBadgeColors(row.type);
          return <TypeChip label={row.type} size="small" bg={colors.bg} textColor={colors.text} />;
        },
      },
      {
        id: 'state',
        label: isCareHospice ? 'BRAND' : 'STATE',
        align: 'center',
        accessor: (row) => row.state,
        render: (row) => <BoldText500Typography variant="body2">{row.state}</BoldText500Typography>,
        filterOptions: brandOrStateOptions,
      },
      {
        id: 'payor',
        label: 'PAYER',
        align: 'center',
        accessor: (row) => row.payor,
        filterOptions: payerOptions,
        render: (row) => <BoldTextTypography variant="body2">{row.payor}</BoldTextTypography>,
      },
      {
        id: 'npi',
        label: isCareHospice ? 'PTAN' : 'NPI',
        align: 'center',
        accessor: (row) => row.npi,
        render: (row) => <BoldText500Typography variant="body2">{row.npi}</BoldText500Typography>,
      },
      {
        id: 'identifier',
        label: 'IDENTIFIER',
        align: 'center',
        accessor: (row) => row.identifier,
        render: (row) => (
          <BoldText500Typography variant="body2">{row.identifier || '-'}</BoldText500Typography>
        ),
      },
      {
        id: 'amount',
        label: 'AMOUNT',
        align: 'center',
        accessor: (row) => row.amount,
        render: (row) => (
          <AmountTypography variant="body2" amount={row.amount}>
            {formatCurrency(row.amount)}
          </AmountTypography>
        ),
      },
      {
        id: 'suspenseBalance',
        label: 'SUSPENSE BALANCE',
        align: 'center',
        accessor: (row) => row.suspenseBalance,
        render: (row) => (
          <SuspenseBalanceTypography variant="body2" balance={row.suspenseBalance}>
            {formatCurrency(row.suspenseBalance)}
          </SuspenseBalanceTypography>
        ),
      },
      {
        id: 'status',
        label: 'STATUS',
        align: 'center',
        accessor: (row) => row.status,
        filterOptions: statusOptions,
        render: (row) => <StatusBadge status={row.status} />,
      },
    ],
    [expandedRows, toggleRow, payerOptions, isCareHospice, brandOrStateOptions, statusOptions],
  );

  return (
    <Box>
      <ScreenHeaderBox>
        <ScreenHeaderTitleText variant="h5">FB & Recoup</ScreenHeaderTitleText>
        <Typography variant="body2" color="text.secondary">
          Forward Balance and recoupment transaction details.
        </Typography>
      </ScreenHeaderBox>

      {/* {isError && (
        <_ErrorAlert severity="error">
          Failed to load Forward Balance and Recoupment transaction details. Please try reloading or contact support.
        </_ErrorAlert>
      )} */}

      <SummaryGrid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="TOTAL AMOUNT"
            value={formatCurrency(stats.totalOriginalAmount)}
            backgroundColor={theme.palette.background.paper}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="TOTAL SUSPENSE BALANCE"
            value={formatCurrency(stats.totalRemainingAmount)}
            variant="negative"
            backgroundColor={theme.palette.background.paper}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="ACTION REQUIRED"
            value={String(stats.actionRequired)}
            backgroundColor={theme.palette.background.paper}
          />
        </Grid>
      </SummaryGrid>
      <ToolbarWrapper>
        <SearchWrapper>
          <SearchField
            size="small"
            placeholder="Search by Transaction #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIconStyled />
                </InputAdornment>
              ),
            }}
          />
          <SearchButton
            variant="contained"
            size="small"
            disabled={!searchTerm}
            onClick={() => onSearch()}
          >
            Search
          </SearchButton>
        </SearchWrapper>
      </ToolbarWrapper>

      <DataTable
        columns={columns}
        data={plbDetails}
        rowKey={(row) => row.id}
        expandedRows={expandedRows}
        expandedContent={(row) => {
          if (!row.associatedEraFiles || row.associatedEraFiles.length === 0) {
            return (
              <EmptyEraBox>
                <Typography variant="body2" color="text.secondary">
                  No associated ERA files found.
                </Typography>
              </EmptyEraBox>
            );
          }
          return (
            <AssociatedEraFilesSection
              files={row.associatedEraFiles}
              isCareHospice={isCareHospice}
            />
          );
        }}
        exportTitle="FB & Recoup Details"
        customToolbarContent={
          <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
        }
        dictionaryId="fb-recoup"
        serverSide
        totalElements={totalElements}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        download={false}
        loading={isFetching}
        customFilterContent={
          <FilterFormControl size="small">
            <FilterTextField
              size="small"
              value={filterNpiPtan}
              onChange={(e) => setFilterNpiPtan(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
              placeholder={isCareHospice ? 'All PTAN' : 'All NPI'}
              InputProps={{
                endAdornment: (
                  <AdornmentBox position="end">
                    <FilterIconButton
                      size="small"
                      disabled={!filterNpiPtan}
                      onClick={() => applyFilters()}
                    >
                      <SearchIcon fontSize="small" color={filterNpiPtan ? 'primary' : 'action'} />
                    </FilterIconButton>
                  </AdornmentBox>
                ),
              }}
            />
          </FilterFormControl>
        }
        additionalFilterCount={filterNpiPtan ? 1 : 0}
      />
    </Box>
  );
};

export default FbRecoupScreen;
