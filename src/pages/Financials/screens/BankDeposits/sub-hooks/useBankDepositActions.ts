import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveExportType } from '@/store/slices/uiSlice';
import { useLazyExportBankDepositsQuery } from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { formatDateForFilename } from '@/utils/formatters';
import { EXPORT_FORMATS, DEFAULT_CLIENT_NAME } from '@/constants/common';

interface ActionParams {
    queryParams: { fromDate: string; toDate: string };
    userId: string;
    selectedTenant: { displayName?: string } | undefined;
    selectedEntityId: string;
    refetch: () => void;
}

export const useBankDepositActions = ({ queryParams, userId, selectedTenant, selectedEntityId, refetch }: ActionParams) => {
    const dispatch = useAppDispatch();
    const { actionTriggers } = useAppSelector(s => s.ui);
    const exportCount = useRef(actionTriggers.export);
    const printCount = useRef(actionTriggers.print);
    const reloadCount = useRef(actionTriggers.reload);

    const [triggerExport] = useLazyExportBankDepositsQuery();

    const handleExport = useCallback(async (formatType: typeof EXPORT_FORMATS.PDF | typeof EXPORT_FORMATS.XLSX) => {
        try {
            dispatch(setActiveExportType(formatType));
            const result = await triggerExport({
                startDate: queryParams.fromDate,
                endDate: queryParams.toDate,
                icanManageId: Number(userId),
                clientName: selectedTenant?.displayName?.toLowerCase() || DEFAULT_CLIENT_NAME,
                hospitalId: selectedEntityId === 'all' ? 0 : Number(selectedEntityId),
            }).unwrap();

            if (result !== undefined) {
                downloadFileFromBlob(
                    result,
                    `Bank_Deposits_Report_${formatDateForFilename(queryParams.fromDate)}_to_${formatDateForFilename(queryParams.toDate)}.${formatType}`
                );
            }
        } catch (err) {
            console.error('Bank Deposits Export failed:', err);
        } finally {
            dispatch(setActiveExportType(null));
        }
    }, [dispatch, queryParams.fromDate, queryParams.toDate, userId, selectedTenant, triggerExport, selectedEntityId]);

    useEffect(() => {
        if (actionTriggers.export > exportCount.current) {
            handleExport(EXPORT_FORMATS.XLSX);
            exportCount.current = actionTriggers.export;
        }
    }, [actionTriggers.export, handleExport]);

    useEffect(() => {
        if (actionTriggers.print > printCount.current) {
            handleExport(EXPORT_FORMATS.PDF);
            printCount.current = actionTriggers.print;
        }
    }, [actionTriggers.print, handleExport]);

    useEffect(() => {
        if (actionTriggers.reload > reloadCount.current) {
            refetch();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, refetch]);

    return {
        handleExport
    };
};
