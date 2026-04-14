import { MenuItem, MenuModule, SubMenuItem } from '@/store/api/userApi';
import { NAV_CONFIG, NavMetadata } from '@/config/navigation';

export interface DynamicTab {
    id: number;
    label: string;
    path: string;
    status: 'Active' | 'Hidden' | 'Disabled';
    component?: React.ComponentType<any>;
    subTabs?: DynamicTab[];
}

export interface NavigationStructure {
    sidebar: DynamicTab[];
    financialsTabs: DynamicTab[];
}

export const getNavigationStructure = (menus: MenuItem[]): NavigationStructure => {
    const sidebar: DynamicTab[] = [];
    let financialsTabs: DynamicTab[] = [];

    menus.forEach((menu, menuIdx) => {
        if (menu.status === 'Hidden') return;

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
                    const modConfig = NAV_CONFIG[mod.menuName] || { path: `${config.path}/${mod.menuName.toLowerCase().replace(/\s+/g, '-')}` };
                    
                    let subTabs: DynamicTab[] = mod.subModules 
                        ? mod.subModules
                            .filter(sub => sub.status !== 'Hidden')
                            .map((sub, subIdx) => {
                                const subConfig = NAV_CONFIG[sub.menuName] || { path: `${modConfig.path}/${sub.menuName.toLowerCase().replace(/\s+/g, '-')}` };
                                return {
                                    id: subIdx,
                                    label: sub.menuName,
                                    path: subConfig.path,
                                    status: sub.status,
                                    component: subConfig.component,
                                };
                            })
                        : [];

                    // Fallback for Trends & Forecast if sub-modules are missing
                    if (subTabs.length === 0 && mod.menuName === 'Trends & Forecast') {
                      subTabs = [
                        { id: 0, label: 'Forecast Trends', path: '/financials/trends-forecast/forecast', status: 'Active', component: modConfig.component },
                        { id: 1, label: 'Executive Summary', path: '/financials/trends-forecast/summary', status: 'Active', component: modConfig.component },
                        { id: 2, label: 'Payer Performance', path: '/financials/trends-forecast/payer-performance', status: 'Active', component: modConfig.component },
                      ];
                    }

                    // Fallback for Variance Analysis if sub-modules are missing
                    if (subTabs.length === 0 && mod.menuName === 'Variance Analysis') {
                      subTabs = [
                        { id: 0, label: 'Fee Schedule Variance', path: '/financials/variance-analysis/fee-schedule', status: 'Active', component: modConfig.component },
                        { id: 1, label: 'Payment Variance', path: '/financials/variance-analysis/payment', status: 'Active', component: modConfig.component },
                      ];
                    }

                    // Fallback for Statements if sub-modules are missing
                    if (subTabs.length === 0 && mod.menuName === 'Statements') {
                      subTabs = [
                        { id: 0, label: 'PIP', path: '/financials/statements/pip', status: 'Active', component: modConfig.component },
                        { id: 1, label: 'Forward Balances', path: '/financials/statements/forward-balance', status: 'Active', component: modConfig.component },
                        { id: 2, label: 'Suspense Accounts', path: '/financials/statements/suspense-accounts', status: 'Active', component: modConfig.component },
                      ];
                    }

                    return {
                        id: modIdx,
                        label: mod.menuName,
                        path: modConfig.path,
                        status: mod.status,
                        component: modConfig.component,
                        subTabs: subTabs.length > 0 ? subTabs : undefined,
                    };
                });
        }
    });

    return { sidebar, financialsTabs };
};
