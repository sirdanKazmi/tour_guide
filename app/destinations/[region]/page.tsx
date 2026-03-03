import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Calendar, 
  Thermometer, 
  Globe, 
  Wallet,
  Sparkles,
  ArrowRight,
  Hotel
} from 'lucide-react';
import { 
  getRegionById, 
  getAllRegionIds, 
  Region 
} from '@/lib/gb-destinations';
import RegionPageClient from '@/app/destinations/[region]/RegionPageClient';

// Generate static params for all regions
export function generateStaticParams() {
  const regionIds = getAllRegionIds();
  return regionIds.map((id) => ({
    region: id,
  }));
}

// Generate metadata for each region
export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: regionId } = await params;
  const region = getRegionById(regionId);
  
  if (!region) {
    return {
      title: 'Region Not Found',
    };
  }

  return {
    title: `${region.name} | Gilgit-Baltistan Travel Guide`,
    description: `${region.overview.slice(0, 160)}... Discover top attractions, best time to visit, activities, and travel tips for ${region.name}.`,
    keywords: [
      region.name,
      'Gilgit-Baltistan',
      'Pakistan travel',
      'Karakoram',
      'mountain destinations',
      ...region.attractions.map(a => a.name),
    ],
    openGraph: {
      title: `${region.name} - ${region.tagline}`,
      description: region.overview,
      images: [
        {
          url: region.heroImage,
          width: 1200,
          height: 630,
          alt: `${region.name} - ${region.tagline}`,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
  };
}

interface RegionPageProps {
  params: Promise<{
    region: string;
  }>;
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region: regionId } = await params;
  const region = getRegionById(regionId);

  if (!region) {
    notFound();
  }

  return <RegionPageClient region={region} />;
}
