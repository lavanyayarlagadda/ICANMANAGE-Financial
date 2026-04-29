import { subMonths, subYears, format, startOfMonth } from 'date-fns';

export interface DateRange {
    from: string;
    to: string;
}

export const calculateDatesFromLabel = (range: string): DateRange | null => {
    const to = new Date();
    let from;
    switch (range) {
        case '1 month': from = subMonths(to, 1); break;
        case '3 months': from = subMonths(to, 3); break;
        case '6 months': from = subMonths(to, 6); break;
        case '1 year': from = subYears(to, 1); break;
        case 'MTD': from = startOfMonth(to); break;
        case 'All Time': from = new Date(2020, 0, 1); break;
        default: return null;
    }
    return {
        from: format(from, 'yyyy-MM-dd'),
        to: format(to, 'yyyy-MM-dd')
    };
};

export const getInitialCustomRange = () => ({
    from: startOfMonth(new Date()),
    to: new Date()
});
