'use client';

import DestinationsPageComponent from '@/components/DestinationsPage';
import { initialData } from '@/lib/data';

export default function DestinationsPage() {
  return <DestinationsPageComponent data={initialData} />;
}