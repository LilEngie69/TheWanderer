// src/StarGlobe.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const StarGlobe = ({ color = 'white', size = 1, spinSpeed = 1 }) => {
  return (
    <div
      style={{
        width: `${size * 20}px`,       // Example: scaling
        height: `${size * 20}px`,
        backgroundColor: color,
        borderRadius: '50%',
        animation: `spin ${spinSpeed}s linear infinite`
      }}
    >
    </div>
  );
};

export default StarGlobe;