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
                    
                    const subTabs: DynamicTab[] = mod.subModules 
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
