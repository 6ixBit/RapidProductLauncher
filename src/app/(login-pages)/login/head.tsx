import { CustomHead } from '@/components/CustomHead';
import { PRODUCT_NAME } from '@/constants';

export default function Head() {
  return (
    <CustomHead>
      <title>{`Login | ${PRODUCT_NAME}`}</title>
    </CustomHead>
  );
}
