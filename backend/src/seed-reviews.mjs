import pg from 'pg';
import bcryptjs from 'bcryptjs';

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

// ── Admin users ─────────────────────────────────────────────────────────────
const adminUsers = [
  { name: 'System Admin', email: 'admin@booking.local' },
  { name: 'Content Admin', email: 'manager@booking.local' },
];

// ── Fake users ──────────────────────────────────────────────────────────────
const fakeUsers = [
  { name: 'James Whitfield', email: 'james.whitfield@gmail.com' },
  { name: 'Sophie Leclerc', email: 'sophie.leclerc@outlook.fr' },
  { name: 'Marco Bianchi', email: 'marco.bianchi@libero.it' },
  { name: 'Yuki Tanaka', email: 'yuki.tanaka@yahoo.co.jp' },
  { name: 'Elena Voronova', email: 'elena.voronova@mail.ru' },
  { name: 'David Okonkwo', email: 'david.okonkwo@gmail.com' },
  { name: 'Natalie Chen', email: 'natalie.chen@hotmail.com' },
  { name: 'Carlos Mendes', email: 'carlos.mendes@gmail.com' },
  { name: 'Anya Patel', email: 'anya.patel@gmail.com' },
  { name: 'Thomas Bergmann', email: 'thomas.bergmann@web.de' },
  { name: 'Isabelle Fontaine', email: 'isabelle.fontaine@gmail.fr' },
  { name: "Ryan O'Sullivan", email: 'ryan.osullivan@eircom.ie' },
  { name: 'Mei-Ling Zhang', email: 'meiling.zhang@163.com' },
  { name: 'Alexander Petrov', email: 'alex.petrov@yandex.ru' },
  { name: 'Priya Krishnamurthy', email: 'priya.krishna@gmail.com' },
  { name: 'Lucas Vandenberg', email: 'lucas.vandenberg@hotmail.nl' },
  { name: 'Fatima Al-Rashidi', email: 'fatima.rashidi@gmail.com' },
  { name: 'Noah Fischer', email: 'noah.fischer@gmx.de' },
  { name: 'Grace Adeyemi', email: 'grace.adeyemi@gmail.com' },
  { name: 'Dmitri Sokolov', email: 'dmitri.sokolov@gmail.com' },
  { name: 'Charlotte Beaumont', email: 'charlotte.beaumont@gmail.com' },
  { name: 'Kenji Watanabe', email: 'kenji.watanabe@gmail.com' },
  { name: 'Isabella Romano', email: 'isabella.romano@gmail.it' },
  { name: "Michael O'Brien", email: 'michael.obrien@gmail.com' },
  { name: 'Zara Hussain', email: 'zara.hussain@hotmail.co.uk' },
  { name: 'Erik Lindqvist', email: 'erik.lindqvist@gmail.se' },
  { name: 'Valentina Moretti', email: 'valentina.moretti@gmail.it' },
  { name: 'Kwame Asante', email: 'kwame.asante@gmail.com' },
  { name: 'Hannah Müller', email: 'hannah.mueller@web.de' },
  { name: 'Rafael Torres', email: 'rafael.torres@gmail.es' },
  { name: 'Amira Benali', email: 'amira.benali@gmail.com' },
  { name: 'Oliver Thornton', email: 'oliver.thornton@gmail.co.uk' },
  { name: 'Sakura Hayashi', email: 'sakura.hayashi@yahoo.jp' },
  { name: 'Viktor Kozlov', email: 'viktor.kozlov@mail.ru' },
  { name: 'Chloe Dupont', email: 'chloe.dupont@gmail.fr' },
  { name: 'Arjun Sharma', email: 'arjun.sharma@gmail.com' },
  { name: 'Mia Johansson', email: 'mia.johansson@gmail.se' },
  { name: 'Diego Ramirez', email: 'diego.ramirez@gmail.mx' },
  { name: 'Nadia Ivanova', email: 'nadia.ivanova@yandex.ru' },
  { name: 'Ben Hartley', email: 'ben.hartley@gmail.co.uk' },
];

// ── Pool of review comments keyed by rating ──────────────────────────────────
const reviewPool = {
  5: [
    'Absolutely flawless stay from start to finish. The moment we arrived, the staff greeted us by name — it turned out our concierge had researched our anniversary and had champagne and roses waiting in the room. Details like that are why this place is worth every penny.',
    "I've stayed in many five-star hotels around the world, and this one still manages to stand apart. The bed linen alone is something I still think about. The breakfast spread was extraordinary — I spent forty minutes just choosing between pastries.",
    "Our suite had a private terrace with a view that I genuinely didn't want to leave. We ended up cancelling two days of sightseeing just to sit on that terrace with coffee and read. Zero regrets.",
    "The spa was transcendent. I booked a 90-minute treatment almost as an afterthought and came out three hours later not entirely sure who I was. The therapist had diagnosed tension in my shoulders I didn't even know I had.",
    "Service here operates at a frequency that most hotels don't even know exists. Nothing was ever too much trouble. When I mentioned at breakfast that I loved the olive oil, a small bottle appeared in my room that evening with a note explaining the estate it came from. Extraordinary.",
    'Worth every cent and then some. We splurged on a suite for our honeymoon and still talk about it two years later. The turndown service left handwritten notes with local recommendations that turned out to be the best meals of the trip.',
    'This hotel has ruined me for everywhere else. I stayed for five nights and by day two the bar staff knew my drink order. By day three the restaurant remembered my dietary requirements. By day four I considered never leaving.',
    'The pool was a revelation — warm, immaculately clean, and quiet on weekday mornings. I had it almost entirely to myself for an hour each morning. Combined with the breakfast terrace view, it was the best start to any day I can remember.',
    "I travel for work roughly 150 nights a year and I've stayed in hotels on every continent. This is the best I've experienced. The mattress, the pillow menu, the blackout curtains — whoever specified the sleep environment here deserves an award.",
    'Every single member of staff we encountered smiled genuinely. Not the professional hotel smile — an actual human smile. The housekeeping team left a small origami swan on the bed each morning. It sounds trivial but it set the tone for the whole day.',
    'The restaurant was the highlight for me. We ate in three times in four nights, which never happens. The sommelier was exceptional — guided us through a local wine list we knew nothing about and every selection was spot-on.',
    'Arrived exhausted after a delayed flight and the team had clearly been briefed. A glass of warm milk and a plate of biscuits appeared without us asking. The bath was already run. I was asleep in twenty minutes and woke up feeling like a different person.',
    "Genuinely couldn't fault a single thing. Not the room, not the service, not the food, not the facilities. I've been trying to find something to criticise and I can't. That almost never happens.",
  ],
  4: [
    "Excellent hotel with only minor things stopping it from a perfect score. The room was stunning and the service attentive, but the noise from the bar downstairs meant I needed earplugs on Friday night. Still, I'd return without hesitation.",
    "Really impressive property. Loved the design, the spa was fantastic, and the breakfast was one of the best I've had anywhere. Dropped one star only because the pool was quite crowded on the weekend and reserving a sun bed at a reasonable hour proved difficult.",
    "Four very strong stars. The staff were warm and genuinely helpful throughout. The only minor disappointment was that our room looked onto a side street rather than the main view we'd been hoping for — partly our fault for not specifying at booking. Will definitely return and upgrade.",
    'Loved the experience overall. The bed was incredible and the bathroom had a deep soaking tub that I used every single morning. Restaurant was a bit slow at peak times but the food quality made up for it. Would recommend to anyone visiting.',
    'Great hotel with a slightly inconsistent service experience — our first night the concierge was exceptional, the second less engaged. The room itself was immaculate and the location unbeatable. Minor quibble in an otherwise lovely stay.',
    "Very good indeed. The spa facilities were excellent and I appreciated the quality of the toiletries. The gym was smaller than I expected for a property of this calibre, but the equipment was top-tier. One of the better business-trip hotels I've stayed in.",
    "Absolutely recommended. Beautiful building, lovely rooms, fantastic common areas. The afternoon tea was a highlight — easily the best version of it I've had anywhere. Service was warm if slightly stretched during a busy period.",
    'Four solid stars. Clean, elegant, well-located. The room category we booked was excellent value. The only area for improvement would be the check-in process, which took longer than expected for a hotel at this level. Everything else was seamless.',
    "Gorgeous hotel, genuinely impressive in person. The photos don't do the lobby justice. Dropped a star because the pillow menu was listed on the room card but when we requested something specific, it turned out they were out of that option. Small thing but not what you expect at this price point.",
    'Thoroughly enjoyable stay. The pool was warm and rarely overcrowded in the mornings. The complimentary fruit bowl in the room was refreshed daily and was always excellent quality — a small touch that I noticed. Would return.',
  ],
  3: [
    'Decent hotel with a beautiful setting. Service was polite and the location was hard to argue with. The room itself felt a little dated in places — the bathroom especially showed some wear. For the price, I expected slightly more consistency.',
    'Mixed experience overall. Some staff were brilliant and went out of their way to help; others seemed disinterested and took a while to respond to requests. The property itself is genuinely beautiful but the execution is uneven. Might return but would manage expectations.',
    "The hotel is trading somewhat on its reputation, I feel. The name and the lobby make enormous promises that the rooms don't quite deliver. Comfortable enough, and the breakfast was genuinely good, but for what I paid I expected a little more magic.",
    "Good in many ways, less good in others. The spa was a clear highlight — one of the better ones I've used anywhere. The restaurant, however, was a disappointment: slow, and the dish I ordered was noticeably inferior to what I'd had described to me. I'd come back for the spa but manage expectations on the food.",
    "Fine. Perfectly fine. The room was clean and reasonably spacious. The view was actually better than expected, which was a nice surprise. Service was cordial if not notably warm. I've stayed in better and I've stayed in worse. Would try again on a special offer.",
    'Honestly a little underwhelmed given the price and the hype. The photos online are clearly taken with very flattering lenses — the room was smaller and darker than expected. Staff were polite but somewhat robotic. The breakfast buffet, though, was genuinely impressive.',
  ],
  2: [
    "Disappointing for the price. I had genuinely high expectations based on the reviews I'd read, and the reality didn't measure up. The room had a musty smell that persisted throughout our stay despite our mentioning it. The view that was 'guaranteed' at booking was partially obstructed by construction equipment.",
    "Sadly not what I hoped. The concept and the location are fantastic but execution falls short. We waited 45 minutes for room service that never arrived; when I called to chase it, the staff seemed surprised we hadn't received it. The issue was eventually resolved but the experience soured the evening.",
  ],
};

// ── Per-hotel review sets ─────────────────────────────────────────────────────
// 8 reviews per hotel, mixing ratings naturally
const hotelReviews = {
  'Le Grand Ritz': [
    {
      rating: 5,
      comment:
        'The Ritz Paris is not a hotel — it is a philosophy. From the moment the doorman in his impeccable livery opened the car door, to the moment we reluctantly checked out four days later, every interaction was a masterclass in what service can be when an institution truly commits to it. Our room on the second floor looked over the private garden and I woke up each morning to birdsong in the middle of Paris. The Bar Hemingway alone is worth a separate trip.',
    },
    {
      rating: 5,
      comment:
        "I proposed to my partner in the Jardin Ritz at sunset. The hotel had arranged a private corner with roses and Champagne without being asked — I had simply mentioned at check-in that we were celebrating something special. That level of instinctive thoughtfulness is what separates this place from every other five-star in the world. We'll be back for every anniversary.",
    },
    {
      rating: 5,
      comment:
        'The spa is on another level entirely. I spent three hours there on our second day and emerged feeling like I had slept for a week. The hammam, the flotation pool, the treatment — each was perfect in its own right. Combined, they were extraordinary. The therapist was the most knowledgeable I have encountered anywhere.',
    },
    {
      rating: 4,
      comment:
        "Magnificent hotel with very few flaws. The Louis XVI room we occupied was breathtaking and the evening turndown service left the most thoughtful small gifts. My single gripe is that L'Espadon, while excellent, felt slightly formal even for a Michelin-starred restaurant — I'd have preferred a touch less ceremony. But this is a minor note on an otherwise five-star experience.",
    },
    {
      rating: 5,
      comment:
        'Stayed for three nights for a major work celebration. The concierge arranged a private tour of Versailles before opening hours, a table at a Michelin two-star that had been fully booked for months, and a vintage Citroën DS for a morning drive through the Marais. They did this in 24 hours. Unbelievable.',
    },
    {
      rating: 5,
      comment:
        'The Ritz Paris pastry team should be internationally celebrated. The breakfast pastry trolley alone would justify a separate hotel category. I had the most extraordinary millefeuille of my life sitting in my dressing gown on a Tuesday morning looking at the Place Vendôme. Peak human experience.',
    },
    {
      rating: 4,
      comment:
        'Second visit, just as impressive as the first. The hotel has clearly maintained its standards with rigour during the renovation years. The only slight surprise was that our suite was on a noisier floor than expected given the city location — ear plugs were provided without prompting, which was thoughtful.',
    },
    {
      rating: 5,
      comment:
        "We celebrated my parents' 40th wedding anniversary here and the hotel treated them like royalty from the moment of arrival. My mother is still talking about the way the maître d' in L'Espadon remembered her name from the previous evening and had her favourite wine open and breathing before she sat down.",
    },
  ],
  'Hôtel de Crillon': [
    {
      rating: 5,
      comment:
        'The Karl Lagerfeld-designed suite was unlike anything I have ever experienced in a hotel. The 18th-century boiseries, the contemporary art, the private terrace — it felt like inhabiting the personal apartment of someone with flawless taste. The bed faced the terrace and I lay awake for an hour simply looking at the lights of Paris reflected in the windows. Extraordinary.',
    },
    {
      rating: 5,
      comment:
        "I've stayed at most of the great Paris palaces and the Crillon post-renovation is the one that will bring me back most reliably. The blend of historical weight and contemporary design is perfectly calibrated. The Caudalíe spa in the basement is a revelation — the vineyard therapy facial left my skin looking ten years younger.",
    },
    {
      rating: 4,
      comment:
        "Brilliant hotel let down by a slightly perfunctory breakfast service on our first morning — items arrived slowly and one dish was cold. Brought to the attention of the maître d', who couldn't have been more apologetic and comped the entire breakfast, which was gracious. Everything else was exemplary.",
    },
    {
      rating: 5,
      comment:
        "Les Ambassadeurs is the finest hotel restaurant in Paris. I say this having eaten at all the competition. Chef Christopher Hache's sea bass with fennel and champagne beurre blanc was among the best individual dishes of my life. Combined with a Montrachet from the wine list and the company, it was a dinner I will discuss for years.",
    },
    {
      rating: 5,
      comment:
        "The location on the Place de la Concorde cannot be overstated. You are at the absolute centre of Paris's grandest axis. The Tuileries to the east, the Champs-Élysées to the west, the Seine to the south — it is an address that makes every walk feel like a history lesson. Add the Crillon's extraordinary service and you have something close to perfect.",
    },
    {
      rating: 4,
      comment:
        "Wonderful in almost every respect. The room was immaculate and the Caudalíe spa genuinely world-class. My only observation is that the bar area felt slightly congested on the weekend evening we visited — perhaps more seating would help manage the demand. But I'd return tomorrow if I could.",
    },
    {
      rating: 5,
      comment:
        "The concierge here deserves their own review. In 48 hours she arranged a private evening at the Musée d'Orsay, a table at Alain Passard's Arpège, and a bespoke perfume-making session at a Grasse maîtresse parfumeuse's Paris studio. All three were sold out or not publicly bookable. Magic.",
    },
    {
      rating: 5,
      comment:
        "Stayed here for the first time on my husband's 50th birthday. He is not easily impressed by hotels. He declared it the best hotel he had ever stayed in within four hours of arrival. By day two he was asking about long-term residence rates. That, I think, says everything.",
    },
  ],
  'The Savoy': [
    {
      rating: 5,
      comment:
        'The Savoy is the closest thing London has to a national treasure in hospitality. Walking through those brass doors on the Strand, you feel the weight of 135 years of extraordinary guests. Our River Suite had a view of the Thames that I would travel from any continent to see again. The American Bar is everything it is said to be and more.',
    },
    {
      rating: 5,
      comment:
        'Had tea in the Thames Foyer on a rainy November afternoon and it was one of the most civilised experiences of my life. The finger sandwiches, the scones with clotted cream, the extraordinary pastries — all exceptional. But more than the food, the atmosphere of warm elegance was simply irreplaceable. London at its best.',
    },
    {
      rating: 4,
      comment:
        "Classic Savoy experience with one small caveat: the lift situation during peak check-out on Sunday morning was chaotic and at odds with the hotel's level of service in every other respect. Once past that, the stay was a pleasure throughout. The Savoy Grill dinner was superb — the beef Wellington is legendary for a reason.",
    },
    {
      rating: 5,
      comment:
        "Went to the American Bar for cocktails and ended up closing the place. Colin the head bartender remembered exactly what my wife had ordered on our last visit three years ago, unprompted. When I mentioned this later to the general manager, he said 'that's just what we do.' The nonchalance of excellence.",
    },
    {
      rating: 5,
      comment:
        "The pool on the third floor is gorgeous and I had it almost entirely to myself on a Tuesday morning at 7am. Swam thirty lengths watching the grey London light gradually brighten through the skylight windows. One of the loveliest hours I've spent in any city anywhere.",
    },
    {
      rating: 4,
      comment:
        "Excellent hotel deserving of its reputation. The room was beautiful and the service attentive. Docking one star because the noise from the Strand can penetrate on street-level rooms — worth requesting a higher floor or courtyard-facing room when booking. Everything else was exactly as you'd hope.",
    },
    {
      rating: 5,
      comment:
        'My third stay and the hotel consistently maintains a standard that would justify the price even if it were 30% higher. The theatre concierge got us last-minute tickets to a sold-out National Theatre production on our second night. The Rolls-Royce fleet for city transfers is both absurd and completely wonderful.',
    },
    {
      rating: 5,
      comment:
        "The Savoy Grill is in a category of its own. The room itself — unchanged since the 1920s — transports you completely. I had the Dover sole prepared tableside and a 2015 Puligny-Montrachet and I genuinely didn't want the evening to end. Highly recommend requesting a window table overlooking the dining room.",
    },
  ],
  'The Langham London': [
    {
      rating: 5,
      comment:
        "Artesian at The Langham is still the best hotel bar in London, full stop. The cocktail programme under the new bar director is extraordinary — each drink is a complete sensory narrative. I came for drinks and stayed for four hours, which tells you everything. The hotel itself matched the bar's ambition at every turn.",
    },
    {
      rating: 5,
      comment:
        'The Roman pool in the ESPA Life spa is simply one of the great hotel facilities anywhere on earth. I spent an hour in the marble columns at 7am watching the light change through the ceiling lights and felt genuinely moved. The membership programme they offer London residents exists for good reason.',
    },
    {
      rating: 4,
      comment:
        "Lovely hotel with a genuine sense of history and an excellent location. The room was beautifully appointed and the service warm and responsive. My only note is that Roux at The Landau, while very good, perhaps doesn't quite justify its price relative to the off-hotel competition in the area. As a hotel restaurant, though, it's exceptional.",
    },
    {
      rating: 5,
      comment:
        'Stayed for a week during a work project and by day three the team knew my breakfast order, my preferred gym time, and had arranged my dry cleaning around my schedule without being asked. That level of attentive service when extended over a longer stay is genuinely life-changing for a work trip.',
    },
    {
      rating: 5,
      comment:
        "The Palm Court afternoon tea is a London institution for a reason. The scones arrive warm with extraordinary Devonshire cream, the pastry chef's seasonal creations change monthly, and the ambience of the glass-roofed room is exactly what Edwardian elegance should feel like. Book it for any occasion and it will not disappoint.",
    },
    {
      rating: 4,
      comment:
        "Genuinely excellent hotel. The rooms are among the best I've stayed in — the bed and the bathroom particularly stand out. One small frustration: valet parking on the evening of a large event was slow and I waited 20 minutes for my car. Understandable but worth knowing.",
    },
    {
      rating: 5,
      comment:
        'The Langham manages to feel both grand and genuinely welcoming simultaneously, which is a combination that most grand hotels get wrong in one direction or the other. The staff here seem to actually enjoy their work, which makes every interaction pleasurable rather than transactional.',
    },
    {
      rating: 5,
      comment:
        "I've been travelling to London for business four times a year for fifteen years and The Langham is where I stay. The consistency is what does it — I know exactly what I'm getting and it's always exactly right. The evening press of my suit, ready for the next morning without my asking, is the detail that keeps me loyal.",
    },
  ],
  'Marina Bay Sands': [
    {
      rating: 5,
      comment:
        'The SkyPark infinity pool at sunset is something every human being should experience at least once. I am not someone who is easily impressed by hotel swimming pools but standing at the northern edge of that pool with Singapore Bay spread below and the Supertrees in the garden beyond was genuinely affecting. We stayed in the hotel primarily to access the pool and it was completely worth it.',
    },
    {
      rating: 4,
      comment:
        'Enormous hotel that somehow maintains a reasonable service standard given its scale. The views from our room on the 42nd floor were extraordinary and the location for exploring Singapore is unbeatable — MRT, the Gardens, the financial district all on your doorstep. The restaurants are good if expensive. A must for first-time Singapore visitors.',
    },
    {
      rating: 5,
      comment:
        "Guy Savoy at the Marina Bay Sands is legitimately one of the best meals I've had anywhere in the world. The artichoke and black truffle soup in a Parmesan crust is the dish every food writer mentions and they're right to — it's a transcendent thing. Paired with service at the highest possible level in a room with that Singapore Bay view.",
    },
    {
      rating: 3,
      comment:
        "The hotel is impressive in scale and the pool is everything it's made out to be. However, the sheer size means queues for everything — lifts, restaurants, check-in. For leisure travel, fine. For a work trip where time matters, the logistics become frustrating. Good value at entry-level rates but the premium experience requires strategic planning.",
    },
    {
      rating: 5,
      comment:
        'Took my kids for a once-in-a-lifetime trip and they still talk about it a year later. The SkyPark pool, the laser show from our room window each night, the underwater tunnel in the aquarium — it was a genuinely magical three days. Worth every dollar for the family experience.',
    },
    {
      rating: 4,
      comment:
        'The Banyan Tree Spa on the 55th floor is outstanding. Had the Traditional Thai massage combined with the hot stone treatment and emerged two hours later feeling substantially less like a human being under stress. The views from the treatment room are extraordinary. Only knocked one star because booking availability was limited on my travel dates.',
    },
    {
      rating: 5,
      comment:
        'CÉ LA VI rooftop bar at sunset is everything. We were there on a clear evening when the light turned the bay golden and the city skyline started to illuminate itself, and I genuinely had to remind myself to stop staring and drink my cocktail. One of the great city-view experiences in Asia.',
    },
    {
      rating: 4,
      comment:
        "Very impressive property, particularly the architecture and the facilities. The rooms are comfortable and modern. My only concern was the room rate versus what comparable hotels offer — you're paying a significant premium for the brand and the SkyPark access, which is justified if the pool is your priority but less so if it isn't.",
    },
  ],
  'Raffles Singapore': [
    {
      rating: 5,
      comment:
        "The Singapore Sling at the Long Bar is not just a drink — it is a cultural pilgrimage. I am not a sentimental person but sitting in that bar, throwing peanut shells onto the floor as custom demands, with that extraordinary cocktail in my hand, I felt the weight of Singapore's history in a way that no museum had managed. The peanut shells are absurd and perfect.",
    },
    {
      rating: 5,
      comment:
        "Butler service here is the gold standard. Our butler Rahim had made contact before arrival to understand our preferences and by the time we checked in, the suite was already configured precisely as we would have arranged it ourselves. The welcome amenities reflected things we had mentioned in passing — a bottle of exactly the right Burgundy, a selection of my wife's favourite chocolates.",
    },
    {
      rating: 5,
      comment:
        'Raffles is the living embodiment of why Singapore matters. The restored building is extraordinary — the Personality Suites, each dedicated to a different famous guest, are the most historically resonant hotel rooms in Asia. We stayed in the Somerset Maugham suite and spent an evening reading his Singapore stories. Completely magical.',
    },
    {
      rating: 4,
      comment:
        "Superb hotel with one area for honest improvement: the Tiffin Room service was significantly slower than expected on our first evening, and the lamb dish we ordered was noticeably less accomplished than the rest of the meal. The setting more than compensates and everything else was excellent. I'd return without hesitation.",
    },
    {
      rating: 5,
      comment:
        'The Writers Bar is everything a hotel bar should be and absolutely never is. Dark wood, leather, portraits of brilliant people, and genuinely knowledgeable bartenders who recommend the right vintage Cognac without condescension. I spent three evenings there and each one improved on the last.',
    },
    {
      rating: 5,
      comment:
        'Two outdoor pools, a spa of genuine quality, butler service of the old-fashioned personal kind — and all this in a building that is itself a masterpiece of colonial Singapore architecture. Raffles delivers on every promise. The detail that most impressed me: the housekeeper who left a small handwritten note on Raffles Hotel stationery welcoming us back, three years after our first visit.',
    },
    {
      rating: 4,
      comment:
        "Wonderful hotel that justified the expense completely. The only small complaint is that the pool garden area is not quite as private as we'd hoped — it's visible from several of the surrounding suite balconies. Not a major concern but worth knowing if pool privacy matters.",
    },
    {
      rating: 5,
      comment:
        "Stayed here celebrating our 25th wedding anniversary and the hotel treated every moment of the stay as though it were a ceremony. From the champagne waiting in our room to the private guided tour of the hotel's history the following morning, every detail was considered. We were both moved to tears on arrival. Nothing else to say.",
    },
  ],
  'Burj Al Arab Jumeirah': [
    {
      rating: 5,
      comment:
        'I arrived by helicopter at the helipad landing pad and was escorted to a suite of such extraordinary opulence that I genuinely laughed aloud upon entering. The gold fixtures, the two-storey living room, the butler in white gloves who appeared silently whenever anything was needed — it is a completely maximalist experience that delivers exactly what it promises. Not subtle, not restrained, and completely wonderful.',
    },
    {
      rating: 5,
      comment:
        "Al Mahara — the underwater restaurant reached by simulated submarine — is the most theatrically extraordinary dining experience I've had anywhere on earth. The conceit could easily be gimmicky but the floor-to-ceiling aquarium walls are genuinely beautiful and the seafood is of exceptional quality. My lobster was flawless.",
    },
    {
      rating: 4,
      comment:
        'Everything at the Burj is superlative — the scale, the service, the views. I deducted one star only because the breakfast buffet, despite its extraordinary breadth and quality, was slightly chaotic in terms of organisation during peak hours. A small operational issue at a property that otherwise operates at a completely different level.',
    },
    {
      rating: 5,
      comment:
        'The private beach club experience with dedicated butler service is how all beach holidays should feel. A cold towel arrived without my asking every 20 minutes. My drink was refreshed before it was finished. A beach menu was explained to me by a chef who came down from the main building specifically. Dubai in June is extraordinary.',
    },
    {
      rating: 5,
      comment:
        "The Skyview Bar at 200 metres is the best cocktail view in the world. I have said this to several people and they've pushed back, but I maintain it. The bar itself is well-designed, the drinks are very good, and looking down at the island and the Gulf below with a perfect Negroni in your hand is an experience with no competition.",
    },
    {
      rating: 4,
      comment:
        "There is nowhere on earth quite like the Burj Al Arab and it delivered on its extraordinary reputation. My only observation is that the price premium is genuinely significant over other excellent Dubai hotels — it is justified by the uniqueness and the service, but you should go knowing you're paying for an experience more than an accommodation.",
    },
    {
      rating: 5,
      comment:
        "The Rolls-Royce airport transfer is the correct way to begin a stay here. From the moment the car arrived, the entire experience was choreographed. The Burj's approach is to make you feel like the most important person in the world for the duration of your stay, and they achieve it through relentless attention to detail.",
    },
    {
      rating: 5,
      comment:
        "My children's birthdays were noted at check-in. When we returned to the suite after dinner on my daughter's birthday, there was a small birthday cake with her name on it, a handwritten card from the hotel, and a small gift of a Burj Al Arab model in Swarovski crystal. She is ten and she will remember that for the rest of her life.",
    },
  ],
  'Royal Mansour Marrakech': [
    {
      rating: 5,
      comment:
        'The Royal Mansour is a city. It is not a hotel — it is a complete walled world with its own medina streets, its own gardens, its own universe of extraordinary Moroccan craftsmanship. I walked around the property for an hour before even entering my riad, simply to understand its architecture. Every centimetre of zellij tilework, every carved plaster panel, every hand-painted cedarwood ceiling is a masterpiece.',
    },
    {
      rating: 5,
      comment:
        "La Table du Mansour has three Michelin stars and earns every one of them. Yannick Alléno's interpretation of Moroccan cuisine through the lens of French classical technique is a genuinely original creative vision — the bastilla with pigeon, almonds, and saffron cream sauce was unlike anything I had tasted anywhere. The wine programme for a Moroccan hotel is extraordinary.",
    },
    {
      rating: 5,
      comment:
        'The riad is the correct unit of luxury accommodation. Your own entrance, your own courtyard garden with its citrus tree and tiled fountain, your own plunge pool on the rooftop, your own kitchen and butler. It is a private palace. I stayed for four nights and by the third day I had cancelled all my outside plans to simply remain within it.',
    },
    {
      rating: 4,
      comment:
        'Magnificent property with one honest observation: the scale is so large and the service team so numerous that on quiet mornings you occasionally feel more observed than attended to. A minor tone issue rather than a service failure. The hammam, the spa, and La Marocaine restaurant were all world-class.',
    },
    {
      rating: 5,
      comment:
        "The hammam ritual at the Royal Mansour Spa is the finest hammam experience I've had outside of Turkey. The attendants are skilled and the 16-metre plunge pool at the centre of the complex is a genuinely beautiful architectural space. I went twice in four days and could have gone daily.",
    },
    {
      rating: 5,
      comment:
        "Came for three nights and asked to extend to six. They accommodated us with the most gracious seamlessness — the room was simply continued, no additional paperwork, no move. The private cooking class in the hotel's Moroccan kitchen was the best food experience of our trip. The chef who taught us had learned from his mother, who had learned from the royal palace kitchens.",
    },
    {
      rating: 5,
      comment:
        'The garden at the Royal Mansour — thousands of roses, orange trees, jasmine climbers — is one of the most beautiful enclosed spaces I have walked through anywhere. The evening cocktail service in the garden, with the scent of jasmine and the distant sounds of the medina beyond the walls, is an experience I would return to Marrakech specifically to repeat.',
    },
    {
      rating: 4,
      comment:
        "Outstanding hotel experience. The only practical limitation is that the location within the medina, while part of the hotel's extraordinary character, makes car access complicated for those with mobility concerns. The hotel's private buggy service helps but this is worth noting for relevant guests.",
    },
  ],
  'Four Seasons Bali at Jimbaran Bay': [
    {
      rating: 5,
      comment:
        'Woke at 5am on our first morning and went to sit on the villa terrace to watch the sunrise over the bay. A staff member appeared silently ten minutes later with fresh-pressed juices and a selection of tropical fruit that had been cut that morning. No words were exchanged. It was the most perfect morning I can remember.',
    },
    {
      rating: 5,
      comment:
        'The Balinese Cooking Academy deserves its own trip. We spent a morning at the Jimbaran fish market at dawn, then cooked with a local grandmother in the hotel kitchen for four hours. The food we made was extraordinary, but more than that, it was a genuine cultural exchange. We left with recipes, with friendships, and with a far deeper understanding of Bali.',
    },
    {
      rating: 4,
      comment:
        "Beautiful resort, exceptional location, incredible service. I give four stars rather than five only because the beach access requires a fairly long walk from the upper villas, which on a hot day with luggage is a significant undertaking. The golf buggy service helps but isn't always immediately available. Everything else was flawless.",
    },
    {
      rating: 5,
      comment:
        'The Sakala Spa is the finest spa in Bali, and given that Bali is the world capital of the spa experience, that is saying a great deal. The Jamu herbal wrap followed by the traditional Balinese massage using warm sesame and ylang-ylang oil left me in a state of such profound relaxation that I fell asleep on the treatment table.',
    },
    {
      rating: 5,
      comment:
        'Four nights felt like four weeks in the most positive sense — time seemed to expand here. The villa garden, the private pool, the sounds of the gamelan music drifting across from the ceremony being performed in the hotel temple on our second morning — Bali at the Four Seasons is a genuinely transformative experience.',
    },
    {
      rating: 5,
      comment:
        'The staff-to-guest ratio here means that service anticipates needs rather than responding to them. The housekeeping team learned our schedule within two days and worked around it invisibly. Fresh flowers appeared in the villa each morning. The private plunge pool was temperature-adjusted to our stated preference without further prompting.',
    },
    {
      rating: 4,
      comment:
        "Exceptional resort with very high standards throughout. My only honest note is that the dining options within the resort, while very good, are limited in number — on a four-night stay we were ready for more variety by the end. The hotel's shuttle service to Jimbaran's excellent local restaurants compensates for this perfectly.",
    },
    {
      rating: 5,
      comment:
        'This is where I have chosen to spend my 50th birthday week and it was the right choice. The resort arranged a private dinner on the beach on my actual birthday — torchlit, with a gamelan quartet performing, and a menu I had co-designed with the chef two weeks in advance. The most memorable dinner of my life.',
    },
  ],
  'The Peninsula Tokyo': [
    {
      rating: 5,
      comment:
        "The Hana Suite at the Peninsula Tokyo has views of the Imperial Palace gardens that made me genuinely catch my breath on arrival. The combination of Japanese minimalist design executed with Western luxury standards, and then operated with the quiet precision of Japanese hospitality culture — it is an unbeatable combination. I've stayed in the finest hotels in Paris and London and this surpasses them.",
    },
    {
      rating: 5,
      comment:
        'Peter restaurant on the 24th floor is the finest Western fine dining in Tokyo. The city view is extraordinary and the kitchen executes at a level that would earn stars in any city. But what stays with me most is the sake programme in the Toyama Bar — 200 expressions, explained by a sommelier of exceptional knowledge. I spent two evenings there and barely scratched the surface.',
    },
    {
      rating: 5,
      comment:
        "The in-room technology here is from a different era of hotel design. The tablet that controls every element of the environment — lighting, temperature, curtains, do not disturb, bath-filling — is operated with zero learning curve and works perfectly. The soaking bath positioned to face the Imperial Palace is one of the great small luxuries of any hotel I've visited.",
    },
    {
      rating: 4,
      comment:
        "Superlative Peninsula experience in one of the world's great cities. Docked one star only because the restaurant booking process for Peter — even as a hotel guest — was opaque and required multiple calls before a table was confirmed. Once there, the experience was exceptional, but the process was at odds with the hotel's standards elsewhere.",
    },
    {
      rating: 5,
      comment:
        'The fleet of custom Peninsula Green Rolls-Royce Phantoms is both absurd and completely right for this hotel. Being collected from Narita in one of those cars starts the experience on exactly the right footing. Our driver spoke perfect English, had a selection of newspapers and still water waiting, and played the exact right music at exactly the right volume.',
    },
    {
      rating: 5,
      comment:
        'The spa on the lower ground floor is a complete world. The indoor pool, the hot spring bath, the Finnish sauna — each is designed with the rigorous attention to materiality that runs through the whole hotel. I had a 90-minute Peninsula signature treatment that incorporated Japanese Reiki techniques and emerged feeling fundamentally recalibrated.',
    },
    {
      rating: 5,
      comment:
        'The lobby afternoon tea at the Peninsula Tokyo is a institution that I would cross the Pacific to repeat. The Japanese interpretation of the afternoon tea tradition — incorporating matcha pastries alongside classic French-style petit fours — is brilliantly handled. The Champagne selection available to accompany it is extraordinary.',
    },
    {
      rating: 4,
      comment:
        "Outstanding hotel in every meaningful respect. The Peninsula lives up to its reputation and then some. Minor feedback: the gym is smaller than the room count would suggest and can be crowded at peak morning times. This didn't substantially affect our stay but worth noting for those who prioritise fitness.",
    },
  ],
  'Park Hyatt Tokyo': [
    {
      rating: 5,
      comment:
        'Woke at 4am on our first night with jet lag and from the 47th floor I watched Tokyo beginning its day: the earliest light over Mount Fuji on the western horizon, then the slow illumination of the Shinjuku forest of towers, then the city gradually assembling itself from silence into noise. I have never watched a sunrise in any city that affected me as much. That alone was worth the price of the room.',
    },
    {
      rating: 5,
      comment:
        "New York Bar on a Friday night with a live jazz quartet performing is one of the great unambiguous pleasures of civilised life. The cocktail programme is sophisticated, the food is very good, and the view at night — Tokyo spreading in every direction from 52 floors up — is incomparable. I drank four cocktails and wished I'd had six.",
    },
    {
      rating: 4,
      comment:
        'Beautiful, beautiful hotel. The Lost in Translation connection means it carries a certain mythology that the hotel handles elegantly — no tacky references, just a place that earns its own mythology through consistent excellence. My only note is that the rooms on the lower floors have a slightly less extraordinary view than the promotional material implies. Request a high floor explicitly.',
    },
    {
      rating: 5,
      comment:
        'The 47th floor swimming pool surrounded by Greek columns with one side of the space open to the Shinjuku skyline is the most beautiful pool space I have been in anywhere in the world. Swimming at 6am with Mount Fuji visible through the glass while Tokyo rushes about below is an experience of such profound beauty that I am tempted to sound ridiculous in describing it.',
    },
    {
      rating: 5,
      comment:
        'The Peak Lounge for breakfast is a genuinely extraordinary experience. The washi-paper lanterns, the silence, the quality of the Japanese breakfast set, the incomparable view — I cancelled a morning museum visit just to extend breakfast by two hours, and I would do it again without hesitation.',
    },
    {
      rating: 5,
      comment:
        'Three nights was not enough. The Park Hyatt Tokyo is the hotel that most effectively isolates you from the overwhelming scale of the city while simultaneously giving you the best possible view of it. The lobby area on the 41st floor, with its extraordinary double-height space and library feel, is a masterpiece of hotel design.',
    },
    {
      rating: 4,
      comment:
        "Genuinely excellent hotel with a slight caveat on value: the entry-level rooms here are smaller and less dramatic than the hotel's reputation might suggest, and the full experience requires upgrading to at least the Park Deluxe category. Once in the right room category, it's completely worth the premium.",
    },
    {
      rating: 5,
      comment:
        "Came back for my fifth visit and the hotel continues to improve with each stay. The new menus in New York Grill are the best they've been, and someone has refreshed the cocktail programme at New York Bar in the last year. The Japanese breakfast is still the finest I've had anywhere.",
    },
  ],
  'Taj Lake Palace': [
    {
      rating: 5,
      comment:
        'Arriving by boat across Lake Pichola at dusk, watching the white marble palace glow amber and gold against the darkening Rajasthani sky, with the City Palace rising above it on the far shore — I have never had a hotel arrival that moved me as much. I sat in the boat in complete silence and felt something shift. Udaipur and the Taj Lake Palace together are one of the great experiences on earth.',
    },
    {
      rating: 5,
      comment:
        "The Jiva Spa hammam is the most beautiful treatment space I've ever visited. The 18th-century marble chambers, the soft light through the original jali windows, the Ayurvedic oils and the sound of the lake beyond the walls — the treatment itself was superb but the setting was transcendent. I've been to Turkish hammams in Istanbul and this is in a different category.",
    },
    {
      rating: 5,
      comment:
        'Neel Kamal restaurant on the terrace facing the lake at night was a dinner I will never forget. The safed maas (white lamb curry) made with saffron and cream from a centuries-old palace recipe was the best thing I ate in India. Combined with a glass of Sula Dindori Reserve Shiraz and that view of the illuminated City Palace, it was a perfect evening.',
    },
    {
      rating: 4,
      comment:
        "Magical hotel with the world's most extraordinary setting. My one practical note is that the lake can be quite active with tourist boats during the day, which means the palace is less private than you might imagine from the photographs. It doesn't diminish the beauty but it's worth knowing. Evenings, by contrast, are enchanting.",
    },
    {
      rating: 5,
      comment:
        "The cultural programme at the Taj Lake Palace is exceptional. The evening Rajasthani folk music performance in the courtyard — with traditional instruments, dance, and the lake as backdrop — is one of the most atmospheric live performances I've attended. The musicians were clearly masters of their tradition and the intimacy of the setting made it feel like a private concert.",
    },
    {
      rating: 5,
      comment:
        'My room had a view directly onto the lake and the ghats of Udaipur, and in the early morning, watching the devotees perform their sunrise rituals at the ghats while boats moved silently across the water, I felt completely at peace in a way that is rare. Udaipur and this palace together are the reason to come to Rajasthan.',
    },
    {
      rating: 4,
      comment:
        'Extraordinary experience overall. The boat transfer from the city is a lovely touch and the welcome was genuinely warm. I give four rather than five only because the WiFi connectivity within the palace rooms was unreliable during my stay — understandable given the heritage building constraints, but worth noting for business travellers.',
    },
    {
      rating: 5,
      comment:
        'We celebrated our 30th wedding anniversary here. The hotel knew and had arranged a sunset boat ride on the private lake boat with rose petals in the water, champagne, and a tabla player in the stern. It was so perfect it verged on the cinematic. My husband described it as the best moment of our marriage. Hard to disagree.',
    },
  ],
  'Soneva Fushi': [
    {
      rating: 5,
      comment:
        "There is no definition of luxury that Soneva Fushi doesn't satisfy at the highest level. But more than luxury, there is a genuinely thoughtful way of living here — the SLOW philosophy isn't marketing language but an actual operating ethos. The barefoot box at the villa entrance, the glass studio, the observatory, the zero single-use plastic — every detail reflects a coherent vision of what a good life might look like.",
    },
    {
      rating: 5,
      comment:
        'The resident astronomer opened the observatory at 9pm and spent two hours walking us through the Maldivian night sky with patient, extraordinary knowledge. I have never felt so connected to the universe as I did lying on the observatory deck watching the Milky Way through a telescope while the Indian Ocean moved quietly below. Worth the trip alone.',
    },
    {
      rating: 5,
      comment:
        "The whale shark snorkelling excursion in the Baa Atoll — guided by the resort's own marine biologist — was the single greatest wildlife experience of my life. We spent 40 minutes in the water with three whale sharks of extraordinary size and they showed no fear of us whatsoever. The biologist's knowledge of individual sharks by marking was remarkable.",
    },
    {
      rating: 4,
      comment:
        "Genuinely extraordinary resort that delivers on its remarkable reputation. The only reason I don't give five stars is personal rather than a criticism of the hotel: the villa is so exceptional and the grounds so beautiful that I found it almost impossible to leave the property, which meant I saw very little of the Maldives beyond it. Possibly this is the point.",
    },
    {
      rating: 5,
      comment:
        "Fresh in the Garden — dining within the kitchen garden at sunset, eating food grown ten metres from your table, prepared by a chef who has just walked through those same rows — is the most direct connection between farm and table I've experienced. The flavours were extraordinary precisely because nothing had travelled at all. Revolutionary simplicity.",
    },
    {
      rating: 5,
      comment:
        'The glass studio is a genuinely wonderful facility. The master glassblower who has worked there for fifteen years gave us an afternoon lesson and we produced three imperfect but genuinely beautiful glasses that are now, legitimately, our most treasured domestic objects. The studio itself — recycling every glass bottle on the island — is a philosophical statement about luxury and responsibility.',
    },
    {
      rating: 5,
      comment:
        "The open-air bathroom in our villa was the most extraordinary private space I've encountered in travel. A walled garden open to the sky, a vast outdoor bathtub, a stone shower surrounded by tropical plants, a daybed for drying in the sun. I spent more time in that bathroom than anywhere else in the villa. A complete philosophy of privacy and nature.",
    },
    {
      rating: 4,
      comment:
        'Brilliant resort experience. The only logistical note is that the seaplane transfer from Malé, while spectacular in its own right, is weather-dependent and our return was delayed by several hours. The resort handled the delay beautifully with food, drinks, and activities, but budget flexibility in your travel schedule.',
    },
  ],
};

// ── Review generation helpers ─────────────────────────────────────────────────
function pickCommentForRating(rating) {
  const pool = reviewPool[rating] ?? [];
  if (!pool.length)
    return 'Great stay with attentive service and a comfortable room.';
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRatingForStars(stars) {
  // Weighted rating distribution: 5-star hotels get more 5s, 3-star hotels get more 3s.
  const r = Math.random();
  const weights =
    stars === 5
      ? [
          [5, 0.65],
          [4, 0.25],
          [3, 0.08],
          [2, 0.02],
        ]
      : stars === 4
        ? [
            [5, 0.35],
            [4, 0.4],
            [3, 0.2],
            [2, 0.05],
          ]
        : [
            [5, 0.15],
            [4, 0.35],
            [3, 0.35],
            [2, 0.15],
          ];

  let acc = 0;
  for (const [rating, w] of weights) {
    acc += w;
    if (r <= acc) return rating;
  }
  return 3;
}

function deterministicReviewTarget(hotelId, stars, min, max) {
  const span = max - min + 1;
  const x = Math.abs(Math.sin(hotelId * 17 + stars * 1013) * 10000) % 1;
  return min + Math.floor(x * span);
}

// ── Insert fake users ─────────────────────────────────────────────────────────
console.log('Creating admin users...');
// Admin password for seeded accounts:
// - from .env: ADMIN_SEED_PASSWORD
// - fallback (if env is missing): Admin123!Secure
const adminHashedPw = await bcryptjs.hash(
  process.env.ADMIN_SEED_PASSWORD ?? 'Admin123!Secure',
  10,
);
for (const admin of adminUsers) {
  try {
    await client.query(
      `INSERT INTO users (email, password, name, role)
       VALUES ($1, $2, $3, 'ADMIN')
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         role = 'ADMIN'`,
      [admin.email, adminHashedPw, admin.name],
    );
  } catch (err) {
    console.error(`Failed to insert admin ${admin.name}:`, err.message);
  }
}
console.log(`✓ ${adminUsers.length} admins ready`);

console.log('Creating fake users...');
// Password for all fake reviewer accounts: FakeReviewer!99
const hashedPw = await bcryptjs.hash('FakeReviewer!99', 10);
const userIds = [];

for (const u of fakeUsers) {
  try {
    const res = await client.query(
      `INSERT INTO users (email, password, name, role)
       VALUES ($1, $2, $3, 'USER')
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [u.email, hashedPw, u.name],
    );
    userIds.push(res.rows[0].id);
  } catch (err) {
    console.error(`Failed to insert user ${u.name}:`, err.message);
  }
}
console.log(`✓ ${userIds.length} users ready`);

const MIN_REVIEWS_PER_HOTEL = parseInt(
  process.env.MIN_REVIEWS_PER_HOTEL ?? '50',
  10,
);
const MAX_REVIEWS_PER_HOTEL = parseInt(
  process.env.MAX_REVIEWS_PER_HOTEL ?? '110',
  10,
);
if (
  Number.isNaN(MIN_REVIEWS_PER_HOTEL) ||
  Number.isNaN(MAX_REVIEWS_PER_HOTEL) ||
  MAX_REVIEWS_PER_HOTEL < MIN_REVIEWS_PER_HOTEL
) {
  throw new Error(
    `Invalid MIN/MAX review settings: MIN=${MIN_REVIEWS_PER_HOTEL}, MAX=${MAX_REVIEWS_PER_HOTEL}`,
  );
}

// ── Fetch all hotels ──────────────────────────────────────────────────────────
const hotelsRes = await client.query(
  'SELECT id, name, stars FROM hotels ORDER BY id',
);
const hotels = hotelsRes.rows;

const hotelIds = hotels.map((h) => h.id);
const reviewCountsRes =
  hotelIds.length > 0
    ? await client.query(
        `SELECT hotel_id, count(*)::int AS count
         FROM reviews
         WHERE hotel_id = ANY($1::int[])
         GROUP BY hotel_id`,
        [hotelIds],
      )
    : { rows: [] };
const reviewCountMap = new Map(
  reviewCountsRes.rows.map((r) => [r.hotel_id, r.count]),
);

// ── Insert reviews ────────────────────────────────────────────────────────────
console.log('Inserting reviews...');
let totalReviews = 0;

await client.query('BEGIN');
try {
  for (const hotel of hotels) {
    const existingCount = reviewCountMap.get(hotel.id) ?? 0;
    const targetCount = deterministicReviewTarget(
      hotel.id,
      hotel.stars,
      MIN_REVIEWS_PER_HOTEL,
      MAX_REVIEWS_PER_HOTEL,
    );
    const toInsert = Math.max(0, targetCount - existingCount);

    if (toInsert === 0) continue;

    const customReviews = hotelReviews[hotel.name] ?? [];

    // Shuffle userIds so different hotels get different reviewer sets
    const shuffled = [...userIds].sort(() => Math.random() - 0.5);

    let insertedForThisHotel = 0;
    const batchSize = 200;

    for (let start = 0; start < toInsert; start += batchSize) {
      const batch = [];
      const end = Math.min(toInsert, start + batchSize);

      for (let i = start; i < end; i++) {
        const globalIdx = existingCount + i;
        const userId = shuffled[globalIdx % shuffled.length];

        let rating;
        let comment;

        // If we have custom comments for a hotel, use them for the first N inserts.
        if (customReviews.length > 0 && globalIdx < customReviews.length) {
          rating = customReviews[globalIdx].rating;
          comment = customReviews[globalIdx].comment;
        } else {
          rating = pickRatingForStars(hotel.stars);
          comment = pickCommentForRating(rating);
        }

        // Skew towards recent dates so "latest 10" looks fresh.
        const daysAgo = Math.floor(Math.random() ** 2 * 540);
        const createdAt = new Date(
          Date.now() - daysAgo * 86_400_000 - (globalIdx % 120) * 1000,
        );

        batch.push([userId, hotel.id, rating, comment, createdAt]);
      }

      if (batch.length === 0) continue;

      const valuesSql = [];
      const params = [];
      batch.forEach((row, idx) => {
        const base = idx * 5;
        valuesSql.push(
          `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5})`,
        );
        params.push(row[0], row[1], row[2], row[3], row[4]);
      });

      await client.query(
        `INSERT INTO reviews (user_id, hotel_id, rating, comment, created_at)
         VALUES ${valuesSql.join(',')}`,
        params,
      );

      insertedForThisHotel += batch.length;
      totalReviews += batch.length;
    }

    // Update hotel rating to reflect real average
    await client.query(
      `UPDATE hotels
       SET rating = (
         SELECT ROUND(AVG(rating)::numeric, 1)
         FROM reviews
         WHERE hotel_id = $1
       )
       WHERE id = $1`,
      [hotel.id],
    );

    reviewCountMap.set(hotel.id, existingCount + insertedForThisHotel);
    console.log(
      `✓ ${hotel.name} — +${insertedForThisHotel} reviews (now ${existingCount + insertedForThisHotel})`,
    );
  }

  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
}

await client.end();
console.log(
  `\n Done! Inserted ${totalReviews} reviews across ${hotels.length} hotels.`,
);
