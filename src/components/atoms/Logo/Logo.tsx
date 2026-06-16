import React from 'react';
import * as styles from './Logo.styles';

interface LogoProps {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  return (
    <styles.ContainerBox>
      <styles.ImageContainer>
        <styles.StyledImg src="/cognitiveLogo.svg" alt="logo" collapsed={collapsed} />
      </styles.ImageContainer>
    </styles.ContainerBox>
  );
};

export default Logo;
