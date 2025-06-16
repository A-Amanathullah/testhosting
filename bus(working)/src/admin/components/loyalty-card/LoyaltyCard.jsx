import React from 'react';
import { Award, Users, CreditCard, Bus, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const LoyaltyCard = ({ 
  tier, 
  icon, 
  points, 
  customers, 
  color = '#C0C0C0', 
  pointsMethod, 
  pointsPerBooking, 
  amount, 
  pointsPerAmount, 
  onEdit 
}) => {
  // Use custom colors passed from props
  const hexToRgb = (hex) => {
    // Remove the # character if present
    hex = hex.replace('#', '');
    
    // Convert HEX to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };
  
  const generateStyles = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    // Create a lighter variant for gradients
    const lightRgb = {
      r: Math.min(255, rgb.r + 40),
      g: Math.min(255, rgb.g + 40),
      b: Math.min(255, rgb.b + 40)
    };
    
    // Create a darker variant for text
    const darkRgb = {
      r: Math.max(0, rgb.r - 70),
      g: Math.max(0, rgb.g - 70),
      b: Math.max(0, rgb.b - 70)
    };

    return {
      bg: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`,
      lightBg: `rgba(${lightRgb.r}, ${lightRgb.g}, ${lightRgb.b}, 0.5)`,
      borderColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      textColor: `rgb(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b})`,
    };
  };
  const customStyle = generateStyles(color);
  
  // Determine which icon to use
  const IconComponent = icon === 'award' ? Award : (icon === 'users' ? Users : CreditCard);
  
  // Determine points method icon
  const PointsMethodIcon = pointsMethod === 'booking' ? Bus : DollarSign;

  return (
    <motion.div 
      style={{
        background: `linear-gradient(135deg, ${customStyle.lightBg}, ${customStyle.bg})`,
        borderColor: customStyle.borderColor
      }}
      className={`relative overflow-hidden border-2 rounded-lg shadow-lg`}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-white/30">
            <IconComponent className="w-6 h-6 text-gray-800" />
          </div>
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-white/40">
            {tier}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900">
          {points.min} - {points.max} Points
        </h3>
        
        <div className="flex items-center mt-3 mb-2 text-sm text-gray-800">
          <PointsMethodIcon className="w-4 h-4 mr-1" />
          <span>
            {pointsMethod === 'booking' ? 
              `${pointsPerBooking} points per booking` : 
              `${pointsPerAmount} points per Rs.${amount}`}
          </span>
        </div>
        
        <div className="flex items-center mt-4 text-sm text-gray-700 opacity-80">
          <Users className="w-4 h-4 mr-1" />
          <span>{customers} customers enrolled</span>
        </div>
      </div>
      
      {/* Edit button */}
      <button 
        onClick={onEdit}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </motion.div>
  );
};

export default LoyaltyCard;
