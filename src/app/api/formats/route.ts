import { NextResponse } from 'next/server';
import { CAROUSEL_FORMATS } from '@/lib/templates/carouselFormats';

// Expose carousel formats with their questions for agent-app to fetch
export async function GET() {
  // Transform to a more friendly format for the agent app
  const formats = CAROUSEL_FORMATS.map(format => ({
    id: format.id,
    name: formatIdToName(format.id),
    description: getFormatDescription(format.id),
    icon: getFormatIcon(format.id),
    color: getFormatColor(format.id),
    frames: format.frames,
    day: format.day,
    audience: format.audience,
    sampleTopics: format.sampleTopics,
    questions: format.questions || [],
  }));

  return NextResponse.json(formats);
}

function formatIdToName(id: string): string {
  const names: Record<string, string> = {
    'MarketPulseCarousel': 'Market Stats',
    'NeighbourhoodGuideCarousel': 'Neighbourhood Guide',
    'ProcessTimelineCarousel': 'Process Timeline',
    'MythVsFactCarousel': 'Myth vs Fact',
    'ClientQuestionsCarousel': 'Client Q&A',
    'ThisOrThatCarousel': 'This or That',
    'BuyerObjectionsCarousel': 'Buyer Guide',
  };
  return names[id] || id;
}

function getFormatDescription(id: string): string {
  const descriptions: Record<string, string> = {
    'MarketPulseCarousel': 'Local market updates - average prices, days on market, trends in specific areas.',
    'NeighbourhoodGuideCarousel': 'Spotlight local areas - what makes them special, price ranges, lifestyle.',
    'ProcessTimelineCarousel': 'Walk through the buying or selling process step by step.',
    'MythVsFactCarousel': 'Bust common misconceptions with facts.',
    'ClientQuestionsCarousel': 'Answer real questions from your clients.',
    'ThisOrThatCarousel': 'Compare options - Condo vs House, Rural vs Urban, Build vs Buy.',
    'BuyerObjectionsCarousel': 'Address common buyer concerns and objections.',
  };
  return descriptions[id] || '';
}

function getFormatIcon(id: string): string {
  const icons: Record<string, string> = {
    'MarketPulseCarousel': 'TrendingUp',
    'NeighbourhoodGuideCarousel': 'Map',
    'ProcessTimelineCarousel': 'Clock',
    'MythVsFactCarousel': 'Scale',
    'ClientQuestionsCarousel': 'MessageCircle',
    'ThisOrThatCarousel': 'GitCompare',
    'BuyerObjectionsCarousel': 'HelpCircle',
  };
  return icons[id] || 'Sparkles';
}

function getFormatColor(id: string): string {
  const colors: Record<string, string> = {
    'MarketPulseCarousel': '#10b981',
    'NeighbourhoodGuideCarousel': '#f59e0b',
    'ProcessTimelineCarousel': '#6366f1',
    'MythVsFactCarousel': '#ef4444',
    'ClientQuestionsCarousel': '#8b5cf6',
    'ThisOrThatCarousel': '#f59e0b',
    'BuyerObjectionsCarousel': '#3b82f6',
  };
  return colors[id] || '#3b82f6';
}
