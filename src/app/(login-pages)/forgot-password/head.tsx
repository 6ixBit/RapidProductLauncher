import { CustomHead } from '@/components/CustomHead';
import { PRODUCT_NAME } from '@/constants';

export default function Head() {
  return (
    <CustomHead>
      <title>{`Forgot Password | ${PRODUCT_NAME}`}</title>
    </CustomHead>
  );
}
