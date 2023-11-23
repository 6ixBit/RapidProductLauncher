// do not cache this layout
export const revalidate = 0;
export const fetchCache = 'only-no-store';
export const dynamic = 'force-dynamic';

export const metadata = {
  icons: {
    icon: '/images/logo-black-main.ico',
  },
  title: 'Nextbase Essential',
  description: 'Nextbase Essential',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
