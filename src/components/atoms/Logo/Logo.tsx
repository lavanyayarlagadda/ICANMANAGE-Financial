import React from "react";
import { Box } from "@mui/material";
import * as styles from './Logo.styles';

interface LogoProps {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  return (
    <Box sx={styles.containerStyles}>
      <Box sx={styles.imageContainerStyles}>
        <img 
          src="/cognitiveLogo.svg" 
          alt="logo" 
          style={styles.imageStyles(collapsed)} 
        />
      </Box>
    </Box>
  );
};

export default Logo;
