export enum ReconStatus {
    MATCHED = 'Matched',
    RECONCILED = 'Reconciled',
    EXCEPTION = 'Exception',
    NOT_MATCHED = 'Not Matched',
}

export enum SystemStatus {
    CRITICAL = 'Critical',
    IMPROVING = 'Improving',
    STABLE = 'Stable',
}

export const RECON_STATUS_LABELS = {
    [ReconStatus.MATCHED]: 'Matched',
    [ReconStatus.RECONCILED]: 'Reconciled',
    [ReconStatus.EXCEPTION]: 'Exception',
} as const;
