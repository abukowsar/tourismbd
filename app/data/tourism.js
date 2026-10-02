export const categories = [
  { id: "all", label: "All places" },
  { id: "heritage", label: "Heritage" },
  { id: "nature", label: "Nature & wildlife" },
  { id: "beach", label: "Beaches & islands" },
  { id: "hills", label: "Hills & adventure" },
  { id: "tea", label: "Tea country" },
  { id: "city", label: "City & food" },
];

export const destinations = [
  {
    id: "dhaka",
    name: "Dhaka",
    region: "Dhaka Division",
    categories: ["city", "heritage"],
    icon: "city",
    tone: "sunset",
    tagline: "A loud, colorful, generous capital",
    summary:
      "Old Dhaka lanes, Mughal forts, the pink Ahsan Manzil palace, Sadarghat river port, and some of the best biryani in South Asia.",
    highlights: ["Lalbagh Fort", "Ahsan Manzil", "Sadarghat boat ride", "Old Dhaka food walk", "Liberation War Museum"],
    bestTime: "Nov – Feb",
    days: 2,
    gateway: "Hazrat Shahjalal Intl. Airport (DAC)",
    tip: "Use the MRT Line 6 metro or ride-hailing apps to skip the worst traffic.",
  },
  {
    id: "sonargaon",
    name: "Sonargaon",
    region: "Narayanganj",
    categories: ["heritage"],
    icon: "landmark",
    tone: "clay",
    tagline: "The old capital of Bengal",
    summary:
      "Walk the abandoned merchant mansions of Panam Nagar and browse jamdani weaving and folk art — an easy day trip from Dhaka.",
    highlights: ["Panam Nagar", "Folk Art & Crafts Museum", "Jamdani weavers", "Goaldi Mosque"],
    bestTime: "Nov – Mar",
    days: 1,
    gateway: "About 1.5 hours by road from Dhaka",
    tip: "Leave Dhaka early in the morning to beat traffic and heat.",
  },
  {
    id: "sundarbans",
    name: "Sundarbans",
    region: "Khulna",
    categories: ["nature"],
    icon: "tree",
    tone: "forest",
    unesco: true,
    tagline: "The world's largest mangrove forest",
    summary:
      "Multi-day boat journeys through tidal creeks — home of the Royal Bengal tiger, spotted deer, saltwater crocodiles, and river dolphins.",
    highlights: ["Kotka & Kochikhali", "Karamjal wildlife center", "Canoe creeks at dawn", "Bird watching"],
    bestTime: "Nov – Feb",
    days: 3,
    gateway: "Khulna or Mongla (fly to Jashore, JSR)",
    tip: "Book a licensed tour operator — permits, forest guards, and boats are arranged for you.",
  },
  {
    id: "bagerhat",
    name: "Bagerhat Mosque City",
    region: "Khulna",
    categories: ["heritage"],
    icon: "mosque",
    tone: "clay",
    unesco: true,
    tagline: "15th-century terracotta mosques",
    summary:
      "The Sixty Dome Mosque (Shat Gombuj) and dozens of early Islamic monuments — pairs perfectly with a Sundarbans trip.",
    highlights: ["Sixty Dome Mosque", "Khan Jahan Ali Mazar", "Singair Mosque", "Bagerhat Museum"],
    bestTime: "Nov – Mar",
    days: 1,
    gateway: "About 1 hour from Khulna",
    tip: "Dress modestly and remove shoes before entering mosques.",
  },
  {
    id: "coxs-bazar",
    name: "Cox's Bazar",
    region: "Chattogram Division",
    categories: ["beach"],
    icon: "wave",
    tone: "ocean",
    tagline: "The world's longest natural sea beach",
    summary:
      "Around 120 km of unbroken sand. Drive the Marine Drive to Himchari and Inani, eat fresh seafood, and watch sunsets over the Bay of Bengal.",
    highlights: ["Laboni & Sugandha beach", "Marine Drive", "Himchari waterfall", "Inani rocky beach", "Ramu Buddhist temples"],
    bestTime: "Nov – Mar",
    days: 3,
    gateway: "Cox's Bazar Airport (CXB) or the Dhaka – Cox's Bazar train",
    tip: "Swim only in flagged zones near lifeguards — rip currents are strong.",
  },
  {
    id: "saint-martin",
    name: "Saint Martin's Island",
    region: "Cox's Bazar",
    categories: ["beach", "nature"],
    icon: "palm",
    tone: "ocean",
    tagline: "Bangladesh's only coral island",
    summary:
      "Turquoise water, coconut palms, and coral reefs at the southern tip of the country. Access is seasonal and protected.",
    highlights: ["Chera Dwip", "Coral shore walks", "Fresh coconut & seafood", "Starry night skies"],
    bestTime: "Nov – Jan",
    days: 2,
    gateway: "Ships from Cox's Bazar / Teknaf in season",
    tip: "Visitor numbers and overnight stays are restricted to protect the reef — check current rules before booking.",
  },
  {
    id: "sylhet",
    name: "Sylhet",
    region: "Sylhet Division",
    categories: ["nature", "tea"],
    icon: "leaf",
    tone: "forest",
    tagline: "Swamp forests and stone rivers",
    summary:
      "Row through the flooded Ratargul swamp forest, see the clear waters of Jaflong and Bholaganj, and visit the shrine of Hazrat Shah Jalal.",
    highlights: ["Ratargul swamp forest", "Jaflong", "Bholaganj Sada Pathor", "Malnicherra tea estate", "Shah Jalal Dargah"],
    bestTime: "Jun – Oct (water) · Nov – Feb (hills)",
    days: 3,
    gateway: "Osmani Intl. Airport (ZYL)",
    tip: "Ratargul is at its most magical in the monsoon when the forest stands in water.",
  },
  {
    id: "sreemangal",
    name: "Sreemangal",
    region: "Moulvibazar",
    categories: ["tea", "nature"],
    icon: "cup",
    tone: "forest",
    tagline: "The tea capital of Bangladesh",
    summary:
      "Rolling tea gardens, Lawachara rainforest with hoolock gibbons, pineapple farms, and the famous seven-layer tea.",
    highlights: ["Tea garden walks", "Lawachara National Park", "Seven-layer tea", "Madhabpur Lake"],
    bestTime: "Oct – Mar",
    days: 2,
    gateway: "About 4–5 hours by train from Dhaka",
    tip: "Hire a local guide for Lawachara to spot gibbons and langurs.",
  },
  {
    id: "tanguar-haor",
    name: "Tanguar Haor",
    region: "Sunamganj",
    categories: ["nature"],
    icon: "boat",
    tone: "river",
    tagline: "Houseboat life on a vast wetland",
    summary:
      "An inland sea in the monsoon with swamp trees, migratory birds, and views of the Meghalaya hills. Sleep on a traditional houseboat.",
    highlights: ["Houseboat overnight", "Watchtower", "Niladri Lake", "Barikka Tila sunset"],
    bestTime: "Jul – Oct (winter for birds)",
    days: 2,
    gateway: "Via Sunamganj, about 2 hours from Sylhet",
    tip: "Carry a power bank and cash — connectivity and ATMs are limited.",
  },
  {
    id: "bandarban",
    name: "Bandarban",
    region: "Chittagong Hill Tracts",
    categories: ["hills"],
    icon: "mountain",
    tone: "hill",
    tagline: "Clouds, trails, and hill communities",
    summary:
      "The highest hills in the country, waterfalls, and the cultures of the Marma, Bawm, and Mro peoples. Wake above the clouds at Nilgiri.",
    highlights: ["Nilgiri", "Nilachal", "Golden Temple", "Boga Lake", "Nafakhum waterfall"],
    bestTime: "Oct – Feb",
    days: 3,
    gateway: "About 2 hours by road from Chattogram",
    tip: "Some hill areas need prior permission for foreign visitors — your operator or guide can arrange it.",
  },
  {
    id: "rangamati",
    name: "Rangamati",
    region: "Chittagong Hill Tracts",
    categories: ["hills", "nature"],
    icon: "boat",
    tone: "river",
    tagline: "Lake country in the hills",
    summary:
      "Boat across the huge Kaptai Lake, cross the hanging bridge, and learn about Chakma culture and weaving.",
    highlights: ["Kaptai Lake boat trip", "Hanging bridge", "Shuvalong waterfall", "Rajban Vihara"],
    bestTime: "Oct – Mar",
    days: 2,
    gateway: "About 2.5 hours by road from Chattogram",
    tip: "Hire a covered engine boat for the day to explore the lake at your own pace.",
  },
  {
    id: "paharpur",
    name: "Paharpur",
    region: "Naogaon",
    categories: ["heritage"],
    icon: "landmark",
    tone: "clay",
    unesco: true,
    tagline: "A great 8th-century Buddhist monastery",
    summary:
      "The ruins of Somapura Mahavihara, once one of the largest monasteries south of the Himalayas. Combine with Mahasthangarh in Bogura.",
    highlights: ["Somapura Mahavihara", "Site museum", "Mahasthangarh", "Bogura mishti doi"],
    bestTime: "Nov – Feb",
    days: 1,
    gateway: "Via Bogura or Joypurhat, fly to Saidpur (SPD) or Rajshahi (RJH)",
    tip: "Visit in the late afternoon when the terracotta glows.",
  },
  {
    id: "kuakata",
    name: "Kuakata",
    region: "Patuakhali",
    categories: ["beach"],
    icon: "sun",
    tone: "sunset",
    tagline: "Watch sunrise and sunset from one beach",
    summary:
      "A quiet 18 km beach, fishing villages, Rakhine communities, and one of the few shores where you see both sunrise and sunset over the sea.",
    highlights: ["Sunrise at Gangamati", "Sunset beach", "Rakhine village", "Fatrar Char mangroves"],
    bestTime: "Nov – Feb",
    days: 2,
    gateway: "Road via the Padma Bridge, about 6–7 hours from Dhaka",
    tip: "Take the overnight launch from Dhaka to Barishal for a classic river journey.",
  },
];

export const interests = [
  { id: "heritage", label: "Heritage & history" },
  { id: "nature", label: "Nature & wildlife" },
  { id: "beach", label: "Beaches" },
  { id: "hills", label: "Hills & trekking" },
  { id: "tea", label: "Tea gardens" },
  { id: "city", label: "City & food" },
];

export const transfers = {
  "dhaka>sylhet": "45-minute flight or 7-hour scenic train",
  "dhaka>sreemangal": "4–5 hour train (Parabat or Upaban Express)",
  "dhaka>coxs-bazar": "1-hour flight or overnight train",
  "dhaka>sundarbans": "4–5 hours by road to Khulna over the Padma Bridge",
  "dhaka>bagerhat": "4–5 hours by road over the Padma Bridge",
  "dhaka>bandarban": "Fly to Chattogram, then 2 hours by road",
  "dhaka>rangamati": "Fly to Chattogram, then 2.5 hours by road",
  "dhaka>kuakata": "6–7 hours by road, or the overnight launch to Barishal",
  "dhaka>paharpur": "Fly to Saidpur or 5–6 hours by road",
  "dhaka>tanguar-haor": "Fly to Sylhet, then about 2 hours by road",
  "sylhet>sreemangal": "About 2 hours by road or train",
  "sreemangal>sylhet": "About 2 hours by road or train",
  "sylhet>tanguar-haor": "About 2 hours by road to Sunamganj, then by boat",
  "sundarbans>bagerhat": "About 1 hour by road",
  "bagerhat>sundarbans": "About 1 hour by road to Khulna or Mongla",
  "coxs-bazar>saint-martin": "Seasonal ship from Cox's Bazar or Teknaf",
  "coxs-bazar>bandarban": "About 3 hours by road",
  "bandarban>rangamati": "About 3–4 hours by road",
  "bandarban>coxs-bazar": "About 3 hours by road",
  "rangamati>bandarban": "About 3–4 hours by road",
};

export const seasons = [
  {
    id: "winter",
    name: "Winter",
    months: "November – February",
    temp: "12 – 26 °C",
    verdict: "Best time to visit",
    rating: 5,
    copy: "Dry, sunny, and comfortable. Peak season for the Sundarbans, beaches, Saint Martin's, hill treks, and winter pitha street food.",
  },
  {
    id: "spring",
    name: "Spring & summer",
    months: "March – May",
    temp: "28 – 36 °C",
    verdict: "Hot but festive",
    rating: 3,
    copy: "Hot and humid with occasional storms. Celebrate Pohela Boishakh, the Bengali New Year, on 14 April, and enjoy mango season.",
  },
  {
    id: "monsoon",
    name: "Monsoon",
    months: "June – October",
    temp: "26 – 32 °C",
    verdict: "Lush and dramatic",
    rating: 4,
    copy: "Rivers swell and everything turns green. Ideal for Ratargul, Tanguar Haor houseboats, and waterfalls. Expect rain and some route delays.",
  },
];

export const festivals = [
  { date: "21 Feb", name: "International Mother Language Day", note: "Dawn processions to the Shaheed Minar" },
  { date: "26 Mar", name: "Independence Day", note: "National celebrations across the country" },
  { date: "14 Apr", name: "Pohela Boishakh", note: "Bengali New Year — color, music, and street fairs" },
  { date: "Varies", name: "Eid ul-Fitr & Eid ul-Adha", note: "Major holidays — book transport early" },
  { date: "Sep – Oct", name: "Durga Puja", note: "Beautiful pandals, especially in Old Dhaka" },
  { date: "16 Dec", name: "Victory Day", note: "Parades, flags, and fireworks" },
];

export const essentials = [
  {
    icon: "passport",
    title: "Visa & entry",
    points: [
      "Visa on arrival is available for many nationalities for tourism — confirm with your nearest Bangladesh mission before flying.",
      "Carry a passport valid for 6+ months, a return ticket, and your hotel booking.",
      "Keep a digital and printed copy of your passport and visa.",
    ],
  },
  {
    icon: "sim",
    title: "SIM & internet",
    points: [
      "Buy a local SIM (Grameenphone, Robi, Banglalink) at the airport — bring your passport.",
      "4G data is cheap and works well in cities and most tourist areas.",
      "Download offline maps before visiting the Sundarbans, haors, or hills.",
    ],
  },
  {
    icon: "wallet",
    title: "Money",
    points: [
      "The currency is the Bangladeshi Taka (BDT, ৳).",
      "ATMs are common in cities; carry cash for rural areas and small shops.",
      "Cards work at upscale hotels, malls, and some restaurants.",
    ],
  },
  {
    icon: "bus",
    title: "Getting around",
    points: [
      "Domestic flights connect Dhaka with Chattogram, Sylhet, Cox's Bazar, Jashore, and more.",
      "Book trains online at the Bangladesh Railway e-ticket site; ride-hailing (Uber, Pathao) works in big cities.",
      "Agree on fares for CNG auto-rickshaws and rickshaws before you ride.",
    ],
  },
  {
    icon: "heart",
    title: "Culture & etiquette",
    points: [
      "Dress modestly — cover shoulders and knees, especially at religious sites.",
      "Use your right hand to eat, give, and receive.",
      "The weekend is Friday and Saturday. Ask before photographing people.",
    ],
  },
  {
    icon: "shield",
    title: "Health & safety",
    points: [
      "Drink bottled or filtered water, and use mosquito repellent.",
      "Plugs are type C, D, and G at 220V. Time zone is GMT+6.",
      "Keep valuables in hotel safes and travel with licensed guides in remote areas.",
    ],
  },
];

export const emergencyNumbers = [
  { number: "999", label: "National emergency", detail: "Police, fire service, and ambulance — free from any phone" },
  { number: "333", label: "Government info line", detail: "Public information and services" },
  { number: "16263", label: "Health helpline", detail: "Medical advice and hospital information" },
  { number: "109", label: "Women & child helpline", detail: "Support against violence and harassment" },
];

export const phrases = [
  { english: "Hello (Muslim greeting)", roman: "Assalamu alaikum", bangla: "আসসালামু আলাইকুম" },
  { english: "Hello (Hindu greeting)", roman: "Nomoshkar", bangla: "নমস্কার" },
  { english: "Thank you", roman: "Dhonnobad", bangla: "ধন্যবাদ" },
  { english: "How are you?", roman: "Kemon achen?", bangla: "কেমন আছেন?" },
  { english: "I am fine", roman: "Ami bhalo achi", bangla: "আমি ভালো আছি" },
  { english: "How much is it?", roman: "Koto taka?", bangla: "কত টাকা?" },
  { english: "Where is ...?", roman: "... kothay?", bangla: "... কোথায়?" },
  { english: "Water", roman: "Pani", bangla: "পানি" },
  { english: "Very tasty!", roman: "Khub moja!", bangla: "খুব মজা!" },
  { english: "I don't understand", roman: "Ami bujhi na", bangla: "আমি বুঝি না" },
  { english: "Yes / No", roman: "Ji / Na", bangla: "জি / না" },
  { english: "Help!", roman: "Bachao!", bangla: "বাঁচাও!" },
];

export const foods = [
  { name: "Kacchi biryani", where: "Old Dhaka", copy: "Slow-cooked mutton and fragrant rice sealed in a pot — a Dhaka icon." },
  { name: "Shorshe ilish", where: "Everywhere", copy: "Hilsa, the national fish, cooked in a sharp mustard sauce." },
  { name: "Bhorta platter", where: "Home kitchens", copy: "A dozen mashed dishes — eggplant, potato, dried fish, lentils — with rice." },
  { name: "Fuchka & chotpoti", where: "Street stalls", copy: "Crisp shells with tangy tamarind water; warm chickpea chaat." },
  { name: "Mezban beef", where: "Chattogram", copy: "Rich, spicy beef curry from traditional community feasts." },
  { name: "Mishti doi", where: "Bogura", copy: "Sweet caramelized yogurt set in clay pots." },
  { name: "Winter pitha", where: "Nov – Feb", copy: "Rice cakes with date-palm jaggery, steamed on street corners." },
  { name: "Seven-layer tea", where: "Sreemangal", copy: "A striped glass of tea, each layer a different flavor." },
];

export const faqs = [
  {
    q: "Is Bangladesh safe for international tourists?",
    a: "Most visits are trouble-free, and Bangladeshis are famously hospitable to guests. Use licensed guides in remote areas, avoid political gatherings, keep emergency numbers saved, and register your plan here so support can reach you quickly.",
  },
  {
    q: "When is the best time to visit?",
    a: "November to February is the most comfortable — dry and mild. The monsoon (June to October) is beautiful for wetlands and waterfalls, but expect rain and some delays.",
  },
  {
    q: "How many days do I need?",
    a: "Seven to ten days lets you combine Dhaka, the tea country or Sylhet, and either the Sundarbans or Cox's Bazar. Use the trip planner above to build a day-by-day plan.",
  },
  {
    q: "Do I need a guide?",
    a: "Not for cities, but a licensed guide or operator is required or strongly recommended for the Sundarbans, the Chittagong Hill Tracts, and haor houseboat trips.",
  },
  {
    q: "What should women travelers know?",
    a: "Dress modestly with loose clothing and carry a light scarf. Women-only queues and seats are common on transport. Call 109 or 999 for help at any time.",
  },
  {
    q: "What happens after I register?",
    a: "Your arrival city, first hotel, route, and emergency contact are saved to your visitor safety profile so the support team can coordinate guides, pickups, and help if you need it.",
  },
];

export const currencies = [
  { code: "USD", name: "US dollar", rate: 122 },
  { code: "EUR", name: "Euro", rate: 133 },
  { code: "GBP", name: "British pound", rate: 158 },
  { code: "INR", name: "Indian rupee", rate: 1.4 },
  { code: "AUD", name: "Australian dollar", rate: 80 },
  { code: "CAD", name: "Canadian dollar", rate: 88 },
  { code: "JPY", name: "Japanese yen", rate: 0.82 },
  { code: "CNY", name: "Chinese yuan", rate: 17 },
  { code: "SAR", name: "Saudi riyal", rate: 32.5 },
  { code: "AED", name: "UAE dirham", rate: 33.2 },
  { code: "MYR", name: "Malaysian ringgit", rate: 28 },
  { code: "SGD", name: "Singapore dollar", rate: 94 },
];

export const priceGuide = [
  { item: "Cup of street tea", bdt: 15 },
  { item: "Plate of kacchi biryani", bdt: 350 },
  { item: "Short rickshaw ride", bdt: 60 },
  { item: "Metro ride across Dhaka", bdt: 100 },
  { item: "Mid-range hotel per night", bdt: 6000 },
];

export const weatherCities = [
  { name: "Dhaka", lat: 23.81, lon: 90.41 },
  { name: "Cox's Bazar", lat: 21.43, lon: 92.01 },
  { name: "Sylhet", lat: 24.89, lon: 91.87 },
  { name: "Sreemangal", lat: 24.31, lon: 91.73 },
  { name: "Khulna", lat: 22.82, lon: 89.55 },
  { name: "Bandarban", lat: 22.2, lon: 92.22 },
];
