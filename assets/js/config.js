/* =====================================================================
   SITE CONFIG: the ONE file to edit for business details and rates.
   ---------------------------------------------------------------------
   - Rates, phone and WhatsApp update live on the site as soon as you
     save this file and push.
   - Page titles, JSON-LD, sitemap and OG tags are baked into the HTML.
     After changing name / phone / address / domain / destinations,
     run:  node tools/generate.mjs   (needs Node 18+, no npm install)
   Every value marked TODO is a placeholder. Replace it before you
   promote the site.
   ===================================================================== */
window.SITE_CONFIG = {
  business: {
    name: "Ghatline Travels",
    legalName: "Ghatline Travels",       // TODO: confirm registered name (for Terms/Privacy)
    tagline: "Tempo traveller & Force Urbania on rent in Bangalore",
    phone: "+910000000000",               // TODO: E.164 format, e.g. +919876543210
    phoneDisplay: "+91 00000 00000",      // TODO: how the number is shown on the site
    whatsapp: "910000000000",             // TODO: digits only, with country code, no +
    email: "hello@example.com",           // TODO: your email
    area: "Your Area",                    // TODO: e.g. "Marathahalli"
    street: "",                           // TODO: street address (optional, shown in schema if set)
    city: "Bengaluru",
    region: "Karnataka",
    postalCode: "560001",                 // TODO: your PIN code
    country: "IN",
    geo: { lat: 12.9716, lng: 77.5946 },  // TODO: your office lat/lng (Google Maps → right-click → copy)
    openingHours: "Mo-Su 06:00-22:00",    // TODO: your hours
    openingHoursText: "Every day, 6 am to 10 pm",
    founded: "",                          // TODO: e.g. "2015" (leave empty to hide)
  },

  // Live site address, no trailing slash. Change to "https://yourdomain.in"
  // once your custom domain is set up, then re-run the generator.
  siteUrl: "http://rahulsah.net/tempo-traveller-bangalore", // TODO: switch to https once HTTPS is enforced, or to your business domain

  social: {
    instagram: "",        // TODO: full URL, e.g. https://instagram.com/yourhandle
    instagramHandle: "",  // TODO: e.g. yourhandle (without @)
    facebook: "",         // TODO: full URL
    youtube: "",          // TODO: full URL (optional)
    googleBusiness: "",   // TODO: Google Business Profile / Maps URL
  },

  /* ---------------- Rates (used by the fare estimator) ----------------
     TODO: these are SAMPLE numbers so the estimator can be tested.
     While ratesAreSample is true, the site shows a "sample rates" note.
     Set your real rates, then set ratesAreSample: false.            */
  ratesAreSample: true,
  pricing: {
    minKmPerDay: 300,    // TODO: minimum billable km per day
    driverBata: 500,     // TODO: ₹ per day
  },

  fleet: [
    {
      id: "force-urbania",
      slug: "force-urbania-on-rent-bangalore",
      name: "Force Urbania",
      short: "Urbania",
      tier: "Premium",
      seats: [10, 13, 17],
      ratePerKm: { 10: 30, 13: 32, 17: 36 }, // TODO: ₹/km per seat option
      features: ["Pushback reclining seats", "Roof AC with individual vents", "Wide aisle and high roof", "USB charging points", "Large rear luggage space", "Music system"],
      idealFor: "Families, corporate offsites and groups who want a smoother, quieter ride on long highway runs.",
      image: "urbania",
    },
    {
      id: "force-traveller",
      slug: "tempo-traveller-on-rent-bangalore",
      name: "Force Traveller (Tempo Traveller)",
      short: "Tempo Traveller",
      tier: "Classic",
      seats: [12, 13, 17, 20, 26],
      ratePerKm: { 12: 22, 13: 23, 17: 25, 20: 28, 26: 32 }, // TODO: ₹/km per seat option
      features: ["AC with roof vents", "Pushback seats (most variants)", "Roof carrier for luggage", "Music system", "First-aid kit", "Experienced ghat-road drivers"],
      idealFor: "Pilgrimages, friends' trips, school and college tours, weddings and any group that wants the best value per seat.",
      image: "traveller",
    },
    {
      // TODO: set enabled: false if you do not offer luxury 1x1 seating
      enabled: true,
      id: "maharaja",
      slug: "luxury-maharaja-tempo-traveller-bangalore",
      name: "Luxury Maharaja Tempo Traveller (1x1)",
      short: "Maharaja 1x1",
      tier: "Luxury",
      seats: [9, 12],
      ratePerKm: { 9: 38, 12: 40 }, // TODO: ₹/km per seat option
      features: ["1x1 captain seats with wide aisle", "Extra legroom and recline", "LED mood lighting", "LCD screen and music system", "Curtains and charging points", "Premium upholstery"],
      idealFor: "Senior citizens, VIP guests, wedding parties and long trips where comfort comes first.",
      image: "maharaja",
    },
  ],

  /* ---------------- Destinations ----------------
     Distances and times are APPROXIMATE road figures from central
     Bangalore (one way). They vary by route, traffic and pickup point.
     km = one-way distance used by the fare estimator.                */
  destinations: [
    { id: "goa", name: "Goa", slug: "bangalore-to-goa-tempo-traveller", km: 560, time: "10–11 hrs", trip: "3N/4D", season: "November to February", vehicle: "12–26 seater", region: "Coastal Goa",
      places: ["Baga, Calangute and Anjuna beaches (North Goa)", "Fort Aguada and Chapora Fort", "Old Goa churches, including Basilica of Bom Jesus", "Palolem and Colva beaches (South Goa)", "Dudhsagar Falls (seasonal, by jeep from Kulem)", "Panaji's Fontainhas Latin quarter"],
      route: "Via Tumakuru, Chitradurga, Hubballi and Dharwad (NH48), then down to the coast. Many groups break the drive at Hubballi or Dandeli.",
      note: "Goa needs an inter-state permit for tourist vehicles; permit and toll charges are extra.",
      map: [0.24, 0.12] },
    { id: "hampi", name: "Hampi", slug: "bangalore-to-hampi-tempo-traveller", km: 340, time: "6–7 hrs", trip: "2N/3D", season: "October to February", vehicle: "12–20 seater", region: "North Karnataka",
      places: ["Virupaksha Temple", "Vittala Temple and the Stone Chariot", "Hemakuta and Matanga Hill sunsets", "Lotus Mahal and Elephant Stables", "Coracle ride on the Tungabhadra", "Anegundi and the Tungabhadra Dam"],
      route: "Via Tumakuru and Chitradurga on NH48, then towards Hosapete. Excellent highway most of the way.",
      note: "Summer afternoons (March–May) are very hot; plan sightseeing early morning and evening.",
      map: [0.42, 0.24] },
    { id: "north-karnataka", name: "North Karnataka", sub: "Badami, Aihole, Pattadakal, Bijapur", slug: "bangalore-to-north-karnataka-tempo-traveller", km: 450, time: "8–9 hrs to Badami", trip: "3N/4D", season: "October to February", vehicle: "12–26 seater", region: "North Karnataka",
      places: ["Badami cave temples and Agastya Lake", "Aihole, the cradle of temple architecture", "Pattadakal group of monuments (UNESCO)", "Gol Gumbaz, Vijayapura (Bijapur)", "Ibrahim Rauza and Bara Kaman", "Almatti Dam and gardens"],
      route: "Via NH48 to Hubballi or Hosapete, then north to Badami. Vijayapura is about 520 km and 9–10 hrs from Bangalore.",
      note: "Combine with Hampi for a 5N/6D heritage circuit.",
      map: [0.36, 0.08] },
    { id: "udupi", name: "Udupi", slug: "bangalore-to-udupi-tempo-traveller", km: 400, time: "8 hrs", trip: "2N/3D", season: "October to March", vehicle: "12–20 seater", region: "Coastal Karnataka",
      places: ["Sri Krishna Matha", "Malpe Beach", "St. Mary's Island (by boat, seasonal)", "Kaup Beach and lighthouse", "Manipal End Point", "Kollur Mookambika (about 80 km)"],
      route: "Via Hassan and the Shiradi or Charmadi ghat to the coast. Ghat sections can be slow during the monsoon.",
      note: "St. Mary's Island boats usually do not run during the monsoon (June–September).",
      map: [0.2, 0.48] },
    { id: "mangalore", name: "Mangalore", slug: "bangalore-to-mangalore-tempo-traveller", km: 350, time: "7 hrs", trip: "2N/3D", season: "October to March", vehicle: "12–26 seater", region: "Coastal Karnataka",
      places: ["Panambur and Tannirbhavi beaches", "Kadri Manjunatha Temple", "Mangaladevi Temple", "Sultan Battery", "St. Aloysius Chapel", "Someshwara Beach"],
      route: "Via Kunigal, Hassan and the Shiradi ghat (NH75). Check current ghat road status in the monsoon.",
      note: "Easily combined with Udupi and the South Canara temples.",
      map: [0.24, 0.58] },
    { id: "south-canara", name: "South Canara", sub: "Dharmasthala, Kukke, Murudeshwar, Gokarna", slug: "bangalore-to-dharmasthala-kukke-tempo-traveller", km: 300, time: "6–7 hrs to Dharmasthala", trip: "3N/4D", season: "October to March", vehicle: "12–26 seater", region: "Coastal Karnataka",
      places: ["Sri Manjunatha Temple, Dharmasthala", "Kukke Subramanya Temple", "Murudeshwar Temple and Shiva statue", "Gokarna's Om and Kudle beaches", "Mahabaleshwar Temple, Gokarna", "Kollur Mookambika en route"],
      route: "Via Hassan to Dharmasthala and Kukke (about 280–300 km), then north along the coast to Murudeshwar and Gokarna (about 480 km from Bangalore).",
      note: "Temples have dress codes and darshan timings; we plan the day around them.",
      map: [0.28, 0.66] },
    { id: "kerala", name: "Kerala", sub: "Munnar, Alleppey, Kochi, Wayanad", slug: "bangalore-to-kerala-tempo-traveller", km: 470, time: "9–10 hrs to Munnar", trip: "4N/5D", season: "September to March", vehicle: "12–26 seater", region: "Kerala",
      places: ["Munnar tea gardens and Eravikulam National Park", "Alleppey houseboats on the backwaters", "Fort Kochi and the Chinese fishing nets", "Wayanad: Edakkal Caves and Banasura Sagar", "Athirappilly Falls", "Marari or Kovalam beach"],
      route: "Wayanad is about 280 km (6 hrs) via Mysuru. Munnar, Kochi and Alleppey are 470–560 km via Salem and Coimbatore.",
      note: "Kerala needs an inter-state permit; permit, toll and parking charges are extra.",
      map: [0.5, 0.92] },
    { id: "coorg", name: "Coorg", slug: "bangalore-to-coorg-tempo-traveller", km: 250, time: "5–6 hrs", trip: "2N/3D", season: "October to March", vehicle: "10–26 seater", region: "Western Ghats",
      places: ["Abbey Falls", "Raja's Seat, Madikeri", "Dubare Elephant Camp", "Namdroling Golden Temple, Bylakuppe", "Talacauvery and Bhagamandala", "Mandalpatti viewpoint (by jeep)"],
      route: "Via the Bengaluru–Mysuru Expressway and Hunsur, or via Srirangapatna and Kushalnagar.",
      note: "One of our most-booked weekend runs; book early for long weekends.",
      map: [0.38, 0.66] },
    { id: "chikmagalur", name: "Chikmagalur", slug: "bangalore-to-chikmagalur-tempo-traveller", km: 245, time: "5 hrs", trip: "2N/3D", season: "September to March", vehicle: "10–20 seater", region: "Western Ghats",
      places: ["Mullayanagiri, Karnataka's highest peak", "Baba Budangiri", "Hebbe and Jhari falls (by jeep)", "Kudremukh National Park", "Belur and Halebidu temples en route", "Coffee estate stays"],
      route: "Via Kunigal and Hassan (NH75), with an optional stop at Belur and Halebidu.",
      note: "Mullayanagiri road is narrow; vehicle restrictions sometimes apply on peak days.",
      map: [0.32, 0.46] },
    { id: "mysore", name: "Mysore", slug: "bangalore-to-mysore-tempo-traveller", km: 145, time: "3 hrs", trip: "1N/2D or day trip", season: "October to February (Dasara in Sept/Oct)", vehicle: "10–26 seater", region: "Mysuru",
      places: ["Mysore Palace (lit up on Sunday evenings)", "Chamundi Hills", "Brindavan Gardens, KRS Dam", "Srirangapatna", "Ranganathittu Bird Sanctuary", "St. Philomena's Church"],
      route: "Via the Bengaluru–Mysuru Expressway (toll). Easy to extend to Coorg or Ooty.",
      note: "Dasara week sees heavy crowds; book well in advance.",
      map: [0.5, 0.7] },
    { id: "ooty", name: "Ooty", slug: "bangalore-to-ooty-tempo-traveller", km: 270, time: "6–7 hrs", trip: "2N/3D", season: "March to June, October to November", vehicle: "10–20 seater", region: "Nilgiris",
      places: ["Government Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Nilgiri Mountain Railway (toy train)", "Pykara Falls and Lake", "Coonoor: Sim's Park and Dolphin's Nose"],
      route: "Via Mysuru, Bandipur and Mudumalai. The forest stretch is closed to traffic at night (roughly 9 pm to 6 am).",
      note: "The Nilgiris currently require an e-pass for visiting vehicles; check the latest rules before travel.",
      map: [0.5, 0.84] },
    { id: "kodaikanal", name: "Kodaikanal", slug: "bangalore-to-kodaikanal-tempo-traveller", km: 465, time: "9 hrs", trip: "2N/3D", season: "April to June, September to October", vehicle: "10–20 seater", region: "Tamil Nadu hills",
      places: ["Kodaikanal Lake", "Coaker's Walk", "Pillar Rocks", "Guna Caves (Devil's Kitchen)", "Bryant Park", "Berijam Lake (forest permit)"],
      route: "Via Hosur, Krishnagiri, Salem and Dindigul, then up the Kodai ghat road.",
      note: "Tamil Nadu permit and Kodaikanal e-pass rules apply; we check them for you before departure.",
      map: [0.68, 0.9] },
    { id: "sakleshpur", name: "Sakleshpur", slug: "bangalore-to-sakleshpur-tempo-traveller", km: 220, time: "4.5 hrs", trip: "1N/2D", season: "July to March", vehicle: "10–20 seater", region: "Western Ghats",
      places: ["Manjarabad Fort", "Bisle Ghat viewpoint", "Hemavathi reservoir", "Coffee and cardamom estates", "Agni Gudda hill", "Shettihalli Rosary Church (seasonal)"],
      route: "Via Kunigal and Hassan on NH75. One of the easiest Western Ghats weekend drives.",
      note: "Best green and misty in the monsoon; roads can be slippery, so we plan buffer time.",
      map: [0.3, 0.54] },
    { id: "dandeli", name: "Dandeli", slug: "bangalore-to-dandeli-tempo-traveller", km: 470, time: "8–9 hrs", trip: "2N/3D", season: "October to May", vehicle: "12–26 seater", region: "Uttara Kannada",
      places: ["White-water rafting on the Kali river (seasonal)", "Syntheri Rocks", "Kavala Caves", "Supa Dam viewpoint", "Jungle stays and kayaking", "Ulavi Channabasaveshwara Temple"],
      route: "Via NH48 to Hubballi and Dharwad, then west to Dandeli through forest roads.",
      note: "Rafting runs are subject to river and forest department rules each season.",
      map: [0.3, 0.2] },
    { id: "jog-falls", name: "Jog Falls", slug: "bangalore-to-jog-falls-tempo-traveller", km: 400, time: "7–8 hrs", trip: "2N/3D", season: "August to December", vehicle: "12–20 seater", region: "Shivamogga",
      places: ["Jog Falls viewpoints", "Linganamakki Dam", "Honnemaradu backwaters", "Sigandur Chowdeshwari Temple", "Keladi and Ikkeri temples", "Combine with Murudeshwar and Gokarna"],
      route: "Via Tumakuru, Shivamogga and Sagara.",
      note: "The falls are at their fullest just after the monsoon; in summer the flow is thin.",
      map: [0.26, 0.32] },
    { id: "pondicherry", name: "Pondicherry", slug: "bangalore-to-pondicherry-tempo-traveller", km: 310, time: "6 hrs", trip: "2N/3D", season: "October to March", vehicle: "10–26 seater", region: "Puducherry",
      places: ["French Quarter (White Town)", "Promenade Beach", "Auroville and the Matrimandir viewing point", "Paradise Beach (by boat from Chunnambar)", "Serenity Beach", "Sri Aurobindo Ashram"],
      route: "Via Hosur, Krishnagiri and Tiruvannamalai, or via Vellore.",
      note: "Puducherry and Tamil Nadu permits are extra; Tiruvannamalai is a popular stop on the way.",
      map: [0.86, 0.72] },
    { id: "tirupati", name: "Tirupati", slug: "bangalore-to-tirupati-tempo-traveller", km: 250, time: "5–6 hrs", trip: "1N/2D", season: "All year (September to February is most pleasant)", vehicle: "10–26 seater", region: "Andhra Pradesh",
      places: ["Sri Venkateswara Temple, Tirumala", "Sri Padmavathi Ammavari Temple, Tiruchanur", "Srikalahasti Temple", "Kapila Theertham", "Talakona Falls", "Silathoranam and Srivari Padalu"],
      route: "Via Kolar, Mulbagal and Chittoor, then up the Tirumala ghat road.",
      note: "Book darshan tickets on the official TTD site in advance; Andhra Pradesh permit is extra.",
      map: [0.8, 0.44] },
  ],
};
