import { withBaseDescription, withBaseTitle } from '@/utils/seo';
import { SignUp } from './Signup';

export const metadata = {
  title: withBaseTitle('Sign Up'),
  description: withBaseDescription('sign up page of Nextbase Essentail version'),
  
}

export default function SignupPage() {
  return <SignUp />;
}
