import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Custom Content Package | Syntellic",
  description: "Professional real estate carousels and listing graphics, designed specifically for your brand and audience.",
  openGraph: {
    title: "Your Custom Content Package",
    description: "Professional real estate carousels and listing graphics, designed specifically for your brand and audience.",
    type: "website",
    siteName: "Syntellic",
  },
  twitter: {
    card: "summary",
    title: "Your Custom Content Package",
    description: "Professional real estate carousels and listing graphics, designed specifically for your brand.",
  },
};

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
