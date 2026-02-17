import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "LinkedIn - Professional Networking Platform",
    template: "%s | LinkedIn",
  },
  description:
    "Connect with industry leaders, share your expertise, and discover opportunities that shape your career journey.",
  keywords: [
    "professional networking",
    "career development",
    "industry connections",
    "job opportunities",
  ],
  authors: [{ name: "LinkedIn Team" }],
  creator: "LinkedIn",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "LinkedIn - Professional Networking Platform",
    description:
      "Connect with industry leaders, share your expertise, and discover opportunities that shape your career journey.",
    siteName: "LinkedIn",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn - Professional Networking Platform",
    description:
      "Connect with industry leaders, share your expertise, and discover opportunities.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
