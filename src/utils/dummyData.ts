export type MenuStatus = 'Active' | 'Hidden' | 'Disabled';

export interface MenuAccess {
    menuName: string;
    status: MenuStatus;
}

const adminMenus: MenuAccess[] = [
    { menuName: 'Collections', status: 'Active' },
        { menuName: 'Financials', status: 'Active' },

    { menuName: 'All Transactions', status: 'Active' },
    { menuName: 'Payments', status: 'Disabled' },
    { menuName: 'PIP', status: 'Active' },
    { menuName: 'Forward Balances', status: 'Active' },
    { menuName: 'Recoupments', status: 'Active' },
    { menuName: 'Other Adjustments', status: 'Active' },
    { menuName: 'Variance Analysis', status: 'Active' },
    { menuName: 'Trends & Forecast', status: 'Active' },
];

const managerMenus: MenuAccess[] = [
    { menuName: 'Collections', status: 'Disabled' },
        { menuName: 'Financials', status: 'Active' },

    { menuName: 'All Transactions', status: 'Active' },
    { menuName: 'Payments', status: 'Active' },
    { menuName: 'PIP', status: 'Disabled' },
    { menuName: 'Forward Balances', status: 'Hidden' },
    { menuName: 'Recoupments', status: 'Active' },
    { menuName: 'Other Adjustments', status: 'Hidden' },
    { menuName: 'Variance Analysis', status: 'Active' },
    { menuName: 'Trends & Forecast', status: 'Disabled' },
];

const userMenus: MenuAccess[] = [

    { menuName: 'Collections', status: 'Hidden' },
    { menuName: 'Financials', status: 'Active' },
    { menuName: 'All Transactions', status: 'Active' },
    { menuName: 'Payments', status: 'Active' },
    { menuName: 'PIP', status: 'Hidden' },
    { menuName: 'Forward Balances', status: 'Hidden' },
    { menuName: 'Recoupments', status: 'Hidden' },
    { menuName: 'Other Adjustments', status: 'Hidden' },
    { menuName: 'Variance Analysis', status: 'Hidden' },
    { menuName: 'Trends & Forecast', status: 'Hidden' },
];

export const DUMMY_USERS = [
    {
        id: '1', username: 'ajohnson', password: 'password123', email: 'alice.johnson@icanrcm.com', firstName: 'Alice', lastName: 'Johnson', company: 'Care Hospice Inc', role: 'admin',
        accessibleModules: ['Collections', 'Financials', 'All Transactions', 'Payments', 'PIP', 'Forward Balances', 'Recoupments', 'Other Adjustments', 'Variance Analysis', 'Trends & Forecast'],
        menus: adminMenus,
        defaultLandingPage: 'Financials'
    },
    {
        id: '2', username: 'jsmith', password: 'password123', email: 'jsmith@icanrcm.com', firstName: 'John', lastName: 'Smith', company: 'Care Hospice Inc', role: 'manager',
        accessibleModules: ['Financials', 'All Transactions', 'Payments', 'Recoupments', 'Variance Analysis'],
        menus: managerMenus,
        defaultLandingPage: 'Financials'
    },
    {
        id: '3', username: 'demo', password: 'demo', email: 'demo@icanrcm.com', firstName: 'Demo', lastName: 'User', company: 'Care Hospice Inc', role: 'user',
        accessibleModules: ['Financials', 'All Transactions', 'Payments'],
        menus: userMenus,
        defaultLandingPage: 'Financials'
    },
];
