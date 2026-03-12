import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    Tabs,
    Tab,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '@/store';
import { setProfilerFilters, ProfilerFilter, setProfilerBannerOpen } from '@/store/slices/financialsSlice';

const profilerFields = [
    { value: 'accountNumber', label: 'Account Number' },
    { value: 'patientName', label: 'Patient Name' },
    { value: 'payer', label: 'Payer Name' },
    { value: 'totalDue', label: 'Total Due' },
    { value: 'amountCollected', label: 'Collected' },
    { value: 'balance', label: 'Balance' },
    { value: 'lastActivityDate', label: 'Last Activity Date' },
    { value: 'assignedTo', label: 'Assigned To' },
    { value: 'status', label: 'Status' },
];

const stringOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'in_list', label: 'In List' },
];

const numberOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
];

const getOperatorsForField = (fieldValue: string) => {
    if (['totalDue', 'amountCollected', 'balance'].includes(fieldValue)) {
        return numberOperators;
    }
    return stringOperators;
};

const CollectionsFilter: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState(0);

    // Quick Search State
    const [quickSearch, setQuickSearch] = useState({
        accountNumber: '',
        partialId: false,
        patientName: '',
        payerName: '',
        lastActivityDate: '',
        ignoreProfiler: false,
    });

    // Profiler State
    const [rules, setRules] = useState<ProfilerFilter[]>([
        { id: '1', field: 'payer', operator: 'contains', value: '' }
    ]);

    const handleQuickSearchChange = (field: string, value: any) => {
        setQuickSearch(prev => ({ ...prev, [field]: value }));
    };

    const handleAddRule = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setRules([...rules, { id: newId, field: 'payer', operator: 'contains', value: '' }]);
    };

    const handleRemoveRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
    };

    const handleRuleChange = (id: string, key: keyof ProfilerFilter, val: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, [key]: val } : r));
    };

    const applyProfilerFilters = () => {
        // Only apply valid rules
        const validRules = rules.filter(r => r.value.trim() !== '');
        dispatch(setProfilerFilters(validRules));
        if (validRules.length > 0) {
            dispatch(setProfilerBannerOpen(true));
        }
    };

    const clearProfilerFilters = () => {
        setRules([{ id: Math.random().toString(36).substr(2, 9), field: 'payer', operator: 'contains', value: '' }]);
        dispatch(setProfilerFilters([]));
    };

    return (
        <Card sx={{ mb: 3, overflow: 'visible' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mr: 4, fontWeight: 600 }}>Collections Filtering</Typography>
                <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
                    <Tab label="Quick Search" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Profiler" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
            </Box>

            {/* Quick Search Tab content */}
            {activeTab === 0 && (
                <CardContent>
                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
                                Patient Account Number
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Comma delimited list"
                                    value={quickSearch.accountNumber}
                                    onChange={(e) => handleQuickSearchChange('accountNumber', e.target.value)}
                                />
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={quickSearch.partialId} onChange={(e) => handleQuickSearchChange('partialId', e.target.checked)} />}
                                    label={<Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>Partial ID</Typography>}
                                    sx={{ m: 0 }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
                                Patient Name
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Last, First (optional)"
                                value={quickSearch.patientName}
                                onChange={(e) => handleQuickSearchChange('patientName', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
                                Payer Name
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                value={quickSearch.payerName}
                                onChange={(e) => handleQuickSearchChange('payerName', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
                                Last Activity Date
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={quickSearch.lastActivityDate}
                                onChange={(e) => handleQuickSearchChange('lastActivityDate', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '40px' }}>
                                <Button variant="contained" color="primary" startIcon={<SearchIcon />} sx={{ flex: 1, textTransform: 'none' }}>
                                    Search
                                </Button>
                                <Button variant="outlined" sx={{ minWidth: 'auto', px: 2, textTransform: 'none' }} onClick={() => setQuickSearch({
                                    accountNumber: '',
                                    partialId: false,
                                    patientName: '',
                                    payerName: '',
                                    lastActivityDate: '',
                                    ignoreProfiler: false,
                                })}>
                                    Clear
                                </Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox size="small" checked={quickSearch.ignoreProfiler} onChange={(e) => handleQuickSearchChange('ignoreProfiler', e.target.checked)} />}
                                label={<Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600 }}>Ignore Profiler Filters</Typography>}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            )}

            {/* Profiler Tab content */}
            {activeTab === 1 && (
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>Advanced Profile Builder</Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <Select displayEmpty value="" sx={{ fontSize: '0.875rem' }}>
                                    <MenuItem value="" disabled>Load Saved Profile...</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Save Profile</Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                        {rules.map((rule) => {
                            const ruleOperators = getOperatorsForField(rule.field);

                            // Ensure selected operator is valid for field, or reset it
                            if (!ruleOperators.find(o => o.value === rule.operator)) {
                                // we'll just optimistically show it, but ideally we'd reset it in handleRuleChange
                            }

                            return (
                                <Box key={rule.id} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <FormControl size="small" sx={{ width: 200 }}>
                                        <Select
                                            value={rule.field}
                                            onChange={(e) => {
                                                const newField = e.target.value as string;
                                                const validOp = getOperatorsForField(newField)[0].value;
                                                handleRuleChange(rule.id, 'field', newField);
                                                handleRuleChange(rule.id, 'operator', validOp);
                                            }}
                                            sx={{ fontSize: '0.875rem', backgroundColor: theme.palette.background.default }}
                                        >
                                            {profilerFields.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" sx={{ width: 160 }}>
                                        <Select
                                            value={rule.operator}
                                            onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value as string)}
                                            sx={{ fontSize: '0.875rem', backgroundColor: theme.palette.background.default }}
                                        >
                                            {ruleOperators.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        size="small"
                                        value={rule.value}
                                        onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                                        sx={{ width: 300, backgroundColor: theme.palette.background.default }}
                                        placeholder="Value..."
                                    />

                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemoveRule(rule.id)}
                                        sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            );
                        })}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={handleAddRule}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                            size="small"
                        >
                            Add Rule
                        </Button>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button onClick={clearProfilerFilters} size="small" sx={{ textTransform: 'none' }}>
                                Clear All
                            </Button>
                            <Button onClick={applyProfilerFilters} variant="contained" size="small" sx={{ textTransform: 'none' }}>
                                Apply Profile Filter
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            )}
        </Card>
    );
};

export default CollectionsFilter;
