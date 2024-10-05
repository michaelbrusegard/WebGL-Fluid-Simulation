'use client';

import WebGLFluidEnhanced, { defaultConfig } from '../../../../dist/index.es';
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
import { Loader } from '@/components/ui/loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, CopyIcon, KeyboardIcon, SettingsIcon } from 'lucide-react';
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function PlayPage() {
  const mainRef = useRef(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useQueryStates({
    simResolution: parseAsInteger
      .withDefault(defaultConfig.simResolution)
      .withOptions({ clearOnDefault: true }),
    dyeResolution: parseAsInteger
      .withDefault(defaultConfig.dyeResolution)
      .withOptions({ clearOnDefault: true }),
    captureResolution: parseAsInteger
      .withDefault(defaultConfig.captureResolution)
      .withOptions({ clearOnDefault: true }),
    densityDissipation: parseAsFloat
      .withDefault(defaultConfig.densityDissipation)
      .withOptions({ clearOnDefault: true }),
    velocityDissipation: parseAsFloat
      .withDefault(defaultConfig.velocityDissipation)
      .withOptions({ clearOnDefault: true }),
    pressure: parseAsFloat
      .withDefault(defaultConfig.pressure)
      .withOptions({ clearOnDefault: true }),
    pressureIterations: parseAsInteger
      .withDefault(defaultConfig.pressureIterations)
      .withOptions({ clearOnDefault: true }),
    curl: parseAsFloat
      .withDefault(defaultConfig.curl)
      .withOptions({ clearOnDefault: true }),
    splatRadius: parseAsFloat
      .withDefault(defaultConfig.splatRadius)
      .withOptions({ clearOnDefault: true }),
    splatForce: parseAsInteger
      .withDefault(defaultConfig.splatForce)
      .withOptions({ clearOnDefault: true }),
    shading: parseAsBoolean
      .withDefault(defaultConfig.shading)
      .withOptions({ clearOnDefault: true }),
    colorful: parseAsBoolean
      .withDefault(defaultConfig.colorful)
      .withOptions({ clearOnDefault: true }),
    colorUpdateSpeed: parseAsInteger
      .withDefault(defaultConfig.colorUpdateSpeed)
      .withOptions({ clearOnDefault: true }),
    colorPalette: parseAsArrayOf(parseAsString)
      .withDefault(defaultConfig.colorPalette)
      .withOptions({ clearOnDefault: true }),
    hover: parseAsBoolean
      .withDefault(defaultConfig.hover)
      .withOptions({ clearOnDefault: true }),
    inverted: parseAsBoolean
      .withDefault(defaultConfig.inverted)
      .withOptions({ clearOnDefault: true }),
    backgroundColor: parseAsString
      .withDefault(defaultConfig.backgroundColor)
      .withOptions({ clearOnDefault: true }),
    transparent: parseAsBoolean
      .withDefault(true)
      .withOptions({ clearOnDefault: true }),
    brightness: parseAsFloat
      .withDefault(defaultConfig.brightness)
      .withOptions({ clearOnDefault: true }),
    bloom: parseAsBoolean
      .withDefault(defaultConfig.bloom)
      .withOptions({ clearOnDefault: true }),
    bloomIterations: parseAsInteger
      .withDefault(defaultConfig.bloomIterations)
      .withOptions({ clearOnDefault: true }),
    bloomResolution: parseAsInteger
      .withDefault(defaultConfig.bloomResolution)
      .withOptions({ clearOnDefault: true }),
    bloomIntensity: parseAsFloat
      .withDefault(defaultConfig.bloomIntensity)
      .withOptions({ clearOnDefault: true }),
    bloomThreshold: parseAsFloat
      .withDefault(defaultConfig.bloomThreshold)
      .withOptions({ clearOnDefault: true }),
    bloomSoftKnee: parseAsFloat
      .withDefault(defaultConfig.bloomSoftKnee)
      .withOptions({ clearOnDefault: true }),
    sunrays: parseAsBoolean
      .withDefault(defaultConfig.sunrays)
      .withOptions({ clearOnDefault: true }),
    sunraysResolution: parseAsInteger
      .withDefault(defaultConfig.sunraysResolution)
      .withOptions({ clearOnDefault: true }),
    sunraysWeight: parseAsFloat
      .withDefault(defaultConfig.sunraysWeight)
      .withOptions({ clearOnDefault: true }),
  });

  const formSchema = z.object({
    simResolution: z.number().default(config.simResolution),
    dyeResolution: z.number().default(config.dyeResolution),
    captureResolution: z.number().default(config.captureResolution),
    densityDissipation: z.number().default(config.densityDissipation),
    velocityDissipation: z.number().default(config.velocityDissipation),
    pressure: z.number().default(config.pressure),
    pressureIterations: z.number().default(config.pressureIterations),
    curl: z.number().default(config.curl),
    splatRadius: z.number().default(config.splatRadius),
    splatForce: z.number().default(config.splatForce),
    shading: z.boolean().default(config.shading),
    colorful: z.boolean().default(config.colorful),
    colorUpdateSpeed: z.number().default(config.colorUpdateSpeed),
    colorPalette: z.array(z.string()).default(config.colorPalette),
    hover: z.boolean().default(config.hover),
    inverted: z.boolean().default(config.inverted),
    backgroundColor: z.string().default(config.backgroundColor),
    transparent: z.boolean().default(config.transparent),
    brightness: z.number().default(config.brightness),
    bloom: z.boolean().default(config.bloom),
    bloomIterations: z.number().default(config.bloomIterations),
    bloomResolution: z.number().default(config.bloomResolution),
    bloomIntensity: z.number().default(config.bloomIntensity),
    bloomThreshold: z.number().default(config.bloomThreshold),
    bloomSoftKnee: z.number().default(config.bloomSoftKnee),
    sunrays: z.boolean().default(config.sunrays),
    sunraysResolution: z.number().default(config.sunraysResolution),
    sunraysWeight: z.number().default(config.sunraysWeight),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.safeParse({}).data,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await setConfig(values);
    setIsConfigOpen(false);
  }

  function onReset() {
    form.reset({ ...defaultConfig, transparent: true });
  }

  async function handleCopy() {
    const customConfig = Object.fromEntries(
      Object.entries(config).filter(
        ([key, value]) =>
          value !== (defaultConfig as Record<string, unknown>)[key],
      ),
    );

    if (Object.keys(customConfig).length === 0) {
      toast('', {
        description:
          'No changes to copy, config is the same as the default config...',
      });
    } else {
      const formattedConfig = JSON.stringify(customConfig, null, 2);
      await navigator.clipboard.writeText(formattedConfig);
      toast(<pre>{formattedConfig}</pre>);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    if (mainRef.current) {
      simulationRef.current = new WebGLFluidEnhanced(mainRef.current);
      simulationRef.current.setConfig(config);
      simulationRef.current.start();
      setIsLoading(false);

      function handleKeyDown(event: KeyboardEvent) {
        if (simulationRef.current) {
          switch (event.key) {
            case ' ':
              event.preventDefault();
              simulationRef.current.multipleSplats(5);
              break;
            case 'p':
            case 'P':
              const drawWhilePaused = event.key === 'P';
              const isPaused =
                simulationRef.current.togglePause(drawWhilePaused);
              toast(
                isPaused
                  ? `Simulation paused${drawWhilePaused ? ', drawing enabled' : ''}`
                  : 'Simulation resumed',
              );
              break;
            case 's':
              simulationRef.current.downloadScreenshot();
              toast(
                <>
                  <strong>'fluid.png'</strong> saved to <em>Downloads</em>{' '}
                  folder.
                </>,
              );
              break;
          }
        }
      }
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.classList.remove('overflow-hidden');
        if (simulationRef.current) {
          simulationRef.current.stop();
          simulationRef.current = null;
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.setConfig(config);
    }
  }, [config]);

  return (
    <main
      className='relative -mt-14 flex h-full items-center justify-center bg-white dark:bg-black'
      ref={mainRef}
    >
      {isLoading ? (
        <Loader size='lg' />
      ) : (
        <div className='pointer-events-none absolute size-full max-w-7xl'>
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button
                className='pointer-events-auto absolute left-2 top-16 z-10'
                variant='outline'
                size='icon'
                aria-label='Configuration Menu'
              >
                <SettingsIcon aria-hidden='true' />
              </Button>
            </DialogTrigger>
            <DialogContent className='!size-[91.666667%] max-w-7xl overflow-auto'>
              <DialogHeader className='flex flex-row items-center justify-start gap-3'>
                <DialogTitle>Configuration</DialogTitle>
                <Button
                  className='size-6'
                  size='icon'
                  variant='ghost'
                  aria-label='Copy Config'
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <CheckIcon className='size-4' aria-hidden='true' />
                  ) : (
                    <CopyIcon className='size-4' aria-hidden='true' />
                  )}
                </Button>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <div className='xs:grid-cols-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4'>
                    {Object.keys(formSchema.shape).map((key) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof z.infer<typeof formSchema>}
                        render={({ field }) => (
                          <FormItem className='h-20 space-y-0'>
                            <FormLabel>{key}</FormLabel>
                            <FormControl>
                              {typeof field.value === 'boolean' ? (
                                <Checkbox
                                  className='h-10 w-full rounded-md'
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              ) : Array.isArray(field.value) ? (
                                <Input
                                  value={field.value.join(',')}
                                  onChange={(e) =>
                                    field.onChange(e.target.value.split(','))
                                  }
                                  onBlur={field.onBlur}
                                  placeholder='#FF0000,#00FF00,#0000FF'
                                  type='text'
                                />
                              ) : (
                                <Input
                                  value={field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(
                                      typeof field.value === 'number'
                                        ? parseFloat(value)
                                        : value,
                                    );
                                  }}
                                  onBlur={field.onBlur}
                                  type={
                                    typeof field.value === 'number'
                                      ? 'number'
                                      : 'text'
                                  }
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <div className='flex items-center justify-start gap-2'>
                    <Button type='submit'>Apply</Button>
                    <Button type='button' variant='outline' onClick={onReset}>
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className='pointer-events-auto absolute left-14 top-16 z-10'
                variant='outline'
                size='icon'
                aria-label='Configuration Menu'
              >
                <KeyboardIcon aria-hidden='true' />
              </Button>
            </DialogTrigger>
            <DialogContent className='overflow-auto'>
              <DialogHeader className='mb-6'>
                <DialogTitle>Keybinds</DialogTitle>
              </DialogHeader>
              <div className='bg-popover mb-4 flex h-20 flex-col rounded-md p-4'>
                <div className='mb-2 flex items-center'>
                  <kbd className='bg-muted mr-2 rounded px-2 py-1'>space</kbd>
                  <span>: multipleSplats</span>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Is set to splat 5 splats
                </p>
              </div>
              <div className='bg-popover mb-4 flex h-20 flex-col rounded-md p-4'>
                <div className='mb-2 flex items-center'>
                  <kbd className='bg-muted mr-2 rounded px-2 py-1'>p</kbd>
                  <span>: togglePause</span>
                </div>
              </div>
              <div className='bg-popover mb-4 flex h-20 flex-col rounded-md p-4'>
                <div className='mb-2 flex items-center'>
                  <kbd className='bg-muted mr-2 rounded px-2 py-1'>shift</kbd> +
                  <kbd className='bg-muted mr-2 rounded px-2 py-1'>p</kbd>
                  <span>: togglePause</span>
                </div>
                <p className='text-muted-foreground text-sm'>
                  Has drawWhilePaused enabled{' '}
                </p>
              </div>
              <div className='bg-popover mb-4 flex h-20 flex-col rounded-md p-4'>
                <div className='mb-2 flex items-center'>
                  <kbd className='bg-muted mr-2 rounded px-2 py-1'>s</kbd>
                  <span>: downloadScreenshot</span>
                </div>
                <p className='text-muted-foreground text-sm'>
                  NOTE: Screenshots often look better with transparency disabled
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </main>
  );
}
