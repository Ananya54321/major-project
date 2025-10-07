import './global.css';
import Header from '../shared/widgets';
import {Poppins, Roboto} from "next/font/google"
import Providers from './providers';

export const metadata = {
  title: 'Welcome to furever',
  description: 'A great place for pet lovers!',
};

const roboto = {
  subsets : ['latin'],
  weight : ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto'
}

const poppins = {
  subsets : ['latin'],
  weight : ['100', '300', '400', '500', '700', '900'],
  variable: '--font-poppins'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <Providers>
          <Header />
          {children}
        </Providers>
        </body>
    </html>
  );
}
