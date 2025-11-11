import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Panel – GitHub JSON CRUD",
  description: "Simple admin panel using GitHub as a JSON database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}> 
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col">
        <header className="border-b bg-white">
          <div className="text-center p-6 flex items-center justify-center">
            <h1 className="text-center font-semibold tracking-tight text-black/90 text-3xl">Admin Panel</h1>
          </div>
        </header>

        <main className="flex-1 w-full mx-auto">
          {children}
        </main>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}