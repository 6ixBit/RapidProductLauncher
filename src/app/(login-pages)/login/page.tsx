import { withBaseDescription, withBaseTitle } from '@/utils/seo';
import { Login } from './Login';

export const metadata={
  title: withBaseTitle('Login'),
  description: withBaseDescription('login page of Nextbase Essentail version'),
  
}

export default function LoginPage() {
  return <Login />;
}
