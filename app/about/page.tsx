import AboutPageComponent from '@/components/AboutPage';
import { initialData } from '@/lib/data';

export default function AboutRoute() {
  return <AboutPageComponent data={initialData} />;
}