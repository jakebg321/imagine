import React from 'react';

const CustomCrosshair = () => {
  return (
    <div 
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      {/* Center dot */}
      <div 
        style={{
          width: '4px',
          height: '4px',
          backgroundColor: '#ff0000',
          borderRadius: '50%'
        }}
      />
      
      {/* Crosshair lines */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '-8px',
        width: '2px',
        height: '16px',
        backgroundColor: '#ff0000',
        transform: 'translateX(-50%)'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '-8px',
        width: '16px',
        height: '2px',
        backgroundColor: '#ff0000',
        transform: 'translateY(-50%)'
      }} />
    </div>
  );
};

export default CustomCrosshair;