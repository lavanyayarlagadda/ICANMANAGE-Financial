import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material';

export const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <MuiGlobalStyles
      styles={{
        ':root': {
          '--primary-color': theme.palette.primary.main,
          '--secondary-color': theme.palette.secondary.main,
          '--accent-color': theme.palette.warning.main,
          '--error-color': theme.palette.error.main,
          '--bg-color': theme.palette.background.default,
          '--surface-color': theme.palette.background.paper,
          '--text-primary': theme.palette.text.primary,
          '--text-secondary': theme.palette.text.secondary,
          '--border-color': theme.palette.divider,
          '--font-family-primary': theme.typography.fontFamily,
          '--font-family-headline': (theme.typography.h1 as { fontFamily?: string }).fontFamily || theme.typography.fontFamily,
        },
        /* Custom Scrollbar for Autocomplete and other lists */
        '.MuiAutocomplete-listbox::-webkit-scrollbar': {
          width: '8px !important',
          display: 'block !important',
          WebkitAppearance: 'none !important',
        },
        '.MuiAutocomplete-listbox::-webkit-scrollbar-track': {
          backgroundColor: `${theme.palette.grey[100]} !important`,
          borderRadius: '8px !important',
        },
        '.MuiAutocomplete-listbox::-webkit-scrollbar-thumb': {
          backgroundColor: `${theme.palette.grey[300]} !important`,
          borderRadius: '8px !important',
          border: `2px solid ${theme.palette.grey[100]} !important`,
        },
        '.MuiAutocomplete-listbox::-webkit-scrollbar-thumb:hover': {
          backgroundColor: `${theme.palette.grey[400]} !important`,
        },

        /* Global Scrollbar */
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: theme.palette.grey[50],
        },
        '::-webkit-scrollbar-thumb': {
          background: theme.palette.grey[300],
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.grey[400],
        },
      }}
    />
  );
};
