import React from 'react';
import { Box } from '@mui/material';
import * as styles from './BankDepositTabs.styles';

interface Entity {
  id: string;
  name: string;
}

interface BankDepositTabsProps {
  entities: Entity[];
  selectedEntityId: string;
  onEntityChange: (id: string) => void;
}

const BankDepositTabs: React.FC<BankDepositTabsProps> = ({
  entities,
  selectedEntityId,
  onEntityChange,
}) => {
  return (
    <styles.ContainerBox>
      <styles.LabelText variant="caption">View Entity</styles.LabelText>
      <styles.StyledTabs
        value={selectedEntityId}
        onChange={(_, val) => onEntityChange(val)}
        variant="scrollable"
        scrollButtons={true}
        allowScrollButtonsMobile
      >
        {entities.map((e) => {
          const isActive = selectedEntityId === e.id;
          return (
            <styles.StyledTab
              key={e.id}
              value={e.id}
              active={isActive}
              label={<Box>{e.name}</Box>}
              disableRipple
            />
          );
        })}
      </styles.StyledTabs>
    </styles.ContainerBox>
  );
};

export default BankDepositTabs;
