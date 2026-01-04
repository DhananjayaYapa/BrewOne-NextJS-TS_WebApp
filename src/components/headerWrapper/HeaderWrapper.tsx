'use client';

import { usePathname } from 'next/navigation';
import HeaderBar from '@/components/headerBar/headerBar';

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noHeaderPaths = ["/"];

  const shouldShowHeader = !noHeaderPaths.includes(pathname);

  return (
    <>
      {shouldShowHeader ? (
        <HeaderBar>
          {children}
        </HeaderBar>
      ) : (
        children
      )}
    </>
  );
}
