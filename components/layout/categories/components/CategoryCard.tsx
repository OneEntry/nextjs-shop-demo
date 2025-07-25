import { Baloo_2 as Baloo } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import CategoryAnimations from '../animations/CategoryAnimations';

interface CategoryCardProps {
  category: { title: string; link: string; imgSrc: string };
  index: number;
}

const baloo = Baloo({
  subsets: ['latin'],
  weight: ['400', '800'],
});

/**
 * Category card
 * @param category
 * @param index index of element in array for stagger
 *
 * @returns category card with animations
 */
const CategoryCard: FC<CategoryCardProps> = ({
  category: { imgSrc, title, link },
  index,
}) => {
  return (
    <CategoryAnimations
      className={`${baloo.className} block-card group relative flex w-1/4 grow flex-col justify-center overflow-hidden rounded-3xl text-2xl font-bold text-white transition-shadow duration-500 hover:shadow-xl max-md:w-full`}
      index={index}
    >
      <Link
        prefetch={true}
        href={link}
        className="relative flex size-full h-64 bg-slate-100 p-6"
      >
        <h2 className="z-10 mt-auto uppercase">{title}</h2>
        <Image
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          src={imgSrc ? imgSrc : '/images/card.svg'}
          alt={title}
          className="size-full rounded-3xl object-cover transition-all duration-500 group-hover:scale-125"
        />
        <div className="radial-hover"></div>
      </Link>
    </CategoryAnimations>
  );
};

export default CategoryCard;
