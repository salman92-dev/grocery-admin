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
title: 'Admin Panel – GitHub JSON CRUD',
description: 'Simple admin panel using GitHub as a JSON database',
};

export default function RootLayout({ children }) {
return (
<html lang="en">
<body className="bg-gray-50 text-gray-900 antialiased">
<div className="max-w-7xl mx-auto p-6">
<h1 className="text-2xl font-bold text-black">Admin Panel – Fresh Organic Products</h1>
{/* <p className="text-sm text-gray-800 mt-1">Backed by product.json in your GitHub repo</p> */}
<div className="mt-6">{children}</div>
  <Toaster position="center-center" reverseOrder={false} />
</div>
</body>
</html>
);
}
