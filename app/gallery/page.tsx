import GalleryPageComponent from '@/components/GalleryPage';
import { initialData } from '@/lib/data';

export default function GalleryRoute() {
  return <GalleryPageComponent data={initialData} />;
}