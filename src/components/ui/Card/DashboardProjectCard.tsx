type DashboardProjectCardProps = {
  teamName: string;
  projectName: string;
  projectDescription: string;
};

export default function DashboardProjectCard({
  teamName,
  projectName,
  projectDescription,
}: DashboardProjectCardProps) {
  return (
    <div className="flex flex-col justify-between group bg-white hover:bg-gradient-to-tl from-blue-100 to-white cursor-pointer rounded-[12px] h-[184px] border border-gray-300 hover:border-blue-300 hover:shadow-lg p-5">
      <div>
        <p className="text-xl font-[600] text-black group-hover:text-blue-900 ">
          {projectName}
        </p>
        <p className="text-base font-[400] text-gray-600 group-hover:text-blue-600 ">
          {projectDescription}
        </p>
      </div>

      <div className="flex">
        <p className="text-base font-[500] text-gray-700">{teamName}</p>
      </div>
    </div>
  );
}
