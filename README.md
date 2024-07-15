# [WebGL Fluid Enhanced](https://www.npmjs.com/package/webgl-fluid-enhanced)

[![npm version](https://img.shields.io/npm/v/webgl-fluid-enhanced.svg?color=green)](https://www.npmjs.com/package/webgl-fluid-enhanced)
[![npm dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://www.npmjs.com/package/webgl-fluid-enhanced)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/webgl-fluid-enhanced.svg?color=blue)](https://bundlephobia.com/package/webgl-fluid-enhanced)
[![npm downloads](<https://img.shields.io/npm/dt/webgl-fluid-enhanced?logo=npm&color=rgba(203,0,0,0.9)>)](https://www.npmjs.com/package/webgl-fluid-enhanced)
[![conventional commits](https://img.shields.io/badge/commits-Conventional-FE5196.svg?logo=conventionalcommits)](https://conventionalcommits.org)

I wanted to use Pavel Dobryakov's [WebGL Fluid Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) for [my personal website](https://www.michaelbrusegard.com) ([see code](https://github.com/michaelbrusegard/personal-website)), but I couldn't find a way to use it with Next.js. So I decided to add ES Module Support. I also added Typescript and some extra config options so I can personally customise it how I like. I removed the config GUI and other boilerplate and minimized the package. I hope you find it useful!

#### [Preview here!](https://michaelbrusegard.github.io/WebGL-Fluid-Enhanced/)

## Screenshots

![fluid](https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced/assets/56915010/6671d84c-1672-41a6-851c-b20b174dd803)
![fluid](https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced/assets/56915010/f1d199b1-deb2-45f7-a2b1-2992eb42f562)
![fluid](https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced/assets/56915010/6cc25eca-a60d-4a5c-bd19-1b8c034e0f31)
![fluid](https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced/assets/56915010/0cb4c9e3-dcba-4545-98ca-9c959e29bb73)

## Install

```bash
  npm install webgl-fluid-enhanced
```

## New Features

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

## Config options

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

## General info

### Usage

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

### Set background image

To set background image make sure the `TRANSPARENT` option is set to `true`, and in the CSS you can set `background-image: url('<PHOTO-URL>');` and `background-size: 100% 100%;` to fill the whole canvas.

### Background color

When using the `BACK_COLOR` option, the color you provided will be whitened when the `BLOOM` option is set to `true`.

## Examples

### HTML

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

### React

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

### Next.js (tailwindcss)

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

### Vue.js

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

### Angular

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

### Svelte

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

## Want to contribute?

Feel free to open an issue or a pull request! I'm always open to suggestions and improvements, and I have tried to make the development environment as good as possible. Right now I have only added typescript definitions to the package API because I am not that familiar with all the internal code of Pavel Dobryakov's work.

## References

https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu

https://github.com/mharrys/fluids-2d

https://github.com/haxiomic/GPU-Fluid-Experiments

## License

The code is available under the [MIT license](LICENSE)
