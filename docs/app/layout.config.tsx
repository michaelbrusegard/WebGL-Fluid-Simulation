import { source } from '@/app/source';
import { cn } from '@/utils';
import { type HomeLayoutProps } from 'fumadocs-ui/home-layout';
import { type DocsLayoutProps } from 'fumadocs-ui/layout';
import { BookText, Joystick } from 'lucide-react';

function Icon({ className, ...props }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-md bg-[#161b22] px-1 font-bold text-[#d5dce0]',
        className,
      )}
      {...props}
    >
      O
    </span>
  );
}

export const baseOptions: HomeLayoutProps = {
  githubUrl: 'https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced',
  nav: {
    title: (
      <>
        <Icon />
        <span className='font-medium'>WebGL Fluid Enhanced</span>
      </>
    ),
    transparentMode: 'none',
  },
  links: [
    {
      icon: <BookText />,
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      icon: <Joystick />,
      text: 'Playground',
      url: '/play',
      active: 'nested-url',
    },
  ],
};

export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  nav: {
    ...baseOptions.nav,
    transparentMode: 'none',
  },
  sidebar: {
    defaultOpenLevel: 0,
  },
};
