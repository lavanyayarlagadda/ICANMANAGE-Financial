import { User } from '@/store/slices/authSlice';

export const STATIC_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNTYiLCJ0ZW5hbnRzIjpbXSwicm9sZXMiOlsiQWRtaW4iXSwiY29tcGFueSI6IkNvZ25pdGl2ZUhlYWx0aElUIiwiZXhwIjoxNzc0NjI0Mjc0LCJpYXQiOjE3NzQ2MjA2NzQsImVtYWlsIjoiYXZpbmFzaEBjb2duaXRpdmUuY29tIn0.a9-B5-MOLyzQxOsSI6bqN_WqHFpWyM8HCfQ34kE2mDM'
export const STATIC_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNTYiLCJ0ZW5hbnRzIjpbXSwibGFzdE5hbWUiOiJSZWRkeSIsInJvbGUiOiJBZG1pbiIsInJvbGVJZCI6IjE1OSIsInJvbGVzIjpbIkFkbWluIl0sInR5cGUiOiJyZWZyZXNoIiwiZmlyc3ROYW1lIjoiQXZpbmFzaCIsImNvbXBhbnkiOiJDb2duaXRpdmVIZWFsdGhJVCIsImV4cCI6MTc3NTE5ODcwNSwiaWF0IjoxNzc0NTkzOTA1LCJlbWFpbCI6ImF2aW5hc2hAY29nbml0aXZlLmNvbSIsInVzZXJuYW1lIjoiYXZpbmFzaEBjb2duaXRpdmUuY29tIn0.DyX8I3jvM9k3Ix7hWAF5-Q1m23Io8P8M9i59kZAGMio';

export const DUMMY_USER: User = {
    id: 'user-123',
    username: 'ajohnson',
    email: 'alex.johnson@icanmanage.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    company: 'ICANManage Health',
    roleId: 'role-admin',
    role: 'Admin',
    menus: [
        {
            menuName: 'Financials',
            status: 'Active',
            subModules: [
                { menuName: 'All Transactions', status: 'Active' },
                { menuName: 'Payments', status: 'Active' },
                { menuName: 'PIP', status: 'Active' },
                { menuName: 'Forward Balances', status: 'Active' },
                { menuName: 'Recoupments', status: 'Active' },
                { menuName: 'Other Adjustments', status: 'Active' },
                { menuName: 'Variance Analysis', status: 'Active' },
                { menuName: 'Trends & Forecast', status: 'Active' }
            ]
        },
        {
            menuName: 'Collections',
            status: 'Active'
        }
    ]
};
