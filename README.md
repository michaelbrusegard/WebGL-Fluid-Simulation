# [WebGL Fluid Enhanced](https://www.npmjs.com/package/webgl-fluid-enhanced)

[![npm version](https://img.shields.io/npm/v/webgl-fluid-enhanced.svg?color=green)](https://www.npmjs.com/package/webgl-fluid-enhanced)
[![npm dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://www.npmjs.com/package/webgl-fluid-enhanced)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/webgl-fluid-enhanced.svg?color=blue)](https://bundlephobia.com/package/webgl-fluid-enhanced)
[![npm downloads](<https://img.shields.io/npm/dt/webgl-fluid-enhanced?logo=npm&color=rgba(203,0,0,0.9)>)](https://www.npmjs.com/package/webgl-fluid-enhanced)
[![conventional commits](https://img.shields.io/badge/commits-Conventional-FE5196.svg?logo=conventionalcommits)](https://conventionalcommits.org)

> [!IMPORTANT]
> The new documentation and playground can be found [here](https://webgl-fluid-enhanced.michaelbrusegard.com).

## Table of Contents

1. [WebGL Fluid Enhanced](#webgl-fluid-enhanced)
2. [Documentation for Outdated Version (v0.6.1 and Prior)](#documentation-for-outdated-version-v061-and-prior)
3. [Want to contribute](#want-to-contribute)
4. [References](#references)
5. [License](#license)

## Documentation for Outdated Version (v0.6.1 and Prior)

### Install

```bash
  npm install webgl-fluid-enhanced
```

### New Features

- Ability to change config after simulation has started
- Use hover to activate
- Choose colors used in simulation
- Set background image
- Set if splats generate on initial load
- Specify how many splats should generate initially and from keypress
- Assign specific key to splats (Can be disabled)
- Trigger splats method
- Pause method
- Brightness option
- Method to splat at specific coordinates
- TypeScript support

### Config options

```js
webGLFluidEnhanced.config({
  SIM_RESOLUTION: 128, // Resolution of the simulation grid
  DYE_RESOLUTION: 1024, // Resolution of the dye grid
  CAPTURE_RESOLUTION: 512, // Resolution of captured frames
  DENSITY_DISSIPATION: 1, // Rate at which density dissipates
  VELOCITY_DISSIPATION: 0.2, // Rate at which velocity dissipates
  PRESSURE: 0.8, // Pressure value used in the simulation
  PRESSURE_ITERATIONS: 20, // Number of pressure iterations
  CURL: 30, // Curl value used in the simulation
  INITIAL: true, // Enables splats on initial load
  SPLAT_AMOUNT: 5, // Number of initial splats (Random number between n and n * 5)
  SPLAT_RADIUS: 0.25, // Radius of the splats
  SPLAT_FORCE: 6000, // Force applied by the splats
  SPLAT_KEY: 'Space', // Keyboard key to spawn new splats (empty to disable)
  SHADING: true, // Enables shading in the visualization
  COLORFUL: true, // Enables rapid changing of colors
  COLOR_UPDATE_SPEED: 10, // Speed of color update
  COLOR_PALETTE: [], // Custom color palette (empty by default, uses hex colors)
  HOVER: true, // Enables interaction on hover
  BACK_COLOR: '#000000', // Background color of the canvas
  TRANSPARENT: false, // Makes the canvas transparent if true
  BRIGHTNESS: 0.5, // Color brightness (Recommend lower than 1.0 if BLOOM is true)
  BLOOM: true, // Enables bloom effect
  BLOOM_ITERATIONS: 8, // Number of bloom effect iterations
  BLOOM_RESOLUTION: 256, // Resolution of the bloom effect
  BLOOM_INTENSITY: 0.8, // Intensity of the bloom effect
  BLOOM_THRESHOLD: 0.6, // Threshold for the bloom effect
  BLOOM_SOFT_KNEE: 0.7, // Soft knee value for the bloom effect
  SUNRAYS: true, // Enables sunrays effect
  SUNRAYS_RESOLUTION: 196, // Resolution of the sunrays effect
  SUNRAYS_WEIGHT: 1.0, // Weight of the sunrays effect
});
```

### General info

#### Usage

Initialise:

```js
webGLFluidEnhanced.simulation(document.querySelector('canvas'), {
  // Optional options
});
```

Edit config:

```js
webGLFluidEnhanced.config({
  // Options
});
```

Trigger splats:

```js
webGLFluidEnhanced.splats();
```

Splat at specific coordinates:

```js
// x and y are the coordinates in the HTML document where the splat should occur.
// They represent the position of the center of the splat.
webGLFluidEnhanced.splat(
  x,
  y,

  // dx and dy represent the directional components of the splat's force.
  // They determine the direction of the fluid movement caused by the splat.
  // These values are best in the range from -1000 to 1000, with 0 representing no force.
  dx,
  dy,

  // color is the color of the fluid added by the splat as a string in hexadecimal format.
  // This parameter is optional. If not provided, colors from the palette or then a random color may be used.
  color,
);
```

Pause/resume the simulation:

```js
// drawWhilePaused is an optional boolean that determines whether it is possible to stil draw while the simulation is paused.
webGLFluidEnhanced.pause(drawWhilePaused);
```

Download a screenshot:

```js
webGLFluidEnhanced.screenshot();
```

#### Set background image

To set background image make sure the `TRANSPARENT` option is set to `true`, and in the CSS you can set `background-image: url('<PHOTO-URL>');` and `background-size: 100% 100%;` to fill the whole canvas.

#### Background color

When using the `BACK_COLOR` option, the color you provided will be whitened when the `BLOOM` option is set to `true`.

### Examples

#### HTML

```html
<!doctype html>
<html>
  <body>
    <canvas style="width: 100vw; height: 100vh;"></canvas>
    <script type="importmap">
      {
        "imports": {
          "webgl-fluid-enhanced": "https://esm.run/webgl-fluid-enhanced@latest"
        }
      }
    </script>
    <script type="module">
      import webGLFluidEnhanced from 'webgl-fluid-simulation';

      webGLFluidEnhanced.simulation(document.querySelector('canvas'), {
        COLOR_PALETTE: ['#cc211b', '#f1c593', '#e87e54', '#f193a7', '#ec6fa9'],
        HOVER: false,
        SPLAT_RADIUS: 0.1,
        VELOCITY_DISSIPATION: 0.99,
        BLOOM: false,
      });
    </script>
  </body>
</html>
```

#### React

```js
import { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid-enhanced';

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    webGLFluidEnhanced.simulation(canvasRef.current, {
      SIM_RESOLUTION: 256,
      DENSITY_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 30,
      COLOR_PALETTE: ['#61dafb', '#a8dadc', '#457b9d', '#1d3557', '#f1faee'],
    });
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default App;
```

#### Next.js (tailwindcss)

```tsx
'use client';

import { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid-enhanced';

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    webGLFluidEnhanced.simulation(canvasRef.current!, {
      PRESSURE: 0.2,
      SUNRAYS: false,
      START_SPLATS: 10,
      DENSITY_DISSIPATION: 3,
      CURL: 100,
      COLOR_PALETTE: ['#0000ff', '#111111', '#1d1d1d', '#eaeaea', '#4dba87'],
    });
  }, []);

  return <canvas ref={canvasRef} className='h-screen w-screen' />;
};

export default App;
```

#### Vue.js

```vue
<!-- Not tested! -->
<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import WebGLFluid from 'webgl-fluid'

const canvas = ref()

onMounted(() => {
  webGLFluidEnhanced.simulation(canvas, {
        SPLAT_RADIUS: 0.5,
        COLOR_UPDATE_SPEED: 20,
        BLOOM: false,
    <>});
})
</script>

<style>
canvas {
  width: 100vw;
  height: 100vh;
}
</style>
```

#### Angular

```ts
// Not tested!
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import webGLFluidEnhanced from 'webgl-fluid-enhanced';

@Component({
  selector: 'app-root',
  template: `
    <canvas #canvasRef style="width: 100vw; height: 100vh;"></canvas>
  `,
})
export class AppComponent implements OnInit {
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef;

  ngOnInit(): void {
    webGLFluidEnhanced.simulation(this.canvasRef.nativeElement, {
      COLOR_PALETTE: ['#dd0031', '#c3002f', '#dd0031'],
      START_SPLATS: 50,
      TRANSPARENT: true,
    });
  }
}
```

#### Svelte

```svelte
<!-- Not tested! -->
<script>
  import { onMount } from 'svelte';

  let canvasRef;

  onMount(() => {
    import('webgl-fluid-enhanced').then(({ default: webGLFluidEnhanced }) => {
      webGLFluidEnhanced.simulation(canvasRef, {
        SIM_RESOLUTION: 256,
        VELOCITY_DISSIPATION: 0.99,
        COLOR_PALETTE: ['#ff7f00'],
      });
    });
  });
</script>

<canvas bind:this={canvasRef} style="width: 100vw; height: 100vh;" />
```

## Want to contribute

Feel free to open an issue or a pull request! I'm always open to suggestions and improvements, and I have tried to make the development environment as good as possible with a descriptive file structure and TypeScript definitions.

## References

https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu

https://github.com/mharrys/fluids-2d

https://github.com/haxiomic/GPU-Fluid-Experiments

## License

The code is available under the [MIT license](LICENSE)
