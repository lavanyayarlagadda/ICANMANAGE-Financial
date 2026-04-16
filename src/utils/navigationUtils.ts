import { MenuItem, MenuModule, SubMenuItem } from '@/store/api/userApi';
import { NAV_CONFIG, NavMetadata } from '@/config/navigation';

export interface DynamicTab {
    id: number;
    label: string;
    path: string;
    status: 'Active' | 'Hidden' | 'Disabled';
    component?: React.ComponentType;
    subTabs?: DynamicTab[];
}

export interface NavigationStructure {
    sidebar: DynamicTab[];
    financialsTabs: DynamicTab[];
}

export const getNavigationStructure = (menus: MenuItem[], accessibleModules: string[] = []): NavigationStructure => {
    const sidebar: DynamicTab[] = [];
    let financialsTabs: DynamicTab[] = [];

    const isAccessible = (name: string) => {
        if (!accessibleModules || accessibleModules.length === 0) return true;
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
                    const modConfig = NAV_CONFIG[mod.menuName] || { path: `${config.path}/${mod.menuName.toLowerCase().replace(/\s+/g, '-')}` };
                    
                    let subTabs: DynamicTab[] = mod.subModules 
                        ? mod.subModules
                            .filter(sub => sub.status !== 'Hidden' && isAccessible(sub.menuName))
                            .map((sub, subIdx): DynamicTab => {
                                const subConfig = NAV_CONFIG[sub.menuName] || { path: `${modConfig.path}/${sub.menuName.toLowerCase().replace(/\s+/g, '-')}` };
                                return {
                                    id: subIdx,
                                    label: sub.menuName,
                                    path: subConfig.path,
                                    status: sub.status as 'Active' | 'Hidden' | 'Disabled',
                                    component: subConfig.component,
                                };
                            })
                        : [];

                    // Fallback for Trends & Forecast if sub-modules are missing
                    if (subTabs.length === 0 && mod.menuName === 'Trends & Forecast') {
                      const fallbacks: DynamicTab[] = [
                        { id: 0, label: 'Forecast Trends', path: '/financials/trends-forecast/forecast', status: 'Active', component: modConfig.component },
                        { id: 1, label: 'Executive Summary', path: '/financials/trends-forecast/summary', status: 'Active', component: modConfig.component },
                        { id: 2, label: 'Payer Performance', path: '/financials/trends-forecast/payer-performance', status: 'Active', component: modConfig.component },
                      ];
                      subTabs = fallbacks.filter(f => isAccessible(f.label));
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
                            label: mod.menuName,
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
