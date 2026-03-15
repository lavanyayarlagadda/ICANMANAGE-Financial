import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { themeConfig } from "@/theme/themeConfig";

interface LogoProps {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        sx={{
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img 
          src="/cognitiveLogo.svg" 
          alt="logo" 
          style={{ 
            width: collapsed ? 100 : 120,
            transition: 'width 0.2s ease-in-out'
          }} 
        />
      </Box>
      {/* {!collapsed && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.2 }}
          >
            iCAN RCM
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.65rem' }}>
            PLATFORM
          </Typography>
        </Box>
      )} */}
    </Box>
  );
};

export default Logo;
