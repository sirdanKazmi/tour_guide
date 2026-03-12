import image1 from './GalleryImg/image1.jpeg';
import image2 from './GalleryImg/image2.jpeg';
import image3 from './GalleryImg/image3.jpeg';
import image4 from './GalleryImg/image4.jpeg';
import image5 from './GalleryImg/image5.jpeg';
import image6 from './GalleryImg/image6.jpeg';
import image7 from './GalleryImg/image7.jpeg';
import image8 from './GalleryImg/image8.jpeg';
import image9 from './GalleryImg/image9.jpeg';
import image10 from './GalleryImg/image10.jpeg';
import image11 from './GalleryImg/image11.jpeg';
import image12 from './GalleryImg/image12.jpeg';
import image13 from './GalleryImg/image13.jpeg';
import image14 from './GalleryImg/image14.jpeg';
import image15 from './GalleryImg/image15.jpeg';
import { StaticImageData } from 'next/image';

export interface GalleryImage {
  id: number;
  category: string;
  src: StaticImageData;
}

export const galleryImages: GalleryImage[] = [
  { id: 1, category: 'Mountains', src: image1 },
  { id: 2, category: 'Mountains', src: image2 },
  { id: 3, category: 'Mountains', src: image3 },
  { id: 4, category: 'Mountains', src: image4 },
  { id: 5, category: 'Coast', src: image5 },
  { id: 6, category: 'Coast', src: image6 },
  { id: 7, category: 'Coast', src: image7 },
  { id: 8, category: 'Coast', src: image8 },
  { id: 9, category: 'Forest', src: image9 },
  { id: 10, category: 'Forest', src: image10 },
  { id: 11, category: 'Forest', src: image11 },
  { id: 12, category: 'Forest', src: image12 },
  { id: 13, category: 'Desert', src: image13 },
  { id: 14, category: 'Desert', src: image14 },
  { id: 15, category: 'Desert', src: image15 },

];
