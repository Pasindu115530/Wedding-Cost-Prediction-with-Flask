import './globals.css';

export const metadata = {
  title: 'Wedding Cost Predictor',
  description: 'Estimate your wedding costs with our AI-powered prediction tool.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}