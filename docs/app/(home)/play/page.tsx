'use client';

import WebGLFluidEnhanced from '../../../../dist/index.es.js';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from 'lib/config';
import { SettingsIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export default function HomePage() {
  const mainRef = useRef(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({
      simResolution: 128,
      dyeResolution: 1024,
      captureResolution: 512,
      densityDissipation: 1,
      velocityDissipation: 0.2,
      pressure: 0.8,
      pressureIterations: 20,
      curl: 30,
      splatRadius: 0.25,
      splatForce: 6000,
      shading: true,
      colorful: true,
      colorUpdateSpeed: 10,
      colorPalette: [],
      hover: true,
      inverted: false,
      backgroundColor: '#000000',
      transparent: false,
      brightness: 0.5,
      bloom: true,
      bloomIterations: 8,
      bloomResolution: 256,
      bloomIntensity: 0.8,
      bloomThreshold: 0.6,
      bloomSoftKnee: 0.7,
      sunrays: true,
      sunraysResolution: 196,
      sunraysWeight: 1.0,
    }),
  });

  useEffect(() => {
    if (mainRef.current) {
      const simulation = new WebGLFluidEnhanced(mainRef.current);
      simulation.start();

      return () => {
        simulation.stop();
      };
    }
  }, []);

  return (
    <main
      className='relative -mt-14 flex h-screen items-center justify-center'
      ref={mainRef}
    >
      <div className='pointer-events-none absolute size-full max-w-7xl'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className='pointer-events-auto absolute left-2 top-16'
              variant='outline'
              size='icon'
            >
              <SettingsIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className='!size-[91.666667%] max-w-7xl'>
            <DialogHeader>
              <DialogTitle>Configuration</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form className='space-y-8'>
                <div className='flex flex-wrap gap-8'>
                  {Object.keys(formSchema.shape).map((key) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={key as keyof z.infer<typeof formSchema>}
                      render={({ field }) => (
                        <FormItem className='flex-grow'>
                          <FormLabel>{key}</FormLabel>
                          <FormControl>
                            {typeof field.value === 'boolean' ? (
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                onBlur={field.onBlur}
                              />
                            ) : (
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Button type='submit'>Apply</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
