import { baseOptions } from '@/app/layout.config';
import { Layout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <Layout {...baseOptions}>
      {children}
      <Footer />
    </Layout>
  );
}

function Footer(): React.ReactElement {
  return (
    <footer className="mt-auto border-t bg-card py-12 text-secondary-foreground">
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs">
            Built with ❤️ by{' '}
            <a
              href="https://fuma-dev.vercel.app"
              rel="noreferrer noopener"
              target="_blank"
              className="font-semibold"
            >
              Michael
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
