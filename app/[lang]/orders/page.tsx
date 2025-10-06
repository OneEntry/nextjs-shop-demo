import type { Metadata } from 'next';
import type { JSX } from 'react';
import { Suspense } from 'react';

import WithSidebar from '@/app/[lang]/[page]/WithSidebar';
import { getBlockByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import OrdersPage from '@/components/layout/orders';
import Loader from '@/components/shared/Loader';
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

/**
 * Orders page
 * @param   {PageProps}                 props        - Page props
 * @param   {Promise<{ lang: string }>} props.params - Page params
 * @returns {Promise<JSX.Element>}                   Orders page layout JSX.Element
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 */
const OrdersPageLayout = async ({
  params,
}: PageProps): Promise<JSX.Element> => {
  const { lang } = await params;
  // Get the dictionary from the API and set the server provider.
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // Get block by marker from the API.
  const { block, isError } = await getBlockByMarker('orders_settings', lang);

  // Return nothing if block data is not available or an error occurred
  if (!block || isError) {
    return <></>;
  }

  return (
    <section className="relative mx-auto box-border flex min-h-80 w-full max-w-(--breakpoint-xl) shrink-0 grow flex-col self-stretch">
      <div className="flex w-full flex-col items-center gap-5 bg-white">
        <WithSidebar lang={lang}>
          <Suspense fallback={<Loader />}>
            <OrdersPage
              lang={lang}
              dict={dict}
              settings={block.attributeValues}
            />
          </Suspense>
        </WithSidebar>
      </div>
    </section>
  );
};

export default OrdersPageLayout;

/**
 * Pre-generation page params
 * @returns {Promise<object[]>} Static params for pre-generation
 */
export async function generateStaticParams(): Promise<object[]> {
  const params: Array<{ lang: string }> = [];
  for (const lang of i18n.locales) {
    params.push({ lang });
  }
  return params;
}

/**
 * Generates metadata for the orders page, including title, description, OpenGraph tags and canonical URL
 * @param   {object}                    metadataParams        - Metadata params
 * @param   {Promise<{ lang: string }>} metadataParams.params - An object containing the language parameter
 * @returns {Promise<Metadata>}                               Promise resolving to Metadata object with page metadata information
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const title = 'My orders';
  const description = 'Order history and processing statuses.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${lang}/orders`,
      type: 'website',
    },
    alternates: {
      canonical: `/${lang}/orders`,
    },
  };
}
