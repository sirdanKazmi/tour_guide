export interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  highlight?: string;
}

export interface BudgetRange {
  economy: string;
  midRange: string;
  luxury: string;
}

export interface Region {
  id: string;
  name: string;
  tagline: string;
  overview: string;
  heroImage: string;
  gallery: string[];
  attractions: Attraction[];
  bestTimeToVisit: {
    months: string;
    description: string;
  };
  activities: string[];
  whyVisit: string;
  budget: BudgetRange;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevation: string;
  climate: string;
  languages: string[];
  currency: string;
}

export const gilgitBaltistanRegions: Region[] = [
  {
    id: 'skardu',
    name: 'Skardu',
    tagline: 'Gateway to the Mighty Karakorams',
    overview: 'Nestled amidst the towering peaks of the Karakoram Range, Skardu is a paradise that seems untouched by time. With its crystal-clear lakes, ancient forts, and the world\'s highest cold desert, this valley offers an otherworldly experience that captivates every traveler\'s soul. From the serene waters of Shangrila to the vast plains of Deosai, Skardu is where adventure meets tranquility.',
    heroImage: '/destinations/Skardu/bg.png',
    gallery: [
      '/destinations/Skardu/image7.png',
      '/destinations/Skardu/image8.png',
      '/destinations/Skardu/image9.png',
      '/destinations/Skardu/image10.png',
      '/destinations/Skardu/image11.png',
      '/destinations/Skardu/image12.png',
    ],
    attractions: [
{
  id: 'shangrila',
  name: 'Shangrila Resort (Lower Kachura Lake)',
  description: 'A surreal resort built on a lake, featuring a crashed airplane turned restaurant...',
  image: '/destinations/Skardu/image1.png', 
  highlight: 'Heart-shaped lake with airplane restaurant',
},
      {
        id: 'upper-kachura',
        name: 'Upper Kachura Lake',
        description: 'A pristine alpine lake with crystal-clear turquoise waters, surrounded by snow-capped peaks. Perfect for trout fishing and kayaking adventures.',
        image: '/destinations/Skardu/image2.png', 
        highlight: 'Crystal-clear turquoise waters',
      },
      {
        id: 'satpara',
        name: 'Satpara Lake',
        description: 'One of the largest freshwater lakes in Pakistan, fed by melting glaciers. The lake supplies water to Skardu city and offers breathtaking reflections.',
        image: '/destinations/Skardu/image3.png', 
        highlight: 'Glacier-fed freshwater lake',
      },
      {
        id: 'deosai',
        name: 'Deosai National Park',
        description: 'Known as the "Land of Giants," this is the second-highest plateau in the world. Home to the Himalayan brown bear and endless wildflower meadows.',
        image: '/destinations/Skardu/image4.png', 
        highlight: 'World\'s second-highest plateau',
      },
      {
        id: 'manthokha',
        name: 'Manthokha Waterfall',
        description: 'A spectacular 180-foot waterfall cascading down rocky cliffs. The rainbow mists and thundering waters create a mesmerizing natural spectacle.',
        image: '/destinations/Skardu/image5.png', 
        highlight: '180-foot thundering cascade',
      },
      {
        id: 'manthal-buddha',
        name: 'Manthal Buddha ',
        description: 'Manthal Buddha Rock is an ancient rock carving located near Skardu. It features a large image of Buddha carved into a rock, dating back to around the 8th century, showing the influence of Buddhism in the region before the arrival of Islam.',
        image: '/destinations/Skardu/image6.png', 
        highlight: 'Ancient Buddhist Carving',
      },

    ],
    bestTimeToVisit: {
      months: 'April to October',
      description: 'Summer months offer pleasant weather with clear skies, perfect for trekking and sightseeing. Spring brings blooming apricot orchards, while autumn paints the valley in golden hues.',
    },
    activities: [
      'Trekking to Deosai Plains',
      'Trout fishing in alpine lakes',
      'Desert safari in Katpana',
      'Paragliding over the valley',
      'Camping under starlit skies',
      'Rock climbing expeditions',
      'Photography tours',
      'Cultural heritage walks',
    ],
    whyVisit: 'Skardu offers a unique combination of desert, lakes, and mountains in one valley. It is the gateway to four 8,000-meter peaks and provides access to some of the world\'s most spectacular trekking routes.',
    budget: {
      economy: '$30-50/day',
      midRange: '$80-150/day',
      luxury: '$200-400/day',
    },
    coordinates: { lat: 35.2971, lng: 75.4710 },
    elevation: '2,228 meters (7,310 ft)',
    climate: 'Cold desert climate with warm summers and freezing winters',
    languages: ['Balti', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'hunza',
    name: 'Hunza Valley',
    tagline: 'The Valley of Eternal Youth',
    overview: 'Hunza is a magical valley where time seems to stand still. Surrounded by snow-crowned peaks including the majestic Rakaposhi, this valley is famed for the longevity of its people and their warm hospitality. Ancient forts, turquoise lakes, and terraced fields create a landscape that has inspired travelers for centuries.',
    heroImage: '/destinations/Hunza/bg.png',
    gallery: [
      '/destinations/Hunza/image7.png',
      '/destinations/Hunza/image8.png',
      '/destinations/Hunza/image9.png',
      '/destinations/Hunza/image10.png',
    ],
    attractions: [
      {
        id: 'altit-fort',
        name: 'Altit Fort',
        description: 'Over 900 years old, this ancient fort offers panoramic views of the Hunza Valley and the Hunza River. The fort\'s museum showcases the rich cultural heritage of the region.',
        image: '/destinations/Hunza/image1.png',
        highlight: '900-year-old royal fort',
      },
      {
        id: 'baltit-fort',
        name: 'Baltit Fort',
        description: 'A UNESCO World Heritage site, this 700-year-old fort features stunning Tibetan architecture and offers breathtaking views of Rakaposhi Peak.',
        image: '/destinations/Hunza/image2.png',
        highlight: 'UNESCO World Heritage site',
      },
      {
        id: 'attabad-lake',
        name: 'Attabad Lake',
        description: 'A stunning turquoise lake formed by a landslide in 2010. The vibrant blue waters contrast beautifully with the surrounding mountains.',
        image: '/destinations/Hunza/image3.png',
        highlight: 'Turquoise mountain lake',
      },
      {
        id: 'passu-cones',
        name: 'Passu Cones',
        description: 'Iconic jagged peaks that look like cathedral spires. These dramatic mountains are one of the most photographed landmarks in Pakistan.',
        image: '/destinations/Hunza/image4.png', 
        highlight: 'Cathedral-like jagged peaks',
      },
      {
        id: 'hussaini-bridge',
        name: 'Hussaini Suspension Bridge',
        description: 'One of the most dangerous bridges in the world, with wooden planks and gaps overlooking the Borit Lake. A thrilling experience for adventure seekers.',
        image: '/destinations/Hunza/image5.png',
        highlight: 'World\'s most dangerous bridge',
      },
      {
        id: 'eagles-nest',
        name: 'Eagle\'s Nest View Point',
        description: 'A panoramic viewpoint offering 360-degree views of Hunza Valley, including Ultar Sar, Ladyfinger Peak, and Rakaposhi.',
        image: '/destinations/Hunza/image6.png',
        highlight: '360-degree valley views',
      },
    ],
    bestTimeToVisit: {
      months: 'March to November',
      description: 'Spring brings blossoming apricot, cherry, and apple trees. Summer offers clear mountain views. Autumn transforms the valley into a golden paradise.',
    },
    activities: [
      'Trekking to Rakaposhi Base Camp',
      'Boating on Attabad Lake',
      'Crossing Hussaini Bridge',
      'Photography at Eagle\'s Nest',
      'Exploring ancient forts',
      'Tasting organic local fruits',
      'Hiking to glaciers',
      'Stargazing in Duikar',
    ],
    whyVisit: 'Hunza offers the perfect blend of natural beauty, cultural richness, and adventure. The valley\'s people are known for their longevity and hospitality, and the views of Rakaposhi are simply unmatched.',
    budget: {
      economy: '$25-45/day',
      midRange: '$70-120/day',
      luxury: '$150-300/day',
    },
    coordinates: { lat: 36.3167, lng: 74.6500 },
    elevation: '2,438 meters (8,000 ft)',
    climate: 'Mountain valley climate with mild summers and cold winters',
    languages: ['Burushaski', 'Wakhi', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'gilgit',
    name: 'Gilgit',
    tagline: 'The Heart of the Karakoram',
    overview: 'Gilgit, the administrative capital of Gilgit-Baltistan, sits at the confluence of three mighty mountain ranges. This ancient city has been a crossroads of civilizations for millennia, offering a unique blend of cultures, history, and natural beauty. From ancient Buddhist carvings to pristine alpine valleys, Gilgit is a treasure trove waiting to be explored.',
    heroImage: '/destinations/Gilgit/bg.jpg',
    gallery: [
      '/destinations/Gilgit/image7.jpg',
      '/destinations/Gilgit/image8.webp',
      '/destinations/Gilgit/image9.webp',
      '/destinations/Gilgit/image10.jpg',
    ],  
    attractions: [
      {
        id: 'kargah-buddha',
        name: 'Kargah Buddha',
        description: 'A 7th-century rock carving of Buddha overlooking the Kargah Valley. This ancient site reflects the region\'s Buddhist heritage and offers stunning valley views.',
        image: '/destinations/Gilgit/image1.png',
        highlight: 'Ancient 7th-century Buddha carving',
      },
      {
        id: 'naltar-valley',
        name: 'Naltar Valley',
        description: 'Famous for its colorful lakes and as Pakistan\'s premier ski resort. The valley transforms into a winter wonderland with world-class skiing facilities.',
        image: '/destinations/Gilgit/image2.png',
        highlight: 'Colorful lakes and ski resort',
      },
      {
        id: 'rakaposhi-view',
        name: 'Rakaposhi View Point',
        description: 'The most accessible viewpoint for the magnificent Rakaposhi Peak (7,788m). The viewpoint offers unobstructed views of this golden pyramid-shaped mountain.',
        image: '/destinations/Gilgit/image3.png',
        highlight: 'Closest view of Rakaposhi Peak',
      },
      {
        id: 'gilgit-river',
        name: 'Gilgit River',
        description: 'A mighty river that carved its way through the mountains. The river\'s turquoise waters and surrounding landscapes are perfect for photography.',
        image: '/destinations/Gilgit/image4.png',
        highlight: 'Turquoise glacial waters',
      },
            {
        id: 'chinese-graveyards',
        name: 'Chinese Graveyards',
        description: 'Chinese graveyards are deeply rooted in ancestral veneration, often featuring traditional horseshoe-shaped, hillside graves aimed at optimizing feng shui.',
        image: '/destinations/Gilgit/image5.png',
        highlight: 'Symbols on Tombstones',
      },
            {
        id: 'taj-mughal-minar',
        name: 'Taj Mughal Minar',
        description: 'Taj Mughal Minar is a historic tower-like monument located in Gilgit. It reflects Mughal-style architecture, with a tall structure that resembles a minaret.',
        image: '/destinations/Gilgit/image6.png',
        highlight: 'Mughal architectural influence',
      },
    ],
    bestTimeToVisit: {
      months: 'May to October',
      description: 'Summer offers the best weather for sightseeing and outdoor activities. Winter attracts ski enthusiasts to Naltar Valley.',
    },
    activities: [
      'Skiing at Naltar Ski Resort',
      'Visiting ancient Buddhist sites',
      'River rafting adventures',
      'Photography tours',
      'Exploring local bazaars',
      'Trekking expeditions',
      'Cultural heritage tours',
      'Mountain biking',
    ],
    whyVisit: 'Gilgit serves as the perfect base for exploring the Northern Areas. It offers easy access to multiple valleys, historical sites, and some of the best skiing in South Asia.',
    budget: {
      economy: '$20-40/day',
      midRange: '$60-100/day',
      luxury: '$120-250/day',
    },
    coordinates: { lat: 35.9200, lng: 74.3100 },
    elevation: '1,500 meters (4,921 ft)',
    climate: 'Semi-arid climate with hot summers and cold winters',
    languages: ['Shina', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'khaplu',
    name: 'Khaplu',
    tagline: 'The Valley of Kings',
    overview: 'Khaplu is a hidden gem that once served as the capital of a kingdom. This valley preserves some of the finest examples of Tibetan architecture in Pakistan. The historic Khaplu Palace, ancient mosques, and the gateway to the mighty Masherbrum create an atmosphere of timeless elegance and grandeur.',
    heroImage: '/destinations/Khaplu/bg.jpeg',
    gallery: [
      '/destinations/Khaplu/image7.webp',
      '/destinations/Khaplu/image8.jpeg',
      '/destinations/Khaplu/image9.jpeg',
      '/destinations/Khaplu/image10.jpeg',
    ],
    attractions: [
      {
        id: 'khaplu-palace',
        name: 'Khaplu Palace',
        description: 'A magnificent 19th-century palace built in Tibetan style, now converted into a heritage hotel. The palace features intricate woodwork and stunning mountain views.',
        image: '/destinations/Khaplu/image1.jpeg',
        highlight: '19th-century Tibetan palace hotel',
      },
      {
        id: 'chaqchan-mosque',
        name: 'Chaqchan Mosque',
        description: 'A 700-year-old mosque built by Tibetan craftsmen, featuring unique Kashmiri and Tibetan architectural elements. One of the oldest mosques in the region.',
        image: '/destinations/Khaplu/image2.jpeg',
        highlight: '700-year-old historic mosque',
      },
      {
        id: 'saling-valley',
        name: 'Saling Valley',
        description: 'A pristine valley offering panoramic views of the Masherbrum Range. The valley is dotted with traditional villages and lush terraced fields.',
        image: '/destinations/Khaplu/image3.jpeg',
        highlight: 'Gateway to Masherbrum Range',
      },
      {
        id: 'shyok-river-viewpoint',
        name: 'Shyok River Viewpoint',
        description: 'Shyok River Viewpoint is a scenic spot near Khaplu that offers a beautiful view of the Shyok River. The viewpoint allows visitors to enjoy the natural landscape, mountains, and the flowing river that passes through the valley.',
        image: '/destinations/Khaplu/image4.jpeg',
        highlight: 'Panoramic River Scenery',
      },
            {
        id: 'thoqsi-khar',
        name: 'Thoqsi Khar',
        description: 'Thoqsi Khar is an ancient fort located near Khaplu in Gilgit-Baltistan. It is believed to have been built many centuries ago and served as a defensive structure for the local rulers.',
        image: '/destinations/Khaplu/image5.jpeg',
        highlight: 'Historic Fort Ruins',
      },
            {
        id: 'hanjor',
        name: 'Hanjor',
        description: 'Hanjor is a small village located near Khaplu in the Ghanche District of Gilgit-Baltistan. It is surrounded by mountains, green fields, and traditional Balti houses.',
        image: '/destinations/Khaplu/image6.jpeg',
        highlight: 'Natural Beauty and Culture',
      },
    ],
    bestTimeToVisit: {
      months: 'April to October',
      description: 'Spring and summer offer pleasant weather for exploring. Autumn provides clear mountain views with comfortable temperatures.',
    },
    activities: [
      'Staying at Khaplu Palace Hotel',
      'Trekking to Masherbrum Base Camp',
      'Exploring ancient architecture',
      'Photography of Tibetan-style buildings',
      'Visiting traditional villages',
      'Climbing expeditions',
      'Cultural immersion experiences',
      'Stargazing in clear mountain air',
    ],
    whyVisit: 'Khaplu offers the finest examples of Tibetan architecture in Pakistan, royal heritage, and access to some of the world\'s highest peaks. It is less crowded than other tourist destinations.',
    budget: {
      economy: '$25-40/day',
      midRange: '$60-100/day',
      luxury: '$120-250/day',
    },
    coordinates: { lat: 35.1600, lng: 76.3400 },
    elevation: '2,600 meters (8,530 ft)',
    climate: 'Cold semi-arid climate with cool summers and harsh winters',
    languages: ['Balti', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'astore',
    name: 'Astore',
    tagline: 'The Valley of Meadows',
    overview: 'Astore is a valley of dreams, where emerald meadows meet snow-capped peaks. The famous Rama Meadows and the pristine Rama Lake offer landscapes that seem straight out of a fairy tale. This valley is also home to the elusive Deosai National Park and the beautiful Minimarg plateau.',
    heroImage: '/destinations/Astore/bg.jpeg',
    gallery: [
      '/destinations/Astore/image7.jpeg',
      '/destinations/Astore/image8.jpeg',
      '/destinations/Astore/image9.jpeg',
      '/destinations/Astore/image10.jpeg',
    ],
    attractions: [
      {
        id: 'rama-meadows',
        name: 'Rama Meadows',
        description: 'Lush green meadows surrounded by pine forests and snow-capped peaks. The meadows offer a perfect camping spot with breathtaking views of Nanga Parbat.',
        image: '/destinations/Astore/image1.jpg',
        highlight: 'Emerald meadows with mountain views',
      },
      {
        id: 'rama-lake',
        name: 'Rama Lake',
        description: 'A pristine alpine lake reflecting the surrounding peaks like a mirror. The trek to the lake offers stunning views of the Astore Valley.',
        image: '/destinations/Astore/image2.jpg',
        highlight: 'Mirror-like alpine lake',
      },
      {
        id: 'minimarg',
        name: 'Minimarg',
        description: 'A beautiful plateau known as the "Land of Fairies." Famous for its colorful wildflowers, especially the rare pink tulips that bloom in spring.',
        image: '/destinations/Astore/image3.jpeg',
        highlight: 'Land of colorful wildflowers',
      },
      {
        id: 'domel',
        name: 'Domel',
        description: 'A scenic viewpoint offering panoramic views of the Astore Valley and Nanga Parbat. The sunset views from here are spectacular.',
        image: '/destinations/Astore/image4.jpg',
        highlight: 'Panoramic valley viewpoint',
      },
      {
        id: 'rupal-valley',
        name: 'Rupal Valley',
        description: 'Rupal Valley is a beautiful valley located in the Astore region of Gilgit-Baltistan. It lies on the southern side of Nanga Parbat, one of the highest mountains in the world.',
        image: '/destinations/Astore/image5.jpeg',
        highlight: 'Gateway to Nanga Parbat',
      },
     {
        id: 'burzil-pass',
        name: 'Burzil Pass',
        description: 'Burzil Pass is a high mountain pass located in the Astore region of Gilgit-Baltistan. It connects Astore with the Deosai area and was historically an important route for travelers and traders moving between regions.',
        image: '/destinations/Astore/image6.jpeg',
        highlight: ' A historic, high-elevation pass.',
      },

    ],
    bestTimeToVisit: {
      months: 'June to September',
      description: 'Summer is the best time when the meadows are green and the weather is pleasant. Spring offers blooming wildflowers in Minimarg.',
    },
    activities: [
      'Camping at Rama Meadows',
      'Trekking to Rama Lake',
      'Photography of Nanga Parbat',
      'Wildflower viewing in Minimarg',
      'Fishing in alpine streams',
      'Jeep safaris to remote valleys',
      'Bird watching',
      'Stargazing at high altitude',
    ],
    whyVisit: 'Astore offers some of the most beautiful meadows in Pakistan, with easy access to views of Nanga Parbat. The valley is less commercialized and offers authentic mountain experiences.',
    budget: {
      economy: '$20-35/day',
      midRange: '$50-90/day',
      luxury: '$100-200/day',
    },
    coordinates: { lat: 35.3700, lng: 74.8500 },
    elevation: '2,540 meters (8,330 ft)',
    climate: 'Alpine climate with cool summers and heavy snowfall in winters',
    languages: ['Shina', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'nagar',
    name: 'Nagar',
    tagline: 'Home of the Golden Peak',
    overview: 'Nagar Valley, sister to Hunza, offers equally spectacular views with fewer crowds. The valley is home to some of the most impressive glaciers in the world, including the Hopper Glacier. With its traditional villages and unobstructed views of Rakaposhi, Nagar is a paradise for those seeking authentic mountain experiences.',
    heroImage: '/destinations/Nagar/bg.jpeg',
    gallery: [
      '/destinations/Nagar/image7.jpeg',
      '/destinations/Nagar/image8.jpeg',
      '/destinations/Nagar/image9.jpeg',
      '/destinations/Nagar/image10.jpeg',
    ],
    attractions: [
      {
        id: 'rakaposhi-base',
        name: 'Rakaposhi Base Camp',
        description: 'The closest you can get to the magnificent Rakaposhi (7,788m) without technical climbing. The base camp offers stunning views of the mountain\'s massive south face.',
        image: '/destinations/Nagar/image1.jpeg',
        highlight: 'Closest view of Rakaposhi',
      },
      {
        id: 'hopper-glacier',
        name: 'Hopper Glacier',
        description: 'One of the largest glaciers outside the polar regions. The glacier offers a surreal landscape of ice, rocks, and turquoise meltwater lakes.',
        image: '/destinations/Nagar/image2.jpeg',
        highlight: 'Massive non-polar glacier',
      },
      {
        id: 'rush-lake',
        name: 'Rush Lake',
        description: 'One of the highest alpine lakes in Pakistan, surrounded by snow-capped peaks. The trek offers panoramic views of the entire region.',
        image: '/destinations/Nagar/image3.jpeg',
        highlight: 'High-altitude alpine lake',
      },
      {
        id: 'chalt-valley',
        name: 'Chalt Valley',
        description: 'Chalt Valley is a beautiful valley located in the Nagar District of Gilgit-Baltistan. It is known for its fertile land, orchards, and scenic mountain views.',
        image: '/destinations/Nagar/image4.jpeg',
        highlight: 'Scenic Natural Beauty',
      },
      {
        id: 'pissan-cricket-stadium',
        name: 'Pissan Cricket Stadium',
        description: 'Pissan Cricket Stadium is a scenic cricket ground located in the Nagar Valley. The stadium is surrounded by high mountains and natural landscapes, making it one of the most beautiful cricket grounds in the region',
        image: '/destinations/Nagar/image5.jpg',
        highlight: 'Breathtaking mountain views',
      },
      {
        id: 'miacher-kho-meadows',
        name: 'Miacher Kho Meadows',
        description: 'Miacher Kho Meadows is a beautiful alpine meadow located in the Nagar Valley. It is surrounded by green fields, mountains, and glaciers, making it a peaceful natural spot.',
        image: '/destinations/Nagar/image6.png',
        highlight: 'Lush green and stunning meadows',
      },

    ],
    bestTimeToVisit: {
      months: 'May to October',
      description: 'Summer offers the best weather for trekking and glacier visits. Autumn provides clear views and comfortable temperatures.',
    },
    activities: [
      'Trekking to Rakaposhi Base Camp',
      'Glacier walking on Hopper',
      'High-altitude lake trekking',
      'Photography of massive peaks',
      'Exploring traditional villages',
      'Mountain climbing expeditions',
      'Camping in the wilderness',
      'Wildlife spotting',
    ],
    whyVisit: 'Nagar offers the best views of Rakaposhi with fewer tourists than Hunza. The Hopper Glacier is one of the most accessible major glaciers in the world.',
    budget: {
      economy: '$20-40/day',
      midRange: '$60-100/day',
      luxury: '$120-250/day',
    },
    coordinates: { lat: 36.2500, lng: 74.6000 },
    elevation: '2,600 meters (8,530 ft)',
    climate: 'Mountain valley climate with cold winters and mild summers',
    languages: ['Burushaski', 'Shina', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'ghizer',
    name: 'Ghizer',
    tagline: 'The Valley of Lakes',
    overview: 'Ghizer is a valley of pristine lakes and unspoiled natural beauty. The famous Phander Lake, with its turquoise waters and trout-filled depths, is the crown jewel of this region. The valley offers a peaceful retreat away from the main tourist routes, with traditional villages and warm hospitality.',
    heroImage: '/destinations/Ghizer/bg.jpeg',
    gallery: [
      '/destinations/Ghizer/image7.jpeg',
      '/destinations/Ghizer/image8.jpeg',
      '/destinations/Ghizer/image9.jpeg',
      '/destinations/Ghizer/image10.jpeg',
    ],
    attractions: [
      {
        id: 'phander-lake',
        name: 'Phander Lake',
        description: 'A stunning turquoise lake surrounded by poplar trees and snow-capped peaks. The lake is famous for trout fishing and its changing colors throughout the day.',
        image: '/destinations/Ghizer/image1.webp',
        highlight: 'Turquoise trout-filled lake',
      },
      {
        id: 'khalti-lake',
        name: 'Khalti Lake',
        description: 'A serene lake formed by the Ghizer River, surrounded by traditional villages. The lake offers excellent opportunities for trout fishing.',
        image: '/destinations/Ghizer/image2.webp',
        highlight: 'River-formed serene lake',
      },
      {
        id: 'ishkoman-valley',
        name: 'Ishkoman Valley',
        description: 'A remote valley offering pristine wilderness and traditional Wakhi culture. The valley is home to diverse wildlife and stunning landscapes.',
        image: '/destinations/Ghizer/image3.jpeg',
        highlight: 'Pristine wilderness valley',
      },
      {
        id: 'shandur-pass',
        name: 'Shandur Pass',
        description: 'Shandur Pass is a high mountain pass located between Gilgit-Baltistan and Chitral. It is famous for its vast green plains and beautiful lake at a very high altitude in the mountains.',
        image: '/destinations/Ghizer/image4.jpeg',
        highlight: 'Highest Polo Ground in the World',
      },
      {
        id: 'yasin-valley',
        name: 'Yasin Valley',
        description: 'Yasin Valley is a beautiful valley located in the Ghizer District of Gilgit-Baltistan. It is surrounded by high mountains, green meadows, and the Yasin River.',
        image: '/destinations/Ghizer/image5.jpeg',
        highlight: 'Scenic landscapes, rivers, and mountains',
      },
      {
        id: 'gahkuch',
        name: 'Gahkuch',
        description: 'Gahkuch is the capital town of Ghizer District. It is located along the Gilgit River and is known for its beautiful natural scenery, mountains, and peaceful environment.',
        image: '/destinations/Ghizer/image6.jpeg',
        highlight: 'The headquarters of the Ghizer district  ',
      },
    ],
    bestTimeToVisit: {
      months: 'May to October',
      description: 'Summer offers the best weather for lake activities and sightseeing. The lakes are at their most beautiful during these months.',
    },
    activities: [
      'Trout fishing in Phander Lake',
      'Camping by the lakeside',
      'Exploring Ishkoman Valley',
      'Photography of turquoise waters',
      'Trekking to remote areas',
      'Experiencing Wakhi culture',
      'Bird watching',
      'Kayaking and boating',
    ],
    whyVisit: 'Ghizer offers some of the most beautiful lakes in Pakistan with minimal tourist crowds. The valley is perfect for those seeking peace, natural beauty, and authentic cultural experiences.',
    budget: {
      economy: '$20-35/day',
      midRange: '$50-90/day',
      luxury: '$100-180/day',
    },
    coordinates: { lat: 36.2000, lng: 73.3000 },
    elevation: '2,164 meters (7,100 ft)',
    climate: 'Valley climate with mild summers and cold winters',
    languages: ['Khowar', 'Wakhi', 'Shina', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'shigar',
    name: 'Shigar',
    tagline: 'Where Desert Meets Mountains',
    overview: 'Shigar Valley is a land of contrasts, where the cold desert meets lush orchards and ancient forts. The valley is home to the Sarfaranga Cold Desert, one of the highest deserts in the world, and the historic Shigar Fort. This is where you can experience sand dunes and snow-capped peaks in a single view.',
    heroImage: '/destinations/Shigar/bg.jpeg',
    gallery: [
      '/destinations/Shigar/image7.jpeg',
      '/destinations/Shigar/image8.jpeg',
      '/destinations/Shigar/image9.jpeg',
      '/destinations/Shigar/image10.jpeg',
    ],
    attractions: [
      {
        id: 'shigar-fort-valley',
        name: 'Shigar Fort (Fong-Khar)',
        description: 'A 17th-century fort that has been beautifully restored into a heritage hotel. The fort showcases traditional Balti architecture and offers luxury accommodation.',
        image: '/destinations/Shigar/image1.jpg',
        highlight: '17th-century heritage hotel',
      },
      {
        id: 'blind-lake',
        name: 'Blind Lake (Jarba Zhou)',
        description: 'A mysterious lake surrounded by sand dunes and mountains. The lake\'s unique location creates a surreal landscape that seems out of this world.',
        image: '/destinations/Shigar/image2.jpeg',
        highlight: 'Desert-surrounded mysterious lake',
      },
      {
        id: 'amburiq-mosque',
        name: 'Amburiq Mosque',
        description: 'Amburiq Mosque is one of the oldest mosques in the Shigar region of Gilgit-Baltistan. It was built in the 14th century and shows a unique combination of Tibetan, Kashmiri, and local Balti wooden architecture.',
        image: '/destinations/Shigar/image3.jpeg',
        highlight: 'Unique Wooden Architecture',
      },
      {
        id: 'khilingrong-mosque',
        name: 'Khilingrong Mosque',
        description: 'Khilingrong Mosque is a historic mosque located in the Shigar Valley. It reflects traditional Balti architecture and was built using local materials such as wood, stone, and mud.',
        image: '/destinations/Shigar/image4.jpeg',
        highlight: 'Historic Mosque with Traditional Balti Architecture',
      },
      {
        id: 'shigar-river',
        name: 'Shigar River',
        description: 'Shigar River is a major river in the Shigar Valley that flows from the Baltoro Glacier and joins the Indus River. It nourishes the valley, supporting agriculture and local communities, and provides breathtaking views of the surrounding mountains.',
        image: '/destinations/Shigar/image5.jpg',
        highlight: 'Lifeblood of the Valley',
      },
      {
        id: 'sarfaranga',
        name: 'Sarfaranga Cold Desert',
        description: 'Sarfaranga Cold Desert is located in the Shigar District at a height of 7,500 feet on the way to Shigar Valley. Nature unfolds itself with a vast variety in this desert.',
        image: '/destinations/Shigar/image6.png',
        highlight: 'Unique High-Altitude Landscape',
      },
    ],
    bestTimeToVisit: {
      months: 'April to October',
      description: 'Spring and summer offer pleasant weather for exploring the desert and fort. Autumn provides clear views of the surrounding peaks.',
    },
    activities: [
      'Desert safari in Sarfaranga',
      'Staying at Shigar Fort Hotel',
      'Sandboarding on dunes',
      'Photography of desert-mountain contrast',
      'Exploring traditional villages',
      'Visiting apricot orchards',
      'Stargazing in the desert',
      'Camel rides',
    ],
    whyVisit: 'Shigar offers a unique combination of desert and mountain landscapes. The cold desert experience at high altitude is rare and unforgettable.',
    budget: {
      economy: '$25-40/day',
      midRange: '$70-120/day',
      luxury: '$150-300/day',
    },
    coordinates: { lat: 35.4200, lng: 75.7300 },
    elevation: '2,230 meters (7,320 ft)',
    climate: 'Cold desert climate with extreme temperature variations',
    languages: ['Balti', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
  {
    id: 'ghanche',
    name: 'Ghanche',
    tagline: 'The Eastern Gateway',
    overview: 'Ghanche is the easternmost district of Gilgit-Baltistan, bordering Ladakh. The district is home to the Hushe Valley, the gateway to some of the world\'s highest peaks including Masherbrum. The region offers pristine wilderness, traditional villages, and some of the most challenging trekking routes in the Karakoram.',
    heroImage: '/destinations/Ghanche/bg.jpeg',
    gallery: [
      '/destinations/Ghanche/image7.jpeg',
      '/destinations/Ghanche/image8.jpeg',
      '/destinations/Ghanche/image9.jpeg',
      '/destinations/Ghanche/image10.jpeg',
    ],
    attractions: [
      {
        id: 'thalley-broq',
        name: 'Thalley Broq',
        description: 'Thalley Broq is a beautiful high-altitude meadow located in the Ghanche region of Gilgit-Baltistan. It is known for its green fields, fresh mountain air, and scenic views of surrounding peaks. The area is popular among trekkers and nature lovers.',
        image: '/destinations/Ghanche/image1.webp',
        highlight: 'lush green meadow',
      },
      {
        id: 'hushe-valley',
        name: 'Hushe Valley',
        description: 'The last inhabited valley before the great glaciers of the Karakoram. The valley offers stunning views of Masherbrum and serves as base camp for numerous expeditions.',
        image: '/destinations/Ghanche/image2.jpg',
        highlight: 'Gateway to Karakoram glaciers',
      },

      {
        id: 'masherbrum-K1-view',
        name: 'Masherbrum K1 Views',
        description: 'Spectacular views of Masherbrum (7,821m), known as the "Queen of Peaks." The mountain\'s distinctive pyramid shape dominates the skyline.',
        image: '/destinations/Ghanche/image3.jpeg',
        highlight: 'Views of the Queen of Peaks',
      },
      {
        id: 'kharfaq-lake',
        name: 'Kharfaq Lake ',
        description: 'Kharfaq Lake is a scenic high-altitude lake located in the Ghanche region of Gilgit-Baltistan. Surrounded by mountains and alpine meadows, the lake is known for its clear water and peaceful natural environment',
        image: '/destinations/Ghanche/image4.jpg',
        highlight: 'Crystal-Clear Mountain Lake',
      },
      {
        id: 'balghar-ranga',
        name: 'Balghar Ranga ',
        description: 'Balghar Ranga is a beautiful mountain village located in the scenic region of Ghanche District. The area is surrounded by high mountains, green fields, and traditional Balti houses.',
        image: '/destinations/Ghanche/image5.jpeg',
        highlight: 'Natural greenery surroundings',
      },
      {
        id: 'barah-valley-ghanche',
        name: 'Barah Valley',
        description: 'Barah Valley is a scenic valley in the Ghanche region of Gilgit-Baltistan. It is surrounded by high mountains, green fields, and small traditional villages.',
        image: '/destinations/Ghanche/image6.jpeg',
        highlight: 'Natural beauty and fertile land,',
      },

    ],
    bestTimeToVisit: {
      months: 'June to September',
      description: 'Summer is the only feasible time to visit due to harsh winters. The weather is pleasant for trekking and mountaineering activities.',
    },
    activities: [
      'Trekking to Masherbrum Base Camp',
      'Mountaineering expeditions',
      'Exploring remote villages',
      'Photography of 7000m+ peaks',
      'Glacier trekking',
      'Rock climbing',
      'Wildlife spotting',
      'Cultural experiences',
    ],
    whyVisit: 'Ghanche offers access to some of the most challenging and rewarding trekking routes in the Karakoram. The views of Masherbrum are simply spectacular.',
    budget: {
      economy: '$30-50/day',
      midRange: '$80-150/day',
      luxury: '$200-400/day',
    },
    coordinates: { lat: 35.1500, lng: 76.6000 },
    elevation: '3,000+ meters (9,840+ ft)',
    climate: 'High-altitude mountain climate with harsh winters',
    languages: ['Balti', 'Urdu', 'English'],
    currency: 'Pakistani Rupee (PKR)',
  },
];

export const getRegionById = (id: string): Region | undefined => {
  return gilgitBaltistanRegions.find((region) => region.id === id);
};

export const getAllRegionIds = (): string[] => {
  return gilgitBaltistanRegions.map((region) => region.id);
};
