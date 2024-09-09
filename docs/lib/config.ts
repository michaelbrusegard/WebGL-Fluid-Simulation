'use client';

import { z } from 'zod';

const formSchema = z.object({
  simResolution: z.number().default(128),
  dyeResolution: z.number().default(1024),
  captureResolution: z.number().default(512),
  densityDissipation: z.number().default(1),
  velocityDissipation: z.number().default(0.2),
  pressure: z.number().default(0.8),
  pressureIterations: z.number().default(20),
  curl: z.number().default(30),
  splatRadius: z.number().default(0.25),
  splatForce: z.number().default(6000),
  shading: z.boolean().default(true),
  colorful: z.boolean().default(true),
  colorUpdateSpeed: z.number().default(10),
  colorPalette: z.array(z.any()).default([]),
  hover: z.boolean().default(true),
  inverted: z.boolean().default(false),
  backgroundColor: z.string().default('#000000'),
  transparent: z.boolean().default(false),
  brightness: z.number().default(0.5),
  bloom: z.boolean().default(true),
  bloomIterations: z.number().default(8),
  bloomResolution: z.number().default(256),
  bloomIntensity: z.number().default(0.8),
  bloomThreshold: z.number().default(0.6),
  bloomSoftKnee: z.number().default(0.7),
  sunrays: z.boolean().default(true),
  sunraysResolution: z.number().default(196),
  sunraysWeight: z.number().default(1.0),
});

export { formSchema };
