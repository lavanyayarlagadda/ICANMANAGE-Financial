import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import * as styles from './LocationTabs.styles';

interface LocationTabsProps {
  view: string;
  locations: string[];
  activeLocation: string;
  setActiveLocation: (loc: string) => void;
}

const LocationTabs: React.FC<LocationTabsProps> = ({
  locations,
  activeLocation,
  setActiveLocation,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <styles.StyledLocationTabWrapper isMobile={isMobile}>
      <styles.TabsContainer>
        <styles.StyledTabs
          value={activeLocation}
          onChange={(_, newValue) => setActiveLocation(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {locations.map((loc) => (
            <styles.StyledTab
              key={loc}
              label={loc}
              value={loc}
              disableRipple
              active={activeLocation === loc}
            />
          ))}
        </styles.StyledTabs>
      </styles.TabsContainer>

      <styles.SpacerBox isMobile={isMobile} />
    </styles.StyledLocationTabWrapper>
  );
};

export default LocationTabs;
