interface BrandLogoProps {
  imageSrc: string;
  name: string;
  compact?: boolean;
}

function BrandLogo({ imageSrc, name, compact = false }: BrandLogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        <img src={imageSrc} alt={`${name} 로고`} className="size-full object-contain" />
      </div>
      {!compact && <span className="truncate text-lg font-bold tracking-tight">{name}</span>}
    </div>
  );
}

export { BrandLogo };
