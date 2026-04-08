import { useState, useMemo, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { RECONCILIATION_DUMMY_DATA } from './ReconciliationDummyData';

export type ReconciliationStatus = 'unreconciled' | 'reconciled' | 'my-queue';

export interface ReconciliationRow {
  id: string;
  transactionNo: string;
  transactionType: string;
  batchOwner: string;
  accountName: string;
  payor: string;
  depositDate: string;
  bankDeposit: number;
  remittance: number;
  amd: number;
  nextGenCore: number;
  nextGenPcsd: number;
  legacy: number;
  gl: number;
  unapplied: number;
  variance: number;
  status: string;
  complexStatus: string[];
  location: string;
  isEdited?: boolean;
  comment?: string;
  reconcileDate?: string;
}

export interface HeaderConfig {
  id: keyof ReconciliationRow | 'actions';
  label: string;
  align: 'left' | 'right' | 'center';
  isAction?: boolean;
  isLink?: boolean;
  isCurrency?: boolean;
  highlightOnZero?: boolean;
  filterOptions?: string[];
}

export interface FilterState {
  payor: string;
  status: string;
  fromDate: string;
  toDate: string;
  transactionNo: string;
}

const LOCATIONS = ['AZ', 'CA', 'FL', 'MN', 'NC', 'OH', 'SC', 'TX', 'All'];
const AGE_RANGES = ['0-30', '31-60', '61-90', '>90'];

export const useReconciliation = () => {
  const [view, setView] = useState<ReconciliationStatus>('unreconciled');
  const [loading, setLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState('All');
  const [activeAge, setActiveAge] = useState<string | null>(null);
  const [headers, setHeaders] = useState<HeaderConfig[]>([]);

  // Real-time values in inputs
  const [searchFilters, setSearchFilters] = useState<FilterState>({
    payor: 'All',
    status: 'All',
    fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    transactionNo: '',
  });

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 10,
    sortField: 'effectiveDate',
    sortOrder: 'desc' as 'asc' | 'desc',
    fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Filters that are actually affecting the table
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(searchFilters);

  // Mock Row Data
  const mockRows: ReconciliationRow[] = useMemo(() => RECONCILIATION_DUMMY_DATA, []);

  // Simulate Backend Header Fetching
  useEffect(() => {
    const fetchHeaders = async () => {
      // setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      const newHeaders: HeaderConfig[] = [
        { id: 'actions', label: 'Actions', align: 'left', isAction: true },
        { id: 'transactionNo', label: 'Transaction NO', align: 'left', isLink: true },
        { id: 'location', label: 'Loc/State', align: 'left', filterOptions: ['AZ', 'CA', 'FL', 'MN', 'NC', 'OH', 'SC', 'TX'] },
        { id: 'transactionType', label: 'Type', align: 'left', filterOptions: ['PAYMENT', 'ADJUSTMENT'] },
        { id: 'batchOwner', label: 'Batch Owner', align: 'left', filterOptions: ['ICAN', 'ADMIN', 'SYSTEM'] },
        { id: 'accountName', label: 'Account Name', align: 'left', filterOptions: ['Operating', 'Trust', 'Reserve'] },
        { id: 'payor', label: 'Payor', align: 'left', filterOptions: ['UnitedHealthcare', 'Aetna', 'Cigna', 'Medicare'] },
        { id: 'complexStatus', label: 'Aging', align: 'left', filterOptions: ['0-30', '31-60', '61-90', '>90'] },
        { id: 'depositDate', label: 'Deposit Date', align: 'left' },
        { id: 'bankDeposit', label: 'Bank Deposit', align: 'right', isCurrency: true },
        { id: 'remittance', label: 'Remittance', align: 'right', isCurrency: true, highlightOnZero: true },
        { id: 'amd', label: 'AMD', align: 'right', isCurrency: true },
        { id: 'nextGenCore', label: 'NextGen Core', align: 'right', isCurrency: true },
        { id: 'nextGenPcsd', label: 'NextGen PCSD', align: 'right', isCurrency: true, highlightOnZero: true },
        { id: 'legacy', label: 'Legacy', align: 'right', isCurrency: true },
        { id: 'gl', label: 'GL', align: 'right', isCurrency: true },
        { id: 'unapplied', label: 'Unapplied', align: 'right', isCurrency: true },
      ];

      if (view === 'reconciled') {
        newHeaders.push({ id: 'reconcileDate', label: 'Reconcile Date', align: 'left' });
      }

      if (view === 'unreconciled') {
        newHeaders.push({ id: 'variance', label: 'Variance', align: 'right', isCurrency: true });
        newHeaders.push({ id: 'status', label: 'Status', align: 'left', filterOptions: ['Done', 'Pending', 'In Progress'] });
      }

      setHeaders(newHeaders);
      setLoading(false);
    };

    fetchHeaders();
  }, [view]);

  const handleRangeChange = useCallback((range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setQueryParams(prev => ({ ...prev, fromDate: from, toDate: to, page: 0 }));
    }
  }, []);

  const filteredData = useMemo(() => {
    return mockRows.filter(row => {
      const statusMatch = view === 'my-queue' ? (row.batchOwner === 'ICAN') : row.status.toLowerCase() === view;
      const locationMatch = activeLocation === 'All' || row.location === activeLocation;
      const searchMatch = !appliedFilters.transactionNo || row.transactionNo.toLowerCase().includes(appliedFilters.transactionNo.toLowerCase());
      const payorMatch = appliedFilters.payor === 'All' || row.payor.includes(appliedFilters.payor);
      const ageMatch = !activeAge || row.complexStatus.some(s => s.includes(activeAge));

      // Date matching (if applicable)
      const rowDate = new Date(row.depositDate);
      const from = new Date(appliedFilters.fromDate);
      const to = new Date(appliedFilters.toDate);
      const dateMatch = rowDate >= from && rowDate <= to;

      return statusMatch && locationMatch && searchMatch && payorMatch && ageMatch && dateMatch;
    });
  }, [mockRows, view, activeLocation, appliedFilters, activeAge]);

  const stats = useMemo(() => {
    return {
      bankDeposit: filteredData.reduce((sum, r) => sum + r.bankDeposit, 0),
      remittance: filteredData.reduce((sum, r) => sum + r.remittance, 0),
      cashPosting: filteredData.reduce((sum, r) => sum + (r.nextGenCore + r.nextGenPcsd + r.legacy), 0),
      payVariance: filteredData.reduce((sum, r) => sum + r.variance, 0),
      postVariance: filteredData.reduce((sum, r) => sum + Math.abs(r.bankDeposit - (r.nextGenCore + r.nextGenPcsd)), 0),
      reconciliationRate: 98.4,
    };
  }, [filteredData]);

  const handleToggle = useCallback((newView: ReconciliationStatus) => {
    setView(newView);
  }, []);

  const applyFilters = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setAppliedFilters(searchFilters);
      setLoading(false);
    }, 200);
  }, [searchFilters]);

  const handleGlobalTransactionSearch = useCallback((txNo: string) => {
    setLoading(true);
    setTimeout(() => {
      // Find the record in ALL data
      const record = mockRows.find(r => r.transactionNo.toLowerCase().includes(txNo.toLowerCase()));
      if (record) {
        // Determine which tab it belongs to
        let targetView: ReconciliationStatus = record.status.toLowerCase() as ReconciliationStatus;
        if (record.batchOwner === 'ICAN') targetView = 'my-queue';

        setView(targetView);
        setSearchFilters(prev => ({ ...prev, transactionNo: txNo }));
        setAppliedFilters({ ...searchFilters, transactionNo: txNo });
      } else {
        alert('Transaction not found across any tabs.');
      }
      setLoading(false);
    }, 300);
  }, [mockRows, searchFilters]);

  return {
    view,
    loading,
    headerData: headers,
    filteredData,
    stats,
    handleToggle,
    locations: LOCATIONS,
    activeLocation,
    setActiveLocation,
    ageRanges: AGE_RANGES,
    activeAge,
    setActiveAge,
    searchFilters,
    setSearchFilters,
    handleRangeChange,
    applyFilters,
    handleGlobalTransactionSearch,
  };
};
