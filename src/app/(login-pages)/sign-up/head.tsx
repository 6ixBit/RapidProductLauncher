import { CustomHead } from '@/components/CustomHead';
import { PRODUCT_NAME } from '@/constants';

export default function Head() {
  return (
    <CustomHead>
      <title>{`Sign Up | ${PRODUCT_NAME}`}</title>
    </CustomHead>
  );
}
