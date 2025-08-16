import "../styles/globals.css";

export const metadata = {
  title: "Lasavo — AI Couture for Everyone",
  description: "Upgrade your wardrobe with Designer DNA™ — bespoke transformations in 7 days."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
