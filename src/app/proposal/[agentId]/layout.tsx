import type { Metadata } from "next";

type Props = {
  params: Promise<{ agentId: string }>;
};

// Personalized metadata per agent
const AGENT_META: Record<string, { name: string; description: string }> = {
  'greg-caseley': {
    name: 'Greg',
    description: "Your followers get answers to their real estate questions. You get consistent, branded content — scheduled and measured to ensure your social media is helping your business.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agentId } = await params;
  const agent = AGENT_META[agentId] || {
    name: 'You',
    description: 'Custom content package ready for review.'
  };

  const title = `${agent.name}, let's build on this momentum`;

  return {
    title: `${title} | Syntellic`,
    description: agent.description,
    openGraph: {
      title,
      description: agent.description,
      type: "website",
      siteName: "Syntellic",
    },
    twitter: {
      card: "summary",
      title,
      description: agent.description,
    },
  };
}

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
