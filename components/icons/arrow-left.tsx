const ArrowLeftIcon = (props?: { active?: boolean }) => {
  return (
    <svg
      width="15"
      height="12"
      viewBox="0 0 15 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        'size-full group-hover:fill-orange-500 transition-colors duration-300 ' +
        (props?.active ? 'fill-orange-500' : 'fill-[#B0BCCE]')
      }
    >
      <path d="M6.735 1.03575C6.53997 0.844657 6.27548 0.737305 5.99971 0.737305C5.72393 0.737305 5.45945 0.844657 5.26442 1.03575L0.584346 5.62279C0.389373 5.81394 0.279842 6.07317 0.279842 6.34346C0.279842 6.61375 0.389373 6.87298 0.584346 7.06413L5.26442 11.6512C5.46057 11.8368 5.72328 11.9396 5.99597 11.9373C6.26865 11.9349 6.5295 11.8277 6.72233 11.6387C6.91516 11.4498 7.02454 11.1941 7.0269 10.9268C7.02927 10.6596 6.92445 10.4021 6.735 10.2098L3.91968 7.3628H13.7998C14.0757 7.3628 14.3402 7.2554 14.5352 7.06424C14.7303 6.87308 14.8398 6.6138 14.8398 6.34346C14.8398 6.07311 14.7303 5.81384 14.5352 5.62268C14.3402 5.43151 14.0757 5.32412 13.7998 5.32412H3.91968L6.735 2.4771C6.92997 2.28595 7.0395 2.02672 7.0395 1.75643C7.0395 1.48613 6.92997 1.22691 6.735 1.03575Z" />
    </svg>
  );
};

export default ArrowLeftIcon;