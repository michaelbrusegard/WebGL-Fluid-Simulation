import { type BaseLayoutProps, type DocsLayoutProps } from 'fumadocs-ui/layout';
import { pageTree } from '@/app/source';

export const baseOptions: BaseLayoutProps = {
  githubUrl: 'https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced',
  nav: {
    title: (
      <>
        <Icon />
        <span className="font-medium max-md:[header_&]:hidden">
          WebGL Fluid Enhanced
        </span>
      </>
    ),
    transparentMode: 'top',
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'Playground',
      url: '/play',
      active: 'nested-url',
    },
  ],
};

export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: pageTree,
};

export function Icon({ className, ...props }: { className?: string }) {
  return (
    <span
      className={
        'text-[#d5dce0] bg-[#161b22] font-bold flex items-center justify-center px-1 rounded-md' +
        className
      }
      {...props}
    >
      O
    </span>
  );
}
