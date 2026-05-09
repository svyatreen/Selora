export type NearbyCategory =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'shopping'
  | 'supermarket'
  | 'pharmacy'
  | 'atm'
  | 'attraction'
  | 'park'
  | 'museum';

export type KeyDistanceItem = {
  type: string;
  nameRu: string;
  nameEn: string;
  distanceKm: number;
  durationWalkMin?: number | null;
  durationDriveMin?: number | null;
};

type PlaceName = { nameRu: string; nameEn: string };

const CATEGORY_ALIASES: Record<string, NearbyCategory> = {
  restaurant: 'restaurant',
  restaurants: 'restaurant',
  cafe: 'cafe',
  cafes: 'cafe',
  bar: 'bar',
  bars: 'bar',
  shopping: 'shopping',
  mall: 'shopping',
  malls: 'shopping',
  supermarket: 'supermarket',
  supermarkets: 'supermarket',
  pharmacy: 'pharmacy',
  pharmacies: 'pharmacy',
  atm: 'atm',
  atms: 'atm',
  attraction: 'attraction',
  attractions: 'attraction',
  park: 'park',
  parks: 'park',
  museum: 'museum',
  museums: 'museum',
};

const FALLBACK_CATEGORY_NAMES: Record<
  NearbyCategory,
  PlaceName[]
> = {
  restaurant: [
    { nameRu: 'Локальный ресторан', nameEn: 'Local Restaurant' },
    { nameRu: 'Городской гастробар', nameEn: 'City Gastrobar' },
    { nameRu: 'Bistro Central', nameEn: 'Bistro Central' },
  ],
  cafe: [
    { nameRu: 'Угловая кофейня', nameEn: 'Corner Coffee' },
    { nameRu: 'Morning Roast Cafe', nameEn: 'Morning Roast Cafe' },
    { nameRu: 'Bean & Bread', nameEn: 'Bean & Bread' },
  ],
  bar: [
    { nameRu: 'Skyline Bar', nameEn: 'Skyline Bar' },
    { nameRu: 'Tap & Barrel', nameEn: 'Tap & Barrel' },
    { nameRu: 'Old Town Pub', nameEn: 'Old Town Pub' },
  ],
  shopping: [
    { nameRu: 'Торговый центр', nameEn: 'Shopping Mall' },
    { nameRu: 'Городская галерея', nameEn: 'City Galleria' },
    { nameRu: 'Outlet Center', nameEn: 'Outlet Center' },
  ],
  supermarket: [
    { nameRu: 'City Market', nameEn: 'City Market' },
    { nameRu: 'Express Grocery', nameEn: 'Express Grocery' },
    { nameRu: 'Fresh Point', nameEn: 'Fresh Point' },
  ],
  pharmacy: [
    { nameRu: 'Городская аптека', nameEn: 'City Pharmacy' },
    { nameRu: '24/7 Pharmacy', nameEn: '24/7 Pharmacy' },
    { nameRu: 'Health Point', nameEn: 'Health Point' },
  ],
  atm: [
    { nameRu: 'Банкомат City Bank', nameEn: 'City Bank ATM' },
    { nameRu: 'Global ATM', nameEn: 'Global ATM' },
    { nameRu: 'CashPoint ATM', nameEn: 'CashPoint ATM' },
  ],
  attraction: [
    { nameRu: 'Исторический центр', nameEn: 'Historic Center' },
    { nameRu: 'Городская набережная', nameEn: 'City Waterfront' },
    { nameRu: 'Главная площадь', nameEn: 'Main Square' },
  ],
  park: [
    { nameRu: 'Центральный парк', nameEn: 'Central Park' },
    { nameRu: 'Сквер у фонтана', nameEn: 'Fountain Square Park' },
    { nameRu: 'Green Walk Park', nameEn: 'Green Walk Park' },
  ],
  museum: [
    { nameRu: 'Городской музей', nameEn: 'City Museum' },
    { nameRu: 'Museum of Modern Art', nameEn: 'Museum of Modern Art' },
    { nameRu: 'Историческая галерея', nameEn: 'Historical Gallery' },
  ],
};

const GLOBAL_REAL_CATEGORY_NAMES: Record<NearbyCategory, PlaceName[]> = {
  restaurant: [
    { nameRu: 'McDonald\'s', nameEn: 'McDonald\'s' },
    { nameRu: 'KFC', nameEn: 'KFC' },
    { nameRu: 'Burger King', nameEn: 'Burger King' },
    { nameRu: 'Domino\'s Pizza', nameEn: 'Domino\'s Pizza' },
    { nameRu: 'Pizza Hut', nameEn: 'Pizza Hut' },
    { nameRu: 'Subway', nameEn: 'Subway' },
    { nameRu: 'Nando\'s', nameEn: 'Nando\'s' },
    { nameRu: 'Wagamama', nameEn: 'Wagamama' },
  ],
  cafe: [
    { nameRu: 'Starbucks', nameEn: 'Starbucks' },
    { nameRu: 'Costa Coffee', nameEn: 'Costa Coffee' },
    { nameRu: 'Tim Hortons', nameEn: 'Tim Hortons' },
    { nameRu: 'Caffè Nero', nameEn: 'Caffe Nero' },
    { nameRu: 'Pret A Manger', nameEn: 'Pret A Manger' },
    { nameRu: 'Coffee Bean & Tea Leaf', nameEn: 'Coffee Bean & Tea Leaf' },
    { nameRu: 'Paul Bakery', nameEn: 'Paul Bakery' },
    { nameRu: 'Dunkin\'', nameEn: 'Dunkin\'' },
  ],
  bar: [
    { nameRu: 'The Irish Pub', nameEn: 'The Irish Pub' },
    { nameRu: 'Sky Bar', nameEn: 'Sky Bar' },
    { nameRu: 'The Rooftop Lounge', nameEn: 'The Rooftop Lounge' },
    { nameRu: 'BrewDog', nameEn: 'BrewDog' },
    { nameRu: 'Hard Rock Cafe Bar', nameEn: 'Hard Rock Cafe Bar' },
    { nameRu: 'Tap House', nameEn: 'Tap House' },
    { nameRu: 'Cocktail Room', nameEn: 'Cocktail Room' },
    { nameRu: 'Craft Beer House', nameEn: 'Craft Beer House' },
  ],
  shopping: [
    { nameRu: 'Zara', nameEn: 'Zara' },
    { nameRu: 'H&M', nameEn: 'H&M' },
    { nameRu: 'Uniqlo', nameEn: 'Uniqlo' },
    { nameRu: 'IKEA', nameEn: 'IKEA' },
    { nameRu: 'Carrefour', nameEn: 'Carrefour' },
    { nameRu: 'Lidl', nameEn: 'Lidl' },
    { nameRu: 'Aldi', nameEn: 'Aldi' },
    { nameRu: '7-Eleven', nameEn: '7-Eleven' },
  ],
  supermarket: [
    { nameRu: 'Carrefour Market', nameEn: 'Carrefour Market' },
    { nameRu: 'Tesco Express', nameEn: 'Tesco Express' },
    { nameRu: 'Lidl', nameEn: 'Lidl' },
    { nameRu: 'Aldi', nameEn: 'Aldi' },
    { nameRu: 'SPAR', nameEn: 'SPAR' },
    { nameRu: 'Co-op', nameEn: 'Co-op' },
  ],
  pharmacy: [
    { nameRu: 'Boots Pharmacy', nameEn: 'Boots Pharmacy' },
    { nameRu: 'CVS Pharmacy', nameEn: 'CVS Pharmacy' },
    { nameRu: 'Walgreens', nameEn: 'Walgreens' },
    { nameRu: 'Apotek', nameEn: 'Apotek' },
    { nameRu: 'BENU Pharmacy', nameEn: 'BENU Pharmacy' },
    { nameRu: 'City Pharmacy', nameEn: 'City Pharmacy' },
    { nameRu: 'HelpNet', nameEn: 'HelpNet' },
    { nameRu: 'DocMorris', nameEn: 'DocMorris' },
  ],
  atm: [
    { nameRu: 'ATM HSBC', nameEn: 'HSBC ATM' },
    { nameRu: 'ATM Citi', nameEn: 'Citi ATM' },
    { nameRu: 'ATM Santander', nameEn: 'Santander ATM' },
    { nameRu: 'ATM BNP Paribas', nameEn: 'BNP Paribas ATM' },
    { nameRu: 'ATM Deutsche Bank', nameEn: 'Deutsche Bank ATM' },
    { nameRu: 'ATM Barclays', nameEn: 'Barclays ATM' },
    { nameRu: 'ATM ING', nameEn: 'ING ATM' },
    { nameRu: 'ATM UniCredit', nameEn: 'UniCredit ATM' },
  ],
  attraction: [
    { nameRu: 'Исторический центр', nameEn: 'Historic Center' },
    { nameRu: 'Старый город', nameEn: 'Old Town' },
    { nameRu: 'Городской музей', nameEn: 'City Museum' },
    { nameRu: 'Смотровая площадка', nameEn: 'City Viewpoint' },
    { nameRu: 'Художественная галерея', nameEn: 'Art Gallery' },
    { nameRu: 'Главная площадь', nameEn: 'Main Square' },
    { nameRu: 'Ратуша', nameEn: 'City Hall' },
    { nameRu: 'Речной променад', nameEn: 'Riverside Promenade' },
  ],
  park: [
    { nameRu: 'Центральный парк', nameEn: 'Central Park' },
    { nameRu: 'Ботанический сад', nameEn: 'Botanical Garden' },
    { nameRu: 'Городской парк', nameEn: 'City Park' },
    { nameRu: 'Парк у озера', nameEn: 'Lakeside Park' },
    { nameRu: 'Парк скульптур', nameEn: 'Sculpture Park' },
    { nameRu: 'Риверсайд парк', nameEn: 'Riverside Park' },
    { nameRu: 'Парк роз', nameEn: 'Rose Garden Park' },
    { nameRu: 'Парк у фонтана', nameEn: 'Fountain Park' },
  ],
  museum: [
    { nameRu: 'Городской музей', nameEn: 'City Museum' },
    { nameRu: 'Исторический музей', nameEn: 'History Museum' },
    { nameRu: 'Музей современного искусства', nameEn: 'Museum of Modern Art' },
    { nameRu: 'Национальная галерея', nameEn: 'National Gallery' },
    { nameRu: 'Музей науки', nameEn: 'Science Museum' },
    { nameRu: 'Музей дизайна', nameEn: 'Design Museum' },
  ],
};

const CITY_SPECIFIC_PLACES: Record<string, Record<NearbyCategory, PlaceName[]>> = {
  Paris: {
    restaurant: [
      { nameRu: 'Le Petit Cler', nameEn: 'Le Petit Cler' },
      { nameRu: 'Cafe de Flore', nameEn: 'Cafe de Flore' },
      { nameRu: 'Les Deux Magots', nameEn: 'Les Deux Magots' },
      { nameRu: 'Le Comptoir du Pantheon', nameEn: 'Le Comptoir du Pantheon' },
      { nameRu: 'Bouillon Chartier', nameEn: 'Bouillon Chartier' },
    ],
    cafe: [
      { nameRu: 'Laduree', nameEn: 'Laduree' },
      { nameRu: 'Angelina', nameEn: 'Angelina' },
      { nameRu: 'Du Pain et des Idees', nameEn: 'Du Pain et des Idees' },
    ],
    bar: [
      { nameRu: 'Little Red Door', nameEn: 'Little Red Door' },
      { nameRu: 'Candelaria', nameEn: 'Candelaria' },
      { nameRu: 'Le Mary Celeste', nameEn: 'Le Mary Celeste' },
    ],
    shopping: [
      { nameRu: 'Galeries Lafayette', nameEn: 'Galeries Lafayette' },
      { nameRu: 'Le Bon Marche', nameEn: 'Le Bon Marche' },
      { nameRu: 'Forum des Halles', nameEn: 'Forum des Halles' },
    ],
    park: [
      { nameRu: 'Тюильри', nameEn: 'Tuileries Garden' },
      { nameRu: 'Люксембургский сад', nameEn: 'Luxembourg Gardens' },
      { nameRu: 'Булонский лес', nameEn: 'Bois de Boulogne' },
    ],
    pharmacy: [
      { nameRu: 'Pharmacie de l\'Hotel de Ville', nameEn: 'Pharmacie de l\'Hotel de Ville' },
      { nameRu: 'Grande Pharmacie de Paris', nameEn: 'Grande Pharmacie de Paris' },
    ],
    atm: [
      { nameRu: 'BNP Paribas ATM', nameEn: 'BNP Paribas ATM' },
      { nameRu: 'Credit Agricole ATM', nameEn: 'Credit Agricole ATM' },
    ],
    supermarket: [
      { nameRu: 'Monoprix', nameEn: 'Monoprix' },
      { nameRu: 'Carrefour City', nameEn: 'Carrefour City' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Центр Помпиду', nameEn: 'Centre Pompidou' },
      { nameRu: 'Музей Родена', nameEn: 'Musee Rodin' },
    ],
  },
  London: {
    restaurant: [
      { nameRu: 'Dishoom', nameEn: 'Dishoom' },
      { nameRu: 'The Wolseley', nameEn: 'The Wolseley' },
      { nameRu: 'Rules Restaurant', nameEn: 'Rules Restaurant' },
      { nameRu: 'Sketch', nameEn: 'Sketch' },
      { nameRu: 'Savoy Grill', nameEn: 'Savoy Grill' },
    ],
    cafe: [
      { nameRu: 'The Wolseley Cafe', nameEn: 'The Wolseley Cafe' },
      { nameRu: 'Fortnum & Mason', nameEn: 'Fortnum & Mason' },
      { nameRu: 'Monmouth Coffee', nameEn: 'Monmouth Coffee' },
    ],
    bar: [
      { nameRu: 'The American Bar', nameEn: 'The American Bar' },
      { nameRu: 'Dukes Bar', nameEn: 'Dukes Bar' },
      { nameRu: 'The Connaught Bar', nameEn: 'The Connaught Bar' },
    ],
    shopping: [
      { nameRu: 'Harrods', nameEn: 'Harrods' },
      { nameRu: 'Selfridges', nameEn: 'Selfridges' },
      { nameRu: 'Liberty London', nameEn: 'Liberty London' },
    ],
    park: [
      { nameRu: 'Риджентс-парк', nameEn: 'Regent\'s Park' },
      { nameRu: 'Сент-Джеймсский парк', nameEn: 'St. James\'s Park' },
      { nameRu: 'Грин-парк', nameEn: 'Green Park' },
    ],
    pharmacy: [
      { nameRu: 'Boots', nameEn: 'Boots' },
      { nameRu: 'Lloyds Pharmacy', nameEn: 'Lloyds Pharmacy' },
    ],
    atm: [
      { nameRu: 'Barclays ATM', nameEn: 'Barclays ATM' },
      { nameRu: 'NatWest ATM', nameEn: 'NatWest ATM' },
    ],
    supermarket: [
      { nameRu: 'Waitrose', nameEn: 'Waitrose' },
      { nameRu: 'Marks & Spencer', nameEn: 'Marks & Spencer' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музей Тейт Модерн', nameEn: 'Tate Modern' },
      { nameRu: 'Музей Виктории и Альберта', nameEn: 'Victoria and Albert Museum' },
    ],
  },
  Berlin: {
    restaurant: [
      { nameRu: 'Lorenz Adlon Esszimmer', nameEn: 'Lorenz Adlon Esszimmer' },
      { nameRu: 'Facil', nameEn: 'Facil' },
      { nameRu: 'Tim Raue', nameEn: 'Tim Raue' },
      { nameRu: 'Nobelhart & Schmutzig', nameEn: 'Nobelhart & Schmutzig' },
    ],
    cafe: [
      { nameRu: 'Bonanza Coffee', nameEn: 'Bonanza Coffee' },
      { nameRu: 'The Barn', nameEn: 'The Barn' },
      { nameRu: 'Five Elephant', nameEn: 'Five Elephant' },
    ],
    bar: [
      { nameRu: 'Berghain', nameEn: 'Berghain' },
      { nameRu: 'Watergate', nameEn: 'Watergate' },
      { nameRu: 'Tausend', nameEn: 'Tausend' },
    ],
    shopping: [
      { nameRu: 'Kaufhaus des Westens', nameEn: 'KaDeWe' },
      { nameRu: 'Mall of Berlin', nameEn: 'Mall of Berlin' },
      { nameRu: 'Potsdamer Platz Arkaden', nameEn: 'Potsdamer Platz Arkaden' },
    ],
    park: [
      { nameRu: 'Тиргартен', nameEn: 'Tiergarten' },
      { nameRu: 'Трептов-парк', nameEn: 'Treptower Park' },
      { nameRu: 'парк Фридрихсхайн', nameEn: 'Volkspark Friedrichshain' },
    ],
    pharmacy: [
      { nameRu: 'DocMorris', nameEn: 'DocMorris' },
      { nameRu: 'Apotheke am Alexanderplatz', nameEn: 'Apotheke am Alexanderplatz' },
    ],
    atm: [
      { nameRu: 'Deutsche Bank ATM', nameEn: 'Deutsche Bank ATM' },
      { nameRu: 'Sparkasse ATM', nameEn: 'Sparkasse ATM' },
    ],
    supermarket: [
      { nameRu: 'Rewe', nameEn: 'Rewe' },
      { nameRu: 'Edeka', nameEn: 'Edeka' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Еврейский музей', nameEn: 'Jewish Museum' },
      { nameRu: 'Музей Пергамон', nameEn: 'Pergamon Museum' },
    ],
  },
  Rome: {
    restaurant: [
      { nameRu: 'La Pergola', nameEn: 'La Pergola' },
      { nameRu: 'Armando al Pantheon', nameEn: 'Armando al Pantheon' },
      { nameRu: 'Roscioli', nameEn: 'Roscioli' },
      { nameRu: 'Da Enzo al 29', nameEn: 'Da Enzo al 29' },
    ],
    cafe: [
      { nameRu: 'Sant\'Eustachio Il Caffe', nameEn: 'Sant\'Eustachio Il Caffe' },
      { nameRu: 'Tazza d\'Oro', nameEn: 'Tazza d\'Oro' },
      { nameRu: 'Ciampini', nameEn: 'Ciampini' },
    ],
    bar: [
      { nameRu: 'Jerry Thomas Project', nameEn: 'Jerry Thomas Project' },
      { nameRu: 'The Court', nameEn: 'The Court' },
      { nameRu: 'Scholars Lounge', nameEn: 'Scholars Lounge' },
    ],
    shopping: [
      { nameRu: 'Galleria Alberto Sordi', nameEn: 'Galleria Alberto Sordi' },
      { nameRu: 'Rinascente', nameEn: 'Rinascente' },
      { nameRu: 'Mercato di Campo de\' Fiori', nameEn: 'Campo de\' Fiori Market' },
    ],
    park: [
      { nameRu: 'Вилла Боргезе', nameEn: 'Villa Borghese' },
      { nameRu: 'Вилла Адриана', nameEn: 'Villa Ada' },
      { nameRu: 'Вилла Дориа Памфили', nameEn: 'Villa Doria Pamphili' },
    ],
    pharmacy: [
      { nameRu: 'Farmacia della Rotonda', nameEn: 'Farmacia della Rotonda' },
      { nameRu: 'Farmacia Internazionale', nameEn: 'Farmacia Internazionale' },
    ],
    atm: [
      { nameRu: 'UniCredit ATM', nameEn: 'UniCredit ATM' },
      { nameRu: 'Bancomat ATM', nameEn: 'Bancomat ATM' },
    ],
    supermarket: [
      { nameRu: 'Conad City', nameEn: 'Conad City' },
      { nameRu: 'Carrefour Express', nameEn: 'Carrefour Express' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музеи Ватикана', nameEn: 'Vatican Museums' },
      { nameRu: 'Капитолийские музеи', nameEn: 'Capitoline Museums' },
    ],
  },
  Barcelona: {
    restaurant: [
      { nameRu: 'El Celler de Can Roca', nameEn: 'El Celler de Can Roca' },
      { nameRu: 'Tickets', nameEn: 'Tickets' },
      { nameRu: 'Paco Meralgo', nameEn: 'Paco Meralgo' },
      { nameRu: 'Can Culleretes', nameEn: 'Can Culleretes' },
    ],
    cafe: [
      { nameRu: 'Satan\'s Coffee Corner', nameEn: 'Satan\'s Coffee Corner' },
      { nameRu: 'Nomad Coffee', nameEn: 'Nomad Coffee' },
      { nameRu: 'El Magnifico', nameEn: 'El Magnifico' },
    ],
    bar: [
      { nameRu: 'Paradiso', nameEn: 'Paradiso' },
      { nameRu: 'Dry Martini', nameEn: 'Dry Martini' },
      { nameRu: 'L\'Ovella Negra', nameEn: 'L\'Ovella Negra' },
    ],
    shopping: [
      { nameRu: 'El Corte Ingles', nameEn: 'El Corte Ingles' },
      { nameRu: 'Maremagnum', nameEn: 'Maremagnum' },
      { nameRu: 'Diagonal Mar', nameEn: 'Diagonal Mar' },
    ],
    park: [
      { nameRu: 'Парк Цитадели', nameEn: 'Parc de la Ciutadella' },
      { nameRu: 'Парк Гуэль', nameEn: 'Park Guell' },
      { nameRu: 'Лабиринт Орта', nameEn: 'Parc del Laberint d\'Horta' },
    ],
    pharmacy: [
      { nameRu: 'Farmacia Navarro', nameEn: 'Farmacia Navarro' },
      { nameRu: 'Farmacia Bosch', nameEn: 'Farmacia Bosch' },
    ],
    atm: [
      { nameRu: 'La Caixa ATM', nameEn: 'La Caixa ATM' },
      { nameRu: 'BBVA ATM', nameEn: 'BBVA ATM' },
    ],
    supermarket: [
      { nameRu: 'Mercadona', nameEn: 'Mercadona' },
      { nameRu: 'Bonpreu', nameEn: 'Bonpreu' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музей Пикассо', nameEn: 'Picasso Museum' },
      { nameRu: 'Музей современного искусства', nameEn: 'MACBA' },
    ],
  },
  Vienna: {
    restaurant: [
      { nameRu: 'Steirereck', nameEn: 'Steirereck' },
      { nameRu: 'Figlmuller', nameEn: 'Figlmuller' },
      { nameRu: 'Plachutta', nameEn: 'Plachutta' },
      { nameRu: 'Griechenbeisl', nameEn: 'Griechenbeisl' },
    ],
    cafe: [
      { nameRu: 'Cafe Central', nameEn: 'Cafe Central' },
      { nameRu: 'Cafe Sacher', nameEn: 'Cafe Sacher' },
      { nameRu: 'Cafe Landtmann', nameEn: 'Cafe Landtmann' },
    ],
    bar: [
      { nameRu: 'Loos American Bar', nameEn: 'Loos American Bar' },
      { nameRu: 'Dino\'s American Bar', nameEn: 'Dino\'s American Bar' },
      { nameRu: 'First Floor', nameEn: 'First Floor' },
    ],
    shopping: [
      { nameRu: 'Ringstrassen Galerien', nameEn: 'Ringstrassen Galerien' },
      { nameRu: 'Steffl', nameEn: 'Steffl' },
      { nameRu: 'Mariahilfer Strasse', nameEn: 'Mariahilfer Strasse' },
    ],
    park: [
      { nameRu: 'Штадтпарк', nameEn: 'Stadtpark' },
      { nameRu: 'Фольксгартен', nameEn: 'Volksgarten' },
      { nameRu: 'Бурггартен', nameEn: 'Burggarten' },
    ],
    pharmacy: [
      { nameRu: 'Apotheke zum weissen Engel', nameEn: 'Apotheke zum weissen Engel' },
      { nameRu: 'Apotheke am Stephansplatz', nameEn: 'Apotheke am Stephansplatz' },
    ],
    atm: [
      { nameRu: 'Erste Bank ATM', nameEn: 'Erste Bank ATM' },
      { nameRu: 'Bank Austria ATM', nameEn: 'Bank Austria ATM' },
    ],
    supermarket: [
      { nameRu: 'Billa', nameEn: 'Billa' },
      { nameRu: 'Spar', nameEn: 'Spar' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музей истории искусств', nameEn: 'Kunsthistorisches Museum' },
      { nameRu: 'Музей Леопольда', nameEn: 'Leopold Museum' },
    ],
  },
  Amsterdam: {
    restaurant: [
      { nameRu: 'De Kas', nameEn: 'De Kas' },
      { nameRu: 'Restaurant Breda', nameEn: 'Restaurant Breda' },
      { nameRu: 'The Duchess', nameEn: 'The Duchess' },
      { nameRu: 'Vinkeles', nameEn: 'Vinkeles' },
    ],
    cafe: [
      { nameRu: 'Bocoffee', nameEn: 'Bocoffee' },
      { nameRu: 'Scandinavian Embassy', nameEn: 'Scandinavian Embassy' },
      { nameRu: 'Sweet Cup', nameEn: 'Sweet Cup' },
    ],
    bar: [
      { nameRu: 'Tales & Spirits', nameEn: 'Tales & Spirits' },
      { nameRu: 'Door 74', nameEn: 'Door 74' },
      { nameRu: 'Brouwerij \'t IJ', nameEn: 'Brouwerij \'t IJ' },
    ],
    shopping: [
      { nameRu: 'De Bijenkorf', nameEn: 'De Bijenkorf' },
      { nameRu: 'Magna Plaza', nameEn: 'Magna Plaza' },
      { nameRu: 'Kalverstraat', nameEn: 'Kalverstraat' },
    ],
    park: [
      { nameRu: 'Вонделпарк', nameEn: 'Vondelpark' },
      { nameRu: 'Амстелпарк', nameEn: 'Amstelpark' },
      { nameRu: 'Сарфатипарк', nameEn: 'Sarphatipark' },
    ],
    pharmacy: [
      { nameRu: 'DA Apotheek', nameEn: 'DA Apotheek' },
      { nameRu: 'BENU Pharmacy', nameEn: 'BENU Pharmacy' },
    ],
    atm: [
      { nameRu: 'ING ATM', nameEn: 'ING ATM' },
      { nameRu: 'ABN AMRO ATM', nameEn: 'ABN AMRO ATM' },
    ],
    supermarket: [
      { nameRu: 'Albert Heijn', nameEn: 'Albert Heijn' },
      { nameRu: 'Jumbo', nameEn: 'Jumbo' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музей Стеделейк', nameEn: 'Stedelijk Museum' },
      { nameRu: 'Музей Рембрандта', nameEn: 'Rembrandt House Museum' },
    ],
  },
  Tokyo: {
    restaurant: [
      { nameRu: 'Sukiyabashi Jiro', nameEn: 'Sukiyabashi Jiro' },
      { nameRu: 'Narisawa', nameEn: 'Narisawa' },
      { nameRu: 'Gonpachi', nameEn: 'Gonpachi' },
      { nameRu: 'Isehiro', nameEn: 'Isehiro' },
    ],
    cafe: [
      { nameRu: 'Blue Bottle Coffee', nameEn: 'Blue Bottle Coffee' },
      { nameRu: 'Onibus Coffee', nameEn: 'Onibus Coffee' },
      { nameRu: 'Fuglen Tokyo', nameEn: 'Fuglen Tokyo' },
    ],
    bar: [
      { nameRu: 'Bar High Five', nameEn: 'Bar High Five' },
      { nameRu: 'Gen Yamamoto', nameEn: 'Gen Yamamoto' },
      { nameRu: 'Tayer + Elementary', nameEn: 'Tayer + Elementary' },
    ],
    shopping: [
      { nameRu: 'Ginza Six', nameEn: 'Ginza Six' },
      { nameRu: 'Isetan', nameEn: 'Isetan' },
      { nameRu: 'Shibuya Parco', nameEn: 'Shibuya Parco' },
    ],
    park: [
      { nameRu: 'Синдзюку-гёэн', nameEn: 'Shinjuku Gyoen' },
      { nameRu: 'Уэно-парк', nameEn: 'Ueno Park' },
      { nameRu: 'парк Хикаригаока', nameEn: 'Hikarigaoka Park' },
    ],
    pharmacy: [
      { nameRu: 'Matsumoto Kiyoshi', nameEn: 'Matsumoto Kiyoshi' },
      { nameRu: 'Tsuruha Drug', nameEn: 'Tsuruha Drug' },
    ],
    atm: [
      { nameRu: 'Seven Bank ATM', nameEn: 'Seven Bank ATM' },
      { nameRu: 'Japan Post Bank ATM', nameEn: 'Japan Post Bank ATM' },
    ],
    supermarket: [
      { nameRu: 'Seijo Ishii', nameEn: 'Seijo Ishii' },
      { nameRu: 'Precce', nameEn: 'Precce' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Национальный музей', nameEn: 'Tokyo National Museum' },
      { nameRu: 'Музей Гибли', nameEn: 'Ghibli Museum' },
    ],
  },
  Dubai: {
    restaurant: [
      { nameRu: 'Nobu Dubai', nameEn: 'Nobu Dubai' },
      { nameRu: 'Zuma', nameEn: 'Zuma' },
      { nameRu: 'La Petite Maison', nameEn: 'La Petite Maison' },
      { nameRu: 'Pierchic', nameEn: 'Pierchic' },
    ],
    cafe: [
      { nameRu: 'The Espresso Lab', nameEn: 'The Espresso Lab' },
      { nameRu: 'Tom & Serg', nameEn: 'Tom & Serg' },
      { nameRu: 'RAW Coffee Company', nameEn: 'RAW Coffee Company' },
    ],
    bar: [
      { nameRu: 'At.mosphere', nameEn: 'At.mosphere' },
      { nameRu: 'Skyview Bar', nameEn: 'Skyview Bar' },
      { nameRu: 'Lock, Stock & Barrel', nameEn: 'Lock, Stock & Barrel' },
    ],
    shopping: [
      { nameRu: 'Mall of the Emirates', nameEn: 'Mall of the Emirates' },
      { nameRu: 'Ibn Battuta Mall', nameEn: 'Ibn Battuta Mall' },
      { nameRu: 'City Centre Mirdif', nameEn: 'City Centre Mirdif' },
    ],
    park: [
      { nameRu: 'Сафари-парк Дубай', nameEn: 'Dubai Safari Park' },
      { nameRu: 'Парк Заабиль', nameEn: 'Zabeel Park' },
      { nameRu: 'Парк Крик', nameEn: 'Creek Park' },
    ],
    pharmacy: [
      { nameRu: 'Life Pharmacy', nameEn: 'Life Pharmacy' },
      { nameRu: 'Aster Pharmacy', nameEn: 'Aster Pharmacy' },
    ],
    atm: [
      { nameRu: 'Emirates NBD ATM', nameEn: 'Emirates NBD ATM' },
      { nameRu: 'ADCB ATM', nameEn: 'ADCB ATM' },
    ],
    supermarket: [
      { nameRu: 'Carrefour', nameEn: 'Carrefour' },
      { nameRu: 'Spinneys', nameEn: 'Spinneys' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музей Дубая', nameEn: 'Dubai Museum' },
      { nameRu: 'Музей будущего', nameEn: 'Museum of the Future' },
    ],
  },
  'New York': {
    restaurant: [
      { nameRu: 'Le Bernardin', nameEn: 'Le Bernardin' },
      { nameRu: 'Eleven Madison Park', nameEn: 'Eleven Madison Park' },
      { nameRu: 'Katz\'s Delicatessen', nameEn: 'Katz\'s Delicatessen' },
      { nameRu: 'Peter Luger', nameEn: 'Peter Luger' },
    ],
    cafe: [
      { nameRu: 'Joe Coffee', nameEn: 'Joe Coffee' },
      { nameRu: 'Blue Bottle Coffee', nameEn: 'Blue Bottle Coffee' },
      { nameRu: 'Gregorys Coffee', nameEn: 'Gregorys Coffee' },
    ],
    bar: [
      { nameRu: 'Dead Rabbit', nameEn: 'Dead Rabbit' },
      { nameRu: 'Attaboy', nameEn: 'Attaboy' },
      { nameRu: 'Please Don\'t Tell', nameEn: 'Please Don\'t Tell' },
    ],
    shopping: [
      { nameRu: 'Macy\'s Herald Square', nameEn: 'Macy\'s Herald Square' },
      { nameRu: 'Bloomingdale\'s', nameEn: 'Bloomingdale\'s' },
      { nameRu: 'Saks Fifth Avenue', nameEn: 'Saks Fifth Avenue' },
    ],
    park: [
      { nameRu: 'Брайант-парк', nameEn: 'Bryant Park' },
      { nameRu: 'Вашингтон-сквер-парк', nameEn: 'Washington Square Park' },
      { nameRu: 'Хай-Лайн', nameEn: 'The High Line' },
    ],
    pharmacy: [
      { nameRu: 'CVS Pharmacy', nameEn: 'CVS Pharmacy' },
      { nameRu: 'Duane Reade', nameEn: 'Duane Reade' },
    ],
    atm: [
      { nameRu: 'Chase ATM', nameEn: 'Chase ATM' },
      { nameRu: 'Bank of America ATM', nameEn: 'Bank of America ATM' },
    ],
    supermarket: [
      { nameRu: 'Whole Foods', nameEn: 'Whole Foods' },
      { nameRu: 'Trader Joe\'s', nameEn: 'Trader Joe\'s' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музей Соломона Гуггенхайма', nameEn: 'Guggenheim Museum' },
      { nameRu: 'Музей современного искусства', nameEn: 'MoMA' },
    ],
  },
  Bali: {
    restaurant: [
      { nameRu: 'Locavore', nameEn: 'Locavore' },
      { nameRu: 'Mozaic', nameEn: 'Mozaic' },
      { nameRu: 'La Lucciola', nameEn: 'La Lucciola' },
      { nameRu: 'Merah Putih', nameEn: 'Merah Putih' },
    ],
    cafe: [
      { nameRu: 'Revolver Espresso', nameEn: 'Revolver Espresso' },
      { nameRu: 'Seniman Coffee Studio', nameEn: 'Seniman Coffee Studio' },
      { nameRu: 'Anomali Coffee', nameEn: 'Anomali Coffee' },
    ],
    bar: [
      { nameRu: 'Rock Bar', nameEn: 'Rock Bar' },
      { nameRu: 'Ku De Ta', nameEn: 'Ku De Ta' },
      { nameRu: 'Potato Head Beach Club', nameEn: 'Potato Head Beach Club' },
    ],
    shopping: [
      { nameRu: 'Beachwalk Shopping Center', nameEn: 'Beachwalk Shopping Center' },
      { nameRu: 'Discovery Shopping Mall', nameEn: 'Discovery Shopping Mall' },
      { nameRu: 'Ubud Art Market', nameEn: 'Ubud Art Market' },
    ],
    park: [
      { nameRu: 'Ботанический сад Бали', nameEn: 'Bali Botanic Garden' },
      { nameRu: 'Парк птиц', nameEn: 'Bali Bird Park' },
      { nameRu: 'Сад орхидей', nameEn: 'Orchid Garden' },
    ],
    pharmacy: [
      { nameRu: 'Guardian Pharmacy', nameEn: 'Guardian Pharmacy' },
      { nameRu: 'Kimia Farma', nameEn: 'Kimia Farma' },
    ],
    atm: [
      { nameRu: 'BCA ATM', nameEn: 'BCA ATM' },
      { nameRu: 'Mandiri ATM', nameEn: 'Mandiri ATM' },
    ],
    supermarket: [
      { nameRu: 'Pepito', nameEn: 'Pepito' },
      { nameRu: 'Bintang Supermarket', nameEn: 'Bintang Supermarket' },
    ],
    attraction: [],
    museum: [
      { nameRu: 'Музей Нека', nameEn: 'Neka Art Museum' },
      { nameRu: 'Музей Агунг Рай', nameEn: 'Agung Rai Museum of Art' },
    ],
  },
};

const CITY_IMPORTANT_PLACES: Record<
  string,
  Array<{ type: string; nameRu: string; nameEn: string; lat: number; lng: number }>
> = {
  Paris: [
    { type: 'attraction', nameRu: 'Эйфелева башня', nameEn: 'Eiffel Tower', lat: 48.8584, lng: 2.2945 },
    { type: 'attraction', nameRu: 'Лувр', nameEn: 'Louvre Museum', lat: 48.8606, lng: 2.3376 },
    { type: 'airport', nameRu: 'Аэропорт Шарль-де-Голль', nameEn: 'Charles de Gaulle Airport', lat: 49.0097, lng: 2.5479 },
    { type: 'station', nameRu: 'Гар-дю-Нор', nameEn: 'Gare du Nord', lat: 48.8801, lng: 2.3549 },
  ],
  London: [
    { type: 'attraction', nameRu: 'Биг-Бен', nameEn: 'Big Ben', lat: 51.5007, lng: -0.1246 },
    { type: 'attraction', nameRu: 'Тауэр', nameEn: 'Tower of London', lat: 51.5081, lng: -0.0759 },
    { type: 'airport', nameRu: 'Аэропорт Хитроу', nameEn: 'Heathrow Airport', lat: 51.47, lng: -0.4543 },
    { type: 'station', nameRu: 'Вокзал Кингс-Кросс', nameEn: 'Kings Cross Station', lat: 51.5308, lng: -0.1238 },
  ],
  Berlin: [
    { type: 'attraction', nameRu: 'Бранденбургские ворота', nameEn: 'Brandenburg Gate', lat: 52.5163, lng: 13.3777 },
    { type: 'center', nameRu: 'Александерплац', nameEn: 'Alexanderplatz', lat: 52.5219, lng: 13.4132 },
    { type: 'airport', nameRu: 'Аэропорт Берлин-Бранденбург', nameEn: 'Berlin Brandenburg Airport', lat: 52.3667, lng: 13.5033 },
    { type: 'station', nameRu: 'Центральный вокзал', nameEn: 'Berlin Hauptbahnhof', lat: 52.525, lng: 13.3695 },
  ],
  Rome: [
    { type: 'attraction', nameRu: 'Колизей', nameEn: 'Colosseum', lat: 41.8902, lng: 12.4922 },
    { type: 'attraction', nameRu: 'Ватикан', nameEn: 'Vatican City', lat: 41.9029, lng: 12.4534 },
    { type: 'airport', nameRu: 'Аэропорт Фьюмичино', nameEn: 'Fiumicino Airport', lat: 41.8003, lng: 12.2389 },
    { type: 'station', nameRu: 'Вокзал Термини', nameEn: 'Termini Station', lat: 41.9013, lng: 12.5006 },
  ],
  Barcelona: [
    { type: 'attraction', nameRu: 'Саграда Фамилия', nameEn: 'Sagrada Familia', lat: 41.4036, lng: 2.1744 },
    { type: 'beach', nameRu: 'Пляж Барселонета', nameEn: 'Barceloneta Beach', lat: 41.3784, lng: 2.1897 },
    { type: 'airport', nameRu: 'Аэропорт Эль-Прат', nameEn: 'El Prat Airport', lat: 41.2974, lng: 2.0833 },
    { type: 'station', nameRu: 'Вокзал Сантс', nameEn: 'Barcelona Sants', lat: 41.3792, lng: 2.1406 },
  ],
  Vienna: [
    { type: 'attraction', nameRu: 'Дворец Шёнбрунн', nameEn: 'Schonbrunn Palace', lat: 48.1858, lng: 16.3126 },
    { type: 'center', nameRu: 'Собор Святого Стефана', nameEn: 'St. Stephens Cathedral', lat: 48.2085, lng: 16.374 },
    { type: 'airport', nameRu: 'Аэропорт Вена', nameEn: 'Vienna Airport', lat: 48.1103, lng: 16.5697 },
    { type: 'station', nameRu: 'Центральный вокзал', nameEn: 'Wien Hauptbahnhof', lat: 48.1851, lng: 16.3829 },
  ],
  Amsterdam: [
    { type: 'attraction', nameRu: 'Площадь Дам', nameEn: 'Dam Square', lat: 52.3731, lng: 4.8922 },
    { type: 'museum', nameRu: 'Рейксмюсеум', nameEn: 'Rijksmuseum', lat: 52.36, lng: 4.8852 },
    { type: 'airport', nameRu: 'Аэропорт Схипхол', nameEn: 'Schiphol Airport', lat: 52.3105, lng: 4.7683 },
    { type: 'station', nameRu: 'Центральный вокзал', nameEn: 'Amsterdam Central', lat: 52.3791, lng: 4.9003 },
  ],
  Tokyo: [
    { type: 'attraction', nameRu: 'Сибуя Кроссинг', nameEn: 'Shibuya Crossing', lat: 35.6595, lng: 139.7004 },
    { type: 'station', nameRu: 'Станция Токио', nameEn: 'Tokyo Station', lat: 35.6812, lng: 139.7671 },
    { type: 'airport', nameRu: 'Аэропорт Нарита', nameEn: 'Narita Airport', lat: 35.772, lng: 140.3929 },
    { type: 'airport', nameRu: 'Аэропорт Ханэда', nameEn: 'Haneda Airport', lat: 35.5494, lng: 139.7798 },
  ],
  Dubai: [
    { type: 'attraction', nameRu: 'Бурдж-Халифа', nameEn: 'Burj Khalifa', lat: 25.1972, lng: 55.2744 },
    { type: 'mall', nameRu: 'Dubai Mall', nameEn: 'Dubai Mall', lat: 25.1972, lng: 55.2796 },
    { type: 'airport', nameRu: 'Аэропорт Дубай', nameEn: 'Dubai Airport', lat: 25.2532, lng: 55.3657 },
    { type: 'beach', nameRu: 'Пляж Джумейра', nameEn: 'Jumeirah Beach', lat: 25.1975, lng: 55.2317 },
  ],
  'New York': [
    { type: 'attraction', nameRu: 'Таймс-сквер', nameEn: 'Times Square', lat: 40.758, lng: -73.9855 },
    { type: 'park', nameRu: 'Центральный парк', nameEn: 'Central Park', lat: 40.7829, lng: -73.9654 },
    { type: 'airport', nameRu: 'Аэропорт JFK', nameEn: 'JFK Airport', lat: 40.6413, lng: -73.7781 },
    { type: 'station', nameRu: 'Гранд-Сентрал', nameEn: 'Grand Central', lat: 40.7527, lng: -73.9772 },
  ],
  Bali: [
    { type: 'attraction', nameRu: 'Храм Улувату', nameEn: 'Uluwatu Temple', lat: -8.8291, lng: 115.0849 },
    { type: 'beach', nameRu: 'Пляж Кута', nameEn: 'Kuta Beach', lat: -8.718, lng: 115.1686 },
    { type: 'airport', nameRu: 'Аэропорт Нгурах-Рай', nameEn: 'Ngurah Rai Airport', lat: -8.7467, lng: 115.1672 },
    { type: 'attraction', nameRu: 'Обезьяний лес', nameEn: 'Ubud Monkey Forest', lat: -8.5186, lng: 115.2586 },
  ],
};

const CITY_ATTRACTIONS: Record<string, PlaceName[]> = {
  Paris: [
    { nameRu: 'Эйфелева башня', nameEn: 'Eiffel Tower' },
    { nameRu: 'Лувр', nameEn: 'Louvre Museum' },
    { nameRu: 'Триумфальная арка', nameEn: 'Arc de Triomphe' },
    { nameRu: 'Собор Парижской Богоматери', nameEn: 'Notre-Dame Cathedral' },
    { nameRu: 'Музей Орсе', nameEn: "Musee d'Orsay" },
    { nameRu: 'Сакре-Кер', nameEn: 'Sacre-Coeur Basilica' },
    { nameRu: 'Елисейские поля', nameEn: 'Champs-Elysees' },
    { nameRu: 'Центр Жоржа Помпиду', nameEn: 'Centre Pompidou' },
  ],
  London: [
    { nameRu: 'Биг-Бен', nameEn: 'Big Ben' },
    { nameRu: 'Букингемский дворец', nameEn: 'Buckingham Palace' },
    { nameRu: 'Тауэрский мост', nameEn: 'Tower Bridge' },
    { nameRu: 'Лондонский глаз', nameEn: 'London Eye' },
    { nameRu: 'Британский музей', nameEn: 'British Museum' },
    { nameRu: 'Вестминстерское аббатство', nameEn: 'Westminster Abbey' },
    { nameRu: 'Трафальгарская площадь', nameEn: 'Trafalgar Square' },
    { nameRu: 'Гайд-парк', nameEn: 'Hyde Park' },
  ],
  Berlin: [
    { nameRu: 'Бранденбургские ворота', nameEn: 'Brandenburg Gate' },
    { nameRu: 'Рейхстаг', nameEn: 'Reichstag Building' },
    { nameRu: 'Музейный остров', nameEn: 'Museum Island' },
    { nameRu: 'Берлинская телебашня', nameEn: 'Berlin TV Tower' },
    { nameRu: 'Чекпойнт Чарли', nameEn: 'Checkpoint Charlie' },
    { nameRu: 'Александерплац', nameEn: 'Alexanderplatz' },
    { nameRu: 'Берлинский собор', nameEn: 'Berlin Cathedral' },
    { nameRu: 'Еврейский музей', nameEn: 'Jewish Museum' },
  ],
  Rome: [
    { nameRu: 'Колизей', nameEn: 'Colosseum' },
    { nameRu: 'Ватикан', nameEn: 'Vatican City' },
    { nameRu: 'Треви фонтан', nameEn: 'Trevi Fountain' },
    { nameRu: 'Пантеон', nameEn: 'Pantheon' },
    { nameRu: 'Римский форум', nameEn: 'Roman Forum' },
    { nameRu: 'Площадь Навона', nameEn: 'Piazza Navona' },
    { nameRu: 'Испанская лестница', nameEn: 'Spanish Steps' },
    { nameRu: 'Замок Святого Ангела', nameEn: 'Castel Sant\'Angelo' },
  ],
  Barcelona: [
    { nameRu: 'Саграда Фамилия', nameEn: 'Sagrada Familia' },
    { nameRu: 'Парк Гуэль', nameEn: 'Park Guell' },
    { nameRu: 'Дом Батльо', nameEn: 'Casa Batllo' },
    { nameRu: 'Ла Рамбла', nameEn: 'La Rambla' },
    { nameRu: 'Готический квартал', nameEn: 'Gothic Quarter' },
    { nameRu: 'Дом Мила', nameEn: 'Casa Mila' },
    { nameRu: 'Пляж Барселонета', nameEn: 'Barceloneta Beach' },
    { nameRu: 'Камп Ноу', nameEn: 'Camp Nou' },
  ],
  Vienna: [
    { nameRu: 'Дворец Шёнбрунн', nameEn: 'Schonbrunn Palace' },
    { nameRu: 'Собор Святого Стефана', nameEn: 'St. Stephen\'s Cathedral' },
    { nameRu: 'Хофбург', nameEn: 'Hofburg Palace' },
    { nameRu: 'Бельведер', nameEn: 'Belvedere Palace' },
    { nameRu: 'Оперный театр', nameEn: 'Vienna State Opera' },
    { nameRu: 'Пратер', nameEn: 'Prater Park' },
    { nameRu: 'Рингштрассе', nameEn: 'Ringstrasse' },
    { nameRu: 'Музей истории искусств', nameEn: 'Kunsthistorisches Museum' },
  ],
  Amsterdam: [
    { nameRu: 'Площадь Дам', nameEn: 'Dam Square' },
    { nameRu: 'Рейксмюсеум', nameEn: 'Rijksmuseum' },
    { nameRu: 'Музей Ван Гога', nameEn: 'Van Gogh Museum' },
    { nameRu: 'Дом Анны Франк', nameEn: 'Anne Frank House' },
    { nameRu: 'Цветочный рынок', nameEn: 'Bloemenmarkt' },
    { nameRu: 'Музей Стеделейк', nameEn: 'Stedelijk Museum' },
    { nameRu: 'Вонделпарк', nameEn: 'Vondelpark' },
    { nameRu: 'Красные фонари', nameEn: 'Red Light District' },
  ],
  Tokyo: [
    { nameRu: 'Сибуя Кроссинг', nameEn: 'Shibuya Crossing' },
    { nameRu: 'Токийская башня', nameEn: 'Tokyo Tower' },
    { nameRu: 'Асакуса Сенсо-дзи', nameEn: 'Senso-ji Temple' },
    { nameRu: 'Императорский дворец', nameEn: 'Imperial Palace' },
    { nameRu: 'Токио Скайтри', nameEn: 'Tokyo Skytree' },
    { nameRu: 'Мэйдзи Дзингу', nameEn: 'Meiji Jingu' },
    { nameRu: 'Уэно-парк', nameEn: 'Ueno Park' },
    { nameRu: 'Акихабара', nameEn: 'Akihabara District' },
  ],
  Dubai: [
    { nameRu: 'Бурдж-Халифа', nameEn: 'Burj Khalifa' },
    { nameRu: 'Dubai Mall', nameEn: 'Dubai Mall' },
    { nameRu: 'Пальма Джумейра', nameEn: 'Palm Jumeirah' },
    { nameRu: 'Дубай Марина', nameEn: 'Dubai Marina' },
    { nameRu: 'Рамка Дубая', nameEn: 'Dubai Frame' },
    { nameRu: 'Бурдж-аль-Араб', nameEn: 'Burj Al Arab' },
    { nameRu: 'Золотой рынок', nameEn: 'Gold Souk' },
    { nameRu: 'Дубайская опера', nameEn: 'Dubai Opera' },
  ],
  'New York': [
    { nameRu: 'Таймс-сквер', nameEn: 'Times Square' },
    { nameRu: 'Центральный парк', nameEn: 'Central Park' },
    { nameRu: 'Эмпайр-стейт-билдинг', nameEn: 'Empire State Building' },
    { nameRu: 'Бруклинский мост', nameEn: 'Brooklyn Bridge' },
    { nameRu: 'Статуя Свободы', nameEn: 'Statue of Liberty' },
    { nameRu: 'Метрополитен-музей', nameEn: 'The Metropolitan Museum of Art' },
    { nameRu: 'Рокфеллер-центр', nameEn: 'Rockefeller Center' },
    { nameRu: 'Бродвей', nameEn: 'Broadway' },
  ],
  Bali: [
    { nameRu: 'Храм Улувату', nameEn: 'Uluwatu Temple' },
    { nameRu: 'Рисовые террасы Тегалаланг', nameEn: 'Tegallalang Rice Terraces' },
    { nameRu: 'Храм Танах Лот', nameEn: 'Tanah Lot Temple' },
    { nameRu: 'Обезьяний лес', nameEn: 'Ubud Monkey Forest' },
    { nameRu: 'Водный дворец Улун Дану', nameEn: 'Ulun Danu Beratan Temple' },
    { nameRu: 'Пляж Кута', nameEn: 'Kuta Beach' },
    { nameRu: 'Водопад Тегенунган', nameEn: 'Tegenungan Waterfall' },
    { nameRu: 'Храм Бесаких', nameEn: 'Besakih Temple' },
  ],
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function distanceKm(la1: number, lo1: number, la2: number, lo2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(la2 - la1);
  const dLon = toRad(lo2 - lo1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function offsetPoint(
  lat: number,
  lng: number,
  distanceKmValue: number,
  bearingDeg: number,
) {
  const dLat = (distanceKmValue / 111) * Math.cos((bearingDeg * Math.PI) / 180);
  const dLng =
    (distanceKmValue / (111 * Math.cos((lat * Math.PI) / 180))) *
    Math.sin((bearingDeg * Math.PI) / 180);
  return { lat: lat + dLat, lng: lng + dLng };
}

export function normalizeNearbyCategory(input: string | undefined): NearbyCategory {
  const normalized = (input ?? 'restaurant').trim().toLowerCase();
  return CATEGORY_ALIASES[normalized] ?? 'restaurant';
}

export function buildFallbackNearbyPlaces(args: {
  city: string;
  latitude: number;
  longitude: number;
  category: NearbyCategory;
  limit: number;
}) {
  const { city, latitude, longitude, category } = args;
  const limit = Math.max(1, Math.min(25, args.limit));
  const names = FALLBACK_CATEGORY_NAMES[category];
  
  const latSeed = Math.round(latitude * 1000);
  const lngSeed = Math.round(longitude * 1000);

  const places = Array.from({ length: limit }).map((_, index) => {
    const base = names[index % names.length];
    const seed = hashString(`${city}:${latSeed}:${lngSeed}:${category}:${index}:${base.nameEn}`);
    const dist = 0.15 + (seed % 190) / 100; // 0.15..2.05 km
    const bearing = seed % 360;
    const point = offsetPoint(latitude, longitude, dist, bearing);

    return {
      osmId: 9_000_000 + index + (seed % 1000),
      type: 'fallback',
      category,
      name: `${base.nameEn}${index < names.length ? '' : ` ${index + 1}`}`,
      nameRu: `${base.nameRu}${index < names.length ? '' : ` ${index + 1}`}`,
      nameEn: `${base.nameEn}${index < names.length ? '' : ` ${index + 1}`}`,
      cuisine: category === 'restaurant' || category === 'cafe' ? 'local' : null,
      opening_hours: null,
      website: null,
      phone: null,
      address: `${city}`,
      latitude: point.lat,
      longitude: point.lng,
      distanceKm: Math.round(dist * 1000) / 1000,
      walkMinutes: Math.max(1, Math.round(dist * 12)),
    };
  });

  return places.sort((a, b) => a.distanceKm - b.distanceKm);
}

function pickPreparedNames(city: string, category: NearbyCategory): PlaceName[] {
  const citySpecific = CITY_SPECIFIC_PLACES[city]?.[category];
  if (citySpecific && citySpecific.length > 0) {
    return citySpecific;
  }
  
  const cityAttractions = CITY_ATTRACTIONS[city] ?? [];
  if (category === 'attraction' && cityAttractions.length > 0) {
    return cityAttractions;
  }
  
  const global = GLOBAL_REAL_CATEGORY_NAMES[category] ?? FALLBACK_CATEGORY_NAMES[category];
  return global;
}

export function buildPreparedNearbyPlaces(args: {
  city: string;
  latitude: number;
  longitude: number;
  category: NearbyCategory;
  limit: number;
  minCount?: number;
}) {
  const { city, latitude, longitude, category } = args;
  const minCount = Math.max(1, Math.min(25, args.minCount ?? 6));
  const limit = Math.max(minCount, Math.min(25, args.limit));
  const names = pickPreparedNames(city, category);
  
  const latSeed = Math.round(latitude * 1000);
  const lngSeed = Math.round(longitude * 1000);

  const places = Array.from({ length: limit }).map((_, index) => {
    const base = names[index % names.length];
    const seed = hashString(`prepared:${city}:${latSeed}:${lngSeed}:${category}:${index}:${base.nameEn}`);
    const dist = 0.18 + (seed % 260) / 100; // 0.18..2.78 km
    const bearing = seed % 360;
    const point = offsetPoint(latitude, longitude, dist, bearing);
    const hasIndex = index >= names.length;

    return {
      osmId: 7_000_000 + index + (seed % 10000),
      type: 'prepared_real',
      category,
      name: hasIndex ? `${base.nameEn} ${index + 1}` : base.nameEn,
      nameRu: hasIndex ? `${base.nameRu} ${index + 1}` : base.nameRu,
      nameEn: hasIndex ? `${base.nameEn} ${index + 1}` : base.nameEn,
      cuisine: category === 'restaurant' || category === 'cafe' ? 'international' : null,
      opening_hours: null,
      website: null,
      phone: null,
      address: city,
      latitude: point.lat,
      longitude: point.lng,
      distanceKm: Math.round(dist * 1000) / 1000,
      walkMinutes: Math.max(1, Math.round(dist * 12)),
    };
  });

  return places.sort((a, b) => a.distanceKm - b.distanceKm);
}

export function buildFallbackKeyDistances(args: {
  city: string;
  latitude: number | null;
  longitude: number | null;
  limit?: number;
}): KeyDistanceItem[] {
  const { city, latitude, longitude } = args;
  const limit = Math.max(3, Math.min(12, args.limit ?? 8));
  const cityPoints = CITY_IMPORTANT_PLACES[city] ?? [];
  const out: KeyDistanceItem[] = [];

  if (latitude != null && longitude != null && cityPoints.length > 0) {
    for (const p of cityPoints) {
      const km = distanceKm(latitude, longitude, p.lat, p.lng);
      out.push({
        type: p.type,
        nameRu: p.nameRu,
        nameEn: p.nameEn,
        distanceKm: Math.round(km * 10) / 10,
        durationWalkMin: km <= 3 ? Math.max(2, Math.round(km * 12)) : null,
        durationDriveMin: Math.max(3, Math.round(km * 2)),
      });
    }
  }

  const generic: KeyDistanceItem[] = [
    {
      type: 'supermarket',
      nameRu: 'Ближайший супермаркет',
      nameEn: 'Nearest supermarket',
      distanceKm: 0.4,
      durationWalkMin: 5,
      durationDriveMin: 2,
    },
    {
      type: 'pharmacy',
      nameRu: 'Ближайшая аптека',
      nameEn: 'Nearest pharmacy',
      distanceKm: 0.3,
      durationWalkMin: 4,
      durationDriveMin: 2,
    },
    {
      type: 'atm',
      nameRu: 'Ближайший банкомат',
      nameEn: 'Nearest ATM',
      distanceKm: 0.2,
      durationWalkMin: 3,
      durationDriveMin: 1,
    },
    {
      type: 'park',
      nameRu: 'Ближайший парк',
      nameEn: 'Nearest park',
      distanceKm: 0.9,
      durationWalkMin: 11,
      durationDriveMin: 4,
    },
    {
      type: 'shopping_mall',
      nameRu: 'Ближайший торговый центр',
      nameEn: 'Nearest shopping mall',
      distanceKm: 1.2,
      durationWalkMin: 15,
      durationDriveMin: 5,
    },
    {
      type: 'museum',
      nameRu: 'Ближайший музей',
      nameEn: 'Nearest museum',
      distanceKm: 1.6,
      durationWalkMin: 20,
      durationDriveMin: 6,
    },
    {
      type: 'attraction',
      nameRu: 'Ближайшая достопримечательность',
      nameEn: 'Nearest attraction',
      distanceKm: 1.4,
      durationWalkMin: 18,
      durationDriveMin: 6,
    },
    {
      type: 'airport',
      nameRu: 'Ближайший аэропорт',
      nameEn: 'Nearest airport',
      distanceKm: 18,
      durationWalkMin: null,
      durationDriveMin: 30,
    },
  ];

  for (const g of generic) {
    if (out.length >= limit) break;
    if (!out.some((i) => i.type === g.type)) out.push(g);
  }

  return out.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
}

export function resolveFallbackCityCenter(city: string): {
  latitude: number;
  longitude: number;
} | null {
  const points = CITY_IMPORTANT_PLACES[city];
  if (!points || points.length === 0) return null;
  return { latitude: points[0].lat, longitude: points[0].lng };
}
