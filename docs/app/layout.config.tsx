import { type BaseLayoutProps, type DocsLayoutProps } from 'fumadocs-ui/layout';
import { createMDXSource, defaultSchemas } from 'fumadocs-mdx';
import { z } from 'zod';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { create } from '@/components/ui/icon';
import { map } from '@/.map';

const utils = loader({
  baseUrl: '/docs',
  rootDir: 'docs',
  icon(icon) {
    if (icon && icon in icons)
      return create({ icon: icons[icon as keyof typeof icons] });
  },
  source: createMDXSource(map, {
    schema: {
      frontmatter: defaultSchemas.frontmatter.extend({
        preview: z.string().optional(),
        index: z.boolean().default(false),
      }),
    },
  }),
});

function Icon({ className, ...props }: { className?: string }) {
  return (
    <span
      className={
        'flex items-center justify-center rounded-md bg-[#161b22] px-1 text-[#d5dce0] font-bold' +
        className
      }
      {...props}
    >
      O
    </span>
  );
}

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
  tree: utils.pageTree,
  nav: {
    ...baseOptions.nav,
    transparentMode: 'none',
  },
  sidebar: {
    defaultOpenLevel: 0,
  },
};
