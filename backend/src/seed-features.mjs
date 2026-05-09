import pg from 'pg';

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

function seeded(seed) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const pickN = (rng, arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
};

const CITY_LANGUAGES = {
  Paris: ['French', 'English', 'Spanish', 'German', 'Italian'],
  London: ['English', 'French', 'Spanish', 'German', 'Arabic'],
  Berlin: ['German', 'English', 'Russian', 'Turkish'],
  Munich: ['German', 'English', 'Italian'],
  Hamburg: ['German', 'English', 'Russian'],
  Barcelona: ['Spanish', 'Catalan', 'English', 'French', 'German'],
  Rome: ['Italian', 'English', 'French', 'Spanish'],
  Florence: ['Italian', 'English', 'French', 'Spanish'],
  Venice: ['Italian', 'English', 'French', 'German'],
  Amsterdam: ['Dutch', 'English', 'German', 'French'],
  Stockholm: ['Swedish', 'English', 'Finnish'],
  Copenhagen: ['Danish', 'English', 'Swedish'],
  Tokyo: ['Japanese', 'English', 'Mandarin', 'Korean'],
  Kyoto: ['Japanese', 'English', 'Mandarin'],
  Fujikawaguchiko: ['Japanese', 'English'],
  Bangkok: ['Thai', 'English', 'Mandarin', 'Japanese'],
  Singapore: ['English', 'Mandarin', 'Malay', 'Tamil'],
  'Ho Chi Minh City': ['Vietnamese', 'English', 'French'],
  Phuket: ['Thai', 'English', 'Russian', 'Mandarin'],
  Bali: ['Indonesian', 'English', 'Russian', 'Mandarin', 'Japanese'],
  Maldives: ['English', 'Russian', 'Arabic', 'Mandarin'],
  Dubai: ['Arabic', 'English', 'Russian', 'Hindi', 'Urdu', 'Mandarin'],
  Marrakech: ['Arabic', 'French', 'English', 'Spanish'],
  'Cape Town': ['English', 'Afrikaans', 'Xhosa'],
  Serengeti: ['English', 'Swahili'],
  'New York': ['English', 'Spanish', 'Mandarin', 'French'],
  Miami: ['English', 'Spanish', 'Portuguese'],
  'Los Angeles': ['English', 'Spanish', 'Korean', 'Mandarin'],
  Sydney: ['English', 'Mandarin'],
  'Hamilton Island': ['English'],
  Patagonia: ['Spanish', 'English'],
  'San Miguel de Allende': ['Spanish', 'English'],
};

const CITY_LANDMARKS = {
  Paris: [
    { type: 'airport', nameRu: 'Аэропорт Шарль-де-Голль (CDG)', nameEn: 'Charles de Gaulle Airport (CDG)', lat: 49.0097, lng: 2.5479 },
    { type: 'airport', nameRu: 'Аэропорт Орли (ORY)', nameEn: 'Orly Airport (ORY)', lat: 48.7233, lng: 2.3794 },
    { type: 'station', nameRu: 'Вокзал Гар-дю-Нор', nameEn: 'Gare du Nord Station', lat: 48.8809, lng: 2.3553 },
    { type: 'attraction', nameRu: 'Эйфелева башня', nameEn: 'Eiffel Tower', lat: 48.8584, lng: 2.2945 },
    { type: 'attraction', nameRu: 'Лувр', nameEn: 'Louvre Museum', lat: 48.8606, lng: 2.3376 },
    { type: 'center', nameRu: 'Площадь Согласия', nameEn: 'Place de la Concorde', lat: 48.8656, lng: 2.3211 },
  ],
  London: [
    { type: 'airport', nameRu: 'Аэропорт Хитроу (LHR)', nameEn: 'Heathrow Airport (LHR)', lat: 51.4700, lng: -0.4543 },
    { type: 'airport', nameRu: 'Аэропорт Гатвик (LGW)', nameEn: 'Gatwick Airport (LGW)', lat: 51.1537, lng: -0.1821 },
    { type: 'station', nameRu: 'Вокзал Кингс-Кросс', nameEn: "King's Cross Station", lat: 51.5308, lng: -0.1238 },
    { type: 'attraction', nameRu: 'Биг-Бен', nameEn: 'Big Ben', lat: 51.5007, lng: -0.1246 },
    { type: 'attraction', nameRu: 'Тауэр', nameEn: 'Tower of London', lat: 51.5081, lng: -0.0759 },
    { type: 'center', nameRu: 'Пикадилли-Серкус', nameEn: 'Piccadilly Circus', lat: 51.5099, lng: -0.1337 },
  ],
  Berlin: [
    { type: 'airport', nameRu: 'Аэропорт Берлин-Бранденбург (BER)', nameEn: 'Berlin Brandenburg Airport (BER)', lat: 52.3667, lng: 13.5033 },
    { type: 'station', nameRu: 'Главный вокзал', nameEn: 'Berlin Hauptbahnhof', lat: 52.5251, lng: 13.3694 },
    { type: 'attraction', nameRu: 'Бранденбургские ворота', nameEn: 'Brandenburg Gate', lat: 52.5163, lng: 13.3777 },
    { type: 'attraction', nameRu: 'Берлинская стена', nameEn: 'Berlin Wall Memorial', lat: 52.5354, lng: 13.3903 },
    { type: 'center', nameRu: 'Александерплац', nameEn: 'Alexanderplatz', lat: 52.5219, lng: 13.4132 },
  ],
  Munich: [
    { type: 'airport', nameRu: 'Аэропорт Мюнхен (MUC)', nameEn: 'Munich Airport (MUC)', lat: 48.3538, lng: 11.7861 },
    { type: 'station', nameRu: 'Главный вокзал', nameEn: 'München Hauptbahnhof', lat: 48.1408, lng: 11.5583 },
    { type: 'attraction', nameRu: 'Мариенплац', nameEn: 'Marienplatz', lat: 48.1374, lng: 11.5755 },
    { type: 'center', nameRu: 'Центр города', nameEn: 'City Center', lat: 48.1372, lng: 11.5755 },
  ],
  Hamburg: [
    { type: 'airport', nameRu: 'Аэропорт Гамбург (HAM)', nameEn: 'Hamburg Airport (HAM)', lat: 53.6304, lng: 9.9882 },
    { type: 'station', nameRu: 'Главный вокзал', nameEn: 'Hamburg Hauptbahnhof', lat: 53.5527, lng: 10.0067 },
    { type: 'attraction', nameRu: 'Эльбская филармония', nameEn: 'Elbphilharmonie', lat: 53.5413, lng: 9.9842 },
    { type: 'center', nameRu: 'Ратушная площадь', nameEn: 'Rathausmarkt', lat: 53.5503, lng: 9.9924 },
  ],
  Barcelona: [
    { type: 'airport', nameRu: 'Аэропорт Эль-Прат (BCN)', nameEn: 'El Prat Airport (BCN)', lat: 41.2974, lng: 2.0833 },
    { type: 'station', nameRu: 'Вокзал Сантс', nameEn: 'Barcelona Sants Station', lat: 41.3791, lng: 2.1402 },
    { type: 'attraction', nameRu: 'Саграда Фамилия', nameEn: 'Sagrada Familia', lat: 41.4036, lng: 2.1744 },
    { type: 'attraction', nameRu: 'Парк Гуэль', nameEn: 'Park Güell', lat: 41.4145, lng: 2.1527 },
    { type: 'beach', nameRu: 'Пляж Барселонета', nameEn: 'Barceloneta Beach', lat: 41.3784, lng: 2.1925 },
    { type: 'center', nameRu: 'Площадь Каталонии', nameEn: 'Plaça de Catalunya', lat: 41.3870, lng: 2.1700 },
  ],
  Rome: [
    { type: 'airport', nameRu: 'Аэропорт Фьюмичино (FCO)', nameEn: 'Fiumicino Airport (FCO)', lat: 41.8003, lng: 12.2389 },
    { type: 'station', nameRu: 'Вокзал Термини', nameEn: 'Roma Termini Station', lat: 41.9013, lng: 12.5018 },
    { type: 'attraction', nameRu: 'Колизей', nameEn: 'Colosseum', lat: 41.8902, lng: 12.4922 },
    { type: 'attraction', nameRu: 'Ватикан', nameEn: 'Vatican City', lat: 41.9029, lng: 12.4534 },
    { type: 'attraction', nameRu: 'Фонтан Треви', nameEn: 'Trevi Fountain', lat: 41.9009, lng: 12.4833 },
  ],
  Florence: [
    { type: 'airport', nameRu: 'Аэропорт Флоренции (FLR)', nameEn: 'Florence Airport (FLR)', lat: 43.8100, lng: 11.2051 },
    { type: 'station', nameRu: 'Вокзал Санта-Мария-Новелла', nameEn: 'Firenze Santa Maria Novella', lat: 43.7765, lng: 11.2483 },
    { type: 'attraction', nameRu: 'Собор Дуомо', nameEn: 'Duomo Cathedral', lat: 43.7731, lng: 11.2560 },
    { type: 'attraction', nameRu: 'Понте Веккьо', nameEn: 'Ponte Vecchio', lat: 43.7679, lng: 11.2531 },
    { type: 'attraction', nameRu: 'Галерея Уффици', nameEn: 'Uffizi Gallery', lat: 43.7678, lng: 11.2553 },
  ],
  Venice: [
    { type: 'airport', nameRu: 'Аэропорт Марко Поло (VCE)', nameEn: 'Marco Polo Airport (VCE)', lat: 45.5053, lng: 12.3519 },
    { type: 'station', nameRu: 'Вокзал Санта-Лючия', nameEn: 'Venezia Santa Lucia Station', lat: 45.4413, lng: 12.3214 },
    { type: 'attraction', nameRu: 'Площадь Сан-Марко', nameEn: "St. Mark's Square", lat: 45.4341, lng: 12.3388 },
    { type: 'attraction', nameRu: 'Мост Риальто', nameEn: 'Rialto Bridge', lat: 45.4380, lng: 12.3358 },
  ],
  Amsterdam: [
    { type: 'airport', nameRu: 'Аэропорт Схипхол (AMS)', nameEn: 'Schiphol Airport (AMS)', lat: 52.3105, lng: 4.7683 },
    { type: 'station', nameRu: 'Центральный вокзал', nameEn: 'Amsterdam Centraal', lat: 52.3791, lng: 4.9003 },
    { type: 'attraction', nameRu: 'Музей Ван Гога', nameEn: 'Van Gogh Museum', lat: 52.3584, lng: 4.8811 },
    { type: 'attraction', nameRu: 'Дом Анны Франк', nameEn: 'Anne Frank House', lat: 52.3752, lng: 4.8840 },
    { type: 'center', nameRu: 'Площадь Дам', nameEn: 'Dam Square', lat: 52.3731, lng: 4.8923 },
  ],
  Stockholm: [
    { type: 'airport', nameRu: 'Аэропорт Арланда (ARN)', nameEn: 'Arlanda Airport (ARN)', lat: 59.6519, lng: 17.9186 },
    { type: 'station', nameRu: 'Центральный вокзал', nameEn: 'Stockholm Central Station', lat: 59.3304, lng: 18.0589 },
    { type: 'attraction', nameRu: 'Старый город', nameEn: 'Gamla Stan', lat: 59.3253, lng: 18.0707 },
  ],
  Copenhagen: [
    { type: 'airport', nameRu: 'Аэропорт Каструп (CPH)', nameEn: 'Copenhagen Airport (CPH)', lat: 55.6181, lng: 12.6561 },
    { type: 'station', nameRu: 'Центральный вокзал', nameEn: 'Copenhagen Central Station', lat: 55.6727, lng: 12.5648 },
    { type: 'attraction', nameRu: 'Сады Тиволи', nameEn: 'Tivoli Gardens', lat: 55.6736, lng: 12.5681 },
    { type: 'attraction', nameRu: 'Нюхавн', nameEn: 'Nyhavn', lat: 55.6797, lng: 12.5912 },
  ],
  Tokyo: [
    { type: 'airport', nameRu: 'Аэропорт Нарита (NRT)', nameEn: 'Narita Airport (NRT)', lat: 35.7720, lng: 140.3929 },
    { type: 'airport', nameRu: 'Аэропорт Ханэда (HND)', nameEn: 'Haneda Airport (HND)', lat: 35.5494, lng: 139.7798 },
    { type: 'station', nameRu: 'Станция Токио', nameEn: 'Tokyo Station', lat: 35.6812, lng: 139.7671 },
    { type: 'attraction', nameRu: 'Сибуя Кроссинг', nameEn: 'Shibuya Crossing', lat: 35.6595, lng: 139.7004 },
    { type: 'attraction', nameRu: 'Храм Сэнсо-дзи', nameEn: 'Senso-ji Temple', lat: 35.7148, lng: 139.7967 },
  ],
  Kyoto: [
    { type: 'station', nameRu: 'Станция Киото', nameEn: 'Kyoto Station', lat: 34.9858, lng: 135.7585 },
    { type: 'attraction', nameRu: 'Кинкаку-дзи (Золотой павильон)', nameEn: 'Kinkaku-ji (Golden Pavilion)', lat: 35.0394, lng: 135.7292 },
    { type: 'attraction', nameRu: 'Фусими Инари-тайся', nameEn: 'Fushimi Inari Shrine', lat: 34.9671, lng: 135.7727 },
  ],
  Fujikawaguchiko: [
    { type: 'attraction', nameRu: 'Озеро Кавагути', nameEn: 'Lake Kawaguchi', lat: 35.5113, lng: 138.7547 },
    { type: 'attraction', nameRu: 'Гора Фудзи', nameEn: 'Mount Fuji', lat: 35.3606, lng: 138.7274 },
  ],
  Bangkok: [
    { type: 'airport', nameRu: 'Аэропорт Суварнабхуми (BKK)', nameEn: 'Suvarnabhumi Airport (BKK)', lat: 13.6900, lng: 100.7501 },
    { type: 'attraction', nameRu: 'Большой дворец', nameEn: 'Grand Palace', lat: 13.7500, lng: 100.4913 },
    { type: 'attraction', nameRu: 'Ват Арун', nameEn: 'Wat Arun', lat: 13.7437, lng: 100.4889 },
  ],
  Singapore: [
    { type: 'airport', nameRu: 'Аэропорт Чанги (SIN)', nameEn: 'Changi Airport (SIN)', lat: 1.3644, lng: 103.9915 },
    { type: 'attraction', nameRu: 'Marina Bay Sands', nameEn: 'Marina Bay Sands', lat: 1.2834, lng: 103.8607 },
    { type: 'attraction', nameRu: 'Сады у залива', nameEn: 'Gardens by the Bay', lat: 1.2816, lng: 103.8636 },
  ],
  'Ho Chi Minh City': [
    { type: 'airport', nameRu: 'Аэропорт Таншоннят (SGN)', nameEn: 'Tan Son Nhat Airport (SGN)', lat: 10.8188, lng: 106.6519 },
    { type: 'attraction', nameRu: 'Собор Сайгонской Богоматери', nameEn: 'Notre-Dame Cathedral Basilica', lat: 10.7798, lng: 106.6990 },
  ],
  Phuket: [
    { type: 'airport', nameRu: 'Аэропорт Пхукет (HKT)', nameEn: 'Phuket Airport (HKT)', lat: 8.1132, lng: 98.3169 },
    { type: 'beach', nameRu: 'Пляж Патонг', nameEn: 'Patong Beach', lat: 7.8964, lng: 98.2966 },
    { type: 'beach', nameRu: 'Пляж Ката', nameEn: 'Kata Beach', lat: 7.8190, lng: 98.2960 },
  ],
  Bali: [
    { type: 'airport', nameRu: 'Аэропорт Нгурах-Рай (DPS)', nameEn: 'Ngurah Rai Airport (DPS)', lat: -8.7482, lng: 115.1672 },
    { type: 'beach', nameRu: 'Пляж Семиньяк', nameEn: 'Seminyak Beach', lat: -8.6905, lng: 115.1670 },
    { type: 'attraction', nameRu: 'Храм Танах Лот', nameEn: 'Tanah Lot Temple', lat: -8.6212, lng: 115.0867 },
    { type: 'attraction', nameRu: 'Убуд центр', nameEn: 'Ubud Center', lat: -8.5069, lng: 115.2625 },
  ],
  Maldives: [
    { type: 'airport', nameRu: 'Аэропорт Мале (MLE)', nameEn: 'Malé International Airport (MLE)', lat: 4.1916, lng: 73.5290 },
    { type: 'beach', nameRu: 'Частный пляж курорта', nameEn: 'Private Resort Beach', lat: 4.1755, lng: 73.5093 },
  ],
  Dubai: [
    { type: 'airport', nameRu: 'Международный аэропорт Дубай (DXB)', nameEn: 'Dubai International Airport (DXB)', lat: 25.2532, lng: 55.3657 },
    { type: 'attraction', nameRu: 'Бурдж-Халифа', nameEn: 'Burj Khalifa', lat: 25.1972, lng: 55.2744 },
    { type: 'attraction', nameRu: 'Дубай Молл', nameEn: 'The Dubai Mall', lat: 25.1972, lng: 55.2796 },
    { type: 'beach', nameRu: 'Пляж Джумейра', nameEn: 'Jumeirah Beach', lat: 25.2048, lng: 55.2708 },
  ],
  Marrakech: [
    { type: 'airport', nameRu: 'Аэропорт Менара (RAK)', nameEn: 'Menara Airport (RAK)', lat: 31.6069, lng: -8.0363 },
    { type: 'attraction', nameRu: 'Площадь Джемаа эль-Фна', nameEn: 'Jemaa el-Fnaa Square', lat: 31.6258, lng: -7.9891 },
    { type: 'attraction', nameRu: 'Сады Мажорель', nameEn: 'Majorelle Garden', lat: 31.6411, lng: -7.9930 },
  ],
  'Cape Town': [
    { type: 'airport', nameRu: 'Международный аэропорт Кейптауна (CPT)', nameEn: 'Cape Town International (CPT)', lat: -33.9695, lng: 18.5972 },
    { type: 'attraction', nameRu: 'Столовая гора', nameEn: 'Table Mountain', lat: -33.9628, lng: 18.4098 },
    { type: 'attraction', nameRu: 'V&A Waterfront', nameEn: 'V&A Waterfront', lat: -33.9032, lng: 18.4197 },
  ],
  Serengeti: [
    { type: 'airport', nameRu: 'Аэропорт Серонера', nameEn: 'Seronera Airstrip', lat: -2.4566, lng: 34.8231 },
    { type: 'attraction', nameRu: 'Национальный парк Серенгети', nameEn: 'Serengeti National Park', lat: -2.3333, lng: 34.8333 },
  ],
  'New York': [
    { type: 'airport', nameRu: 'Аэропорт JFK', nameEn: 'JFK Airport', lat: 40.6413, lng: -73.7781 },
    { type: 'airport', nameRu: 'Аэропорт LaGuardia', nameEn: 'LaGuardia Airport (LGA)', lat: 40.7769, lng: -73.8740 },
    { type: 'station', nameRu: 'Центральный вокзал', nameEn: 'Grand Central Terminal', lat: 40.7527, lng: -73.9772 },
    { type: 'attraction', nameRu: 'Таймс-сквер', nameEn: 'Times Square', lat: 40.7580, lng: -73.9855 },
    { type: 'attraction', nameRu: 'Центральный парк', nameEn: 'Central Park', lat: 40.7829, lng: -73.9654 },
    { type: 'attraction', nameRu: 'Статуя Свободы', nameEn: 'Statue of Liberty', lat: 40.6892, lng: -74.0445 },
  ],
  Miami: [
    { type: 'airport', nameRu: 'Аэропорт Майами (MIA)', nameEn: 'Miami International Airport (MIA)', lat: 25.7959, lng: -80.2871 },
    { type: 'beach', nameRu: 'Саут-Бич', nameEn: 'South Beach', lat: 25.7826, lng: -80.1340 },
    { type: 'attraction', nameRu: 'Линкольн-роуд', nameEn: 'Lincoln Road', lat: 25.7906, lng: -80.1394 },
  ],
  'Los Angeles': [
    { type: 'airport', nameRu: 'Аэропорт LAX', nameEn: 'LAX Airport', lat: 33.9416, lng: -118.4085 },
    { type: 'attraction', nameRu: 'Голливудский знак', nameEn: 'Hollywood Sign', lat: 34.1341, lng: -118.3215 },
    { type: 'beach', nameRu: 'Пляж Санта-Моника', nameEn: 'Santa Monica Beach', lat: 34.0099, lng: -118.4965 },
  ],
  Sydney: [
    { type: 'airport', nameRu: 'Аэропорт Кингсфорд-Смит (SYD)', nameEn: 'Kingsford Smith Airport (SYD)', lat: -33.9399, lng: 151.1753 },
    { type: 'attraction', nameRu: 'Сиднейский оперный театр', nameEn: 'Sydney Opera House', lat: -33.8568, lng: 151.2153 },
    { type: 'beach', nameRu: 'Пляж Бонди', nameEn: 'Bondi Beach', lat: -33.8908, lng: 151.2743 },
  ],
  'Hamilton Island': [
    { type: 'airport', nameRu: 'Аэропорт Гамильтон-Айленд (HTI)', nameEn: 'Hamilton Island Airport (HTI)', lat: -20.3581, lng: 148.9522 },
    { type: 'beach', nameRu: 'Пляж Уайтхэвен', nameEn: 'Whitehaven Beach', lat: -20.2839, lng: 149.0399 },
  ],
  Patagonia: [
    { type: 'airport', nameRu: 'Аэропорт Эль-Калафате (FTE)', nameEn: 'El Calafate Airport (FTE)', lat: -50.2803, lng: -72.0531 },
    { type: 'attraction', nameRu: 'Ледник Перито-Морено', nameEn: 'Perito Moreno Glacier', lat: -50.4967, lng: -73.0397 },
  ],
  'San Miguel de Allende': [
    { type: 'attraction', nameRu: 'Парроккия Сан-Мигель-Архангел', nameEn: 'Parroquia de San Miguel Arcángel', lat: 20.9143, lng: -100.7437 },
    { type: 'center', nameRu: 'Центр города', nameEn: 'Town Center', lat: 20.9144, lng: -100.7440 },
  ],
};

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const HOTEL_AMENITY_POOLS = {
  wellness: [
    'spa_thai_massage', 'spa_aromatherapy', 'spa_couples_room', 'spa_hot_stone',
    'indoor_pool', 'outdoor_pool', 'outdoor_pool_heated', 'rooftop_pool', 'infinity_pool',
    'sauna_finnish', 'sauna_infrared', 'hammam', 'jacuzzi', 'cold_plunge',
    'fitness_studio', 'yoga_classes', 'pilates_studio', 'personal_trainer',
    'beauty_salon', 'hair_salon', 'nail_studio',
  ],
  business: [
    'business_center_24h', 'conference_rooms', 'meeting_rooms_small', 'banquet_hall',
    'coworking_lounge', 'printing_service', 'secretarial_service', 'av_equipment',
    'translator_on_request', 'private_event_space',
  ],
  food: [
    'michelin_restaurant', 'rooftop_bar', 'wine_cellar_500plus', 'cocktail_bar',
    'lobby_bar', 'cigar_lounge', 'room_service_24h', 'afternoon_tea',
    'buffet_breakfast', 'a_la_carte_breakfast', 'pool_bar', 'beach_restaurant',
    'sushi_bar', 'tapas_bar', 'craft_beer_bar', 'champagne_bar',
  ],
  family: [
    'kids_club', 'babysitting_certified', 'playground_outdoor', 'kids_pool_heated',
    'family_rooms', 'baby_cribs', 'kids_menu', 'high_chairs', 'kids_movie_room',
    'teen_lounge', 'stroller_rental',
  ],
  services: [
    'concierge_24h', 'butler_service', 'valet_parking', 'laundry_24h',
    'dry_cleaning', 'shoe_shine', 'currency_exchange', 'tour_desk',
    'bicycle_rental', 'car_rental_desk', 'limousine_service', 'helicopter_transfer',
    'private_chauffeur', 'multilingual_staff', 'express_checkout', 'safe_deposit_lobby',
  ],
  leisure: [
    'private_beach', 'beach_cabanas', 'tennis_court', 'paddle_court',
    'golf_putting_green', 'golf_nearby_18hole', 'ski_storage', 'ski_school',
    'private_garden', 'library_lounge', 'cinema_room', 'game_room',
    'billiards', 'art_gallery', 'rooftop_terrace', 'marina_access',
  ],
  tech: [
    'high_speed_wifi_500mbps', 'smart_room_controls', 'usb_c_in_lobby',
    'mobile_check_in', 'digital_key', 'in_app_concierge', 'fast_charging_ev',
  ],
  sustainability: [
    'leed_certified', 'green_key_certified', 'plastic_free', 'solar_powered',
    'rainwater_harvesting', 'organic_garden', 'electric_shuttle', 'reusable_amenities',
  ],
};

const ROOM_AMENITY_POOLS = {
  tech: [
    'smart_tv_55', 'smart_tv_65_oled', 'netflix_built_in', 'apple_tv',
    'bluetooth_speaker_bose', 'bluetooth_speaker_marshall', 'usb_c_charging',
    'wireless_charger', 'high_speed_wifi', 'voice_assistant_alexa',
    'tablet_room_controls', 'in_room_ipad',
  ],
  bath: [
    'rainfall_shower', 'walk_in_shower', 'freestanding_bathtub', 'jetted_tub',
    'heated_floors', 'heated_towel_rail', 'bathrobes_egyptian_cotton',
    'slippers_branded', 'hermes_amenities', 'diptyque_amenities', 'bvlgari_amenities',
    'molton_brown_amenities', 'magnifying_mirror', 'hairdryer_dyson_supersonic',
    'bidet', 'double_vanity', 'walk_in_closet',
  ],
  comfort: [
    'pillow_menu', 'mattress_topper_premium', 'blackout_curtains', 'soundproof_windows',
    'climate_control_individual', 'humidifier_on_request', 'in_room_safe_laptop',
    'minibar_premium', 'minibar_complimentary', 'turndown_service',
  ],
  food: [
    'nespresso_machine', 'espresso_machine_pro', 'kettle_tea_selection_twg',
    'complimentary_water_glass_bottles', 'fresh_fruit_basket_daily',
    'welcome_chocolates', 'mini_fridge', 'wine_glasses_riedel', 'champagne_flutes',
  ],
  work: [
    'ergonomic_chair_herman_miller', 'executive_desk', 'reading_light_dual',
    'desk_lamp_usb', 'wireless_printer_access', 'webcam_lighting',
  ],
  view_features: [
    'private_balcony', 'french_doors', 'floor_to_ceiling_windows', 'private_terrace',
    'plunge_pool_in_room', 'outdoor_shower', 'fireplace_gas',
  ],
  bedding: [
    'king_size_bed', 'queen_size_bed', 'twin_beds', 'sofa_bed_extra',
    'egyptian_cotton_sheets_500tc', 'down_duvet', 'hypoallergenic_options',
  ],
};

const FREE_ITEM_POOLS = [
  'wifi_unlimited', 'bottled_water_2_daily', 'tea_coffee_daily', 'newspaper_digital',
  'welcome_amenity', 'turndown_service', 'shoe_shine', 'in_room_safe',
  'hair_dryer', 'iron_ironing_board', 'umbrella_in_room', 'slippers_robes',
  'toiletries_set', 'daily_housekeeping', 'mineral_water_unlimited',
];

const GENERIC_NEARBY_TYPES = [
  { type: 'metro', nameRu: 'Ближайшее метро', nameEn: 'Nearest metro station', minKm: 0.2, maxKm: 1.2 },
  { type: 'supermarket', nameRu: 'Ближайший супермаркет', nameEn: 'Nearest supermarket', minKm: 0.1, maxKm: 0.8 },
  { type: 'park', nameRu: 'Ближайший парк', nameEn: 'Nearest park', minKm: 0.3, maxKm: 1.5 },
  { type: 'pharmacy', nameRu: 'Ближайшая аптека', nameEn: 'Nearest pharmacy', minKm: 0.1, maxKm: 0.7 },
  { type: 'museum', nameRu: 'Ближайший музей', nameEn: 'Nearest museum', minKm: 0.4, maxKm: 2.5 },
  { type: 'shopping_mall', nameRu: 'Торговый центр', nameEn: 'Shopping mall', minKm: 0.5, maxKm: 3.0 },
  { type: 'restaurant_district', nameRu: 'Ресторанный квартал', nameEn: 'Restaurant district', minKm: 0.2, maxKm: 1.5 },
  { type: 'hospital', nameRu: 'Ближайшая больница', nameEn: 'Nearest hospital', minKm: 0.5, maxKm: 3.5 },
  { type: 'atm', nameRu: 'Ближайший банкомат', nameEn: 'Nearest ATM', minKm: 0.05, maxKm: 0.5 },
  { type: 'cafe_district', nameRu: 'Уличные кафе', nameEn: 'Cafés & coffee shops', minKm: 0.1, maxKm: 0.8 },
];

const PAYMENT_POOL = ['Visa', 'Mastercard', 'AmericanExpress', 'UnionPay', 'JCB', 'ApplePay', 'GooglePay', 'PayInHotel'];

const { rows: hotels } = await client.query(`SELECT id, city, stars, latitude, longitude, rating FROM hotels`);
console.log(`Updating extended fields for ${hotels.length} hotels...`);

let updatedCount = 0;
for (const h of hotels) {
  const rng = seeded(h.id);
  const stars = h.stars || 3;

  const cityLangs = CITY_LANGUAGES[h.city] || ['English', 'Russian'];
  const langCount = stars >= 5 ? Math.min(cityLangs.length, 5) : stars >= 4 ? 3 : 2;
  const languages = cityLangs.slice(0, langCount);

  const counts = {
    5: { wellness: 6, business: 4, food: 6, family: 5, services: 6, leisure: 5 },
    4: { wellness: 5, business: 3, food: 4, family: 4, services: 6, leisure: 3 },
    3: { wellness: 3, business: 2, food: 3, family: 2, services: 4, leisure: 2 },
  }[stars] || { wellness: 2, business: 1, food: 2, family: 1, services: 3, leisure: 1 };

  const amenitiesExtended = {};
  for (const [cat, n] of Object.entries(counts)) {
    amenitiesExtended[cat] = pickN(rng, HOTEL_AMENITY_POOLS[cat] || [], n);
  }

  // Check-in/out — varies slightly
  const ciHour = stars >= 5 ? '14:00' : '15:00';
  const coHour = stars >= 5 ? '12:00' : '11:00';

  const earlyCheckIn = { available: true, fee: stars >= 5 ? 0 : 30 + Math.floor(rng() * 30), currency: 'USD' };
  const lateCheckOut = { available: true, fee: stars >= 5 ? 0 : 25 + Math.floor(rng() * 35), currency: 'USD' };

  const parkingTypes = [
    { kind: 'underground', available: true, free: false, covered: true, valet: false, price: 25 + Math.floor(rng() * 25), currency: 'USD' },
    { kind: 'covered', available: true, free: false, covered: true, valet: false, price: 18 + Math.floor(rng() * 20), currency: 'USD' },
    { kind: 'open', available: true, free: true, covered: false, valet: false, price: 0 },
    { kind: 'valet', available: true, free: false, covered: true, valet: true, price: 35 + Math.floor(rng() * 30), currency: 'USD' },
    { kind: 'open_paid', available: true, free: false, covered: false, valet: false, price: 12 + Math.floor(rng() * 15), currency: 'USD' },
    { kind: 'underground_free', available: true, free: true, covered: true, valet: false, price: 0 },
  ];
  let parking;
  if (stars >= 5) parking = pick(rng, [parkingTypes[3], parkingTypes[0], parkingTypes[5]]);
  else if (stars === 4) parking = pick(rng, [parkingTypes[0], parkingTypes[1], parkingTypes[5], parkingTypes[3]]);
  else parking = pick(rng, [parkingTypes[2], parkingTypes[1], parkingTypes[4], parkingTypes[5]]);

  const accessibility = {
    wheelchairAccessible: stars >= 4 || rng() > 0.4,
    elevator: stars >= 3 || rng() > 0.3,
    rampedEntrance: stars >= 4 || rng() > 0.5,
    accessibleRooms: stars >= 4 || rng() > 0.6,
    brailleSignage: stars >= 5 && rng() > 0.5,
    hearingAssistance: stars >= 5 && rng() > 0.6,
  };

  const petPolicy = rng() > 0.4
    ? { allowed: true, maxWeightKg: rng() > 0.5 ? 10 : 25, fee: 25 + Math.floor(rng() * 50), restrictions: 'small_dogs_cats_only' }
    : { allowed: false };

  const childPolicy = {
    allowed: true,
    ageGroups: [
      { from: 0, to: 2, pricing: 'free' },
      { from: 3, to: 6, pricing: stars >= 5 ? 'free' : 'reduced' },
      { from: 7, to: 12, pricing: 'reduced' },
    ],
  };

  const payCount = stars >= 5 ? 8 : stars >= 4 ? 6 : 4;
  const paymentMethods = PAYMENT_POOL.slice(0, payCount);

  let popularBadge = null;
  if (stars >= 5 && h.rating >= 4.4 && rng() > 0.35) {
    popularBadge = 'POPULAR_CHOICE';
  } else if (stars === 4 && h.rating >= 4.6 && rng() > 0.6) {
    popularBadge = 'POPULAR_CHOICE';
  }

  const includedInPrice = ['wifi_unlimited', 'taxes', 'service_charge'];
  if (stars >= 4) includedInPrice.push('breakfast_buffet');
  if (stars >= 5) includedInPrice.push('welcome_drink', 'minibar_softs');
  if (parking.free) includedInPrice.push('parking_free');

  const notIncluded = [];
  if (!parking.free && parking.available) notIncluded.push('parking_paid');
  notIncluded.push('city_tax', 'extra_services');
  if (stars < 4) notIncluded.push('breakfast_extra');

  const landmarks = CITY_LANDMARKS[h.city] || [];
  const keyDistances = [];
  if (h.latitude != null && h.longitude != null) {
    for (const lm of landmarks) {
      const km = distanceKm(h.latitude, h.longitude, lm.lat, lm.lng);
      keyDistances.push({
        type: lm.type,
        nameRu: lm.nameRu,
        nameEn: lm.nameEn,
        distanceKm: Math.round(km * 10) / 10,
        durationWalkMin: km <= 3 ? Math.round(km * 12) : null,
        durationDriveMin: Math.max(3, Math.round(km * 1.6)),
      });
    }
  }
  const usedTypes = new Set(keyDistances.map((d) => d.type));
  for (const g of GENERIC_NEARBY_TYPES) {
    if (keyDistances.length >= 10) break;
    if (usedTypes.has(g.type)) continue;
    const km = Math.round((g.minKm + rng() * (g.maxKm - g.minKm)) * 10) / 10;
    keyDistances.push({
      type: g.type,
      nameRu: g.nameRu,
      nameEn: g.nameEn,
      distanceKm: km,
      durationWalkMin: km <= 2 ? Math.max(2, Math.round(km * 12)) : null,
      durationDriveMin: Math.max(2, Math.round(km * 2)),
    });
    usedTypes.add(g.type);
  }
  keyDistances.sort((a, b) => a.distanceKm - b.distanceKm);
  if (keyDistances.length > 10) keyDistances.length = 10;

  await client.query(
    `UPDATE hotels SET
      amenities_extended = $1::jsonb,
      languages = $2,
      check_in_time = $3,
      check_out_time = $4,
      early_check_in = $5::jsonb,
      late_check_out = $6::jsonb,
      parking = $7::jsonb,
      accessibility = $8::jsonb,
      pet_policy = $9::jsonb,
      child_policy = $10::jsonb,
      payment_methods = $11,
      popular_badge = $12,
      included_in_price = $13,
      not_included = $14,
      key_distances = $15::jsonb
     WHERE id = $16`,
    [
      JSON.stringify(amenitiesExtended),
      languages,
      ciHour,
      coHour,
      JSON.stringify(earlyCheckIn),
      JSON.stringify(lateCheckOut),
      JSON.stringify(parking),
      JSON.stringify(accessibility),
      JSON.stringify(petPolicy),
      JSON.stringify(childPolicy),
      paymentMethods,
      popularBadge,
      includedInPrice,
      notIncluded,
      JSON.stringify(keyDistances),
      h.id,
    ],
  );
  updatedCount++;
}
console.log(`✓ Updated ${updatedCount} hotels`);

const { rows: rooms } = await client.query(`SELECT r.id, r.type, r.hotel_id, h.stars FROM rooms r JOIN hotels h ON r.hotel_id = h.id`);
console.log(`Updating extended fields for ${rooms.length} rooms...`);

const SIZE_BY_TYPE = { single: [18, 24], double: [28, 36], deluxe: [40, 55], suite: [60, 110] };
const VIEW_POOL = ['city', 'garden', 'courtyard', 'pool', 'sea', 'mountain', 'park'];
const FLOOR_POOL = ['low', 'mid', 'high'];
const BATH_BY_TYPE = {
  single: ['shower'],
  double: ['shower', 'bath'],
  deluxe: ['bath', 'shower_and_bath'],
  suite: ['shower_and_bath', 'jacuzzi'],
};

const BED_BY_TYPE = {
  single: [[{ type: 'twin', count: 1 }]],
  double: [[{ type: 'queen', count: 1 }], [{ type: 'twin', count: 2 }]],
  deluxe: [[{ type: 'king', count: 1 }], [{ type: 'queen', count: 1 }, { type: 'sofa_bed', count: 1 }]],
  suite: [[{ type: 'king', count: 1 }, { type: 'sofa_bed', count: 1 }], [{ type: 'king', count: 1 }]],
};

let roomUpdated = 0;
for (const r of rooms) {
  const rng = seeded(r.id * 7919);
  const sizeRange = SIZE_BY_TYPE[r.type] || [25, 35];
  const sizeSqm = sizeRange[0] + Math.floor(rng() * (sizeRange[1] - sizeRange[0]));

  const floor = pick(rng, FLOOR_POOL);
  const viewType = pick(rng, VIEW_POOL);
  const bedConfiguration = pick(rng, BED_BY_TYPE[r.type] || [[{ type: 'queen', count: 1 }]]);
  const bathType = pick(rng, BATH_BY_TYPE[r.type] || ['shower']);
  const soundproofing = r.stars >= 4 || rng() > 0.5;

  const isPremium = r.type === 'suite' || r.type === 'deluxe';
  const isHigh = r.stars >= 5;

  const detail = {
    tech: pickN(rng, ROOM_AMENITY_POOLS.tech, isPremium ? 5 : 3),
    bath: pickN(rng, ROOM_AMENITY_POOLS.bath, isPremium ? 7 : 4),
    comfort: pickN(rng, ROOM_AMENITY_POOLS.comfort, isPremium ? 6 : 4),
    food: pickN(rng, ROOM_AMENITY_POOLS.food, isPremium ? 5 : 3),
    work: pickN(rng, ROOM_AMENITY_POOLS.work, isPremium ? 4 : 2),
    bedding: pickN(rng, ROOM_AMENITY_POOLS.bedding, 3),
  };
  if (isPremium || isHigh) {
    detail.view_features = pickN(rng, ROOM_AMENITY_POOLS.view_features, isHigh ? 3 : 2);
  }

  const freeItems = pickN(rng, FREE_ITEM_POOLS, isPremium ? 10 : 8);

  await client.query(
    `UPDATE rooms SET
      size_sqm = $1,
      floor = $2,
      view_type = $3,
      bed_configuration = $4::jsonb,
      bath_type = $5,
      soundproofing = $6,
      non_smoking = $7,
      amenities_detailed = $8::jsonb,
      free_items = $9
     WHERE id = $10`,
    [
      sizeSqm,
      floor,
      viewType,
      JSON.stringify(bedConfiguration),
      bathType,
      soundproofing,
      true,
      JSON.stringify(detail),
      freeItems,
      r.id,
    ],
  );
  roomUpdated++;
}
console.log(`✓ Updated ${roomUpdated} rooms`);

console.log(`Inserting rate plans...`);
await client.query(`DELETE FROM room_rate_plans`);
let ratePlanCount = 0;
for (const r of rooms) {
  const plans = [
    { code: 'standard', nameRu: 'Стандартный тариф', nameEn: 'Standard rate', descriptionRu: 'Базовая цена без питания. Бесплатная отмена за 48 часов до заезда.', descriptionEn: 'Base price, no meals. Free cancellation up to 48 hours before check-in.', priceModifier: 0, refundable: true, includesBreakfast: false, includesDinner: false, freeCancellationHours: 48, lateCheckoutIncluded: false },
    { code: 'breakfast_included', nameRu: 'С завтраком', nameEn: 'With breakfast', descriptionRu: 'Включён завтрак на двоих. Бесплатная отмена за 48 часов.', descriptionEn: 'Breakfast for two included. Free cancellation up to 48 hours.', priceModifier: 0.15, refundable: true, includesBreakfast: true, includesDinner: false, freeCancellationHours: 48, lateCheckoutIncluded: false },
    { code: 'dinner_included', nameRu: 'С ужином', nameEn: 'With dinner', descriptionRu: 'Включён ужин из 3 блюд в ресторане отеля. Бесплатная отмена за 48 часов.', descriptionEn: '3-course dinner at the hotel restaurant included. Free cancellation up to 48 hours.', priceModifier: 0.18, refundable: true, includesBreakfast: false, includesDinner: true, freeCancellationHours: 48, lateCheckoutIncluded: false },
    { code: 'breakfast_dinner', nameRu: 'С завтраком и ужином', nameEn: 'Breakfast & dinner', descriptionRu: 'Полупансион: завтрак и ужин в ресторане. Бесплатная отмена за 48 часов.', descriptionEn: 'Half-board: breakfast and dinner. Free cancellation up to 48 hours.', priceModifier: 0.28, refundable: true, includesBreakfast: true, includesDinner: true, freeCancellationHours: 48, lateCheckoutIncluded: false },
    { code: 'non_refundable', nameRu: 'Невозвратный тариф', nameEn: 'Non-refundable rate', descriptionRu: 'Скидка 12% при оплате сразу. Возврат невозможен.', descriptionEn: 'Save 12% with prepayment. Non-refundable.', priceModifier: -0.12, refundable: false, includesBreakfast: false, includesDinner: false, freeCancellationHours: null, lateCheckoutIncluded: false },
    { code: 'non_refundable_breakfast', nameRu: 'Невозвратный с завтраком', nameEn: 'Non-refundable with breakfast', descriptionRu: 'Завтрак включён, скидка 5%. Возврат невозможен.', descriptionEn: 'Breakfast included, 5% off. Non-refundable.', priceModifier: 0.05, refundable: false, includesBreakfast: true, includesDinner: false, freeCancellationHours: null, lateCheckoutIncluded: false },
    { code: 'non_refundable_dinner', nameRu: 'Невозвратный с ужином', nameEn: 'Non-refundable with dinner', descriptionRu: 'Ужин включён, скидка 5%. Возврат невозможен.', descriptionEn: 'Dinner included, 5% off. Non-refundable.', priceModifier: 0.08, refundable: false, includesBreakfast: false, includesDinner: true, freeCancellationHours: null, lateCheckoutIncluded: false },
    { code: 'non_refundable_breakfast_dinner', nameRu: 'Невозвратный с завтраком и ужином', nameEn: 'Non-refundable with breakfast & dinner', descriptionRu: 'Полупансион + скидка 5%. Возврат невозможен.', descriptionEn: 'Half-board + 5% off. Non-refundable.', priceModifier: 0.18, refundable: false, includesBreakfast: true, includesDinner: true, freeCancellationHours: null, lateCheckoutIncluded: false },
  ];

  for (const p of plans) {
    await client.query(
      `INSERT INTO room_rate_plans (room_id, code, name_ru, name_en, description_ru, description_en, price_modifier, refundable, includes_breakfast, includes_dinner, free_cancellation_hours, late_checkout_included)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (room_id, code) DO UPDATE SET
         name_ru = EXCLUDED.name_ru,
         name_en = EXCLUDED.name_en,
         description_ru = EXCLUDED.description_ru,
         description_en = EXCLUDED.description_en,
         price_modifier = EXCLUDED.price_modifier,
         refundable = EXCLUDED.refundable,
         includes_breakfast = EXCLUDED.includes_breakfast,
         includes_dinner = EXCLUDED.includes_dinner,
         free_cancellation_hours = EXCLUDED.free_cancellation_hours,
         late_checkout_included = EXCLUDED.late_checkout_included`,
      [r.id, p.code, p.nameRu, p.nameEn, p.descriptionRu, p.descriptionEn, p.priceModifier, p.refundable, p.includesBreakfast, p.includesDinner, p.freeCancellationHours, p.lateCheckoutIncluded],
    );
    ratePlanCount++;
  }
}
console.log(`✓ Inserted ${ratePlanCount} rate plans`);

console.log(`Inserting booking addons...`);
await client.query(`DELETE FROM booking_addons WHERE hotel_id IS NULL`);

const ADDONS = [
  // Massage services
  { code: 'massage_relax_60', nameRu: 'Расслабляющий массаж (60 мин)', nameEn: 'Relaxing massage (60 min)', descriptionRu: 'Классический расслабляющий массаж всего тела с ароматическими маслами.', descriptionEn: 'Classic full-body relaxing massage with aromatic oils.', icon: 'Hand', category: 'wellness', price: 95, unit: 'per_person', maxQuantity: 4 },
  { code: 'massage_deep_tissue_90', nameRu: 'Глубокий массаж тканей (90 мин)', nameEn: 'Deep tissue massage (90 min)', descriptionRu: 'Интенсивный массаж для снятия мышечного напряжения и боли в спине.', descriptionEn: 'Intense massage to relieve muscle tension and back pain.', icon: 'Hand', category: 'wellness', price: 145, unit: 'per_person', maxQuantity: 4 },
  { code: 'massage_hot_stone_75', nameRu: 'Массаж горячими камнями (75 мин)', nameEn: 'Hot stone massage (75 min)', descriptionRu: 'Согревающий массаж вулканическими камнями для глубокого расслабления.', descriptionEn: 'Warming volcanic-stone massage for deep relaxation.', icon: 'Sparkles', category: 'wellness', price: 165, unit: 'per_person', maxQuantity: 4 },
  { code: 'massage_thai_90', nameRu: 'Тайский массаж (90 мин)', nameEn: 'Thai massage (90 min)', descriptionRu: 'Традиционный тайский массаж с мягкой проработкой мышц и растяжкой.', descriptionEn: 'Traditional Thai massage with deep muscle work and gentle stretching.', icon: 'Hand', category: 'wellness', price: 155, unit: 'per_person', maxQuantity: 4 },
  { code: 'massage_sports_60', nameRu: 'Спортивный массаж (60 мин)', nameEn: 'Sports massage (60 min)', descriptionRu: 'Восстановительный массаж для снятия усталости после нагрузок.', descriptionEn: 'Recovery-focused massage to reduce fatigue after physical activity.', icon: 'Hand', category: 'wellness', price: 120, unit: 'per_person', maxQuantity: 4 },
  { code: 'massage_balinese_75', nameRu: 'Балийский массаж (75 мин)', nameEn: 'Balinese massage (75 min)', descriptionRu: 'Глубоко расслабляющий массаж с ароматическими маслами и плавными техниками.', descriptionEn: 'Deeply relaxing massage with aromatic oils and flowing techniques.', icon: 'Sparkles', category: 'wellness', price: 140, unit: 'per_person', maxQuantity: 4 },
  // Transport
  { code: 'airport_transfer_sedan', nameRu: 'Трансфер из аэропорта', nameEn: 'Airport transfer', descriptionRu: 'Премиум-автомобиль с водителем, до 3 пассажиров.', descriptionEn: 'Premium car with driver, up to 3 passengers.', icon: 'Car', category: 'transport', price: 75, unit: 'per_booking', maxQuantity: 1 },
  { code: 'airport_transfer_van', nameRu: 'Трансфер из аэропорта', nameEn: 'Airport transfer', descriptionRu: 'Минивэн до 6 пассажиров с большим багажом.', descriptionEn: 'Minivan for up to 6 passengers with luggage.', icon: 'Bus', category: 'transport', price: 130, unit: 'per_booking', maxQuantity: 1 },
  // Comfort & convenience
  { code: 'early_checkin', nameRu: 'Ранний заезд (с 09:00)', nameEn: 'Early check-in (from 9 AM)', descriptionRu: 'Гарантированный заезд в номер уже с 9 утра.', descriptionEn: 'Guaranteed check-in from 9 AM.', icon: 'Sunrise', category: 'comfort', price: 40, unit: 'per_booking', maxQuantity: 1 },
  { code: 'late_checkout', nameRu: 'Поздний выезд (до 18:00)', nameEn: 'Late check-out (until 6 PM)', descriptionRu: 'Оставайтесь в номере до 18:00 без доплаты по часам.', descriptionEn: 'Keep your room until 6 PM, no hourly fees.', icon: 'Moon', category: 'comfort', price: 45, unit: 'per_booking', maxQuantity: 1 },
  { code: 'extra_bed', nameRu: 'Дополнительная кровать', nameEn: 'Extra bed', descriptionRu: 'Раскладная кровать с полным комплектом постельного белья.', descriptionEn: 'Rollaway bed with full bed linen set.', icon: 'Bed', category: 'comfort', price: 35, unit: 'per_night', maxQuantity: 2 },
  // Wellness / leisure
  { code: 'sauna_session_60', nameRu: 'Сеанс в сауне (60 мин)', nameEn: 'Sauna session (60 min)', descriptionRu: 'Финская сауна или хаммам на выбор, ароматерапия включена.', descriptionEn: 'Finnish sauna or hammam, aromatherapy included.', icon: 'Flame', category: 'wellness', price: 50, unit: 'per_person', maxQuantity: 4 },
  { code: 'gym_personal_trainer', nameRu: 'Тренировка с личным тренером (60 мин)', nameEn: 'Personal training session (60 min)', descriptionRu: 'Индивидуальная тренировка в фитнес-зале с сертифицированным тренером.', descriptionEn: '1-on-1 fitness session with a certified trainer.', icon: 'Dumbbell', category: 'wellness', price: 80, unit: 'per_session', maxQuantity: 5 },
  { code: 'yoga_in_room', nameRu: 'Йога в номере (60 мин)', nameEn: 'In-room yoga session (60 min)', descriptionRu: 'Персональное занятие йогой с инструктором, коврик и реквизит включены.', descriptionEn: 'Private yoga session with instructor; mat and props included.', icon: 'Activity', category: 'wellness', price: 70, unit: 'per_session', maxQuantity: 4 },
  // Activities / experiences
  { code: 'bicycle_rental_day', nameRu: 'Аренда велосипеда (день)', nameEn: 'Bicycle rental (day)', descriptionRu: 'Городской или горный велосипед с шлемом и замком.', descriptionEn: 'City or mountain bike with helmet and lock.', icon: 'Bike', category: 'leisure', price: 22, unit: 'per_day', maxQuantity: 4 },
  { code: 'city_tour_private', nameRu: 'Частная обзорная экскурсия (3 часа)', nameEn: 'Private city tour (3 hrs)', descriptionRu: 'Гид с личным транспортом покажет главные места города.', descriptionEn: 'Guide with private transport shows the city highlights.', icon: 'MapPin', category: 'leisure', price: 180, unit: 'per_booking', maxQuantity: 1 },
  // Practical services
  { code: 'laundry_express', nameRu: 'Срочная стирка (4 часа)', nameEn: 'Express laundry (4 hrs)', descriptionRu: 'Стирка и глажка одежды с возвратом в течение 4 часов.', descriptionEn: 'Wash & press service returned within 4 hours.', icon: 'Shirt', category: 'services', price: 30, unit: 'per_bag', maxQuantity: 5 },
  { code: 'shoe_shine_service', nameRu: 'Чистка обуви', nameEn: 'Shoe shine service', descriptionRu: 'Профессиональная чистка и полировка обуви до блеска.', descriptionEn: 'Professional shine and polish to a mirror finish.', icon: 'Footprints', category: 'services', price: 12, unit: 'per_pair', maxQuantity: 6 },
];

for (const a of ADDONS) {
  await client.query(
    `INSERT INTO booking_addons (hotel_id, code, name_ru, name_en, description_ru, description_en, icon, category, price, unit, max_quantity)
     VALUES (NULL, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (code, hotel_id) DO UPDATE SET
       name_ru = EXCLUDED.name_ru, name_en = EXCLUDED.name_en,
       description_ru = EXCLUDED.description_ru, description_en = EXCLUDED.description_en,
       icon = EXCLUDED.icon, category = EXCLUDED.category,
       price = EXCLUDED.price, unit = EXCLUDED.unit, max_quantity = EXCLUDED.max_quantity`,
    [a.code, a.nameRu, a.nameEn, a.descriptionRu, a.descriptionEn, a.icon, a.category, a.price, a.unit, a.maxQuantity],
  );
}
console.log(`✓ Inserted ${ADDONS.length} global addons`);

await client.end();
console.log('\n All extra features seeded successfully');
