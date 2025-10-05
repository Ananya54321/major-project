import './global.css';
import Header from '../shared/widgets';

export const metadata = {
  title: 'Welcome to furever',
  description: 'A great place for pet lovers!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Header />
      <body>{children}</body>
    </html>
  );
}
