import { withBaseDescription, withBaseTitle } from '@/utils/seo';
import { ForgotPassword } from './ForgotPassword';

export const metadata = {
  title: withBaseTitle('Forgot Password'),
  description: withBaseDescription('forgot password page of Nextbase Essentail version'),
}

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
