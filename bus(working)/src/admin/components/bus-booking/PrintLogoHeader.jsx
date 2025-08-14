import React from 'react';

/**
 * PrintLogoHeader - For consistent logo and title in print views
 */
import SideLogo from '../../../assets/Side.png';

const PrintLogoHeader = ({ title }) => (
  <div style={{ textAlign: 'center', marginBottom: 24 }}>
    <img src={SideLogo} alt="Company Logo" style={{ display: 'block', margin: '0 auto 24px auto', maxWidth: 220 }} />
    <h1 style={{ color: '#1a237e', fontSize: '2rem', marginBottom: 12 }}>{title}</h1>
  </div>
);

export default PrintLogoHeader;
