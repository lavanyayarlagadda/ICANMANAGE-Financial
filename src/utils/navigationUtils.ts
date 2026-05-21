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
    const isCareHospiceTenant = (): boolean => {
        const tenantId = (
            selectedTenantId ||
            localStorage.getItem('ican_selected_tenant') ||
            ''
        ).trim().toLowerCase();
        return tenantId === 'carehospice';
    };

    const getDepositReconStatus = (): 'Active' | 'Hidden' | 'Disabled' => {
        const selectedUserId = localStorage.getItem('ican_demo_security_selected_user') || '';
        const key = `ican_deposit_reconciliation_status_${selectedUserId}`;
        const saved = localStorage.getItem(key) || localStorage.getItem('ican_deposit_reconciliation_status_');
        if (saved === 'Hidden' || saved === 'Disabled' || saved === 'Active') return saved;
        return 'Active';
    };

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

                    // Ensure Deposit Reconciliation is visible for Trends & Forecast.
                    if (isTrendsForecastModule) {
                        const isCareHospice = isCareHospiceTenant();
                        const depositReconConfig = NAV_CONFIG['Deposit Reconciliation'] || { path: '/financials/trends-forecast/forecast/deposit-reconciliation' };
                        const depositReconciliationPath = '/financials/trends-forecast/forecast/deposit-reconciliation';
                        const depositReconStatus = getDepositReconStatus();
                        const hasDepositReconciliation = subTabs.some(st => st.label === 'Deposit Reconciliation');

                        if (!hasDepositReconciliation && depositReconStatus !== 'Disabled' && isCareHospice) {
                            const executiveSummaryIndex = subTabs.findIndex(st => st.label === 'Executive Summary');
                            const newTab: DynamicTab = {
                                id: -1,
                                label: 'Deposit Reconciliation',
                                path: depositReconciliationPath,
                                status: depositReconStatus,
                                component: depositReconConfig.component || modConfig.component,
                            };

                            const nextSubTabs = [...subTabs];
                            if (executiveSummaryIndex >= 0) {
                                nextSubTabs.splice(executiveSummaryIndex + 1, 0, newTab);
                            } else {
                                nextSubTabs.push(newTab);
                            }

                            subTabs = nextSubTabs;
                        }

                        if (!isCareHospice && hasDepositReconciliation) {
                            subTabs = subTabs.filter(st => st.label !== 'Deposit Reconciliation');
                        } else if (hasDepositReconciliation) {
                            if (depositReconStatus === 'Disabled') {
                                subTabs = subTabs.filter(st => st.label !== 'Deposit Reconciliation');
                            } else {
                                subTabs = subTabs.map(st =>
                                    st.label === 'Deposit Reconciliation' ? { ...st, status: depositReconStatus } : st
                                );
                            }
                        }

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
                            { id: 0, label: 'PIP', path: '/financials/statements/pip', status: 'Active', component: modConfig.component },
                            { id: 1, label: 'Forward Balances', path: '/financials/statements/forward-balance', status: 'Active', component: modConfig.component },
                            { id: 2, label: 'Suspense Accounts', path: '/financials/statements/suspense-accounts', status: 'Active', component: modConfig.component },
                        ];
                        subTabs = fallbacks.filter(f => isAccessible(f.label));
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
