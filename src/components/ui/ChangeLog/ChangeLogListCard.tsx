type ChangeLogListCardProps = {
  date: string;
  title: string;
  description: string;
};

export default function ChangeLogListCard({
  date,
  title,
  description,
}: ChangeLogListCardProps) {
  return (
    <div
      className="grid grid-cols-2 gap-4 border b-gray-200 rounded-lg px-6 py-4 shadow-sm w-full"
      style={{ gridTemplateColumns: '160px auto' }}
    >
      <p>{date}</p>
      <div>
        <p className="text-lg font-[600] text-blue-500">{title}</p>
        <p className="text-base font-[500] text-black">{description}</p>
      </div>
    </div>
  );
}
