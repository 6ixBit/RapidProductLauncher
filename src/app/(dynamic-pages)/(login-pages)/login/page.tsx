import { withBaseDescription, withBaseTitle } from '@/utils/seo';
import { Login } from './Login';

export const metadata = {
  title: withBaseTitle('Login'),
  description: withBaseDescription('Login page of Nextbase Essential version'),
};

export default function LoginPage() {
  return <Login />;
}
