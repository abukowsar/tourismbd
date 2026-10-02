import "./globals.css";
import LanguageTranslator from "./components/LanguageTranslator";

export const metadata = {
  title: "Tourism BD | Discover Bangladesh Safely",
  description:
    "Plan your Bangladesh trip: explore destinations, build an itinerary, check live weather and currency, learn Bangla phrases, and register for 24/7 tourist safety support.",
  keywords: [
    "Bangladesh tourism",
    "visit Bangladesh",
    "Cox's Bazar",
    "Sundarbans",
    "Sylhet",
    "Bangladesh travel guide",
    "tourist safety Bangladesh",
  ],
  openGraph: {
    title: "Tourism BD | Discover Bangladesh Safely",
    description:
      "Rivers, tea gardens, mangroves, beaches, and famous hospitality — plan and register your Bangladesh journey.",
    images: ["/assets/bangladesh-hero.png"],
    type: "website",
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export const viewport = {
  themeColor: "#0b3b2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Hind+Siliguri:wght@500;600&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <LanguageTranslator />
        {children}
      </body>
    </html>
  );
}
