import Image, { StaticImageData } from 'next/image';

type HelpCardProps = {
  heading: string;
  subheading: string;
  image: StaticImageData;
};

export default function HelpCard({
  heading,
  subheading,
  image,
}: HelpCardProps) {
  return (
    <div className="flex flex-col gap-2 p-3 group rounded-xl bg-slate-50 border border-slate-200">
      <div className="h-full overflow-hidden rounded-xl">
        <Image
          src={image}
          alt="help-image"
          className="rounded-xl group-hover:scale-105"
        />
      </div>

      <div>
        <p className="text-lg font-[600]">{heading}</p>
        <p className="text-base font-[500]">{subheading}</p>
      </div>
    </div>
  );
}
