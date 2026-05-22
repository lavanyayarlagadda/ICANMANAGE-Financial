import { MenuItem } from '@/store/api/userApi';
import { NAV_CONFIG } from '@/config/navigation';

export interface DynamicTab {
    id: number;
    label: string;
    path: string;
    status: 'Active' | 'Hidden' | 'Disabled';
    component?: React.ComponentType<Record<string, unknown>>;
    subTabs?: DynamicTab[];
}

export interface NavigationStructure {
    sidebar: DynamicTab[];
    financialsTabs: DynamicTab[];
}

export const getNavigationStructure = (
    menus: MenuItem[],
    accessibleModules: string[] = [],
    selectedTenantId?: string | null
): NavigationStructure => {
    const sidebar: DynamicTab[] = [];
    let financialsTabs: DynamicTab[] = [];

    const isAccessible = (name: string) => {
        if (!accessibleModules) return true;
        if (accessibleModules.length === 0) return false;
        return accessibleModules.some(m => m.toLowerCase() === name.toLowerCase());
    };

    menus.forEach((menu, menuIdx) => {
        if (menu.status === 'Hidden') return;
        if (!isAccessible(menu.menuName)) {
            // Check if any module inside is accessible (for groups like Financials)
            const hasAccessibleModule = menu.modules?.some(mod =>
                isAccessible(mod.menuName) ||
                mod.subModules?.some(sub => isAccessible(sub.menuName))
            );
            if (!hasAccessibleModule) return;
        }

        const config = NAV_CONFIG[menu.menuName] || { path: `/${menu.menuName.toLowerCase().replace(/\s+/g, '-')}` };

        const mainNavItem: DynamicTab = {
            id: menuIdx,
            label: menu.menuName,
            path: config.path,
            status: menu.status,
            component: config.component,
        };

        sidebar.push(mainNavItem);

        if (menu.menuName === 'Financials' && menu.modules) {
            financialsTabs = menu.modules
                .filter(mod => mod.status !== 'Hidden')
                .map((mod, modIdx) => {
                    const modName = mod.menuName;
                    const modConfig = NAV_CONFIG[modName] || { path: `${config.path}/${mod.menuName.toLowerCase().replace(/\s+/g, '-')}` };

                    let subTabs: DynamicTab[] = mod.subModules
                        ? mod.subModules
                            .filter(sub => sub.status !== 'Hidden' && isAccessible(sub.menuName))
                            .map((sub, subIdx): DynamicTab => {
                                const subName = sub.menuName;
                                const subConfig = NAV_CONFIG[subName] || { path: `${modConfig.path}/${sub.menuName.toLowerCase().replace(/\s+/g, '-')}` };
                                return {
                                    id: subIdx,
                                    label: subName,
                                    path: subConfig.path,
                                    status: sub.status as 'Active' | 'Hidden' | 'Disabled',
                                    component: subConfig.component,
                                };
                            })
                        : [];

                    const isTrendsForecastModule =
                        modConfig.path.toLowerCase().includes('/trends-forecast') ||
                        mod.menuName.toLowerCase().includes('trend') ||
                        subTabs.some(st => st.path.toLowerCase().includes('/trends-forecast'));

                    // Fallback for Trends & Forecast if sub-modules are missing
                    if (subTabs.length === 0 && isTrendsForecastModule) {
                        const depositReconConfig = NAV_CONFIG['Deposit Reconciliation'] || { path: '/financials/trends-forecast/forecast/deposit-reconciliation' };
                        const depositReconciliationPath = '/financials/trends-forecast/forecast/deposit-reconciliation';
                        const fallbacks: DynamicTab[] = [
                            { id: 0, label: 'Forecast Trends', path: '/financials/trends-forecast/forecast', status: 'Active', component: modConfig.component },
                            { id: 1, label: 'Executive Summary', path: '/financials/trends-forecast/summary', status: 'Active', component: modConfig.component },
                            { id: 2, label: 'Deposit Reconciliation', path: depositReconciliationPath, status: 'Active', component: depositReconConfig.component || modConfig.component },
                            { id: 3, label: 'Payer Performance', path: '/financials/trends-forecast/payer-performance', status: 'Active', component: modConfig.component },
                        ];
                        subTabs = fallbacks.filter(f => isAccessible(f.label) || isAccessible('Trends & Forecast'));
                    }

                    // Ensure sub-tabs are properly indexed.
                    if (isTrendsForecastModule) {
                        subTabs = subTabs.map((st, idx) => ({ ...st, id: idx }));
                    }

                    // Fallback for Variance Analysis if sub-modules are missing
                    if (subTabs.length === 0 && mod.menuName === 'Variance Analysis') {
                        const fallbacks: DynamicTab[] = [
                            { id: 0, label: 'Fee Schedule Variance', path: '/financials/variance-analysis/fee-schedule', status: 'Active', component: modConfig.component },
                            { id: 1, label: 'Payment Variance', path: '/financials/variance-analysis/payment', status: 'Active', component: modConfig.component },
                        ];
                        subTabs = fallbacks.filter(f => isAccessible(f.label));
                    }

                    // Fallback for Statements if sub-modules are missing
                    if (subTabs.length === 0 && mod.menuName === 'Statements') {
                        const fallbacks: DynamicTab[] = [
                            { id: 0, label: 'PIP', path: '/financials/statements/pip', status: 'Active', component: NAV_CONFIG['PIP']?.component },
                            { id: 1, label: 'Forward Balances', path: '/financials/statements/forward-balance', status: 'Active', component: NAV_CONFIG['Forward Balances']?.component },
                            { id: 2, label: 'Suspense Accounts', path: '/financials/statements/suspense-accounts', status: 'Active', component: NAV_CONFIG['Suspense Accounts']?.component },
                        ];
                        subTabs = fallbacks.filter(f => isAccessible(f.label));
                    }

                    // Append FB & Recoup to Statements subtabs if Forward Balances is accessible
                    const hasForwardBalances = subTabs.some(st => st.label === 'Forward Balances') || isAccessible('Forward Balances');
                    if (hasForwardBalances && mod.menuName === 'Statements') {
                        if (!subTabs.some(st => st.label === 'FB & Recoup')) {
                            subTabs.push({
                                id: subTabs.length,
                                label: 'FB & Recoup',
                                path: NAV_CONFIG['FB & Recoup']?.path || '/financials/statements/fb&recoup',
                                status: 'Active',
                                component: NAV_CONFIG['FB & Recoup']?.component,
                            });
                        }
                    }

                    if (mod.menuName === 'Statements') {
                        subTabs = subTabs.map((st, idx) => ({ ...st, id: idx }));
                    }

                    // Append FB & Recoup to All Transactions subtabs if Forward Balances is accessible
                    if (hasForwardBalances && mod.menuName === 'All Transactions') {
                        if (!subTabs.some(st => st.label === 'FB & Recoup')) {
                            subTabs = [
                                {
                                    id: 0,
                                    label: 'All Transactions',
                                    path: '/financials/all-transactions',
                                    status: 'Active',
                                    component: NAV_CONFIG['All Transactions']?.component,
                                },
                                {
                                    id: 1,
                                    label: 'FB & Recoup',
                                    path: NAV_CONFIG['FB & Recoup Transactions']?.path || '/financials/transactions/fb&recoup',
                                    status: 'Active',
                                    component: NAV_CONFIG['FB & Recoup Transactions']?.component,
                                }
                            ];
                        }
                    }

                    // Only return the module if it's explicitly accessible OR has accessible sub-tabs
                    if (isAccessible(mod.menuName) || subTabs.length > 0) {
                        const result: DynamicTab = {
                            id: modIdx,
                            label: modName,
                            path: modConfig.path,
                            status: mod.status as 'Active' | 'Hidden' | 'Disabled',
                            component: modConfig.component,
                            subTabs: subTabs.length > 0 ? subTabs : undefined,
                        };
                        return result;
                    }
                    return null;
                })
                .filter((mod): mod is DynamicTab => mod !== null);
        }
    });

    return { sidebar, financialsTabs };
};
