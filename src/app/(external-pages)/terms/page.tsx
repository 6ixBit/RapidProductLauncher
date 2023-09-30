import { withBaseDescription, withBaseTitle } from '@/utils/seo';

export const metadata = {
  title: withBaseTitle('Terms'),
  description: withBaseDescription('terms of Nextbase Essentail version'),
};

export default function TermsPage() {
  return <p>Your terms</p>;
}
