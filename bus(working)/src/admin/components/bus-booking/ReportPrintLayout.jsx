import React from 'react';

/**
 * ReportPrintLayout - A component to provide consistent print layout for reports
 * This will only be visible when printing, and helps format the reports properly
 */
const ReportPrintLayout = ({ 
  title, 
  dateInfo, 
  additionalInfo = [], 
  summaryData = [],
  children 
}) => {
  const currentDate = new Date().toLocaleString();
  
  return (
    <>
      <div className="print-header" style={{ display: 'none' }}>
        <h2>RS Express - {title}</h2>
        {dateInfo && <p>{dateInfo}</p>}
        {additionalInfo.map((info, index) => (
          <p key={index}>{info}</p>
        ))}
        <p>Generated: {currentDate}</p>
      </div>
      
      {summaryData.length > 0 && (
        <div className="print-summary" style={{ display: 'none' }}>
          {summaryData.map((item, index) => (
            <div key={index} className="print-summary-item">
              <strong>{item.label}:</strong> {item.value}
            </div>
          ))}
        </div>
      )}
      
      {children}
    </>
  );
};

export default ReportPrintLayout;
