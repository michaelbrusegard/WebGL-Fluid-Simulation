'use client';

import WebGLFluidEnhanced from '../../../../dist/index.es.js';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      const simulation = new WebGLFluidEnhanced(mainRef.current);
      simulation.start();

      return () => {
        simulation.stop();
      };
    }
  }, []);

  return <main className='h-screen' ref={mainRef}></main>;
}
