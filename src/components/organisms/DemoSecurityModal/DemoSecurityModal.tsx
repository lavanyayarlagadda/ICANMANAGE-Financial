import React from 'react';
import { MenuItem, Box } from '@mui/material';
import { EffectiveMenuItem, EffectiveMenuModule, EffectiveSubMenuItem } from '@/store/api/userApi';
import {
  useDemoSecurityModal,
  MODULE_STATUS_OPTIONS,
  PASSWORD_POLICY_OPTIONS,
} from './DemoSecurityModal.hook';
import {
  StyledDialog,
  StyledDialogTitle,
  HeaderTitleContainer,
  StyledSettingsIcon,
  PanelTitle,
  CloseIconButton,
  StyledCloseIcon,
  StyledDialogContent,
  ConfigureUserBox,
  IconHeaderBox,
  StyledPersonIcon,
  SectionTitle,
  FormRow,
  LabelTypography,
  UserSelect,
  CaptionHelperText,
  ModulePanelTitle,
  EnableSelectionRow,
  StyledSwitch,
  BoldCaptionSpan,
  NavItemsHeaderBox,
  SearchField,
  StyledSearchIcon,
  LoaderWrapper,
  AccordionList,
  PanelContainer,
  StyledSecurityIcon,
  FormFieldWrapper,
  FormFieldLabel,
  StyledTextField,
  StyledFullWidthFormControl,
  StyledDialogActions,
  LogoImage,
  ButtonRow,
  CancelButton,
  SaveButton,
  EmptyStateContainer,
  TreeItemContainer,
  TreeItemLabelBox,
  TreeBullet,
  TreeText,
  StyledFormControl,
  StatusSelect,
  StatusSpacer,
  StatusMenuItem,
  StyledCheckIcon,
  CaptionSecondaryText,
  FormFieldWrapperNoMargin,
  StyledCircularProgress,
} from './DemoSecurityModal.styles';

interface DemoSecurityModalProps {
  open: boolean;
  onClose: () => void;
  currentUser: { id: string; username: string; firstName: string; lastName: string; role: string };
}

const DemoSecurityModal: React.FC<DemoSecurityModalProps> = ({ open, onClose, currentUser }) => {
  const {
    selectedUser,
    inactivityTimeout,
    passwordPolicy,
    moduleSelectionEnabled,
    searchQuery,
    moduleStatuses,
    selectedUsername,
    users,
    menus,
    isLoading,
    isSaving,
    hasChanges,
    setInactivityTimeout,
    setModuleSelectionEnabled,
    setSearchQuery,
    handleUserChange,
    handleModuleStatusSelectChange,
    handlePasswordPolicyChange,
    handleSave,
  } = useDemoSecurityModal({ currentUser, open, onClose });

  const renderTree = (
    items: (EffectiveMenuItem | EffectiveMenuModule | EffectiveSubMenuItem)[],
    level = 0,
    isParentDisabled = false,
  ): React.ReactNode => {
    type MenuItemType = EffectiveMenuItem | EffectiveMenuModule | EffectiveSubMenuItem;

    const itemMatches = (it: MenuItemType, query: string): boolean => {
      const q = query.toLowerCase();
      if (it.menuName.toLowerCase().includes(q)) return true;

      const modules = (it as EffectiveMenuItem).modules;
      const subModules = (it as EffectiveMenuModule).subModules;

      if (modules && modules.some((m) => itemMatches(m, query))) return true;
      if (subModules && subModules.some((s) => itemMatches(s, query))) return true;

      return false;
    };

    const filteredItems = items.filter((item) => itemMatches(item, searchQuery));

    if (filteredItems.length === 0 && searchQuery) {
      if (level === 0)
        return (
          <EmptyStateContainer>
            <PanelTitle variant="body2">No modules match "{searchQuery}"</PanelTitle>
          </EmptyStateContainer>
        );
      return null;
    }

    return filteredItems.map((item) => {
      const modules = (item as EffectiveMenuItem).modules;
      const subModules = (item as EffectiveMenuModule).subModules;
      const hasChildren = (modules && modules.length > 0) || (subModules && subModules.length > 0);

      const currentStatus = moduleStatuses[item.menuId] || 'Hidden';
      const isCurrentlyDisabled = currentStatus === 'Disabled';

      // Level-specific flags
      const isLevel0 = level === 0;
      const isLevel1 = level === 1;
      const isLevel2 = level === 2;

      // If a parent is disabled, the child dropdown should be disabled
      const shouldDisableDropdown = !moduleSelectionEnabled || isParentDisabled;

      return (
        <React.Fragment key={item.menuId}>
          <TreeItemContainer
            _level={level}
            isLevel0={isLevel0}
            isLevel1={isLevel1}
            isParentDisabled={isParentDisabled}
          >
            <TreeItemLabelBox>
              {isLevel2 && <TreeBullet />}
              <TreeText isLevel0={isLevel0} isLevel1={isLevel1} isParentDisabled={isParentDisabled}>
                {item.menuName}
              </TreeText>
            </TreeItemLabelBox>
            <StyledFormControl size="small">
              <StatusSelect
                value={currentStatus}
                onChange={(e) => handleModuleStatusSelectChange(item.menuId, e)}
                disabled={shouldDisableDropdown}
              >
                {MODULE_STATUS_OPTIONS.map((statusOption) => (
                  <StatusMenuItem key={statusOption} value={statusOption}>
                    {currentStatus === statusOption ? <StyledCheckIcon /> : <StatusSpacer />}
                    {statusOption}
                  </StatusMenuItem>
                ))}
              </StatusSelect>
            </StyledFormControl>
          </TreeItemContainer>
          {hasChildren &&
            currentStatus !== 'Hidden' &&
            renderTree(
              modules ? modules : subModules || [],
              level + 1,
              isCurrentlyDisabled || isParentDisabled,
            )}
        </React.Fragment>
      );
    });
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <StyledDialogTitle>
        <Box>
          <HeaderTitleContainer>
            <StyledSettingsIcon />
            <PanelTitle variant="h6">Demo & Security Configuration</PanelTitle>
          </HeaderTitleContainer>
          <PanelTitle variant="body2" color="text.secondary">
            Customize which application modules are visible and set security policies.
          </PanelTitle>
        </Box>
        <CloseIconButton onClick={onClose} size="small">
          <StyledCloseIcon fontSize="small" />
        </CloseIconButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        <ConfigureUserBox>
          <IconHeaderBox>
            <StyledPersonIcon fontSize="small" />
            <SectionTitle variant="subtitle2">Configure for User</SectionTitle>
          </IconHeaderBox>
          <FormRow>
            <LabelTypography variant="body2">Select User:</LabelTypography>
            <StyledFormControl fullWidth size="small">
              <UserSelect value={selectedUser} onChange={handleUserChange} displayEmpty>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.username}
                    {u.id === currentUser.id ? ' (You)' : ''}
                  </MenuItem>
                ))}
              </UserSelect>
            </StyledFormControl>
          </FormRow>
          <CaptionHelperText variant="caption">
            You are editing the menu visibility and settings for the selected user.
          </CaptionHelperText>
        </ConfigureUserBox>

        <FormFieldWrapper>
          <ModulePanelTitle variant="subtitle1">Module Visibility</ModulePanelTitle>
          <EnableSelectionRow>
            <StyledSwitch
              checked={moduleSelectionEnabled}
              onChange={(e) => setModuleSelectionEnabled(e.target.checked)}
              color="primary"
            />
            <Box>
              <PanelTitle variant="body2">Enable Module Selection</PanelTitle>
              <CaptionSecondaryText variant="caption" color="text.secondary">
                Customize visibility for{' '}
                <BoldCaptionSpan component="span" variant="caption" color="primary">
                  {selectedUsername}
                </BoldCaptionSpan>
                .
              </CaptionSecondaryText>
            </Box>
          </EnableSelectionRow>

          {moduleSelectionEnabled && (
            <NavItemsHeaderBox>
              <PanelTitle variant="body2">Visible Navigation Items</PanelTitle>
              <SearchField
                placeholder="Search modules..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <StyledSearchIcon fontSize="small" />,
                }}
              />
            </NavItemsHeaderBox>
          )}

          {isLoading ? (
            <LoaderWrapper>
              <StyledCircularProgress size={32} thickness={4} />
              <PanelTitle variant="body2" color="text.secondary">
                Loading user configuration...
              </PanelTitle>
            </LoaderWrapper>
          ) : (
            moduleSelectionEnabled && (
              <AccordionList>
                {menus && menus.length > 0 ? (
                  renderTree(menus)
                ) : (
                  <EmptyStateContainer>
                    <PanelTitle variant="body2">No modules found.</PanelTitle>
                  </EmptyStateContainer>
                )}
              </AccordionList>
            )
          )}
        </FormFieldWrapper>

        <PanelContainer>
          <IconHeaderBox>
            <StyledSecurityIcon fontSize="small" />
            <PanelTitle variant="subtitle2">Security Settings</PanelTitle>
          </IconHeaderBox>
          <FormFieldWrapper>
            <FormFieldLabel variant="body2">Inactivity Timeout (minutes)</FormFieldLabel>
            <StyledTextField
              fullWidth
              size="small"
              value={inactivityTimeout}
              onChange={(e) => setInactivityTimeout(e.target.value)}
            />
          </FormFieldWrapper>
          <FormFieldWrapperNoMargin>
            <FormFieldLabel variant="body2">Password Expiration Policy</FormFieldLabel>
            <StyledFullWidthFormControl fullWidth size="small">
              <UserSelect value={passwordPolicy} onChange={handlePasswordPolicyChange}>
                {PASSWORD_POLICY_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </UserSelect>
            </StyledFullWidthFormControl>
          </FormFieldWrapperNoMargin>
        </PanelContainer>
      </StyledDialogContent>

      <StyledDialogActions>
        <LogoImage src="/cognitiveLogo.svg" alt="Logo" />
        <ButtonRow>
          <CancelButton onClick={onClose} variant="outlined" disabled={isSaving}>
            Cancel
          </CancelButton>
          <SaveButton onClick={handleSave} variant="contained" disabled={isSaving || !hasChanges}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </SaveButton>
        </ButtonRow>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default DemoSecurityModal;
