import { baseOptions } from '@/app/layout.config';
import { HomeLayout } from 'fumadocs-ui/home-layout';
import type { ReactNode } from 'react';

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>;
}
