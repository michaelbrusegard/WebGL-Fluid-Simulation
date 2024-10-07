import { ImageSwitcher } from '@/components/ImageSwitcher';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Joystick, Library } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='flex h-screen flex-col justify-center text-center'>
      <section className='container relative flex flex-col justify-center gap-8 xl:h-[calc(100vh-4rem)] xl:flex-row'>
        <aside className='my-16 flex flex-col items-center self-center xl:my-24 xl:-mr-10 xl:ml-10 xl:flex-1 xl:items-start'>
          <h1 className='text-6xl md:text-8xl'>WebGL Fluid Enhanced</h1>
          <p className='my-8 text-center text-2xl md:text-4xl xl:text-left'>
            WebGL Fluid Simulation for
            <br />
            modern webpages
          </p>
          <nav className='flex flex-wrap gap-4'>
            <Link
              href='/docs'
              className={cn(
                buttonVariants({
                  size: 'lg',
                }),
                'text-md w-full rounded-full sm:w-auto',
              )}
            >
              <Library className='mr-2 inline-block' size={20} />
              Documentation
            </Link>
            <Link
              href='/play'
              className={cn(
                buttonVariants({
                  size: 'lg',
                  variant: 'secondary',
                }),
                'text-md w-full rounded-full sm:w-auto',
              )}
            >
              <Joystick className='-ml-1 mr-2 inline-block' size={20} />
              Playground
            </Link>
          </nav>
        </aside>
        <aside className='my-4 flex items-center justify-center xl:my-8 xl:flex-1'>
          <ImageSwitcher />
        </aside>
      </section>
    </main>
  );
}
