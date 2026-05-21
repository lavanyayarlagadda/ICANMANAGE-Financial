export interface TableQueryParams {
    page: number;
    size: number;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    fromDate: string;
    toDate: string;
    status?: string | null;
    category?: string | null;
    type?: string | null;
    payer?: string | null;
    payerName?: string | null;
    sourceProvider?: string | null;
    transactionNo?: string | null;
    payerIds?: string | number | null;
}

export interface DateRangeParams {
    fromDate: string;
    toDate: string;
    icanManageId?: string | number;
}

// /** Matches backend DepositReconTrendsQueryDto query params. */
// export interface DepositReconTrendsQueryParams extends DateRangeParams {
//     trailingWindowMonths?: number;
//     forecastMonths?: number;
//     compare?: string;
//     globalFromDate?: string;
//     globalToDate?: string;
//     asOfDate?: string;
// }

// export type DepositReconAgingQueryParams = DateRangeParams;

export interface DynamicColumn {
    displayName: string;
    active?: boolean;
    orderId?: number;
    fkConfigurableFieldsId?: number | null;
    fkHospitalId?: number | null;
}

export interface MappedHeadersResponse {
    data: DynamicColumn[];
    message: string | null;
}

export interface BrandTab {
    fkHospitalMasterId: number;
    hospitalAbbr: string;
    hospitalName: string;
    active?: boolean;
    orderId?: number;
}

export interface DynamicTabsResponse {
    data: BrandTab[];
    message: string | null;
}

export interface MappedHeadersParams {
    hospitalId: number;
    pageName: string;
}

export interface UserMappedBrandsParams {
    icanManageId: string | number;
    facilityMasterId: number;
}
