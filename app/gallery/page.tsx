'use client';

import GalleryPageComponent from '@/components/GalleryPage';
import { initialData } from '@/lib/data';

export default function GalleryPage() {
  return <GalleryPageComponent data={initialData} />;
};