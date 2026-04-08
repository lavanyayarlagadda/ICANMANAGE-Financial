import { User } from '@/store/slices/authSlice';

export const STATIC_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNTYiLCJ0ZW5hbnRzIjpbXSwicm9sZXMiOlsiQWRtaW4iXSwiY29tcGFueSI6IkNvZ25pdGl2ZUhlYWx0aElUIiwiZXhwIjoxNzc0NjI0Mjc0LCJpYXQiOjE3NzQ2MjA2NzQsImVtYWlsIjoiYXZpbmFzaEBjb2duaXRpdmUuY29tIn0.a9-B5-MOLyzQxOsSI6bqN_WqHFpWyM8HCfQ34kE2mDM'
export const STATIC_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNTYiLCJ0ZW5hbnRzIjpbXSwibGFzdE5hbWUiOiJSZWRkeSIsInJvbGUiOiJBZG1pbiIsInJvbGVJZCI6IjE1OSIsInJvbGVzIjpbIkFkbWluIl0sInR5cGUiOiJyZWZyZXNoIiwiZmlyc3ROYW1lIjoiQXZpbmFzaCIsImNvbXBhbnkiOiJDb2duaXRpdmVIZWFsdGhJVCIsImV4cCI6MTc3NTE5ODcwNSwiaWF0IjoxNzc0NTkzOTA1LCJlbWFpbCI6ImF2aW5hc2hAY29nbml0aXZlLmNvbSIsInVzZXJuYW1lIjoiYXZpbmFzaEBjb2duaXRpdmUuY29tIn0.DyX8I3jvM9k3Ix7hWAF5-Q1m23Io8P8M9i59kZAGMio';

export const DUMMY_USER: User = {
    id: '396',
    username: 'ajohnson',
    email: 'alex.johnson@icanmanage.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    company: 'CognitiveHealthIT',
    roleId: 'role-admin',
    role: 'Admin',
    accessibleModules: [
        "Collections",
        "Financials",
        "All Transactions",
        "Payments",
        "PIP",
        "Forward Balances",
        "Recoupments",
        "Other Adjustments",
        "Variance Analysis",
        "Trends & Forecast"
    ],
    defaultLandingPage: 'Financials',
    inactivityTimeout: '15',
    passwordPolicy: '30 Days',
    menus: [
        {
            "menuName": "Collections",
            "status": "Active"
        },
        {
            "menuName": "Financials",
            "status": "Active",
            "modules": [
                {
                    "menuName": "Transactions",
                    "status": "Active",
                    "subModules": [
                        { "menuName": "All Transactions", "status": "Disabled" },
                        { "menuName": "Payments", "status": "Hidden" },
                        { "menuName": "Recoupments", "status": "Active" },
                        { "menuName": "Other Adjustments", "status": "Active" }
                    ]
                },
                {
                    "menuName": "Bank Deposits",
                    "status": "Active"
                },
                {
                    "menuName": "Statements",
                    "status": "Active",
                    "subModules": [
                        { "menuName": "PIP", "status": "Active" },
                        { "menuName": "Forward Balances", "status": "Active" },
                        { "menuName": "Suspense Accounts", "status": "Active" }
                    ]
                },
                {
                    "menuName": "Variance Analysis",
                    "status": "Active",
                    "subModules": [
                        { "menuName": "Fee Schedule Variance", "status": "Active" },
                        { "menuName": "Payment Variance", "status": "Active" }
                    ]
                },
                {
                    "menuName": "Trends & Forecast",
                    "status": "Active",
                    "subModules": [
                        { "menuName": "Forecast Trends", "status": "Active" },
                        { "menuName": "Executive Summary", "status": "Active" },
                        { "menuName": "Payer Performance", "status": "Active" }
                    ]
                }
            ]
        }
    ]
};
