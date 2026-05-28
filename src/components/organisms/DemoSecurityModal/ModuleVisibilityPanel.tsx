import React from 'react';
import {
  Box,
  Typography,
  Switch,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import Accordion from '@/components/atoms/Accordion';
import { themeConfig } from '@/theme';
import { MenuAccess } from '@/utils/dummyData';

interface ModuleVisibilityPanelProps {
  moduleSelectionEnabled: boolean;
  setModuleSelectionEnabled: (val: boolean) => void;
  selectedUsername: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  userBeingEdited: { menus?: MenuAccess[] } | null;
  moduleStatuses: Record<string, string>;
  handleModuleStatusChange: (moduleName: string, status: string) => void;
}

export const ModuleVisibilityPanel: React.FC<ModuleVisibilityPanelProps> = ({
  moduleSelectionEnabled,
  setModuleSelectionEnabled,
  selectedUsername,
  searchQuery,
  setSearchQuery,
  userBeingEdited,
  moduleStatuses,
  handleModuleStatusChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Module Visibility
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Switch
          checked={moduleSelectionEnabled}
          onChange={(e) => setModuleSelectionEnabled(e.target.checked)}
          color="primary"
          sx={{ mr: 1 }}
        />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Enable Module Selection
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Customize which navigation items are visible for{' '}
            <Typography component="span" variant="caption" color="primary" sx={{ fontWeight: 600 }}>
              {selectedUsername}
            </Typography>
            .
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1, sm: 2 },
          mb: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Visible Navigation Items
        </Typography>
        <TextField
          placeholder="Search modules..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: themeConfig.colors.text.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: '100%', sm: 250 },
            backgroundColor: '#FAFBFC',
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        />
      </Box>

      {/* Accordion List */}
      {moduleSelectionEnabled && userBeingEdited?.menus && (
        <Box
          sx={{
            border: `1px solid ${themeConfig.colors.border}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {userBeingEdited.menus.map((menuItem: MenuAccess, index: number) => (
            <React.Fragment key={menuItem.menuName}>
              <Accordion hideBorderTop={index === 0}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: { xs: 1.5, sm: 2 },
                    pl: { xs: 2, sm: 5 },
                  }}
                >
                  <Typography
                    sx={{
                      color: themeConfig.colors.primary,
                      fontSize: '0.85rem',
                      flex: 1,
                      pr: 1,
                      wordBreak: 'break-word',
                    }}
                  >
                    {menuItem.menuName}
                  </Typography>
                  <FormControl size="small" sx={{ width: { xs: 110, sm: 120 }, flexShrink: 0 }}>
                    <Select
                      value={moduleStatuses[menuItem.menuName] || 'Hidden'}
                      onChange={(e) =>
                        handleModuleStatusChange(menuItem.menuName, e.target.value as string)
                      }
                      disabled={!moduleSelectionEnabled}
                      sx={{
                        height: 32,
                        fontSize: '0.8rem',
                        backgroundColor: themeConfig.colors.surface,
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          pr: '28px !important',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            '& .MuiMenuItem-root.Mui-selected': {
                              backgroundColor: themeConfig.colors.warning,
                              color: '#000',
                              '&:hover': {
                                backgroundColor: themeConfig.colors.warning,
                              },
                            },
                          },
                        },
                      }}
                    >
                      {['Active', 'Hidden', 'Disabled'].map((statusOption) => (
                        <MenuItem
                          key={statusOption}
                          value={statusOption}
                          sx={{
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {moduleStatuses[menuItem.menuName] === statusOption ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <Box sx={{ width: 20 }} />
                          )}
                          {statusOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Accordion>

              {menuItem.subModules && moduleStatuses[menuItem.menuName] !== 'Hidden' && (
                <Accordion summary={`${menuItem.menuName} Sub-Modules`}>
                  {menuItem.subModules.map((subItem, sIdx, sArr) => (
                    <Box
                      key={subItem.menuName}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: { xs: 1.5, sm: 2 },
                        pl: { xs: 3, sm: 5 },
                        borderBottom:
                          sIdx < sArr.length - 1
                            ? `1px solid ${themeConfig.colors.border}`
                            : 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          color: themeConfig.colors.primary,
                          fontSize: '0.85rem',
                          flex: 1,
                          pr: 1,
                          wordBreak: 'break-word',
                        }}
                      >
                        {subItem.menuName}
                      </Typography>
                      <FormControl size="small" sx={{ width: { xs: 110, sm: 120 }, flexShrink: 0 }}>
                        <Select
                          value={moduleStatuses[subItem.menuName] || 'Hidden'}
                          onChange={(e) =>
                            handleModuleStatusChange(subItem.menuName, e.target.value as string)
                          }
                          disabled={
                            moduleStatuses[menuItem.menuName] === 'Disabled' ||
                            !moduleSelectionEnabled
                          }
                          sx={{
                            height: 32,
                            fontSize: '0.8rem',
                            backgroundColor: themeConfig.colors.surface,
                            '& .MuiSelect-select': {
                              display: 'flex',
                              alignItems: 'center',
                              pr: '28px !important',
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                '& .MuiMenuItem-root.Mui-selected': {
                                  backgroundColor: themeConfig.colors.warning,
                                  color: '#000',
                                  '&:hover': {
                                    backgroundColor: themeConfig.colors.warning,
                                  },
                                },
                              },
                            },
                          }}
                        >
                          {['Active', 'Hidden', 'Disabled'].map((statusOption) => (
                            <MenuItem
                              key={statusOption}
                              value={statusOption}
                              sx={{
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              {moduleStatuses[subItem.menuName] === statusOption ? (
                                <CheckIcon fontSize="small" />
                              ) : (
                                <Box sx={{ width: 20 }} />
                              )}
                              {statusOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ))}
                </Accordion>
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};
