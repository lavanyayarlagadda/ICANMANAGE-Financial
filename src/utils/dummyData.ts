export type MenuStatus = 'Active' | 'Hidden' | 'Disabled';

export interface MenuAccess {
    menuName: string;
    status: MenuStatus;
    subModules?: MenuAccess[];
}

const adminMenus: MenuAccess[] = [
    { menuName: 'Collections', status: 'Active' },
    {
        menuName: 'Financials',
        status: 'Active',
        subModules: [
            { menuName: 'All Transactions', status: 'Active' },
            { menuName: 'Payments', status: 'Disabled' },
            { menuName: 'PIP', status: 'Active' },
            { menuName: 'Forward Balances', status: 'Active' },
            { menuName: 'Recoupments', status: 'Active' },
            { menuName: 'Other Adjustments', status: 'Active' },
            { menuName: 'Variance Analysis', status: 'Active' },
            { menuName: 'Trends & Forecast', status: 'Active' },
        ]
    }
];

const managerMenus: MenuAccess[] = [
    { menuName: 'Collections', status: 'Disabled' },
    {
        menuName: 'Financials',
        status: 'Active',
        subModules: [
            { menuName: 'All Transactions', status: 'Active' },
            { menuName: 'Payments', status: 'Active' },
            { menuName: 'PIP', status: 'Disabled' },
            { menuName: 'Forward Balances', status: 'Hidden' },
            { menuName: 'Recoupments', status: 'Active' },
            { menuName: 'Other Adjustments', status: 'Hidden' },
            { menuName: 'Variance Analysis', status: 'Active' },
            { menuName: 'Trends & Forecast', status: 'Disabled' },
        ]
    }
];

const userMenus: MenuAccess[] = [
    { menuName: 'Collections', status: 'Hidden' },
    {
        menuName: 'Financials',
        status: 'Active',
        subModules: [
            { menuName: 'All Transactions', status: 'Active' },
            { menuName: 'Payments', status: 'Active' },
            { menuName: 'PIP', status: 'Hidden' },
            { menuName: 'Forward Balances', status: 'Hidden' },
            { menuName: 'Recoupments', status: 'Hidden' },
            { menuName: 'Other Adjustments', status: 'Hidden' },
            { menuName: 'Variance Analysis', status: 'Hidden' },
            { menuName: 'Trends & Forecast', status: 'Hidden' },
        ]
    }
];

export const MOCK_CREDENTIALS = [
    { username: 'ajohnson', password: 'password123', userId: '1' },
    { username: 'jsmith', password: 'password123', userId: '2' },
    { username: 'demo', password: 'demo', userId: '3' },
];

export const LOGIN_API_RESPONSE = [
    {
        id: '1', username: 'ajohnson', email: 'alice.johnson@icanrcm.com', firstName: 'Alice', lastName: 'Johnson', company: 'Care Hospice Inc', roleId: '1', role: 'admin',
    },
    {
        id: '2', username: 'jsmith', email: 'jsmith@icanrcm.com', firstName: 'John', lastName: 'Smith', company: 'Care Hospice Inc', roleId: '2', role: 'manager',
    },
    {
        id: '3', username: 'demo', email: 'demo@icanrcm.com', firstName: 'Demo', lastName: 'User', company: 'Care Hospice Inc', roleId: '3', role: 'user',
    },
];

export const USER_DETAILS_API_RESPONSE = [
    {
        userId: '1',
        accessibleModules: ['Collections', 'Financials', 'All Transactions', 'Payments', 'PIP', 'Forward Balances', 'Recoupments', 'Other Adjustments', 'Variance Analysis', 'Trends & Forecast'],
        menus: adminMenus,
        defaultLandingPage: 'Financials',
        inactivityTimeout: '15',
        passwordPolicy: '30 Days'
    },
    {
        userId: '2',
        accessibleModules: ['Financials', 'All Transactions', 'Payments', 'Recoupments', 'Variance Analysis'],
        menus: managerMenus,
        defaultLandingPage: 'Financials',
        inactivityTimeout: '30',
        passwordPolicy: '60 Days'
    },
    {
        userId: '3',
        accessibleModules: ['Financials', 'All Transactions', 'Payments'],
        menus: userMenus,
        defaultLandingPage: 'Financials',
        inactivityTimeout: '60',
        passwordPolicy: 'Never'
    },
];
