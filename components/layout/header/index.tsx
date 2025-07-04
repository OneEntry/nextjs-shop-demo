import type { FC } from 'react';

import { ServerProvider } from '@/app/store/providers/ServerProvider';

import Logo from './Logo';
import NavGroup from './nav/NavGroup';
import SearchBar from './search/SearchBar';

/**
 * Header section
 *
 * @returns React component
 */
const Header: FC = () => {
  // get props from server provider
  const [lang] = ServerProvider('lang');
  const [dict] = ServerProvider('dict');

  return (
    <header className="z-50 flex items-center justify-center bg-white px-5">
      <section className="mx-auto box-border flex w-full max-w-screen-xl grow flex-col justify-center self-stretch bg-white py-8">
        <div className="flex w-full max-w-screen-xl justify-between gap-8 max-md:flex-wrap max-md:gap-6 max-sm:gap-4">
          <Logo lang={lang} />
          <SearchBar dict={dict} lang={lang} />
          <NavGroup lang={lang} />
        </div>
      </section>
    </header>
  );
};

export default Header;
