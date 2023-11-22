type BasicPageHeadingProps = {
  heading: string;
  subheading: string;
};

export default function BasicPageHeading({
  heading,
  subheading,
}: BasicPageHeadingProps) {
  return (
    <div className="flex flex-col w-[1080px]">
      <div>
        <p className="text-3xl font-[700] text-black mb-1 dark:text-white">
          {heading}
        </p>
        <p className="text-base font-[450] text-slate-600 dark:text-slate-700">
          {subheading}
        </p>
      </div>
    </div>
  );
}
