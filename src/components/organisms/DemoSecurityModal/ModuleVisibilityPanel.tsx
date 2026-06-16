import React from 'react';
import { InputAdornment } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { MenuAccess } from '@/utils/dummyData';
import {
  FormFieldWrapper,
  ModulePanelTitle,
  EnableSelectionRow,
  StyledSwitch,
  BoldCaptionSpan,
  NavItemsHeaderBox,
  PanelTitle,
  SearchField,
  StyledSearchIcon,
  AccordionList,
  AccordionItemRow,
  ModuleNameTypography,
  StatusFormControl,
  ModuleStatusSelect,
  CheckSpacer,
  SubModuleRow,
  StatusMenuItem,
  CaptionSecondaryText,
  FormFieldWrapperNoMargin,
} from './DemoSecurityModal.styles';
import Accordion from '@/components/atoms/Accordion';

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
    <FormFieldWrapper>
      <ModulePanelTitle variant="subtitle1">Module Visibility</ModulePanelTitle>

      <EnableSelectionRow>
        <StyledSwitch
          checked={moduleSelectionEnabled}
          onChange={(e) => setModuleSelectionEnabled(e.target.checked)}
          color="primary"
        />
        <FormFieldWrapperNoMargin>
          <PanelTitle variant="body2">Enable Module Selection</PanelTitle>
          <CaptionSecondaryText variant="caption" color="text.secondary">
            Customize which navigation items are visible for{' '}
            <BoldCaptionSpan component="span" variant="caption" color="primary">
              {selectedUsername}
            </BoldCaptionSpan>
            .
          </CaptionSecondaryText>
        </FormFieldWrapperNoMargin>
      </EnableSelectionRow>

      <NavItemsHeaderBox>
        <PanelTitle variant="body2">Visible Navigation Items</PanelTitle>
        <SearchField
          placeholder="Search modules..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <StyledSearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </NavItemsHeaderBox>

      {/* Accordion List */}
      {moduleSelectionEnabled && userBeingEdited?.menus && (
        <AccordionList>
          {userBeingEdited.menus.map((menuItem: MenuAccess, index: number) => (
            <React.Fragment key={menuItem.menuName}>
              <Accordion hideBorderTop={index === 0}>
                <AccordionItemRow>
                  <ModuleNameTypography>{menuItem.menuName}</ModuleNameTypography>
                  <StatusFormControl size="small">
                    <ModuleStatusSelect
                      value={moduleStatuses[menuItem.menuName] || 'Hidden'}
                      onChange={(e) =>
                        handleModuleStatusChange(menuItem.menuName, e.target.value as string)
                      }
                      disabled={!moduleSelectionEnabled}
                    >
                      {['Active', 'Hidden', 'Disabled'].map((statusOption) => (
                        <StatusMenuItem key={statusOption} value={statusOption}>
                          {moduleStatuses[menuItem.menuName] === statusOption ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            <CheckSpacer />
                          )}
                          {statusOption}
                        </StatusMenuItem>
                      ))}
                    </ModuleStatusSelect>
                  </StatusFormControl>
                </AccordionItemRow>
              </Accordion>

              {menuItem.subModules && moduleStatuses[menuItem.menuName] !== 'Hidden' && (
                <Accordion summary={`${menuItem.menuName} Sub-Modules`}>
                  {menuItem.subModules.map((subItem, sIdx, sArr) => (
                    <SubModuleRow key={subItem.menuName} hasBorderBottom={sIdx < sArr.length - 1}>
                      <ModuleNameTypography>{subItem.menuName}</ModuleNameTypography>
                      <StatusFormControl size="small">
                        <ModuleStatusSelect
                          value={moduleStatuses[subItem.menuName] || 'Hidden'}
                          onChange={(e) =>
                            handleModuleStatusChange(subItem.menuName, e.target.value as string)
                          }
                          disabled={
                            moduleStatuses[menuItem.menuName] === 'Disabled' ||
                            !moduleSelectionEnabled
                          }
                        >
                          {['Active', 'Hidden', 'Disabled'].map((statusOption) => (
                            <StatusMenuItem key={statusOption} value={statusOption}>
                              {moduleStatuses[subItem.menuName] === statusOption ? (
                                <CheckIcon fontSize="small" />
                              ) : (
                                <CheckSpacer />
                              )}
                              {statusOption}
                            </StatusMenuItem>
                          ))}
                        </ModuleStatusSelect>
                      </StatusFormControl>
                    </SubModuleRow>
                  ))}
                </Accordion>
              )}
            </React.Fragment>
          ))}
        </AccordionList>
      )}
    </FormFieldWrapper>
  );
};
