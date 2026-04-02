import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { formatCurrency } from '@/utils/formatters';
import { format, startOfMonth, endOfMonth } from 'date-fns';

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

export const useReconciliation = () => {
  const [view, setView] = useState<ReconciliationStatus>('unreconciled');
  const [loading, setLoading] = useState(false);
  const [activeLocation, setActiveLocation] = useState('All');
  const [activeAge, setActiveAge] = useState<string | null>(null);
  const [headers, setHeaders] = useState<any[]>([]);

  // Real-time values in inputs
  const [searchFilters, setSearchFilters] = useState({
    payor: 'All',
    status: 'All',
    fromDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    transactionNo: '',
  });

  // Filters that are actually affecting the table
  const [appliedFilters, setAppliedFilters] = useState(searchFilters);

  const locations = ['AZ', 'CA', 'FL', 'MN', 'NC', 'OH', 'SC', 'TX', 'All'];
  const ageRanges = ['0-30', '31-60', '61-90', '>90'];

  // Simulate Backend Header Fetching
  useEffect(() => {
    const fetchHeaders = async () => {
      // setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      const newHeaders = [
        { id: 'actions', label: 'Actions', align: 'left', isAction: true },
        { id: 'transactionNo', label: 'Transaction NO', align: 'left', isLink: true },
        { id: 'transactionType', label: 'Transaction Type', align: 'left' },
        { id: 'batchOwner', label: 'Batch Owner', align: 'left' },
        { id: 'accountName', label: 'Account Name', align: 'left' },
        { id: 'payor', label: 'Payor', align: 'left' },
        { id: 'depositDate', label: 'Deposit Date', align: 'left' },
        { id: 'bankDeposit', label: 'Bank Deposit', align: 'right', isCurrency: true },
        { id: 'remittance', label: 'Remittance', align: 'right', isCurrency: true, highlightOnZero: true },
        { id: 'amd', label: 'AMD', align: 'right', isCurrency: true },
        { id: 'nextGenCore', label: 'NextGen Core', align: 'right', isCurrency: true },
        { id: 'nextGenPcsd', label: 'NextGen PCSD', align: 'right', isCurrency: true, highlightOnZero: true },
        { id: 'legacy', label: 'Legacy', align: 'right', isCurrency: true },
        { id: 'gl', label: 'GL', align: 'right', isCurrency: true },
        { id: 'unapplied', label: 'Unapplied', align: 'right', isCurrency: true },
        { id: 'variance', label: 'Variance', align: 'right', isCurrency: true },
        { id: 'status', label: 'Status', align: 'left', isStatus: true },
      ];
      if (view === 'reconciled') {
        newHeaders.splice(16, 0, { id: 'reconcileDate', label: 'Reconcile Date', align: 'left' });
      }
      setHeaders(newHeaders);
      setLoading(false);
    };

    fetchHeaders();
  }, [view]);

  // Mock Row Data
  const mockRows: ReconciliationRow[] = useMemo(() => [
    {
      id: '1',
      transactionNo: '08277549909',
      transactionType: 'EFT CREDIT',
      batchOwner: 'ICAN',
      accountName: 'MDL MD PC Deposits',
      payor: 'HEALTH NET COMMU',
      depositDate: '06/30/2025',
      bankDeposit: 819.72,
      remittance: 0,
      amd: 0,
      nextGenCore: 10,
      nextGenPcsd: 10,
      legacy: 0,
      gl: 0,
      unapplied: 0,
      variance: -819.72,
      status: 'Unreconciled',
      complexStatus: ['Remit missing', 'Post < Deposit', 'Age-276'],
      location: 'AZ',
      isEdited: true,
      comment: 'Check amount not matching'
    },
    {
      id: '2',
      transactionNo: 'W3272298...',
      transactionType: 'EFT CREDIT',
      batchOwner: 'ICAN',
      accountName: 'MDL MD PC Deposits',
      payor: 'UnitedHealthcare',
      depositDate: '06/30/2025',
      bankDeposit: 742.69,
      remittance: 0,
      amd: 0,
      nextGenCore: 10,
      nextGenPcsd: 0,
      legacy: 0,
      gl: 0,
      unapplied: 0,
      variance: -742.69,
      status: 'Unreconciled',
      complexStatus: ['Remit missing', 'Post < Deposit', 'Age-276'],
      location: 'CA',
      isEdited: false
    },
    {
      id: '3',
      transactionNo: 'T1122334...',
      transactionType: 'CHECK',
      batchOwner: 'RECON',
      accountName: 'MDL MD PC Deposits',
      payor: 'UnitedHealthcare',
      depositDate: '06/30/2025',
      bankDeposit: 744.25,
      remittance: 744.25,
      amd: 0,
      nextGenCore: 744.25,
      nextGenPcsd: 0,
      legacy: 0,
      gl: 0,
      unapplied: 0,
      variance: 0,
      status: 'Reconciled',
      complexStatus: ['Match', 'Age-30'],
      location: 'FL',
      reconcileDate: '06/26/2025'
    }
  ], []);

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

  const handleToggle = (newView: ReconciliationStatus) => {
    setView(newView);
  };

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      setAppliedFilters(searchFilters);
      setLoading(false);
    }, 200);
  };

  const handleGlobalTransactionSearch = (txNo: string) => {
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
  };

  return {
    view,
    loading,
    headerData: headers,
    filteredData,
    stats,
    handleToggle,
    locations,
    activeLocation,
    setActiveLocation,
    ageRanges,
    activeAge,
    setActiveAge,
    searchFilters,
    setSearchFilters,
    applyFilters,
    handleGlobalTransactionSearch,
  };
};
