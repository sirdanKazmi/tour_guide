export interface Guide {
  name: string;
  title: string;
  bio: string;
  profilePhoto: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socials: {
    instagram: string;
    facebook: string;
  };
}

export interface Destination {
  id: number;
  name: string;
  region: string;
  description: string;
  image: string;
  activities: string[];
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  rating: number;
  text: string;
  image: string;
}

export interface GalleryItem {
  id: number;
  category: string;
  image: string;
}

export interface TourData {
  guide: Guide;
  destinations: Destination[];
  services: Service[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
}

export const initialData: TourData = {
  guide: {
    name: "Syed Hidayat Hashmi",
    title: "Professional Adventure Guide",
    bio: "With over 10 years of experience exploring the world's most breathtaking destinations, I'm passionate about creating unforgettable journeys. From mountain peaks to hidden coastal gems, I've guided hundreds of travelers to discover the beauty and culture of extraordinary places.",
    profilePhoto: "/about/about.png",
    phone: "03249429323",
    whatsapp: "03249429323",
    email: "shyedhidayat.hashmi@gmail.com",
    address: " Main Bazaar, Skardu, Gilgit-Baltistan, Pakistan ",
    socials: {
      instagram: "https://www.instagram.com/smilesmiles1234/?hl=en",
      facebook: "https://www.facebook.com/syedhidayat.hashmi"
    }
  },
  destinations: [
    {
      id: 1,
      name: "Mountain Paradise",
      region: "Mountains",
      description: "Explore the majestic mountains of Gilgit-Baltistan, home to some of the world’s highest peaks including K2. Visitors can enjoy trekking, climbing, and breathtaking views of glaciers, valleys, and alpine landscapes.",
      image: "/image/image1.jpeg",
      activities: ["Hiking", "Photography", "Wildlife"]
    },
    {
      id: 2,
      name: "Coastal Wonders",
      region: "Coast",
      description: "Although Gilgit-Baltistan has no sea coast, it offers beautiful lakes and rivers that create a similar peaceful water experience. Famous lakes like Attabad Lake and Satpara lake attract tourists with crystal-clear blue water and boating activities.",
      image: "/image/image2.jpg",
      activities: ["Beach", "Snorkeling", "Sunset Watching"]
    },
    {
      id: 3,
      name: "Ancient Forest Trek",
      region: "Forest",
      description: "The forests of Gilgit-Baltistan provide excellent trekking opportunities. Areas like Deosai National Park and nearby valleys feature rich wildlife, alpine plants, and peaceful forest trails.",
      image: "/image/image3.png",
      activities: ["Hiking", "Nature Study", "Camping"]
    },
    {
      id: 4,
      name: "Desert Expedition",
      region: "Desert",
      description: "Visitors can explore the unique cold desert landscape of SarfaRanga Cold Desert, where sand dunes exist between high mountains. This rare desert offers jeep safaris, photography spots, and stunning sunset views.",
      image: "/image/image4.webp",
      activities: ["Safari", "Stargazing", "Photography"]
    }
  ],
  services: [
    {
      icon: "Mountain",
      title: "Guided Adventures",
      description: "Expert-led tours to incredible destinations"
    },
    {
      icon: "Users",
      title: "Group Tours",
      description: "Join like-minded travelers on group expeditions"
    },
    {
      icon: "Compass",
      title: "Custom Itineraries",
      description: "Personalized trips tailored to your interests"
    },
    {
      icon: "Camera",
      title: "Photography Tours",
      description: "Capture stunning moments with photo-focused trips"
    }
  ],
  testimonials: [
    // {
    //   name: "Michael Chen",
    //   rating: 5,
    //   text: "Sarah made our mountain trek absolutely unforgettable! Her knowledge and enthusiasm brought every location to life.",
    //   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    // },
    // {
    //   name: "Emma Rodriguez",
    //   rating: 5,
    //   text: "The coastal tour was beyond amazing. Sarah's attention to detail and care for our group was exceptional.",
    //   image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    // },
    // {
    //   name: "David Kim",
    //   rating: 5,
    //   text: "Best adventure guide ever! Professional, fun, and truly passionate about creating memorable experiences.",
    //   image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    // }
  ],
  gallery: [
    {
      id: 1,
      category: "Mountains",
      image: [
        "/GalleryImg/image1.jpeg",
        "/GalleryImg/image2.jpeg",
        "/GalleryImg/image3.jpeg",
        "/GalleryImg/image4.jpeg",
      ]
    },
    {
      id: 2,
      category: "Coast",
      image: [
        "/GalleryImg/image5.jpeg",
        "/GalleryImg/image6.jpeg",
        "/GalleryImg/image7.jpeg",
        "/GalleryImg/image8.jpeg",
      ]
    },
    {
      id: 3,
      category: "Forest",
      image: [
        "/GalleryImg/image9.jpeg",
        "/GalleryImg/image10.jpeg",
        "/GalleryImg/image11.jpeg",
        "/GalleryImg/image12.jpeg",
      ]
    },
    {
      id: 4,
      category: "Desert",
      image: [

        "/GalleryImg/image13.jpeg",
        "/GalleryImg/image14.jpeg",
        "/GalleryImg/image15.jpeg"
      ]

    }
  ]
};
