import type { ReactNode } from 'react';

export default function FooterLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

function Footer(): React.ReactElement {
  return (
    <footer className='bg-card text-secondary-foreground mt-auto border-t py-12'>
      <div className='container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs'>
            Built with ❤️ by{' '}
            <a
              href='https://michaelbrusegard.com'
              rel='noreferrer noopener'
              target='_blank'
              className='font-semibold'
            >
              Michael
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
