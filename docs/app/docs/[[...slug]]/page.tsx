import { getPage, getPages } from '@/app/source';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Edit } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = getPage(params.slug);

  if (page == null) {
    notFound();
  }

  const MDX = page.data.exports.default;

  const path = `docs/content/${page.file.path}`;

  const footer = (
    <a
      href={`https://github.com/michaelbrusegard/WebGL-Fluid-Enhanced/blob/main/${path}`}
      target="_blank"
      rel="noreferrer noopener"
      className={buttonVariants({
        variant: 'secondary',
        size: 'sm',
        className: 'text-xs gap-1.5',
      })}
    >
      <Edit className="size-3" />
      Edit on Github
    </a>
  );

  return (
    <DocsPage
      toc={page.data.exports.toc}
      full={page.data.full}
      tableOfContent={{
        footer,
      }}
    >
      <DocsBody>
        <h1>{page.data.title}</h1>{' '}
        <p className="mb-8 text-lg text-muted-foreground">
          {page.data.description}
        </p>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = getPage(params.slug);

  if (page == null) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
