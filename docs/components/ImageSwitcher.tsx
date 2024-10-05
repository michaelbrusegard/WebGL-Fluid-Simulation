'use client';

import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { useEffect, useState } from 'react';

function ImageSwitcher() {
  const images = ['hero0', 'hero1', 'hero2', 'hero3', 'hero4'];
  const [currentImage, setCurrentImage] = useState(
    images[Math.floor(Math.random() * images.length)],
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage(
        images[(images.indexOf(currentImage!) + 1) % images.length],
      );
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentImage, images]);

  return (
    <ImageZoom
      src={`/${currentImage}.png`}
      alt='WebGL Fluid Enhanced'
      width={800}
      height={600}
      className='rounded-xl'
    />
  );
}

export { ImageSwitcher };
