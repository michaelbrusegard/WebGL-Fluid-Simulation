'use client';

import WebGLFluidEnhanced from '../../../../dist/index.es.js';
import { Button } from '@/components/ui/button';
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
  FormDescription,
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
    <main className='-mt-14 h-screen' ref={mainRef}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className='absolute left-2 top-16'
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
              <FormField
                control={form.control}
                name='simResolution'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='shadcn' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
