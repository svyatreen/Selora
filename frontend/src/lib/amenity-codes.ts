// Translation maps for amenity codes — keep in sync with backend/seed-features.mjs
// Categories and individual amenity codes.

import {
  Sparkles, Briefcase, Utensils, Baby, BellRing, TreePalm,
  Smartphone, ShowerHead, Tv, Bed, Coffee, BedDouble, Mountain,
} from 'lucide-react';

export const HOTEL_CATEGORY_LABELS: Record<string, { ru: string; en: string; icon: typeof Sparkles }> = {
  wellness: { ru: 'Спа и фитнес', en: 'Spa & Fitness', icon: Sparkles },
  business: { ru: 'Для работы', en: 'Business', icon: Briefcase },
  food: { ru: 'Рестораны и бары', en: 'Dining & Bars', icon: Utensils },
  family: { ru: 'Для семей с детьми', en: 'For Families', icon: Baby },
  services: { ru: 'Услуги отеля', en: 'Hotel Services', icon: BellRing },
  leisure: { ru: 'Отдых и досуг', en: 'Leisure', icon: TreePalm },
  tech: { ru: 'Технологии', en: 'Tech', icon: Smartphone },
};

export const ROOM_CATEGORY_LABELS: Record<string, { ru: string; en: string; icon: typeof Sparkles }> = {
  tech: { ru: 'Техника', en: 'Tech', icon: Tv },
  bath: { ru: 'Ванная комната', en: 'Bathroom', icon: ShowerHead },
  comfort: { ru: 'Комфорт', en: 'Comfort', icon: Bed },
  food: { ru: 'Еда и напитки', en: 'Food & Drinks', icon: Coffee },
  work: { ru: 'Рабочее место', en: 'Workspace', icon: Briefcase },
  view_features: { ru: 'Виды и пространство', en: 'Views & Space', icon: Mountain },
  bedding: { ru: 'Постель', en: 'Bedding', icon: BedDouble },
};

// Hotel-level amenity codes
export const HOTEL_AMENITY_LABELS: Record<string, { ru: string; en: string }> = {
  // wellness
  spa_thai_massage: { ru: 'Тайский массаж в спа', en: 'Thai massage at spa' },
  spa_aromatherapy: { ru: 'Аромотерапия', en: 'Aromatherapy treatments' },
  spa_couples_room: { ru: 'Спа-зал для пар', en: 'Couples spa suite' },
  spa_hot_stone: { ru: 'Массаж горячими камнями', en: 'Hot stone massage' },
  indoor_pool: { ru: 'Крытый бассейн', en: 'Indoor pool' },
  outdoor_pool: { ru: 'Открытый бассейн', en: 'Outdoor pool' },
  outdoor_pool_heated: { ru: 'Открытый бассейн с подогревом', en: 'Heated outdoor pool' },
  rooftop_pool: { ru: 'Бассейн на крыше', en: 'Rooftop pool' },
  infinity_pool: { ru: 'Бесконечный бассейн', en: 'Infinity pool' },
  sauna_finnish: { ru: 'Финская сауна', en: 'Finnish sauna' },
  sauna_infrared: { ru: 'Инфракрасная сауна', en: 'Infrared sauna' },
  hammam: { ru: 'Турецкий хамам', en: 'Turkish hammam' },
  jacuzzi: { ru: 'Джакузи', en: 'Jacuzzi' },
  cold_plunge: { ru: 'Купель с холодной водой', en: 'Cold plunge pool' },
  fitness_studio: { ru: 'Фитнес-студия', en: 'Fitness studio' },
  yoga_classes: { ru: 'Занятия йогой', en: 'Yoga classes' },
  pilates_studio: { ru: 'Студия пилатеса', en: 'Pilates studio' },
  personal_trainer: { ru: 'Персональный тренер', en: 'Personal trainer' },
  beauty_salon: { ru: 'Салон красоты', en: 'Beauty salon' },
  hair_salon: { ru: 'Парикмахерская', en: 'Hair salon' },
  nail_studio: { ru: 'Маникюрный салон', en: 'Nail studio' },

  // business
  business_center_24h: { ru: 'Бизнес-центр 24/7', en: '24/7 business center' },
  conference_rooms: { ru: 'Конференц-залы', en: 'Conference rooms' },
  meeting_rooms_small: { ru: 'Переговорные комнаты', en: 'Meeting rooms' },
  banquet_hall: { ru: 'Банкетный зал', en: 'Banquet hall' },
  coworking_lounge: { ru: 'Коворкинг-лаундж', en: 'Coworking lounge' },
  printing_service: { ru: 'Услуги печати', en: 'Printing service' },
  secretarial_service: { ru: 'Услуги секретаря', en: 'Secretarial service' },
  av_equipment: { ru: 'A/V оборудование', en: 'A/V equipment' },
  translator_on_request: { ru: 'Переводчик по запросу', en: 'Translator on request' },
  private_event_space: { ru: 'Приватные мероприятия', en: 'Private event space' },

  // food
  michelin_restaurant: { ru: 'Ресторан со звездой Michelin', en: 'Michelin-starred restaurant' },
  rooftop_bar: { ru: 'Бар на крыше', en: 'Rooftop bar' },
  wine_cellar_500plus: { ru: 'Винотека 500+ позиций', en: 'Wine cellar (500+ labels)' },
  cocktail_bar: { ru: 'Коктейль-бар', en: 'Cocktail bar' },
  lobby_bar: { ru: 'Лобби-бар', en: 'Lobby bar' },
  cigar_lounge: { ru: 'Сигарный лаундж', en: 'Cigar lounge' },
  room_service_24h: { ru: 'Обслуживание номеров 24/7', en: '24/7 room service' },
  afternoon_tea: { ru: 'Английский чай', en: 'Afternoon tea' },
  buffet_breakfast: { ru: 'Завтрак-буфет', en: 'Buffet breakfast' },
  a_la_carte_breakfast: { ru: 'Завтрак à la carte', en: 'À la carte breakfast' },
  pool_bar: { ru: 'Бар у бассейна', en: 'Pool bar' },
  beach_restaurant: { ru: 'Ресторан на пляже', en: 'Beach restaurant' },
  sushi_bar: { ru: 'Суши-бар', en: 'Sushi bar' },
  tapas_bar: { ru: 'Тапас-бар', en: 'Tapas bar' },
  craft_beer_bar: { ru: 'Бар крафтового пива', en: 'Craft beer bar' },
  champagne_bar: { ru: 'Шампань-бар', en: 'Champagne bar' },

  // family
  kids_club: { ru: 'Детский клуб', en: 'Kids club' },
  babysitting_certified: { ru: 'Услуги сертифицированной няни', en: 'Certified babysitting' },
  playground_outdoor: { ru: 'Уличная детская площадка', en: 'Outdoor playground' },
  kids_pool_heated: { ru: 'Детский бассейн с подогревом', en: 'Heated kids pool' },
  family_rooms: { ru: 'Семейные номера', en: 'Family rooms' },
  baby_cribs: { ru: 'Детские кроватки', en: 'Baby cribs' },
  kids_menu: { ru: 'Детское меню', en: "Kids' menu" },
  high_chairs: { ru: 'Детские стульчики', en: 'High chairs' },
  kids_movie_room: { ru: 'Детский кинозал', en: "Kids' movie room" },
  teen_lounge: { ru: 'Лаундж для подростков', en: 'Teen lounge' },
  stroller_rental: { ru: 'Аренда колясок', en: 'Stroller rental' },

  // services
  concierge_24h: { ru: 'Консьерж 24/7', en: '24/7 concierge' },
  butler_service: { ru: 'Услуги дворецкого', en: 'Butler service' },
  valet_parking: { ru: 'Валет-парковка', en: 'Valet parking' },
  laundry_24h: { ru: 'Прачечная 24/7', en: '24/7 laundry' },
  dry_cleaning: { ru: 'Химчистка', en: 'Dry cleaning' },
  shoe_shine: { ru: 'Чистка обуви', en: 'Shoe shine service' },
  currency_exchange: { ru: 'Обмен валют', en: 'Currency exchange' },
  tour_desk: { ru: 'Экскурсионное бюро', en: 'Tour desk' },
  bicycle_rental: { ru: 'Прокат велосипедов', en: 'Bicycle rental' },
  car_rental_desk: { ru: 'Бюро аренды авто', en: 'Car rental desk' },
  limousine_service: { ru: 'Лимузин-сервис', en: 'Limousine service' },
  helicopter_transfer: { ru: 'Вертолётный трансфер', en: 'Helicopter transfer' },
  private_chauffeur: { ru: 'Персональный водитель', en: 'Private chauffeur' },
  multilingual_staff: { ru: 'Многоязычный персонал', en: 'Multilingual staff' },
  express_checkout: { ru: 'Экспресс-выезд', en: 'Express check-out' },
  safe_deposit_lobby: { ru: 'Сейф в холле', en: 'Safe deposit at lobby' },

  // leisure
  private_beach: { ru: 'Частный пляж', en: 'Private beach' },
  beach_cabanas: { ru: 'Пляжные кабаны', en: 'Beach cabanas' },
  tennis_court: { ru: 'Теннисный корт', en: 'Tennis court' },
  paddle_court: { ru: 'Корт для падела', en: 'Paddle court' },
  golf_putting_green: { ru: 'Поле для гольфа (грин)', en: 'Putting green' },
  golf_nearby_18hole: { ru: 'Поле для гольфа на 18 лунок рядом', en: '18-hole golf course nearby' },
  ski_storage: { ru: 'Хранение лыж', en: 'Ski storage' },
  ski_school: { ru: 'Лыжная школа', en: 'Ski school' },
  private_garden: { ru: 'Частный сад', en: 'Private garden' },
  library_lounge: { ru: 'Библиотека-лаундж', en: 'Library lounge' },
  cinema_room: { ru: 'Кинозал', en: 'Cinema room' },
  game_room: { ru: 'Игровая комната', en: 'Game room' },
  billiards: { ru: 'Бильярд', en: 'Billiards' },
  art_gallery: { ru: 'Галерея искусств', en: 'Art gallery' },
  rooftop_terrace: { ru: 'Терраса на крыше', en: 'Rooftop terrace' },
  marina_access: { ru: 'Доступ к марине', en: 'Marina access' },

  // tech
  high_speed_wifi_500mbps: { ru: 'Wi-Fi 500 Мбит/с', en: 'High-speed Wi-Fi (500 Mbps)' },
  smart_room_controls: { ru: 'Умное управление номером', en: 'Smart room controls' },
  usb_c_in_lobby: { ru: 'USB-C зарядка в холле', en: 'USB-C charging in lobby' },
  mobile_check_in: { ru: 'Заезд через приложение', en: 'Mobile check-in' },
  digital_key: { ru: 'Цифровой ключ', en: 'Digital key' },
  in_app_concierge: { ru: 'Консьерж в приложении', en: 'In-app concierge' },
  fast_charging_ev: { ru: 'Быстрая зарядка для электромобилей', en: 'Fast EV charging' },

  // sustainability
  leed_certified: { ru: 'Сертификация LEED', en: 'LEED certified' },
  green_key_certified: { ru: 'Сертификат Green Key', en: 'Green Key certified' },
  plastic_free: { ru: 'Без одноразового пластика', en: 'Plastic-free' },
  solar_powered: { ru: 'Солнечные батареи', en: 'Solar powered' },
  rainwater_harvesting: { ru: 'Сбор дождевой воды', en: 'Rainwater harvesting' },
  organic_garden: { ru: 'Органический сад', en: 'Organic garden' },
  electric_shuttle: { ru: 'Электрический шаттл', en: 'Electric shuttle' },
  reusable_amenities: { ru: 'Многоразовые амениции', en: 'Reusable amenities' },
};

export const ROOM_AMENITY_LABELS: Record<string, { ru: string; en: string }> = {
  // tech
  smart_tv_55: { ru: 'Smart TV 55"', en: '55-inch Smart TV' },
  smart_tv_65_oled: { ru: 'OLED Smart TV 65"', en: '65-inch OLED Smart TV' },
  netflix_built_in: { ru: 'Netflix встроен', en: 'Netflix built-in' },
  apple_tv: { ru: 'Apple TV', en: 'Apple TV' },
  bluetooth_speaker_bose: { ru: 'Bluetooth-колонка Bose', en: 'Bose Bluetooth speaker' },
  bluetooth_speaker_marshall: { ru: 'Bluetooth-колонка Marshall', en: 'Marshall Bluetooth speaker' },
  usb_c_charging: { ru: 'USB-C зарядка у кровати', en: 'USB-C bedside charging' },
  wireless_charger: { ru: 'Беспроводная зарядка', en: 'Wireless charger' },
  high_speed_wifi: { ru: 'Скоростной Wi-Fi', en: 'High-speed Wi-Fi' },
  voice_assistant_alexa: { ru: 'Голосовой помощник Alexa', en: 'Alexa voice assistant' },
  tablet_room_controls: { ru: 'Планшет управления номером', en: 'Tablet room controls' },
  in_room_ipad: { ru: 'iPad в номере', en: 'In-room iPad' },

  // bath
  rainfall_shower: { ru: 'Тропический душ', en: 'Rainfall shower' },
  walk_in_shower: { ru: 'Душевая кабина', en: 'Walk-in shower' },
  freestanding_bathtub: { ru: 'Отдельностоящая ванна', en: 'Freestanding bathtub' },
  jetted_tub: { ru: 'Гидромассажная ванна', en: 'Jetted tub' },
  heated_floors: { ru: 'Тёплый пол', en: 'Heated floors' },
  heated_towel_rail: { ru: 'Полотенцесушитель', en: 'Heated towel rail' },
  bathrobes_egyptian_cotton: { ru: 'Халаты из египетского хлопка', en: 'Egyptian cotton bathrobes' },
  slippers_branded: { ru: 'Брендовые тапочки', en: 'Branded slippers' },
  hermes_amenities: { ru: 'Косметика Hermès', en: 'Hermès amenities' },
  diptyque_amenities: { ru: 'Косметика Diptyque', en: 'Diptyque amenities' },
  bvlgari_amenities: { ru: 'Косметика Bvlgari', en: 'Bvlgari amenities' },
  molton_brown_amenities: { ru: 'Косметика Molton Brown', en: 'Molton Brown amenities' },
  magnifying_mirror: { ru: 'Косметическое зеркало', en: 'Magnifying mirror' },
  hairdryer_dyson_supersonic: { ru: 'Фен Dyson Supersonic', en: 'Dyson Supersonic hairdryer' },
  bidet: { ru: 'Биде', en: 'Bidet' },
  double_vanity: { ru: 'Двойная раковина', en: 'Double vanity' },
  walk_in_closet: { ru: 'Гардеробная', en: 'Walk-in closet' },

  // comfort
  pillow_menu: { ru: 'Меню подушек', en: 'Pillow menu' },
  mattress_topper_premium: { ru: 'Премиум-наматрасник', en: 'Premium mattress topper' },
  blackout_curtains: { ru: 'Блэкаут-шторы', en: 'Blackout curtains' },
  soundproof_windows: { ru: 'Звукоизолирующие окна', en: 'Soundproof windows' },
  climate_control_individual: { ru: 'Индивидуальный климат-контроль', en: 'Individual climate control' },
  humidifier_on_request: { ru: 'Увлажнитель по запросу', en: 'Humidifier on request' },
  in_room_safe_laptop: { ru: 'Сейф для ноутбука', en: 'Laptop-size in-room safe' },
  minibar_premium: { ru: 'Мини-бар премиум', en: 'Premium minibar' },
  minibar_complimentary: { ru: 'Мини-бар бесплатно', en: 'Complimentary minibar' },
  turndown_service: { ru: 'Подготовка номера ко сну', en: 'Turndown service' },

  // food
  nespresso_machine: { ru: 'Кофемашина Nespresso', en: 'Nespresso machine' },
  espresso_machine_pro: { ru: 'Профессиональная эспрессо-машина', en: 'Pro espresso machine' },
  kettle_tea_selection_twg: { ru: 'Чайный набор TWG', en: 'TWG tea selection & kettle' },
  complimentary_water_glass_bottles: { ru: 'Стеклянные бутылки воды бесплатно', en: 'Complimentary glass-bottled water' },
  fresh_fruit_basket_daily: { ru: 'Свежие фрукты ежедневно', en: 'Fresh fruit basket daily' },
  welcome_chocolates: { ru: 'Шоколад в подарок', en: 'Welcome chocolates' },
  mini_fridge: { ru: 'Холодильник', en: 'Mini fridge' },
  wine_glasses_riedel: { ru: 'Винные бокалы Riedel', en: 'Riedel wine glasses' },
  champagne_flutes: { ru: 'Бокалы для шампанского', en: 'Champagne flutes' },

  // work
  ergonomic_chair_herman_miller: { ru: 'Эргономичное кресло Herman Miller', en: 'Herman Miller ergonomic chair' },
  executive_desk: { ru: 'Рабочий стол executive', en: 'Executive desk' },
  reading_light_dual: { ru: 'Двойные лампы для чтения', en: 'Dual reading lights' },
  desk_lamp_usb: { ru: 'Лампа с USB', en: 'Desk lamp with USB' },
  wireless_printer_access: { ru: 'Беспроводной принтер', en: 'Wireless printer access' },
  webcam_lighting: { ru: 'Освещение для веб-камеры', en: 'Webcam lighting' },

  // view_features
  private_balcony: { ru: 'Частный балкон', en: 'Private balcony' },
  french_doors: { ru: 'Французские двери', en: 'French doors' },
  floor_to_ceiling_windows: { ru: 'Панорамные окна', en: 'Floor-to-ceiling windows' },
  private_terrace: { ru: 'Частная терраса', en: 'Private terrace' },
  plunge_pool_in_room: { ru: 'Плунж-бассейн в номере', en: 'In-room plunge pool' },
  outdoor_shower: { ru: 'Уличный душ', en: 'Outdoor shower' },
  fireplace_gas: { ru: 'Газовый камин', en: 'Gas fireplace' },

  // bedding
  king_size_bed: { ru: 'Кровать king-size', en: 'King-size bed' },
  queen_size_bed: { ru: 'Кровать queen-size', en: 'Queen-size bed' },
  twin_beds: { ru: 'Две односпальные кровати', en: 'Twin beds' },
  sofa_bed_extra: { ru: 'Дополнительный диван-кровать', en: 'Sofa bed (extra)' },
  egyptian_cotton_sheets_500tc: { ru: 'Бельё из египетского хлопка 500TC', en: 'Egyptian cotton sheets (500TC)' },
  down_duvet: { ru: 'Пуховое одеяло', en: 'Down duvet' },
  hypoallergenic_options: { ru: 'Гипоаллергенные опции', en: 'Hypoallergenic options' },
};

// Free items / included / not included codes
export const POLICY_CODE_LABELS: Record<string, { ru: string; en: string }> = {
  wifi_unlimited: { ru: 'Безлимитный Wi-Fi', en: 'Unlimited Wi-Fi' },
  bottled_water_2_daily: { ru: '2 бутылки воды ежедневно', en: '2 bottled waters daily' },
  tea_coffee_daily: { ru: 'Чай и кофе ежедневно', en: 'Tea & coffee daily' },
  newspaper_digital: { ru: 'Цифровая пресса', en: 'Digital newspapers' },
  welcome_amenity: { ru: 'Приветственный комплимент', en: 'Welcome amenity' },
  turndown_service: { ru: 'Вечерний сервис', en: 'Turndown service' },
  shoe_shine: { ru: 'Чистка обуви', en: 'Shoe shine' },
  in_room_safe: { ru: 'Сейф в номере', en: 'In-room safe' },
  hair_dryer: { ru: 'Фен', en: 'Hair dryer' },
  iron_ironing_board: { ru: 'Утюг и гладильная доска', en: 'Iron & ironing board' },
  umbrella_in_room: { ru: 'Зонт в номере', en: 'Umbrella in room' },
  slippers_robes: { ru: 'Тапочки и халат', en: 'Slippers & bathrobes' },
  toiletries_set: { ru: 'Набор туалетных принадлежностей', en: 'Toiletries set' },
  daily_housekeeping: { ru: 'Ежедневная уборка', en: 'Daily housekeeping' },
  mineral_water_unlimited: { ru: 'Минеральная вода без ограничений', en: 'Mineral water unlimited' },

  taxes: { ru: 'Все налоги', en: 'All taxes' },
  service_charge: { ru: 'Сервисный сбор', en: 'Service charge' },
  breakfast_buffet: { ru: 'Завтрак', en: 'Breakfast' },
  welcome_drink: { ru: 'Приветственный напиток', en: 'Welcome drink' },
  minibar_softs: { ru: 'Безалкогольный мини-бар', en: 'Soft drinks minibar' },
  parking_free: { ru: 'Бесплатная парковка', en: 'Free parking' },
  parking_paid: { ru: 'Парковка (оплачивается)', en: 'Parking (paid)' },
  city_tax: { ru: 'Городской налог', en: 'City tax' },
  extra_services: { ru: 'Дополнительные услуги', en: 'Extra services' },
  breakfast_extra: { ru: 'Завтрак (за доплату)', en: 'Breakfast (extra cost)' },

  // Extended free item codes used in room admin
  transfer: { ru: 'Трансфер', en: 'Transfer' },
  dinner: { ru: 'Ужин', en: 'Dinner' },
  lunch: { ru: 'Обед', en: 'Lunch' },
  gym: { ru: 'Тренажёрный зал', en: 'Gym' },
  pool_access: { ru: 'Бассейн', en: 'Pool access' },
  spa_access: { ru: 'СПА', en: 'Spa access' },
  air_conditioning: { ru: 'Кондиционер', en: 'Air conditioning' },
  tv: { ru: 'Телевизор', en: 'TV' },
};

export const LANGUAGE_LABELS: Record<string, { ru: string; en: string; flag: string }> = {
  English: { ru: 'Английский', en: 'English', flag: '🇬🇧' },
  Russian: { ru: 'Русский', en: 'Russian', flag: '🇷🇺' },
  French: { ru: 'Французский', en: 'French', flag: '🇫🇷' },
  German: { ru: 'Немецкий', en: 'German', flag: '🇩🇪' },
  Spanish: { ru: 'Испанский', en: 'Spanish', flag: '🇪🇸' },
  Italian: { ru: 'Итальянский', en: 'Italian', flag: '🇮🇹' },
  Catalan: { ru: 'Каталанский', en: 'Catalan', flag: '🏴' },
  Dutch: { ru: 'Голландский', en: 'Dutch', flag: '🇳🇱' },
  Swedish: { ru: 'Шведский', en: 'Swedish', flag: '🇸🇪' },
  Finnish: { ru: 'Финский', en: 'Finnish', flag: '🇫🇮' },
  Danish: { ru: 'Датский', en: 'Danish', flag: '🇩🇰' },
  Japanese: { ru: 'Японский', en: 'Japanese', flag: '🇯🇵' },
  Mandarin: { ru: 'Китайский (мандарин)', en: 'Mandarin', flag: '🇨🇳' },
  Korean: { ru: 'Корейский', en: 'Korean', flag: '🇰🇷' },
  Thai: { ru: 'Тайский', en: 'Thai', flag: '🇹🇭' },
  Vietnamese: { ru: 'Вьетнамский', en: 'Vietnamese', flag: '🇻🇳' },
  Indonesian: { ru: 'Индонезийский', en: 'Indonesian', flag: '🇮🇩' },
  Malay: { ru: 'Малайский', en: 'Malay', flag: '🇲🇾' },
  Tamil: { ru: 'Тамильский', en: 'Tamil', flag: '🇮🇳' },
  Hindi: { ru: 'Хинди', en: 'Hindi', flag: '🇮🇳' },
  Urdu: { ru: 'Урду', en: 'Urdu', flag: '🇵🇰' },
  Arabic: { ru: 'Арабский', en: 'Arabic', flag: '🇦🇪' },
  Turkish: { ru: 'Турецкий', en: 'Turkish', flag: '🇹🇷' },
  Portuguese: { ru: 'Португальский', en: 'Portuguese', flag: '🇵🇹' },
  Afrikaans: { ru: 'Африкаанс', en: 'Afrikaans', flag: '🇿🇦' },
  Xhosa: { ru: 'Коса', en: 'Xhosa', flag: '🇿🇦' },
  Swahili: { ru: 'Суахили', en: 'Swahili', flag: '🇰🇪' },
};

export const PAYMENT_LABELS: Record<string, { ru: string; en: string }> = {
  Visa: { ru: 'Visa', en: 'Visa' },
  Mastercard: { ru: 'Mastercard', en: 'Mastercard' },
  AmericanExpress: { ru: 'American Express', en: 'American Express' },
  UnionPay: { ru: 'UnionPay', en: 'UnionPay' },
  JCB: { ru: 'JCB', en: 'JCB' },
  ApplePay: { ru: 'Apple Pay', en: 'Apple Pay' },
  GooglePay: { ru: 'Google Pay', en: 'Google Pay' },
  PayInHotel: { ru: 'Оплата в отеле', en: 'Pay at hotel' },
};

export const VIEW_LABELS: Record<string, { ru: string; en: string }> = {
  city: { ru: 'Вид на город', en: 'City view' },
  garden: { ru: 'Вид на сад', en: 'Garden view' },
  courtyard: { ru: 'Вид во двор', en: 'Courtyard view' },
  pool: { ru: 'Вид на бассейн', en: 'Pool view' },
  sea: { ru: 'Вид на море', en: 'Sea view' },
  mountain: { ru: 'Вид на горы', en: 'Mountain view' },
  park: { ru: 'Вид на парк', en: 'Park view' },
  panoramic: { ru: 'Панорамный вид', en: 'Panoramic view' },
  forest: { ru: 'Вид на лес', en: 'Forest view' },
  lake: { ru: 'Вид на озеро', en: 'Lake view' },
};

export const FLOOR_LABELS: Record<string, { ru: string; en: string }> = {
  low: { ru: 'Нижний этаж', en: 'Low floor' },
  mid: { ru: 'Средний этаж', en: 'Mid floor' },
  high: { ru: 'Верхний этаж', en: 'High floor' },
};

export const BATH_LABELS: Record<string, { ru: string; en: string }> = {
  shower: { ru: 'Душ', en: 'Shower' },
  bath: { ru: 'Ванна', en: 'Bathtub' },
  jacuzzi: { ru: 'Джакузи', en: 'Jacuzzi' },
  shower_and_bath: { ru: 'Душ и ванна', en: 'Shower & bathtub' },
};

export const BED_TYPE_LABELS: Record<string, { ru: string; en: string }> = {
  king: { ru: 'King-size', en: 'King-size' },
  queen: { ru: 'Queen-size', en: 'Queen-size' },
  twin: { ru: 'Односпальная', en: 'Twin' },
  sofa_bed: { ru: 'Диван-кровать', en: 'Sofa bed' },
};

export const HOTEL_AMENITY_CATEGORIES: { category: string; items: string[] }[] = [
  { category: 'wellness', items: ['spa_thai_massage', 'spa_aromatherapy', 'spa_couples_room', 'spa_hot_stone', 'indoor_pool', 'outdoor_pool', 'outdoor_pool_heated', 'rooftop_pool', 'infinity_pool', 'sauna_finnish', 'sauna_infrared', 'hammam', 'jacuzzi', 'cold_plunge', 'fitness_studio', 'yoga_classes', 'pilates_studio', 'personal_trainer', 'beauty_salon', 'hair_salon', 'nail_studio'] },
  { category: 'business', items: ['business_center_24h', 'conference_rooms', 'meeting_rooms_small', 'banquet_hall', 'coworking_lounge', 'printing_service', 'secretarial_service', 'av_equipment', 'translator_on_request', 'private_event_space'] },
  { category: 'food', items: ['michelin_restaurant', 'rooftop_bar', 'wine_cellar_500plus', 'cocktail_bar', 'lobby_bar', 'cigar_lounge', 'room_service_24h', 'afternoon_tea', 'buffet_breakfast', 'a_la_carte_breakfast', 'pool_bar', 'beach_restaurant', 'sushi_bar', 'tapas_bar', 'craft_beer_bar', 'champagne_bar'] },
  { category: 'family', items: ['kids_club', 'babysitting_certified', 'playground_outdoor', 'kids_pool_heated', 'family_rooms', 'baby_cribs', 'kids_menu', 'high_chairs', 'kids_movie_room', 'teen_lounge', 'stroller_rental'] },
  { category: 'services', items: ['concierge_24h', 'butler_service', 'valet_parking', 'laundry_24h', 'dry_cleaning', 'shoe_shine', 'currency_exchange', 'tour_desk', 'bicycle_rental', 'car_rental_desk', 'limousine_service', 'helicopter_transfer', 'private_chauffeur', 'multilingual_staff', 'express_checkout', 'safe_deposit_lobby'] },
  { category: 'leisure', items: ['private_beach', 'beach_cabanas', 'tennis_court', 'paddle_court', 'golf_putting_green', 'golf_nearby_18hole', 'ski_storage', 'ski_school', 'private_garden', 'library_lounge', 'cinema_room', 'game_room', 'billiards', 'art_gallery', 'rooftop_terrace', 'marina_access'] },
];

export const POPULAR_BADGE_LABELS: Record<string, { ru: string; en: string; color: string }> = {
  POPULAR_CHOICE: { ru: 'Популярный выбор', en: 'Popular choice', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
};

export function tCode(
  map: Record<string, { ru: string; en: string }>,
  code: string,
  lang: 'ru' | 'en',
  fallback?: string,
): string {
  const entry = map[code];
  if (!entry) return fallback || code.replace(/_/g, ' ');
  return lang === 'ru' ? entry.ru : entry.en;
}
