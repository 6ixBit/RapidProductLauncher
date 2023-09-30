import { withBaseTitle, withBaseDescription } from '@/utils/seo';
import { UpdatePassword } from './UpdatePassword';

export const metadata = {
  title: withBaseTitle('Update Password'),
  description: withBaseDescription('update password page of Nextbase Essentail version'),
  
}

export default function UpdatePasswordPage() {
  return <UpdatePassword />;
}
