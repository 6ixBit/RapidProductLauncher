import { CustomHead } from '@/components/CustomHead';
import { PRODUCT_NAME } from '@/constants';

export default function Head() {
  return (
    <>
      <CustomHead>
        <title>{`Security Settings | ${PRODUCT_NAME}`}</title>
      </CustomHead>
    </>
  );
}
