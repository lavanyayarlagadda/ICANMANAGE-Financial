import React from 'react';
import * as styles from './PlaceholderTab.styles';

const PlaceholderTab: React.FC<{ title: string }> = ({ title }) => (
  <styles.Container>
    <styles.Title variant="h6" color="text.secondary">
      {title}
    </styles.Title>
    <styles.Description variant="body2" color="text.disabled">
      This tab is under development.
    </styles.Description>
  </styles.Container>
);

export default PlaceholderTab;
