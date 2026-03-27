import React from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRowActionMenu } from './RowActionMenu.hook';
import * as styles from './RowActionMenu.styles';

export interface ActionMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  divider?: boolean;
}

interface RowActionMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  extraActions?: ActionMenuItem[];
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({ onView, onEdit, onDelete, extraActions }) => {
  const {
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleAction,
  } = useRowActionMenu();

  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: styles.menuPaperProps } }}
      >
        <MenuItem onClick={() => handleAction(onView)}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction(onEdit)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {extraActions?.map((action, idx) => (
          <MenuItem key={idx} onClick={() => handleAction(action.onClick)}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem onClick={() => handleAction(onDelete)} sx={styles.errorMenuItemStyles}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default RowActionMenu;
