import React from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, TabsProps as MuiTabsProps, TabProps as MuiTabProps } from '@mui/material';

export interface TabItem {
    label: React.ReactNode;
    value: string | number;
    icon?: string | React.ReactElement;
    disabled?: boolean;
}

export interface CustomTabsProps extends Omit<MuiTabsProps, 'value' | 'onChange'> {
    tabs: TabItem[];
    value: string | number;
    onChange: (event: React.SyntheticEvent, newValue: string | number) => void;
    tabProps?: Partial<MuiTabProps>;
}

/**
 * Reusable Tabs component spanning throughout the application.
 */
const Tabs: React.FC<CustomTabsProps> = ({
    tabs,
    value,
    onChange,
    tabProps,
    ...props
}) => {
    return (
        <MuiTabs
            value={value}
            onChange={onChange}
            {...props}
        >
            {tabs.map((tab, index) => (
                <MuiTab
                    key={index}
                    label={tab.label}
                    value={tab.value}
                    icon={tab.icon}
                    disabled={tab.disabled}
                    {...tabProps}
                />
            ))}
        </MuiTabs>
    );
};

export default Tabs;
