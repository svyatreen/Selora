import pg from 'pg';
import { resolveHotelCoordinates } from './lib/hotel-coordinates.mjs';
const { Client } = pg;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const hotels = [
  {
    name: 'Le Grand Ritz',
    description:
      'Legendary Parisian palace hotel offering timeless elegance, Michelin-starred dining, and a world-famous cocktail bar in the heart of Place Vendôme.',
    city: 'Paris',
    address: '15 Place Vendôme, 75001 Paris, France',
    stars: 5,
    amenities: [
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Room Service',
      'Valet Parking',
    ],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.9,
  },
  {
    name: 'Hôtel de Crillon',
    description:
      'An 18th-century palace on Place de la Concorde with breathtaking views of the Eiffel Tower and exquisite French haute cuisine.',
    city: 'Paris',
    address: '10 Place de la Concorde, 75008 Paris, France',
    stars: 5,
    amenities: [
      'Spa',
      'Pool',
      'Restaurant',
      'Bar',
      'Concierge',
      'Butler Service',
      'Gym',
    ],
    images: [
      'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.8,
  },
  {
    name: 'Hôtel Particulier Montmartre',
    description:
      'Romantic 19th-century mansion hidden in Montmartre with garden suites, contemporary art and a charming cocktail bar.',
    city: 'Paris',
    address: '23 Av. Junot, 75018 Paris, France',
    stars: 4,
    amenities: ['Garden', 'Bar', 'Concierge', 'Art Collection', 'Breakfast'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.5,
  },
  {
    name: 'The Savoy',
    description:
      "London's most iconic hotel since 1889. Art Deco grandeur meets modern luxury on the Thames Embankment with world-class dining.",
    city: 'London',
    address: 'Strand, London WC2R 0EU, United Kingdom',
    stars: 5,
    amenities: [
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Theatre Access',
      'Concierge',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWx8ZW58MHx8MHx8fDA%3D',
    ],
    rating: 4.8,
  },
  {
    name: 'The Langham London',
    description:
      "Europe's first grand hotel reimagined for the modern traveller. Steps from Oxford Street with an award-winning spa.",
    city: 'London',
    address: '1C Portland Place, Regent Street, London W1B 1JA',
    stars: 5,
    amenities: [
      'Spa',
      'Pool',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Business Center',
    ],
    images: [
      'https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.7,
  },
  {
    name: 'The Hoxton Shoreditch',
    description:
      "Cool design hotel in East London's creative heartland with a lively all-day lobby restaurant and rooftop bar with skyline views.",
    city: 'London',
    address: '81 Great Eastern St, London EC2A 3HU, United Kingdom',
    stars: 4,
    amenities: ['Restaurant', 'Bar', 'Gym', 'Concierge', 'Meeting Rooms'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.3,
  },
  {
    name: 'Hotel Adlon Kempinski',
    description:
      "Berlin's most prestigious address since 1907 at the Brandenburg Gate with legendary service and world-class gastronomy.",
    city: 'Berlin',
    address: 'Unter den Linden 77, 10117 Berlin, Germany',
    stars: 5,
    amenities: [
      'Spa',
      'Pool',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Valet',
    ],
    images: [
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D',
    ],
    rating: 4.7,
  },
  {
    name: 'Mandarin Oriental Munich',
    description:
      'Sophisticated urban retreat in the heart of Munich blending Bavarian heritage with Asian serenity, near the English Garden.',
    city: 'Munich',
    address: 'Neuturmstrasse 1, 80331 Munich, Germany',
    stars: 5,
    amenities: [
      'Spa',
      'Pool',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Sauna',
    ],
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.6,
  },
  {
    name: 'W Barcelona',
    description:
      'Iconic sail-shaped tower on Barceloneta Beach with 360° sea views, rooftop pool and celebrity DJ nights.',
    city: 'Barcelona',
    address: 'Plaça de la Rosa dels Vents 1, 08039 Barcelona, Spain',
    stars: 5,
    amenities: [
      'Rooftop Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Beach Access',
      'DJ Lounge',
    ],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.6,
  },
  {
    name: 'Aman Venice',
    description:
      "A 16th-century palazzo on the Grand Canal — one of Venice's most extraordinary private residences with its own boats and gardens.",
    city: 'Venice',
    address: 'Calle Tiepolo 1364, 30135 Venice, Italy',
    stars: 5,
    amenities: [
      'Private Boats',
      'Garden',
      'Spa',
      'Restaurant',
      'Bar',
      'Concierge',
      'Butler Service',
    ],
    images: [
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.9,
  },
  {
    name: 'Belmond Villa San Michele',
    description:
      'A 15th-century monastery nestled in the hills above Florence, commanding panoramic views of the city and the Arno valley.',
    city: 'Florence',
    address: 'Via Doccia 4, 50014 Fiesole, Florence, Italy',
    stars: 5,
    amenities: [
      'Pool',
      'Spa',
      'Restaurant',
      'Bar',
      'Garden',
      'Concierge',
      'Cooking Classes',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1661929519129-7a76946c1d38?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.8,
  },
  {
    name: 'Baur au Lac',
    description:
      "Zurich's most distinguished address since 1844 overlooking Lake Zurich, with Swiss precision and Michelin-star dining.",
    city: 'Zurich',
    address: 'Talstrasse 1, 8001 Zürich, Switzerland',
    stars: 5,
    amenities: [
      'Spa',
      'Restaurant',
      'Bar',
      'Concierge',
      'Lake View',
      'Gym',
      'Private Garden',
    ],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.8,
  },
  {
    name: 'Hotel Sacher Vienna',
    description:
      "The birthplace of the legendary Sachertorte. Vienna's most storied hotel blending imperial grandeur with luxury since 1876.",
    city: 'Vienna',
    address: 'Philharmoniker Str. 4, 1010 Vienna, Austria',
    stars: 5,
    amenities: [
      'Spa',
      'Restaurant',
      'Bar',
      'Concierge',
      'Café',
      'Gym',
      'Opera Access',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1687960116497-0dc41e1808a2?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.7,
  },
  {
    name: 'Four Seasons Amsterdam',
    description:
      'Twin 17th-century canal houses transformed into an intimate luxury retreat in the heart of the Golden Ring.',
    city: 'Amsterdam',
    address: 'Keizergracht 99, 1015 AG Amsterdam, Netherlands',
    stars: 5,
    amenities: [
      'Spa',
      'Restaurant',
      'Bar',
      'Concierge',
      'Canal Terrace',
      'Gym',
    ],
    images: [
      'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.6,
  },
  {
    name: 'Grand Hotel Stockholm',
    description:
      "Sweden's finest hotel since 1874 facing the Royal Palace, with Nobel Prize banquet tradition and Nordic spa.",
    city: 'Stockholm',
    address: 'Södra Blasieholmshamnen 8, 103 27 Stockholm, Sweden',
    stars: 5,
    amenities: [
      'Spa',
      'Restaurant',
      'Bar',
      'Concierge',
      'Waterfront Views',
      'Gym',
    ],
    images: [
      'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjg3fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.5,
  },
  {
    name: 'Copenhague Admiral Hotel',
    description:
      'Historic 18th-century granary turned boutique hotel on the Copenhagen waterfront with exposed beams, timber and harbour views.',
    city: 'Copenhagen',
    address: 'Toldbodgade 24-28, 1253 Copenhagen, Denmark',
    stars: 4,
    amenities: ['Restaurant', 'Bar', 'Concierge', 'Waterfront Views', 'Gym'],
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.4,
  },
  {
    name: 'The Fontenay Hamburg',
    description:
      'Sleek new-build icon on the inner Alster lake with a stunning infinity pool and contemporary art woven throughout every corner.',
    city: 'Hamburg',
    address: 'Fontenay 10, 20354 Hamburg, Germany',
    stars: 5,
    amenities: [
      'Infinity Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Lake Views',
      'Concierge',
    ],
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.7,
  },
  {
    name: 'The Peninsula Tokyo',
    description:
      "Tokyo's most prestigious address fusing Japanese harmony with Western luxury. Iconic views of the Imperial Palace.",
    city: 'Tokyo',
    address: '1-8-1 Yurakucho, Chiyoda City, Tokyo 100-0006, Japan',
    stars: 5,
    amenities: [
      'Rooftop Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Helicopter Transfer',
    ],
    images: [
      'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.9,
  },
  {
    name: 'Park Hyatt Tokyo',
    description:
      'Made famous by Lost in Translation, this sky-high hotel occupies floors 41-52 with incomparable city-and-Fuji views.',
    city: 'Tokyo',
    address: '3-7-1-2 Nishi Shinjuku, Shinjuku-ku, Tokyo 163-1055, Japan',
    stars: 5,
    amenities: ['Infinity Pool', 'Gym', 'Restaurant', 'Bar', 'Spa', 'Library'],
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.8,
  },
  {
    name: 'Aman Kyoto',
    description:
      'Secreted in the forested hills of northern Higashiyama, this hushed sanctuary surrounds a private 10th-century garden.',
    city: 'Kyoto',
    address: 'Okitayama Washicho, Kita Ward, Kyoto 603-8814, Japan',
    stars: 5,
    amenities: [
      'Onsen',
      'Spa',
      'Restaurant',
      'Bar',
      'Garden',
      'Tea Ceremony',
      'Concierge',
    ],
    images: [
      'https://images.unsplash.com/photo-1623718649591-311775a30c43?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 4.9,
  },
  {
    name: 'Hoshinoya Fuji',
    description:
      "Japan's first glamping resort perched above Lake Kawaguchi with unobstructed views of Mount Fuji and forest cabins.",
    city: 'Fujikawaguchiko',
    address: '1408 Funatsu, Fujikawaguchiko, Minamitsuru District, Yamanashi',
    stars: 4,
    amenities: [
      'Forest Pool',
      'Restaurant',
      'Bar',
      'Glamping Activities',
      'Mount Fuji Views',
    ],
    images: [
      'https://images.unsplash.com/photo-1580041065738-e72023775cdc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzA1fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.7,
  },
  {
    name: 'Raffles Singapore',
    description:
      'The birthplace of the Singapore Sling. A National Monument with lush tropics, grand colonial architecture and butler service.',
    city: 'Singapore',
    address: '1 Beach Road, Singapore 189673',
    stars: 5,
    amenities: [
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Butler Service',
      'Tennis',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1675745330148-1f7e5a7674a5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjYwfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.8,
  },
  {
    name: 'Marina Bay Sands',
    description:
      'The world-famous infinity pool in the sky. Three towers topped by a SkyPark with panoramic views over Singapore Bay.',
    city: 'Singapore',
    address: '10 Bayfront Avenue, Singapore 018956',
    stars: 5,
    amenities: [
      'SkyPark Infinity Pool',
      'Casino',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Shopping Mall',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1661881436846-5a0f53025711?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODV8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.7,
  },
  {
    name: 'Four Seasons Bali at Jimbaran Bay',
    description:
      'Private villas cascading down terraced hillsides to a pristine crescent bay with a dedicated cooking school.',
    city: 'Bali',
    address: 'Jimbaran, Kuta Sel., Kabupaten Badung, Bali 80361, Indonesia',
    stars: 5,
    amenities: [
      'Private Pool Villas',
      'Spa',
      'Cooking School',
      'Beach Club',
      'Gym',
      'Restaurant',
      'Bar',
    ],
    images: [
      'https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 4.8,
  },
  {
    name: 'Alila Villas Uluwatu',
    description:
      "Dramatic clifftop infinity pools hovering 70m above the Indian Ocean. Bali's most architecturally striking ultra-luxury villa resort.",
    city: 'Bali',
    address: 'Jalan Belimbing Sari, Pecatu, Uluwatu, Bali 80364',
    stars: 5,
    amenities: [
      'Cliff Infinity Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Ocean Views',
      'Butler Service',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1661881436846-5a0f53025711?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODV8fGhvdGVsfGVufDB8fDB8fHww',
    ],
    rating: 4.9,
  },
  {
    name: 'Rosewood Phuket',
    description:
      'Terraced hillside resort overlooking Emerald Bay with spectacular sea views, overwater villas and three sparkling pools.',
    city: 'Phuket',
    address: '88/28 Muen-Ngoen Road, Patong, Phuket 83150, Thailand',
    stars: 5,
    amenities: [
      'Infinity Pool',
      'Spa',
      'Beach Club',
      'Gym',
      'Restaurant',
      'Bar',
      'Yacht Charter',
    ],
    images: [
      'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.7,
  },
  {
    name: 'Anantara Riverside Bangkok',
    description:
      'Enchanting riverside resort on the Chao Phraya with tropical gardens, traditional Thai cooking school and legendary Sunday brunch.',
    city: 'Bangkok',
    address: '257/1-3 Charoennakorn Road, Thonburi, Bangkok 10600, Thailand',
    stars: 5,
    amenities: [
      'Riverside Pool',
      'Spa',
      'Cooking School',
      'Gym',
      'Restaurant',
      'Bar',
      'Free Ferry',
    ],
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.6,
  },
  {
    name: 'The Reverie Saigon',
    description:
      "Ho Chi Minh City's grandest new hotel with Italian-crafted furniture, a magnificent ballroom and riverside skyline views.",
    city: 'Ho Chi Minh City',
    address:
      '22-36 Nguyen Hue Boulevard, District 1, Ho Chi Minh City, Vietnam',
    stars: 5,
    amenities: [
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Butler Service',
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.7,
  },
  {
    name: 'The Plaza New York',
    description:
      "A National Historic Landmark at Central Park. Eloise's home, host to presidents and royalty for over a century on 5th Avenue.",
    city: 'New York',
    address: '768 5th Ave, New York, NY 10019, USA',
    stars: 5,
    amenities: [
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Butler Service',
      'Shopping Arcade',
    ],
    images: [
      'https://images.unsplash.com/photo-1600435335786-d74d2bb6de37?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 4.7,
  },
  {
    name: 'The St. Regis New York',
    description:
      "John Jacob Astor's 1904 masterpiece on Fifth Avenue, renowned for the invention of the Bloody Mary and impeccable butler service.",
    city: 'New York',
    address: '2 E 55th St, New York, NY 10022, USA',
    stars: 5,
    amenities: [
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Butler Service',
      'Concierge',
    ],
    images: [
      'https://images.unsplash.com/photo-1663998468593-1f104e7c9213?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE4fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.8,
  },
  {
    name: 'Faena Hotel Miami Beach',
    description:
      "South Beach's most theatrical luxury experience with Damien Hirst artworks, a gilded mammoth skeleton and cabaret shows.",
    city: 'Miami',
    address: '3201 Collins Ave, Miami Beach, FL 33140, USA',
    stars: 5,
    amenities: [
      'Ocean Pool',
      'Spa',
      'Beach Club',
      'Gym',
      'Restaurant',
      'Bar',
      'Cabaret',
    ],
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
    ],
    rating: 4.6,
  },
  {
    name: 'Four Seasons Los Angeles',
    description:
      'Hollywood glamour meets Beverly Hills luxury. Poolside celebrity sightings and walking distance from Rodeo Drive.',
    city: 'Los Angeles',
    address: '300 S Doheny Dr, Los Angeles, CA 90048, USA',
    stars: 5,
    amenities: ['Outdoor Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge'],
    images: [
      'https://images.unsplash.com/photo-1663998468593-1f104e7c9213?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE4fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.6,
  },
  {
    name: 'Rosewood San Miguel de Allende',
    description:
      'Colonial palace in the UNESCO World Heritage city of San Miguel, with cobblestone courtyards, rooftop views and artisanal mezcal bar.',
    city: 'San Miguel de Allende',
    address: 'Nemesio Diez 11, Zona Centro, San Miguel de Allende, Mexico',
    stars: 5,
    amenities: [
      'Rooftop Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Cultural Activities',
    ],
    images: [
      'https://images.unsplash.com/photo-1709809328185-ba9ee5a06121?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIxfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.8,
  },
  {
    name: 'Awasi Patagonia',
    description:
      'Remote luxury eco-lodge on the edge of Torres del Paine National Park, with exclusive private guides and overwater bungalows.',
    city: 'Patagonia',
    address: 'Torres del Paine National Park, Magallanes, Chile',
    stars: 5,
    amenities: [
      'Private Guides',
      'Spa',
      'Restaurant',
      'Bar',
      'Hiking',
      'Wildlife Watching',
    ],
    images: [
      'https://images.unsplash.com/photo-1667125094717-47e0ff6d0608?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI2fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.9,
  },
  {
    name: 'Burj Al Arab Jumeirah',
    description:
      "The world's only 7-star hotel on its own man-made island, with gold-plated interiors, submarine dining and a helipad.",
    city: 'Dubai',
    address: 'Jumeirah St, Dubai, United Arab Emirates',
    stars: 5,
    amenities: [
      'Private Beach',
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Helipad',
      'Butler Service',
    ],
    images: [
      'https://images.unsplash.com/photo-1709809328185-ba9ee5a06121?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIxfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.9,
  },
  {
    name: 'Atlantis The Palm',
    description:
      "Dubai's legendary resort on Palm Jumeirah with Aquaventure Waterpark, The Lost Chambers Aquarium and 46,000 sqm of water slides.",
    city: 'Dubai',
    address: 'Palm Jumeirah, Dubai, United Arab Emirates',
    stars: 5,
    amenities: [
      'Waterpark',
      'Aquarium',
      'Beach',
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
    ],
    images: [
      'https://images.unsplash.com/photo-1614568112072-770f89361490?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI5fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.7,
  },
  {
    name: 'Royal Mansour Marrakech',
    description:
      'A medina within the medina — 53 private riads built by King Mohammed VI with hammams and a three-Michelin-starred restaurant.',
    city: 'Marrakech',
    address: 'Rue Abou Abbas El Sebti, Marrakech 40000, Morocco',
    stars: 5,
    amenities: [
      'Private Riads',
      'Hammam',
      'Spa',
      'Pool',
      'Restaurant',
      'Bar',
      'Cooking Class',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1661907977530-eb64ddbfb88a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.9,
  },
  {
    name: 'One&Only Cape Town',
    description:
      "South Africa's most glamorous hotel on the Victoria & Alfred Waterfront with Table Mountain views and world-class cuisine.",
    city: 'Cape Town',
    address: 'Dock Road, V&A Waterfront, Cape Town 8002, South Africa',
    stars: 5,
    amenities: [
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Mountain Views',
    ],
    images: [
      'https://images.unsplash.com/photo-1602081115720-72e5b0a254b8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg5fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.8,
  },
  {
    name: 'Singita Grumeti',
    description:
      'Ultra-exclusive safari lodge inside the private Grumeti Reserve bordering the Serengeti with all-inclusive game drives.',
    city: 'Serengeti',
    address: 'Grumeti Reserve, Mugumu, Tanzania',
    stars: 5,
    amenities: [
      'Game Drives',
      'Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Conservation',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1661876403473-64980cbfdf0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 4.9,
  },
  {
    name: 'Qualia Hamilton Island',
    description:
      "Australia's most acclaimed resort, perched on the northern tip of Hamilton Island with 60 private pavilions and Great Barrier Reef access.",
    city: 'Hamilton Island',
    address: '20 Whitsunday Boulevard, Hamilton Island QLD 4803, Australia',
    stars: 5,
    amenities: [
      'Infinity Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Reef Diving',
      'Yacht Charter',
    ],
    images: [
      'https://images.unsplash.com/photo-1678913308053-316cee77afe9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjUwfHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.9,
  },
  {
    name: 'Park Hyatt Sydney',
    description:
      "Sydney Harbour's most coveted address in The Rocks with unobstructed views of the Opera House and Harbour Bridge from every room.",
    city: 'Sydney',
    address: '7 Hickson Rd, The Rocks NSW 2000, Australia',
    stars: 5,
    amenities: [
      'Harbour Pool',
      'Spa',
      'Gym',
      'Restaurant',
      'Bar',
      'Concierge',
      'Yacht Access',
    ],
    images: [
      'https://images.unsplash.com/photo-1598598795009-f80c5072e665?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjU1fHxob3RlbHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    rating: 4.7,
  },
  {
    name: 'Taj Lake Palace',
    description:
      "A white marble palace floating on Lake Pichola. Udaipur's most magical address built in 1746 as a royal summer palace.",
    city: 'Udaipur',
    address: 'Lake Pichola, Udaipur, Rajasthan 313001, India',
    stars: 5,
    amenities: [
      'Lake Pool',
      'Spa',
      'Restaurant',
      'Bar',
      'Boat Transfer',
      'Concierge',
      'Heritage Tours',
    ],
    images: [
      'https://plus.unsplash.com/premium_photo-1675745330148-1f7e5a7674a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 4.8,
  },
  {
    name: 'Soneva Fushi',
    description:
      'Barefoot luxury at its finest — a private island in the Maldives with over-water villas, open-air cinema and organic gardens.',
    city: 'Maldives',
    address: 'Kunfunadhoo Island, Baa Atoll, Maldives',
    stars: 5,
    amenities: [
      'Private Beach',
      'Overwater Villas',
      'Spa',
      'Diving',
      'Restaurant',
      'Bar',
      'Observatory',
    ],
    images: [
      'https://images.unsplash.com/photo-1592494804071-faea15d93a8a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    rating: 4.9,
  },
];

const ROOM_IMAGE_SETS = {
  single: [
    [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1661964210723-ff22b41a8a5f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjM5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=85&w=1200',
      'https://plus.unsplash.com/premium_photo-1676320514007-b9a41f2e7266?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQzfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1631049422186-4b0569fed517?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjYwfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww',
      'https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=85&w=1200',
      'https://plus.unsplash.com/premium_photo-1675616563084-63d1f129623d?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1777016844282-46fa8713cdae?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjY2fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1642399179458-c11c50e3ce1d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjY5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1632385396727-4e377de9836e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjc3fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1776763018821-8feeaeeee0a5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjgwfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631048648924-e8723adbf571?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzAxfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1689609949898-5f7a10649fef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzExfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1631048730715-e780567325f6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzIxfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049035257-02039c597992?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzIyfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1678297269980-16f4be3a15a6?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1631049035293-745416a778d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzI3fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049421631-051b1511cef9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzI4fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049035186-d9af5f078801?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzMxfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/flagged/photo-1556438758-8d49568ce18e?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1631049035227-57752420e957?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzM2fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&q=85&w=1200',
    ],
  ],
  double: [
    [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1200',
      'https://plus.unsplash.com/premium_photo-1675537843204-a729d7ceedda?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzUwfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1646974400468-9e51816f721d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzYxfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1641851962761-43d3c1a34360?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzc5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1702675301342-cac2dc3ef15a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzg5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1732089059979-c35ea80150d8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzk3fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1663091257768-8f089bf6b4fa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDIwfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631773022877-b981bb73c8c0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDI5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1559841644-08984562005a?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1675615667748-83da03046d30?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDM2fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1776763018972-588e27bf6511?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDQ5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1590490360836-2e3b067c082b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTE4fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1762117360848-be7490786979?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTQzfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631020280892-02a11b5e960a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTE5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1724659215886-3674d0a05845?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjA5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1776761363365-ad83248b93df?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjI5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1661875135365-16aab794632f?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1702014859878-5d4743176d28?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1725962479542-1be0a6b0d444?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1661962340349-6ea59fff7e7b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1737517302831-e7b8a8eaa97c?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1631049421570-dafb48ce5e1b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjI2fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1661884177973-3068b241e80d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjM0fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
  ],
  deluxe: [
    [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=85&w=1200',
      'https://plus.unsplash.com/premium_photo-1676823553593-ac587b35a018?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjM4fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1776500587913-6e55907a738e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjQ0fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1771775529138-a7a20ba7e032?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjYxfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1663089331117-b4176fef4c9a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njk4fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1682094026083-fc4329ef6771?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzI5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1766928210443-0be92ed5884a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzM0fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&q=85&w=1200',
      'https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1559508551-44bff1de756b?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1714138076694-0ff65875fc23?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzc5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1507038772120-7fff76f79d79?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1676321688630-9558e7d2be10?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1559841644-08984562005a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1671269705768-cad27668134c?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1631048730670-ff5cd0d08f15?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1609602126247-4ab7188b4aa1?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1645619200527-c6786729c2da?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661962688308-2b00b88b9765?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1590490359854-dfba19688d70?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1660731513683-4cb0c9ac09b8?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTV8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1661963630748-3de7ab820570?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1612320743558-020669ff20e8?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1630999295881-e00725e1de45?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTl8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1631049307290-bb947b114627?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAwfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
  ],
  suite: [
    [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=85&w=1200',
      'https://plus.unsplash.com/premium_photo-1661962340349-6ea59fff7e7b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1725962479542-1be0a6b0d444?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1507038772120-7fff76f79d79?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1671269705768-cad27668134c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA0fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1609602126247-4ab7188b4aa1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1645619200527-c6786729c2da?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1559508551-44bff1de756b?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/flagged/photo-1573168710865-2e4c680d921a?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA1fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1590490359854-dfba19688d70?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTN8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    [
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=85&w=1200',
      'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://plus.unsplash.com/premium_photo-1661901997525-fdbfb88d8554?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTExfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE4fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1713762523087-41019a875741?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE2fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1661963239507-7bdf41a5e66b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI3fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1592230228921-df3a88a2244e?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI4fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1664299335717-71d868cd964e?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMxfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1661963630748-3de7ab820570?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=85&w=1200',
    ],
    [
      'https://images.unsplash.com/photo-1729605411476-defbdab14c54?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMyfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049035115-f96132761a38?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM4fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1662411394768-77db7c7b62e8?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQwfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://plus.unsplash.com/premium_photo-1661886031345-d14bf4e09a07?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
    [
      'https://images.unsplash.com/photo-1631048835049-b0b7ee4be40b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ5fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049035581-bec13f40dfff?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUzfHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1612152605347-f93296cb657d?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU2fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1631049035634-c04c637651b1?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTY2fHxob3RlbCUyMHJvb218ZW58MHx8MHx8fDA%3D',
    ],
  ],
};

const roomData = {
  single: {
    descriptions: [
      'Elegantly appointed single room with premium bedding, marble bathroom and panoramic views.',
      'Cosy single room featuring bespoke furnishings, king-size bed and espresso machine.',
    ],
  },
  double: {
    descriptions: [
      'Spacious double room with separate lounge area, twin or king-size bed and panoramic views.',
      'Beautifully designed double room with rich fabrics, rainfall shower and pillow menu.',
    ],
  },
  deluxe: {
    descriptions: [
      'Expansive deluxe room with separate living area, soaking tub and premium minibar.',
      'Superior deluxe room with floor-to-ceiling windows, walk-in wardrobe and butler pantry.',
    ],
  },
  suite: {
    descriptions: [
      'Lavish one-bedroom suite with private terrace, dining area and dedicated butler service.',
      'Grand suite spanning an entire floor with dual bathrooms, kitchen and sweeping skyline views.',
    ],
  },
};

const luxuryRooms = [
  { type: 'single', priceBase: 380, guests: 1 },
  { type: 'double', priceBase: 580, guests: 2 },
  { type: 'deluxe', priceBase: 920, guests: 2 },
  { type: 'suite', priceBase: 2200, guests: 4 },
];
const upscaleRooms = [
  { type: 'single', priceBase: 220, guests: 1 },
  { type: 'double', priceBase: 320, guests: 2 },
  { type: 'deluxe', priceBase: 480, guests: 2 },
  { type: 'suite', priceBase: 850, guests: 4 },
];

const budgetRooms = [
  { type: 'single', priceBase: 170, guests: 1 },
  { type: 'double', priceBase: 240, guests: 2 },
  { type: 'deluxe', priceBase: 360, guests: 2 },
  { type: 'suite', priceBase: 720, guests: 4 },
];

const templatesByStars = {
  3: budgetRooms,
  4: upscaleRooms,
  5: luxuryRooms,
};

function roomInventoryByStars(stars, type, seed) {
  const baseByStars = {
    3: { single: 9, double: 16, deluxe: 7, suite: 2 },
    4: { single: 16, double: 28, deluxe: 12, suite: 4 },
    5: { single: 26, double: 44, deluxe: 22, suite: 8 },
  };
  const starMap = baseByStars[stars] ?? baseByStars[4];
  const base = starMap[type] ?? 8;
  const spread = Math.max(1, Math.floor(base * 0.2));
  const jitter = Math.floor(pseudoRand(seed + base * 13) * (spread * 2 + 1)) - spread;
  return Math.max(1, base + jitter);
}

const HOTELS_TARGET_COUNT = 220;
const STARS_CYCLE = [3, 4, 5];
const PROPERTY_TYPES = ['Hotel', 'Resort', 'Villa', 'Apartment', 'Boutique', 'Hostel', 'B&B', 'Guest House'];

const CITIES = [
  { city: 'Paris', streets: ['Rue de Rivoli', 'Avenue Montaigne', 'Rue Cler', 'Boulevard Saint-Germain'] },
  { city: 'London', streets: ['Strand', 'Portland Place', 'Regent Street', 'Covent Garden'] },
  { city: 'Berlin', streets: ['Unter den Linden', 'Friedrichstraße', 'Kurfürstendamm', 'Leipziger Straße'] },
  { city: 'Rome', streets: ['Via Veneto', 'Via del Corso', 'Piazza Navona', 'Largo di Torre Argentina'] },
  { city: 'Barcelona', streets: ['Passeig de Gracia', 'Carrer de Mallorca', 'La Rambla', 'Avinguda Diagonal'] },
  { city: 'Vienna', streets: ['Ringstraße', 'Kärntner Straße', 'Mariahilfer Straße', 'Wiener Straße'] },
  { city: 'Amsterdam', streets: ['Keizersgracht', 'Prinsengracht', 'Herengracht', 'Damrak'] },
  { city: 'Tokyo', streets: ['Shinjuku', 'Ginza', 'Shibuya', 'Akihabara'] },
  { city: 'Dubai', streets: ['Sheikh Zayed Road', 'Jumeirah Beach Walk', 'Al Wasl Road', 'Marina Promenade'] },
  { city: 'New York', streets: ['5th Avenue', 'Madison Avenue', 'Broadway', 'Park Avenue'] },
  { city: 'Bali', streets: ['Jimbaran', 'Seminyak', 'Ubud', 'Uluwatu'] },
];

const HOTEL_IMAGE_POOL = Object.values(ROOM_IMAGE_SETS).flat(2);
const HOTEL_BRANDS = ['Aurora', 'Imperial', 'Majestic', 'Regency', 'Crown', 'Solstice', 'Royal', 'Serene', 'Velvet', 'Atlas', 'Elysian', 'Noir'];

function pseudoRand(seed) {
  return Math.abs(Math.sin(seed) * 10000) % 1;
}

function hotelName(propertyType, brand, city, n) {
  switch (propertyType) {
    case 'Resort':
      return `${brand} ${city} Resort`;
    case 'Villa':
      return `${brand} ${city} Villa`;
    case 'Apartment':
      return `${brand} ${city} Apartment`;
    case 'Boutique':
      return `${brand} Boutique ${city}`;
    case 'Hostel':
      return `${brand} ${city} Hostel`;
    case 'B&B':
      return `${brand} ${city} B&B`;
    case 'Guest House':
      return `${brand} ${city} Guest House`;
    case 'Hotel':
    default:
      return `${brand} ${city} Grand Hotel`;
  }
}

function pickHotelImages(pool, seed) {
  const len = pool.length;
  const i1 = Math.floor(pseudoRand(seed + 1) * len);
  let i2 = Math.floor(pseudoRand(seed + 2) * len);
  let i3 = Math.floor(pseudoRand(seed + 3) * len);
  if (i2 === i1) i2 = (i2 + 1) % len;
  if (i3 === i1 || i3 === i2) i3 = (i3 + 2) % len;
  return [pool[i1], pool[i2], pool[i3]];
}

function makeAmenities({ stars, propertyType, seed }) {
  const a = new Set();

  a.add('WiFi');
  a.add('Gym');
  a.add('Restaurant');
  a.add('Bar');
  a.add('Concierge');
  a.add('Parking');
  a.add('Elevator');
  a.add('Wheelchair Access');
  a.add('Air Conditioning');
  a.add('Non-Smoking');

  const poolProb = propertyType === 'Hostel' ? 0.35 : 0.7;
  if (pseudoRand(seed + 10) < poolProb) a.add('Pool');
  if (stars >= 4 && pseudoRand(seed + 11) < 0.75) a.add('Spa');
  if (stars >= 4 && pseudoRand(seed + 12) < 0.35) a.add('Sauna');
  if (stars >= 4 && pseudoRand(seed + 13) < 0.25) a.add('Hot Tub');
  if (pseudoRand(seed + 14) < 0.25) a.add('Indoor Pool');

  if (pseudoRand(seed + 21) < 0.4) a.add('Garden');
  if (pseudoRand(seed + 22) < 0.45) a.add('Terrace');
  if (pseudoRand(seed + 23) < 0.3) a.add('Balcony');
  if (stars >= 4 && pseudoRand(seed + 24) < 0.25) a.add('Sea View');
  if (pseudoRand(seed + 25) < 0.2) a.add('Beach Access');

  a.add('Breakfast');
  if (stars >= 4 && pseudoRand(seed + 30) < 0.4) a.add('Half Board');
  if (stars >= 4 && pseudoRand(seed + 31) < 0.2) a.add('Full Board');
  if (stars >= 4 && pseudoRand(seed + 32) < 0.25) a.add('All-Inclusive');

  if (pseudoRand(seed + 40) < 0.55) a.add('Room Service');
  if (pseudoRand(seed + 41) < 0.25) a.add('Pet Friendly');
  if (pseudoRand(seed + 42) < 0.25) {
    a.add('Family Rooms');
    a.add('Kids Club');
    a.add('Babysitting');
  }
  if (pseudoRand(seed + 43) < 0.2) a.add('Kids Meal');
  if (pseudoRand(seed + 44) < 0.18) a.add('Vegetarian');
  if (pseudoRand(seed + 45) < 0.14) a.add('Special Diet');
  if (pseudoRand(seed + 46) < 0.12) a.add('Gluten-Free');

  if (pseudoRand(seed + 50) < 0.2) a.add('Business Center');
  if (pseudoRand(seed + 51) < 0.18) a.add('Meeting Rooms');
  if (pseudoRand(seed + 52) < 0.12) a.add('Tennis');
  if (pseudoRand(seed + 53) < 0.1) a.add('Golf');
  if (pseudoRand(seed + 54) < 0.08) a.add('Water Sports');

  if (pseudoRand(seed + 60) < 0.15) a.add('Airport Shuttle');
  if (pseudoRand(seed + 61) < 0.12) a.add('24-hour Reception');
  if (pseudoRand(seed + 62) < 0.08) a.add('Laundry');

  return Array.from(a).slice(0, 18);
}

const PROPERTY_TYPE_RU = {
  Hotel: 'отель',
  Resort: 'курорт',
  Villa: 'виллы',
  Apartment: 'апартаменты',
  Boutique: 'бутик-отель',
  Hostel: 'хостел',
  'B&B': 'отель типа «ночлег и завтрак»',
  'Guest House': 'гостевой дом',
};

const PROPERTY_TYPE_EN = {
  Hotel: "hotel",
  Resort: "resort",
  Villa: "villas",
  Apartment: "apartments",
  Boutique: "boutique hotel",
  Hostel: "hostel",
  "B&B": "bed and breakfast hotel",
  "Guest House": "guest house",
};

const ROOM_TYPE_RU = {
  single: 'одноместный номер',
  double: 'двухместный номер',
  deluxe: 'номер делюкс',
  suite: 'номер-сьют',
};

const ROOM_TYPE_EN = {
  single: "single room",
  double: "double room",
  deluxe: "deluxe room",
  suite: "suite",
};

function pickFrom(arr, seed) {
  if (!arr.length) return '';
  const i = Math.floor(pseudoRand(seed) * arr.length);
  return arr[Math.max(0, Math.min(arr.length - 1, i))] ?? '';
}

function hasAmenity(amenities, needle) {
  const list = Array.isArray(amenities) ? amenities.map((a) => String(a).toLowerCase()) : [];
  const n = String(needle).toLowerCase();
  return list.some((a) => a.includes(n));
}

function makeParagraph5(lines) {
  const safe = lines.slice(0, 5);
  while (safe.length < 5) safe.push(' ');
  return safe.join('\n');
}

function makeHotelLongDescription({ name, address, stars, city, propertyType, amenities, seed }) {
  const propertyRu = PROPERTY_TYPE_RU[propertyType] ?? propertyType;
  const isBali = city === 'Bali';

  const poolWord = hasAmenity(amenities, 'Infinity Pool')
    ? 'инфинити-бассейн'
    : hasAmenity(amenities, 'Rooftop Pool')
      ? 'бассейн на крыше'
      : hasAmenity(amenities, 'Cliff Infinity Pool')
        ? 'обрывной инфинити-бассейн'
        : hasAmenity(amenities, 'Pool')
          ? 'бассейн'
          : 'зона отдыха у воды';

  const wellnessWord = hasAmenity(amenities, 'Spa') ? 'спа и велнес' : hasAmenity(amenities, 'Sauna') ? 'сауна и расслабление' : 'восстановление и тишина';

  const mealPlan =
    hasAmenity(amenities, 'All-Inclusive') ? 'формата «всё включено»' :
    hasAmenity(amenities, 'Full Board') ? 'полного пансиона' :
    hasAmenity(amenities, 'Half Board') ? 'полупансиона' :
    'завтрака и блюд на ваш выбор';

  const hasAirport = hasAmenity(amenities, 'Airport Shuttle');
  const hasParking = hasAmenity(amenities, 'Parking');
  const hasSeaOrOcean =
    hasAmenity(amenities, 'Sea View') || hasAmenity(amenities, 'Ocean Views') || hasAmenity(amenities, 'Waterfront Views') || hasAmenity(amenities, 'Lake View');

  const cityVibe = isBali
    ? 'тропическая мягкость, утренний ветер и особая ритмика острова'
    : 'собственный характер города и продуманная забота сервиса';

  const cityNature = isBali
    ? 'садов, моря и закатов, которые хочется встречать медленно'
    : 'света, деталей и приятного ощущения пространства вокруг';

  const conciergePhrase = pickFrom(
    ['Консьерж подскажет маршруты и тихие места без лишней суеты.', 'Команда на связи, чтобы поездка шла по плану.', 'Помощь с бронями и логистикой — как часть сервиса, а не задача гостя.'],
    seed + 1,
  );
  const closingPhrase = pickFrom(
    ['Вы успеете отдохнуть, а город останется в памяти самым тёплым образом.', 'Останется ощущение «всё продумано» — и желание вернуться.', 'Комфорт здесь работает тихо: он просто есть, когда нужен.'],
    seed + 2,
  );

  const p1 = makeParagraph5([
    `Добро пожаловать в ${name} — ${propertyRu} в ${city}.`,
    `Адрес: ${address}.`,
    `Здесь легко почувствовать ${cityVibe} и расслабиться с первых минут.`,
    `Архитектура и интерьер собраны так, чтобы вы не отвлекались на мелочи.`,
    `Ниже — ваш личный гид по отдыху: атмосферный, спокойный, понятный.`,
  ]);

  const p2 = makeParagraph5([
    `Номера в ${name} создают баланс между эстетикой и практичностью.`,
    `Выберите режим тишины и комфортный сон — кровать подготовлена для отдыха.`,
    `Wi‑Fi и климат-контроль помогают оставаться в своём темпе в любой сезон.`,
    hasSeaOrOcean
      ? 'Смена дня ощущается особенно ярко, если из окон открываются виды.'
      : 'Окна мягко «собирают» свет, а внутри сохраняется спокойная атмосфера.',
    'Каждая мелочь работает на ощущение приватности.',
  ]);

  const p3 = makeParagraph5([
    `Люди приезжают сюда за полноценным перезапуском — и это легко почувствовать.`,
    `Если вам важна вода, вас встречает ${poolWord} и удобные зоны отдыха рядом.`,
    `Для восстановления доступен ${wellnessWord}.`,
    hasAmenity(amenities, 'Gym')
      ? 'Фитнес-зал помогает держать форму без жёсткого графика.'
      : 'Двигаться и расслабляться можно в комфортном темпе — без лишнего «надо».',
    'После процедур особенно приятно замедлить день и просто побыть собой.',
  ]);

  const p4 = makeParagraph5([
    `Вкус — важная часть впечатления: завтраки подаются так, чтобы начинать день спокойно.`,
    hasAmenity(amenities, 'Restaurant')
      ? 'Ресторан внутри отеля раскрывает меню красиво и без лишней формальности.'
      : 'Подача блюд организована так, чтобы вам не приходилось ждать и планировать лишнее.',
    hasAmenity(amenities, 'Bar')
      ? 'Бар создаёт правильное настроение: вечер получается неспешным и тёплым.'
      : 'Сервис напитков продуман так, чтобы не нарушать поток впечатлений.',
    `Если вы выбираете ${mealPlan}, отдых становится ещё проще.`,
    `А с рекомендациями по местной кухне город раскрывается вкуснее.`,
  ]);

  const p5 = makeParagraph5([
    `Здесь ценят время: вежливый сервис помогает с планами и организацией.`,
    hasAirport
      ? 'При необходимости можно заранее организовать трансфер.'
      : hasParking
        ? 'Предусмотрены удобства для транспорта и парковки.'
        : 'Организация поездок и встреч продумана без лишних шагов.',
    conciergePhrase,
    `Подходит и для деловых поездок, и для отдыха: настроение легко переключается.`,
    closingPhrase,
  ]);

  return [p1, p2, p3, p4, p5].join('\n\n');
}

function makeHotelLongDescriptionEn({ name, address, stars, city, propertyType, amenities, seed }) {
  const propertyEn = PROPERTY_TYPE_EN[propertyType] ?? propertyType;
  const isBali = city === "Bali";

  const poolWord = hasAmenity(amenities, "Infinity Pool")
    ? "infinity pool"
    : hasAmenity(amenities, "Rooftop Pool")
      ? "rooftop pool"
      : hasAmenity(amenities, "Cliff Infinity Pool")
        ? "cliff infinity pool"
        : hasAmenity(amenities, "Pool")
          ? "pool"
          : "waterfront relaxation area";

  const wellnessWord = hasAmenity(amenities, "Spa")
    ? "spa and wellness"
    : hasAmenity(amenities, "Sauna")
      ? "sauna and relaxation"
      : "recovery and quiet";

  const mealPlan = hasAmenity(amenities, "All-Inclusive")
    ? "all-inclusive"
    : hasAmenity(amenities, "Full Board")
      ? "full board"
      : hasAmenity(amenities, "Half Board")
        ? "half board"
        : "breakfast and meals of your choice";

  const hasAirport = hasAmenity(amenities, "Airport Shuttle");
  const hasParking = hasAmenity(amenities, "Parking");
  const hasSeaOrOcean =
    hasAmenity(amenities, "Sea View") ||
    hasAmenity(amenities, "Ocean Views") ||
    hasAmenity(amenities, "Waterfront Views") ||
    hasAmenity(amenities, "Lake View");

  const cityVibe = isBali
    ? "tropical softness, morning breeze, and the island's special rhythm"
    : "the city's own character and thoughtful service care";

  const conciergePhrase = pickFrom(
    [
      "The concierge will suggest routes and quiet places without needless fuss.",
      "The team stays in touch so your trip goes according to plan.",
      "Help with bookings and logistics is part of the service — not a guest task.",
    ],
    seed + 1,
  );
  const closingPhrase = pickFrom(
    [
      "You'll have time to rest, and the city will stay in memory in the warmest way.",
      "You'll feel “everything is thought through” — and you'll want to come back.",
      "Comfort works quietly here: it's simply there when you need it.",
    ],
    seed + 2,
  );

  const p1 = makeParagraph5([
    `Welcome to ${name} — ${propertyEn} in ${city}.`,
    `Address: ${address}.`,
    `Here you'll easily feel ${cityVibe} and relax from the very first minutes.`,
    "The architecture and interiors are put together so you won't be distracted by small details.",
    "Below is your personal travel guide: atmospheric, calm, and clear.",
  ]);

  const p2 = makeParagraph5([
    `Rooms at ${name} create a balance between aesthetics and practicality.`,
    "Choose a quiet mode and a comfortable sleep — the bed is prepared for rest.",
    "Wi‑Fi and climate control help you stay in your own rhythm in any season.",
    hasSeaOrOcean
      ? "The change of day feels especially vivid when the windows open up to views."
      : "Windows gently “gather” the light, and inside a calm atmosphere is preserved.",
    "Every small detail works towards a feeling of privacy.",
  ]);

  const p3 = makeParagraph5([
    "People come here for a full reset — and you can easily feel it.",
    `If water is important to you, ${poolWord} welcomes you and relaxing areas are nearby.`,
    `For recovery, ${wellnessWord} is available.`,
    hasAmenity(amenities, "Gym")
      ? "A fitness room helps you stay in shape without a strict schedule."
      : "You can move and relax at a comfortable pace — without unnecessary “should”.",
    "After the treatments, it's especially pleasant to slow the day down and simply be yourself.",
  ]);

  const p4 = makeParagraph5([
    "Taste is an important part of the experience: breakfast is served so you can start the day calmly.",
    hasAmenity(amenities, "Restaurant")
      ? "An in-hotel restaurant reveals the menu beautifully, without unnecessary formality."
      : "Food service is arranged so you don't have to wait and plan extra.",
    hasAmenity(amenities, "Bar")
      ? "The bar sets the right mood: evenings are unhurried and warm."
      : "The drink service is designed not to disrupt the flow of impressions.",
    `If you choose ${mealPlan}, rest becomes even easier.`,
    "With recommendations for local cuisine, the city opens up with even better taste.",
  ]);

  const p5 = makeParagraph5([
    "They value your time here: courteous service helps with plans and organization.",
    hasAirport
      ? "If needed, transfers can be arranged in advance."
      : hasParking
        ? "Transport and parking facilities are available."
        : "Trip and meetup logistics are thought through without extra steps.",
    conciergePhrase,
    "It suits both business trips and vacations: your mood shifts effortlessly.",
    closingPhrase,
  ]);

  return [p1, p2, p3, p4, p5].join("\n\n");
}

function makeRoomLongDescription({ roomType, guests, hotelName, hotelCity, amenities, seed }) {
  const roomRu = ROOM_TYPE_RU[roomType] ?? roomType;
  const guestsText = guests === 1 ? 'одного гостя' : guests === 2 ? 'двух гостей' : `${guests} гостей`;

  const hasBalconyOrTerrace = hasAmenity(amenities, 'Balcony') || hasAmenity(amenities, 'Terrace');
  const viewText = hasAmenity(amenities, 'Sea View') || hasAmenity(amenities, 'Ocean Views')
    ? 'вид на море'
    : hasAmenity(amenities, 'Waterfront Views')
      ? 'вид на набережную'
      : hasAmenity(amenities, 'Lake View')
        ? 'вид на озеро'
        : hasAmenity(amenities, 'Garden')
          ? 'зелёный вид на сад'
          : 'мягкий вид на окрестности';

  const layoutByType = {
    single: 'компактно и удобно для максимального сна',
    double: 'для отдыха вдвоём с продуманной зоной для расслабления',
    deluxe: 'с дополнительным пространством, чтобы не чувствовать тесноты',
    suite: 'со статусом «больше пространства»: отдельная гостиная и уединение',
  }[roomType] ?? 'комфортно и продуманно';

  const viewLine = hasBalconyOrTerrace
    ? `Если за окном ${hotelCity}, вам понравятся моменты тишины у окна или на приватной площадке.`
    : `Даже без балкона в номере сохраняется приятный «воздушный» настрой — ${viewText}.`;

  const p1 = makeParagraph5([
    `Ваш ${roomRu} в ${hotelName} — это пространство для спокойного отдыха и приватности.`,
    `Планировка рассчитана на ${guestsText} и поддерживает ощущение личного комфорта.`,
    `Здесь ${layoutByType}, поэтому время внутри отеля ощущается легче.`,
    viewLine,
    'Рядом всегда есть всё нужное, но при этом нет ощущения «перегруженности».',
  ]);

  const p2 = makeParagraph5([
    'Кровать и бельё подобраны так, чтобы сон был ровным и без компромиссов.',
    'Кондиционирование помогает поддерживать комфортную температуру в течение дня.',
    hasAmenity(amenities, 'WiFi')
      ? 'Wi‑Fi работает стабильно, чтобы вы могли работать или планировать поездки.'
      : 'Связь организована так, чтобы не отвлекать от отдыха.',
    'Звуки снаружи приглушены, а внутри легче переключиться на «медленный режим».',
    'Продуманные зоны хранения и рабочее место делают пребывание практичным.',
  ]);

  const p3 = makeParagraph5([
    'Ванная комната — чистая, продуманная и удобная в ежедневных сценариях.',
    'Сантехника и освещение подобраны так, чтобы утро начиналось мягко, а вечер заканчивался спокойно.',
    'Тёплые детали создают атмосферу «спа дома», даже если день был насыщенным.',
    `В ${hotelCity} погода может меняться — но внутри всегда держится комфортное ощущение.`,
    'Завершите вечер в тишине: проснуться будет легче, а поездка — приятнее.',
  ]);

  return [p1, p2, p3].join('\n\n');
}

function makeRoomLongDescriptionEn({ roomType, guests, hotelName, hotelCity, amenities, seed }) {
  const roomEn = ROOM_TYPE_EN[roomType] ?? roomType;
  const guestsText = guests === 1 ? "one guest" : guests === 2 ? "two guests" : `${guests} guests`;

  const hasBalconyOrTerrace = hasAmenity(amenities, "Balcony") || hasAmenity(amenities, "Terrace");
  const viewText = hasAmenity(amenities, "Sea View") || hasAmenity(amenities, "Ocean Views")
    ? "sea view"
    : hasAmenity(amenities, "Waterfront Views")
      ? "waterfront view"
      : hasAmenity(amenities, "Lake View")
        ? "lake view"
        : hasAmenity(amenities, "Garden")
          ? "green garden view"
          : "a soft view of the surroundings";

  const layoutByType = {
    single: "compact and comfortable for maximum sleep",
    double: "for relaxing together with a thoughtfully designed lounge area",
    deluxe: "with extra space so you never feel cramped",
    suite: "with a status of “more space”: a separate living room and privacy",
  }[roomType] ?? "comfortable and thoughtfully planned";

  const viewLine = hasBalconyOrTerrace
    ? `With ${hotelCity} outside, you'll enjoy quiet moments by the window or on your private terrace.`
    : `Even without a balcony, the room keeps a pleasant “airy” feel — ${viewText}.`;

  const p1 = makeParagraph5([
    `Your ${roomEn} in ${hotelName} is a space for calm rest and privacy.`,
    `The layout is designed for ${guestsText} and supports a feeling of personal comfort.`,
    `Here it's ${layoutByType}, so time inside the hotel feels lighter.`,
    viewLine,
    "Everything you need is always nearby, but there is no feeling of “overload”.",
  ]);

  const p2 = makeParagraph5([
    "The bed and linens are chosen so sleep is smooth and without compromises.",
    "Air conditioning helps maintain a comfortable temperature throughout the day.",
    hasAmenity(amenities, "WiFi")
      ? "Wi‑Fi works reliably so you can work or plan your trips."
      : "Connectivity is organized so it doesn't distract from rest.",
    "Outside sounds are muffled, and inside it's easier to switch to a “slow mode”.",
    "Thoughtful storage areas and a working spot make the stay practical.",
  ]);

  const p3 = makeParagraph5([
    "The bathroom is clean, thoughtfully designed, and comfortable in everyday scenarios.",
    "Fixtures and lighting are chosen so your mornings start gently and evenings end calmly.",
    "Warm details create a “spa at home” atmosphere, even after a busy day.",
    `In ${hotelCity} weather may change — but inside you'll always feel that comfort.`,
    "End the evening in quiet: waking up will be easier, and your trip will feel better.",
  ]);

  return [p1, p2, p3].join("\n\n");
}

const hotelsToInsert = (() => {
  const perCity = Math.floor(HOTELS_TARGET_COUNT / CITIES.length);
  const totalPlanned = perCity * CITIES.length;
  const result = [];
  let globalIdx = 0;

  for (const c of CITIES) {
    for (let i = 0; i < perCity; i++) {
      const propertyType = PROPERTY_TYPES[globalIdx % PROPERTY_TYPES.length];
      const stars = STARS_CYCLE[globalIdx % STARS_CYCLE.length];
      const brand = HOTEL_BRANDS[Math.floor(pseudoRand(globalIdx + 123) * HOTEL_BRANDS.length)];
      const name = hotelName(propertyType, brand, c.city, i);

      const seed = globalIdx * 100 + stars * 7;
      const images = pickHotelImages(HOTEL_IMAGE_POOL, seed);
      const amenities = makeAmenities({ stars, propertyType, seed });

      const street = c.streets[Math.floor(pseudoRand(seed + 1) * c.streets.length)];
      const addressNo = 10 + Math.floor(pseudoRand(seed + 2) * 980);
      const address = `${addressNo} ${street}, ${c.city}`;

      // Convert stars to a plausible rating (3.0..5.0)
      const ratingBase = 3.6 + (stars - 3) * 0.35;
      const rating = Math.min(5, Math.max(3.2, ratingBase + pseudoRand(seed + 3) * 0.8));

      const descriptionRu = makeHotelLongDescription({
        name,
        address,
        stars,
        city: c.city,
        propertyType,
        amenities,
        seed: seed + i,
      });

      const descriptionEn = makeHotelLongDescriptionEn({
        name,
        address,
        stars,
        city: c.city,
        propertyType,
        amenities,
        seed: seed + i,
      });
      const coords = resolveHotelCoordinates({ name, address, city: c.city });

      result.push({
        name,
        description: descriptionRu,
        description_ru: descriptionRu,
        description_en: descriptionEn,
        city: c.city,
        address,
        stars,
        amenities,
        images,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        rating,
      });

      globalIdx++;
    }
  }

  if (result.length !== totalPlanned) {
    console.warn('Unexpected generated hotels count:', result.length, 'expected:', totalPlanned);
  }

  // Safety trim to exactly HOTELS_TARGET_COUNT
  return result.slice(0, HOTELS_TARGET_COUNT);
})();

// Minimal idempotency for repeated runs (skip already generated hotels)
const existingHotelsRes = await client.query('SELECT name, city FROM hotels');
const existingKeySet = new Set(existingHotelsRes.rows.map((r) => `${r.name}|||${r.city}`));

let hotelCount = 0;
let roomCount = 0;

let hotelGeneratedIdx = 0;
for (const hotel of hotelsToInsert) {
  const key = `${hotel.name}|||${hotel.city}`;
  if (existingKeySet.has(key)) {
    hotelGeneratedIdx++;
    continue;
  }

  const r = await client.query(
    `INSERT INTO hotels (name, description, description_ru, description_en, city, address, latitude, longitude, stars, amenities, images, rating)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING id`,
    [
      hotel.name,
      hotel.description,
      hotel.description_ru,
      hotel.description_en,
      hotel.city,
      hotel.address,
      hotel.latitude,
      hotel.longitude,
      hotel.stars,
      hotel.amenities,
      hotel.images,
      hotel.rating,
    ],
  );

  const hotelId = r.rows[0].id;
  const setIdx = hotelCount % 10;
  hotelCount++;

  const baseTemplate = templatesByStars[hotel.stars] ?? upscaleRooms;
  let roomsInsertedThisHotel = 0;

  // Exactly one card per room type in each hotel (inventory is in totalRooms)
  for (const room of baseTemplate) {
    const jitter = Math.floor(Math.random() * 60) - 25;
    const descRu = makeRoomLongDescription({
      roomType: room.type,
      guests: room.guests,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      amenities: hotel.amenities,
      seed: hotelGeneratedIdx * 100000 + roomsInsertedThisHotel * 97 + room.type.length,
    });

    const descEn = makeRoomLongDescriptionEn({
      roomType: room.type,
      guests: room.guests,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      amenities: hotel.amenities,
      seed: hotelGeneratedIdx * 100000 + roomsInsertedThisHotel * 97 + room.type.length,
    });
    const images = ROOM_IMAGE_SETS[room.type][setIdx];
    const totalRooms = roomInventoryByStars(
      hotel.stars,
      room.type,
      hotelGeneratedIdx * 10000 + roomsInsertedThisHotel * 17,
    );

    await client.query(
      `INSERT INTO rooms (hotel_id, type, price, guests, total_rooms, description, description_ru, description_en, images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [hotelId, room.type, room.priceBase + jitter, room.guests, totalRooms, descRu, descRu, descEn, images],
    );
    roomCount++;
    roomsInsertedThisHotel++;
  }

  console.log(`✓ ${hotel.name} (${hotel.city}) — ${roomsInsertedThisHotel} rooms added`);
  hotelGeneratedIdx++;
}

console.log(`\n Done! Inserted ${hotelCount} hotels and ${roomCount} rooms.`);
await client.end();
