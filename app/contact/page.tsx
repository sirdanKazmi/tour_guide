import ContactPageComponent from '@/components/ContactPage';
import { initialData } from '@/lib/data';

export default function ContactRoute() {
  return <ContactPageComponent data={initialData} />;
}
