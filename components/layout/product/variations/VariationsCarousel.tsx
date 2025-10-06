'use client';

import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { JSX } from 'react';
import { useState } from 'react';
import Carousel from 'react-simply-carousel';

import CarouselItem from './CarouselItem';
import NavigationButton from './NavigationButton';

/**
 * Variations carousel
 * @param   {object}                 props       - Variations carousel props
 * @param   {Array<IProductsEntity>} props.items - array of products objects
 * @param   {number}                 props.total - total products count
 * @param   {string}                 props.lang  - Current language shortcode
 * @returns {JSX.Element}                        Product variations carousel component
 * @see {@link https://github.com/vadymshymko/react-simply-carousel?tab=readme-ov-file#usage Carousel docs}
 */
const VariationsCarousel = ({
  items,
  total,
  lang,
}: {
  items: Array<IProductsEntity> | undefined;
  total?: number;
  lang: string;
}): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!items || !total || total < 1) {
    return <></>;
  }

  const isCarousel = total > 2;
  const containerClass = isCarousel ? 'px-16 max-md:px-8' : '';

  return (
    <div
      className={
        'flex h-[130px] w-full items-center justify-center self-stretch ' +
        containerClass
      }
    >
      {!isCarousel ? (
        items.map((item: IProductsEntity, idx: number) => (
          <CarouselItem
            key={idx}
            item={item}
            index={idx}
            lang={lang}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        ))
      ) : (
        <Carousel
          infinite
          showSlidesBeforeInit={false}
          containerProps={{
            style: {
              userSelect: 'none',
              justifyContent: 'center',
              overflow: 'hidden',
            },
            className:
              'flex min-w-full wrap w-full flex-row w-full justify-center items-center gap-[4%] self-stretch',
          }}
          activeSlideProps={{
            style: {},
          }}
          forwardBtnProps={{
            children: <NavigationButton direction="right" />,
            style: {
              minWidth: 30,
              alignSelf: 'center',
            },
            className:
              'absolute cursor-pointer top-[calc(50%-15px)] z-10 right-0 size-[30px] group flex aspect-square items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
          }}
          backwardBtnProps={{
            children: <NavigationButton direction="left" />,
            style: {
              minWidth: 30,
              alignSelf: 'center',
            },
            className:
              'absolute cursor-pointer top-[calc(50%-15px)] z-10 left-0 size-[30px] group flex aspect-square items-center justify-center rounded-full border border-neutral-200 bg-white p-2 transition-colors hover:border-orange-500',
          }}
          preventScrollOnSwipe
          swipeTreshold={60}
          activeSlideIndex={currentIndex}
          onRequestChange={setCurrentIndex}
          itemsToShow={3}
          speed={400}
          centerMode={false}
        >
          {items.map((item: IProductsEntity, idx: number) => (
            <CarouselItem
              key={idx}
              item={item}
              index={idx}
              lang={lang}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default VariationsCarousel;
