import { Button } from '../Button';
import Plus from 'lucide-react/dist/esm/icons/plus';

export default function PerformanceCard() {
  return (
    <div className=" flex flex-col h-[144px] justify-between border border-blue-400 rounded-[12px] p-5 pb-4 bg-gradient-to-b from-blue-100 to-white">
      <p className=" text-blue-900 font-[600]">Credits Remaining</p>
      <div className="flex justify-between">
        <p className="text-6xl text-blue-900 font-[600]">23</p>
        <Button
          variant="outlineColor"
          size="sm"
          color="blue"
          className="mt-4 space-x-5"
        >
          <Plus /> Add More Credits
        </Button>
      </div>
    </div>
  );
}
