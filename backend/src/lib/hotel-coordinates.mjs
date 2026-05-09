const EXACT_HOTEL_COORDINATES = new Map(
  [
    ["Le Grand Ritz", { lat: 48.86861, lng: 2.32963 }],
    ["Hôtel de Crillon", { lat: 48.86598, lng: 2.32124 }],
    ["Hôtel Particulier Montmartre", { lat: 48.8876, lng: 2.3325 }],
    ["The Savoy", { lat: 51.51005, lng: -0.1207 }],
    ["The Langham London", { lat: 51.5178, lng: -0.14395 }],
    ["The Hoxton Shoreditch", { lat: 51.52438, lng: -0.08291 }],
    ["Hotel Adlon Kempinski", { lat: 52.51627, lng: 13.38076 }],
    ["Mandarin Oriental Munich", { lat: 48.13892, lng: 11.58166 }],
    ["W Barcelona", { lat: 41.36811, lng: 2.19078 }],
    ["Aman Venice", { lat: 45.44078, lng: 12.32734 }],
    ["Belmond Villa San Michele", { lat: 43.8059, lng: 11.2926 }],
    ["Baur au Lac", { lat: 47.36731, lng: 8.53874 }],
    ["Hotel Sacher Vienna", { lat: 48.20266, lng: 16.36989 }],
    ["Four Seasons Amsterdam", { lat: 52.37402, lng: 4.88416 }],
    ["Grand Hotel Stockholm", { lat: 59.32962, lng: 18.07384 }],
    ["Copenhague Admiral Hotel", { lat: 55.68965, lng: 12.59842 }],
    ["The Fontenay Hamburg", { lat: 53.56383, lng: 9.98905 }],
    ["The Peninsula Tokyo", { lat: 35.67487, lng: 139.76352 }],
    ["Park Hyatt Tokyo", { lat: 35.68566, lng: 139.69052 }],
    ["Aman Kyoto", { lat: 35.04389, lng: 135.72998 }],
    ["Hoshinoya Fuji", { lat: 35.50371, lng: 138.75367 }],
    ["Raffles Singapore", { lat: 1.29453, lng: 103.8535 }],
    ["Marina Bay Sands", { lat: 1.2834, lng: 103.86073 }],
    ["Four Seasons Bali at Jimbaran Bay", { lat: -8.7854, lng: 115.1597 }],
    ["Alila Villas Uluwatu", { lat: -8.84853, lng: 115.14417 }],
    ["Rosewood Phuket", { lat: 7.88086, lng: 98.2604 }],
    ["Anantara Riverside Bangkok", { lat: 13.70457, lng: 100.48879 }],
    ["The Reverie Saigon", { lat: 10.7727, lng: 106.70487 }],
    ["The Plaza New York", { lat: 40.76442, lng: -73.97421 }],
    ["The St. Regis New York", { lat: 40.76159, lng: -73.9749 }],
    ["Faena Hotel Miami Beach", { lat: 25.80854, lng: -80.12389 }],
    ["Four Seasons Los Angeles", { lat: 34.06755, lng: -118.37617 }],
    ["Rosewood San Miguel de Allende", { lat: 20.91026, lng: -100.74694 }],
    ["Awasi Patagonia", { lat: -50.97984, lng: -72.92619 }],
    ["Burj Al Arab Jumeirah", { lat: 25.14119, lng: 55.18525 }],
    ["Atlantis The Palm", { lat: 25.13036, lng: 55.11714 }],
    ["Royal Mansour Marrakech", { lat: 31.62498, lng: -7.99973 }],
    ["One&Only Cape Town", { lat: -33.90879, lng: 18.41781 }],
    ["Singita Grumeti", { lat: -2.1278, lng: 34.7182 }],
    ["Qualia Hamilton Island", { lat: -20.34833, lng: 148.95587 }],
    ["Park Hyatt Sydney", { lat: -33.85639, lng: 151.24607 }],
    ["Taj Lake Palace", { lat: 24.57675, lng: 73.68084 }],
    ["Soneva Fushi", { lat: 5.11171, lng: 73.0709 }],
  ].map(([name, coords]) => [normalize(name), coords]),
);

const CITY_CONFIG = {
  paris: {
    center: { lat: 48.8566, lng: 2.3522 },
    jitter: { lat: 0.018, lng: 0.026 },
    anchors: {
      "place vendôme": { lat: 48.86777, lng: 2.32989 },
      "place de la concorde": { lat: 48.86562, lng: 2.32112 },
      "av. junot": { lat: 48.88735, lng: 2.33235 },
      "rue de rivoli": { lat: 48.8558, lng: 2.3611 },
      "avenue montaigne": { lat: 48.8668, lng: 2.3035 },
      "rue cler": { lat: 48.8557, lng: 2.3055 },
      "boulevard saint-germain": { lat: 48.8532, lng: 2.3342 },
    },
  },
  london: {
    center: { lat: 51.50722, lng: -0.1275 },
    jitter: { lat: 0.02, lng: 0.03 },
    anchors: {
      strand: { lat: 51.5107, lng: -0.1196 },
      "portland place": { lat: 51.5181, lng: -0.1437 },
      "regent street": { lat: 51.5113, lng: -0.1419 },
      "covent garden": { lat: 51.5117, lng: -0.124 },
      "great eastern st": { lat: 51.5242, lng: -0.0824 },
    },
  },
  berlin: {
    center: { lat: 52.52, lng: 13.405 },
    jitter: { lat: 0.018, lng: 0.03 },
    anchors: {
      "unter den linden": { lat: 52.5164, lng: 13.3802 },
      "friedrichstraße": { lat: 52.5079, lng: 13.3908 },
      "kurfürstendamm": { lat: 52.5032, lng: 13.3314 },
      "leipziger straße": { lat: 52.509, lng: 13.3903 },
    },
  },
  munich: {
    center: { lat: 48.13715, lng: 11.57612 },
    jitter: { lat: 0.016, lng: 0.024 },
    anchors: {
      neuturmstrasse: { lat: 48.1387, lng: 11.5816 },
    },
  },
  rome: {
    center: { lat: 41.90278, lng: 12.49637 },
    jitter: { lat: 0.022, lng: 0.03 },
    anchors: {
      "via veneto": { lat: 41.9086, lng: 12.4904 },
      "via del corso": { lat: 41.9007, lng: 12.4794 },
      "piazza navona": { lat: 41.8992, lng: 12.4731 },
      "largo di torre argentina": { lat: 41.8959, lng: 12.4768 },
    },
  },
  barcelona: {
    center: { lat: 41.38506, lng: 2.1734 },
    jitter: { lat: 0.02, lng: 0.028 },
    anchors: {
      "plaça de la rosa dels vents": { lat: 41.3681, lng: 2.1908 },
      "carrer de la marina": { lat: 41.3894, lng: 2.1968 },
      "passeig de gracia": { lat: 41.3927, lng: 2.1649 },
      "carrer de mallorca": { lat: 41.4013, lng: 2.1744 },
      "la rambla": { lat: 41.3803, lng: 2.1739 },
      "avinguda diagonal": { lat: 41.3939, lng: 2.1531 },
    },
  },
  venice: {
    center: { lat: 45.44085, lng: 12.31552 },
    jitter: { lat: 0.01, lng: 0.016 },
    anchors: {
      "calle tiepolo": { lat: 45.4408, lng: 12.3273 },
    },
  },
  florence: {
    center: { lat: 43.76956, lng: 11.25581 },
    jitter: { lat: 0.016, lng: 0.02 },
    anchors: {
      "via doccia": { lat: 43.8061, lng: 11.2921 },
      fiesole: { lat: 43.8061, lng: 11.2932 },
    },
  },
  zurich: {
    center: { lat: 47.37689, lng: 8.54169 },
    jitter: { lat: 0.012, lng: 0.018 },
    anchors: {
      talstrasse: { lat: 47.3673, lng: 8.5388 },
    },
  },
  vienna: {
    center: { lat: 48.20817, lng: 16.37382 },
    jitter: { lat: 0.018, lng: 0.024 },
    anchors: {
      "philharmoniker str": { lat: 48.2027, lng: 16.3699 },
      ringstraße: { lat: 48.2073, lng: 16.3722 },
      "kärntner straße": { lat: 48.2034, lng: 16.3708 },
      "mariahilfer straße": { lat: 48.1986, lng: 16.3419 },
      "wiener straße": { lat: 48.1847, lng: 16.3627 },
    },
  },
  amsterdam: {
    center: { lat: 52.36757, lng: 4.90414 },
    jitter: { lat: 0.016, lng: 0.02 },
    anchors: {
      keizergracht: { lat: 52.374, lng: 4.8841 },
      keizersgracht: { lat: 52.374, lng: 4.8841 },
      prinsengracht: { lat: 52.3731, lng: 4.8838 },
      herengracht: { lat: 52.3726, lng: 4.8911 },
      damrak: { lat: 52.3767, lng: 4.8944 },
    },
  },
  stockholm: {
    center: { lat: 59.32932, lng: 18.06858 },
    jitter: { lat: 0.014, lng: 0.02 },
    anchors: {
      "södra blasieholmshamnen": { lat: 59.3297, lng: 18.0738 },
    },
  },
  copenhagen: {
    center: { lat: 55.6761, lng: 12.5683 },
    jitter: { lat: 0.014, lng: 0.02 },
    anchors: {
      toldbodgade: { lat: 55.6897, lng: 12.5984 },
    },
  },
  hamburg: {
    center: { lat: 53.55108, lng: 9.99368 },
    jitter: { lat: 0.014, lng: 0.02 },
    anchors: {
      fontenay: { lat: 53.5638, lng: 9.9891 },
    },
  },
  tokyo: {
    center: { lat: 35.6762, lng: 139.6503 },
    jitter: { lat: 0.025, lng: 0.03 },
    anchors: {
      yurakucho: { lat: 35.6749, lng: 139.7635 },
      "nishi shinjuku": { lat: 35.6857, lng: 139.6905 },
      otemachi: { lat: 35.6867, lng: 139.7651 },
      shinjuku: { lat: 35.6896, lng: 139.7006 },
      ginza: { lat: 35.6717, lng: 139.765 },
      shibuya: { lat: 35.6595, lng: 139.7005 },
      akihabara: { lat: 35.6984, lng: 139.7731 },
    },
  },
  kyoto: {
    center: { lat: 35.01156, lng: 135.76815 },
    jitter: { lat: 0.018, lng: 0.022 },
    anchors: {
      okitayama: { lat: 35.0439, lng: 135.73 },
    },
  },
  fujikawaguchiko: {
    center: { lat: 35.4976, lng: 138.7547 },
    jitter: { lat: 0.012, lng: 0.016 },
    anchors: {
      funatsu: { lat: 35.5037, lng: 138.7537 },
    },
  },
  singapore: {
    center: { lat: 1.29027, lng: 103.85195 },
    jitter: { lat: 0.012, lng: 0.014 },
    anchors: {
      "beach road": { lat: 1.2945, lng: 103.8535 },
      bayfront: { lat: 1.2834, lng: 103.8607 },
      sentosa: { lat: 1.2496, lng: 103.82 },
      knolls: { lat: 1.2497, lng: 103.82 },
    },
  },
  bali: {
    center: { lat: -8.40952, lng: 115.18892 },
    jitter: { lat: 0.05, lng: 0.06 },
    anchors: {
      jimbaran: { lat: -8.7854, lng: 115.1597 },
      seminyak: { lat: -8.6896, lng: 115.1686 },
      ubud: { lat: -8.5069, lng: 115.2625 },
      uluwatu: { lat: -8.8291, lng: 115.0849 },
      pecatu: { lat: -8.8297, lng: 115.1282 },
    },
  },
  phuket: {
    center: { lat: 7.88045, lng: 98.39229 },
    jitter: { lat: 0.03, lng: 0.035 },
    anchors: {
      patong: { lat: 7.8961, lng: 98.2966 },
      "muen-ngoen": { lat: 7.8809, lng: 98.2604 },
    },
  },
  bangkok: {
    center: { lat: 13.75633, lng: 100.50177 },
    jitter: { lat: 0.03, lng: 0.03 },
    anchors: {
      charoennakorn: { lat: 13.7046, lng: 100.4888 },
    },
  },
  "ho chi minh city": {
    center: { lat: 10.77689, lng: 106.70081 },
    jitter: { lat: 0.016, lng: 0.02 },
    anchors: {
      "nguyen hue": { lat: 10.7727, lng: 106.7049 },
    },
  },
  "new york": {
    center: { lat: 40.71278, lng: -74.00597 },
    jitter: { lat: 0.03, lng: 0.03 },
    anchors: {
      "5th ave": { lat: 40.7644, lng: -73.9742 },
      "5th avenue": { lat: 40.7644, lng: -73.9742 },
      "madison avenue": { lat: 40.7615, lng: -73.9732 },
      broadway: { lat: 40.759, lng: -73.9845 },
      "park avenue": { lat: 40.7544, lng: -73.9769 },
      "e 55th st": { lat: 40.7616, lng: -73.9749 },
    },
  },
  miami: {
    center: { lat: 25.76168, lng: -80.19179 },
    jitter: { lat: 0.02, lng: 0.02 },
    anchors: {
      collins: { lat: 25.8085, lng: -80.1239 },
      "miami beach": { lat: 25.7907, lng: -80.13 },
    },
  },
  "los angeles": {
    center: { lat: 34.05223, lng: -118.24368 },
    jitter: { lat: 0.028, lng: 0.03 },
    anchors: {
      doheny: { lat: 34.0676, lng: -118.3762 },
    },
  },
  "san miguel de allende": {
    center: { lat: 20.91445, lng: -100.74524 },
    jitter: { lat: 0.012, lng: 0.014 },
    anchors: {
      "nemesio diez": { lat: 20.9103, lng: -100.7469 },
    },
  },
  patagonia: {
    center: { lat: -50.94233, lng: -72.91812 },
    jitter: { lat: 0.02, lng: 0.024 },
    anchors: {
      torres: { lat: -50.9798, lng: -72.9262 },
      magallanes: { lat: -50.9798, lng: -72.9262 },
    },
  },
  dubai: {
    center: { lat: 25.20485, lng: 55.27078 },
    jitter: { lat: 0.03, lng: 0.03 },
    anchors: {
      jumeirah: { lat: 25.1412, lng: 55.1852 },
      "palm jumeirah": { lat: 25.1124, lng: 55.139 },
      "sheikh zayed road": { lat: 25.2075, lng: 55.2713 },
      "jumeirah beach walk": { lat: 25.0779, lng: 55.1339 },
      "al wasl road": { lat: 25.1912, lng: 55.2368 },
      "marina promenade": { lat: 25.0815, lng: 55.1403 },
    },
  },
  marrakech: {
    center: { lat: 31.62947, lng: -7.98108 },
    jitter: { lat: 0.016, lng: 0.02 },
    anchors: {
      "abou abbas": { lat: 31.625, lng: -7.9997 },
    },
  },
  "cape town": {
    center: { lat: -33.92487, lng: 18.42406 },
    jitter: { lat: 0.018, lng: 0.02 },
    anchors: {
      waterfront: { lat: -33.9088, lng: 18.4178 },
      "dock road": { lat: -33.9088, lng: 18.4178 },
    },
  },
  serengeti: {
    center: { lat: -2.33333, lng: 34.83333 },
    jitter: { lat: 0.08, lng: 0.08 },
    anchors: {
      grumeti: { lat: -2.1278, lng: 34.7182 },
      mugumu: { lat: -1.8506, lng: 34.6961 },
    },
  },
  "hamilton island": {
    center: { lat: -20.3484, lng: 148.9559 },
    jitter: { lat: 0.012, lng: 0.014 },
    anchors: {
      whitsunday: { lat: -20.3483, lng: 148.9559 },
    },
  },
  sydney: {
    center: { lat: -33.86882, lng: 151.20929 },
    jitter: { lat: 0.018, lng: 0.02 },
    anchors: {
      rocks: { lat: -33.8599, lng: 151.209 },
      hickson: { lat: -33.8564, lng: 151.2461 },
    },
  },
  udaipur: {
    center: { lat: 24.58545, lng: 73.71248 },
    jitter: { lat: 0.015, lng: 0.018 },
    anchors: {
      pichola: { lat: 24.5768, lng: 73.6808 },
    },
  },
  maldives: {
    center: { lat: 4.1755, lng: 73.5093 },
    jitter: { lat: 0.06, lng: 0.06 },
    anchors: {
      baa: { lat: 5.1117, lng: 73.0709 },
      kunfunadhoo: { lat: 5.1117, lng: 73.0709 },
    },
  },
  "big sur": {
    center: { lat: 36.27042, lng: -121.80806 },
    jitter: { lat: 0.012, lng: 0.014 },
    anchors: {
      "ca-1": { lat: 36.2474, lng: -121.7807 },
    },
  },
};

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "");
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function deterministicOffset(seed, spread) {
  const normalized = (seed % 10000) / 9999;
  return (normalized * 2 - 1) * spread;
}

export function resolveHotelCoordinates({ name, address, city }) {
  const normalizedName = normalize(name);
  const exact = EXACT_HOTEL_COORDINATES.get(normalizedName);
  if (exact) {
    return exact;
  }

  const normalizedCity = normalize(city);
  const normalizedAddress = normalize(address);
  const config = CITY_CONFIG[normalizedCity];

  if (!config) {
    return null;
  }

  let base = config.center;
  for (const [keyword, coords] of Object.entries(config.anchors)) {
    if (normalizedAddress.includes(normalize(keyword))) {
      base = coords;
      break;
    }
  }

  const seedSource = `${normalizedName}|${normalizedAddress}|${normalizedCity}`;
  const seedA = hashString(seedSource);
  const seedB = hashString(`${seedSource}|lng`);

  return {
    lat: Number((base.lat + deterministicOffset(seedA, config.jitter.lat)).toFixed(6)),
    lng: Number((base.lng + deterministicOffset(seedB, config.jitter.lng)).toFixed(6)),
  };
}

