'use client';

import AboutPageComponent from '@/components/AboutPage';
import { initialData } from '@/lib/data';

export default function AboutPage() {
  return <AboutPageComponent data={initialData} />;
}