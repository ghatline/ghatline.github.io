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
    phone: "+919831013410",
    phoneDisplay: "+91 98310 13410",
    whatsapp: "919831013410",            // WhatsApp: digits only, with country code
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
  siteUrl: "https://ghatline.github.io", // change to "https://ghatline.in" if you buy that domain

  // Search engine verification. Paste ONLY the content="..." value from each tool, then re-run the generator.
  seo: {
    googleSiteVerification: "", // TODO: Google Search Console > Add property > HTML tag
    bingSiteVerification: "",   // TODO: Bing Webmaster Tools > Add site > HTML meta tag
    indexNowKey: "7f76e0ef25389ffd9d524731d81825b8",          // used to ping Bing/Yandex when pages change (tools/indexnow.mjs)
  },

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
      // Illustration (tools/urbania-illustration.svg). TODO: replace with a photo of your own Urbania, then delete this line.
      illustration: true,
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
      // Representative photo (not our vehicle). TODO: replace with a photo of your own Traveller, then delete this "photo" block.
      photo: { by: "Yann Forget", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", source: "https://commons.wikimedia.org/wiki/File:Force_Traveller,_Leh-Manali_Highway.jpg", changes: "cropped, number plate and operator text blurred" },
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
      // Representative photo of a Force Traveller Luxury (not our vehicle, not a 1x1 interior). TODO: replace with your own photo, then delete this "photo" block.
      photo: { by: "वंपायर (edited by Mr.choppers)", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/", source: "https://commons.wikimedia.org/wiki/File:Force_Traveller_Luxury.jpg", changes: "cropped, number plate and windscreen text blurred" },
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
      note: "Goa needs an inter-state permit for tourist vehicles; permit and toll charges are extra." },
    { id: "hampi", name: "Hampi", slug: "bangalore-to-hampi-tempo-traveller", km: 340, time: "6–7 hrs", trip: "2N/3D", season: "October to February", vehicle: "12–20 seater", region: "North Karnataka",
      places: ["Virupaksha Temple", "Vittala Temple and the Stone Chariot", "Hemakuta and Matanga Hill sunsets", "Lotus Mahal and Elephant Stables", "Coracle ride on the Tungabhadra", "Anegundi and the Tungabhadra Dam"],
      route: "Via Tumakuru and Chitradurga on NH48, then towards Hosapete. Excellent highway most of the way.",
      note: "Summer afternoons (March–May) are very hot; plan sightseeing early morning and evening." },
    { id: "north-karnataka", name: "North Karnataka", sub: "Badami, Aihole, Pattadakal, Bijapur", slug: "bangalore-to-north-karnataka-tempo-traveller", km: 450, time: "8–9 hrs to Badami", trip: "3N/4D", season: "October to February", vehicle: "12–26 seater", region: "North Karnataka",
      places: ["Badami cave temples and Agastya Lake", "Aihole, the cradle of temple architecture", "Pattadakal group of monuments (UNESCO)", "Gol Gumbaz, Vijayapura (Bijapur)", "Ibrahim Rauza and Bara Kaman", "Almatti Dam and gardens"],
      route: "Via NH48 to Hubballi or Hosapete, then north to Badami. Vijayapura is about 520 km and 9–10 hrs from Bangalore.",
      note: "Combine with Hampi for a 5N/6D heritage circuit." },
    { id: "udupi", kind: "pilgrimage", state: "Karnataka", name: "Udupi", slug: "bangalore-to-udupi-tempo-traveller", km: 400, time: "8 hrs", trip: "2N/3D", season: "October to March", vehicle: "12–20 seater", region: "Coastal Karnataka",
      places: ["Sri Krishna Matha", "Malpe Beach", "St. Mary's Island (by boat, seasonal)", "Kaup Beach and lighthouse", "Manipal End Point", "Kollur Mookambika (about 80 km)"],
      route: "Via Hassan and the Shiradi or Charmadi ghat to the coast. Ghat sections can be slow during the monsoon.",
      note: "St. Mary's Island boats usually do not run during the monsoon (June–September)." },
    { id: "mangalore", name: "Mangalore", slug: "bangalore-to-mangalore-tempo-traveller", km: 350, time: "7 hrs", trip: "2N/3D", season: "October to March", vehicle: "12–26 seater", region: "Coastal Karnataka",
      places: ["Panambur and Tannirbhavi beaches", "Kadri Manjunatha Temple", "Mangaladevi Temple", "Sultan Battery", "St. Aloysius Chapel", "Someshwara Beach"],
      route: "Via Kunigal, Hassan and the Shiradi ghat (NH75). Check current ghat road status in the monsoon.",
      note: "Easily combined with Udupi and the South Canara temples." },
    { id: "south-canara", kind: "pilgrimage", state: "Karnataka", name: "Coastal Temple Circuit", sub: "Udupi, Kollur, Murudeshwar, Gokarna", slug: "bangalore-to-coastal-karnataka-temple-tour-tempo-traveller", km: 480, time: "8–9 hrs to Murudeshwar", trip: "4N/5D", season: "October to March", vehicle: "12–26 seater", region: "Coastal Karnataka",
      places: ["Sri Krishna Matha, Udupi", "Sri Mookambika Temple, Kollur", "Murudeshwar Temple and the giant Shiva statue", "Mahabaleshwar Temple, Gokarna", "Om and Kudle beaches, Gokarna", "Maravanthe beach drive between Kollur and Udupi"],
      route: "Out via Shivamogga to Gokarna or Kollur, then down the coast via Murudeshwar and Udupi, and home via Mangaluru and the Shiradi ghat (or the reverse).",
      note: "Temples have dress codes and darshan timings; we plan each day around them." },
    { id: "kerala", name: "Kerala", sub: "Munnar, Alleppey, Kochi, Wayanad", slug: "bangalore-to-kerala-tempo-traveller", km: 470, time: "9–10 hrs to Munnar", trip: "4N/5D", season: "September to March", vehicle: "12–26 seater", region: "Kerala",
      places: ["Munnar tea gardens and Eravikulam National Park", "Alleppey houseboats on the backwaters", "Fort Kochi and the Chinese fishing nets", "Wayanad: Edakkal Caves and Banasura Sagar", "Athirappilly Falls", "Marari or Kovalam beach"],
      route: "Wayanad is about 280 km (6 hrs) via Mysuru. Munnar, Kochi and Alleppey are 470–560 km via Salem and Coimbatore.",
      note: "Kerala needs an inter-state permit; permit, toll and parking charges are extra." },
    { id: "coorg", name: "Coorg", slug: "bangalore-to-coorg-tempo-traveller", km: 250, time: "5–6 hrs", trip: "2N/3D", season: "October to March", vehicle: "10–26 seater", region: "Western Ghats",
      places: ["Abbey Falls", "Raja's Seat, Madikeri", "Dubare Elephant Camp", "Namdroling Golden Temple, Bylakuppe", "Talacauvery and Bhagamandala", "Mandalpatti viewpoint (by jeep)"],
      route: "Via the Bengaluru–Mysuru Expressway and Hunsur, or via Srirangapatna and Kushalnagar.",
      note: "One of our most-booked weekend runs; book early for long weekends." },
    { id: "chikmagalur", name: "Chikmagalur", slug: "bangalore-to-chikmagalur-tempo-traveller", km: 245, time: "5 hrs", trip: "2N/3D", season: "September to March", vehicle: "10–20 seater", region: "Western Ghats",
      places: ["Mullayanagiri, Karnataka's highest peak", "Baba Budangiri", "Hebbe and Jhari falls (by jeep)", "Kudremukh National Park", "Belur and Halebidu temples en route", "Coffee estate stays"],
      route: "Via Kunigal and Hassan (NH75), with an optional stop at Belur and Halebidu.",
      note: "Mullayanagiri road is narrow; vehicle restrictions sometimes apply on peak days." },
    { id: "mysore", name: "Mysore", slug: "bangalore-to-mysore-tempo-traveller", km: 145, time: "3 hrs", trip: "1N/2D or day trip", season: "October to February (Dasara in Sept/Oct)", vehicle: "10–26 seater", region: "Mysuru",
      places: ["Mysore Palace (lit up on Sunday evenings)", "Chamundi Hills", "Brindavan Gardens, KRS Dam", "Srirangapatna", "Ranganathittu Bird Sanctuary", "St. Philomena's Church"],
      route: "Via the Bengaluru–Mysuru Expressway (toll). Easy to extend to Coorg or Ooty.",
      note: "Dasara week sees heavy crowds; book well in advance." },
    { id: "ooty", name: "Ooty", slug: "bangalore-to-ooty-tempo-traveller", km: 270, time: "6–7 hrs", trip: "2N/3D", season: "March to June, October to November", vehicle: "10–20 seater", region: "Nilgiris",
      places: ["Government Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Nilgiri Mountain Railway (toy train)", "Pykara Falls and Lake", "Coonoor: Sim's Park and Dolphin's Nose"],
      route: "Via Mysuru, Bandipur and Mudumalai. The forest stretch is closed to traffic at night (roughly 9 pm to 6 am).",
      note: "The Nilgiris currently require an e-pass for visiting vehicles; check the latest rules before travel." },
    { id: "kodaikanal", name: "Kodaikanal", slug: "bangalore-to-kodaikanal-tempo-traveller", km: 465, time: "9 hrs", trip: "2N/3D", season: "April to June, September to October", vehicle: "10–20 seater", region: "Tamil Nadu hills",
      places: ["Kodaikanal Lake", "Coaker's Walk", "Pillar Rocks", "Guna Caves (Devil's Kitchen)", "Bryant Park", "Berijam Lake (forest permit)"],
      route: "Via Hosur, Krishnagiri, Salem and Dindigul, then up the Kodai ghat road.",
      note: "Tamil Nadu permit and Kodaikanal e-pass rules apply; we check them for you before departure." },
    { id: "sakleshpur", name: "Sakleshpur", slug: "bangalore-to-sakleshpur-tempo-traveller", km: 220, time: "4.5 hrs", trip: "1N/2D", season: "July to March", vehicle: "10–20 seater", region: "Western Ghats",
      places: ["Manjarabad Fort", "Bisle Ghat viewpoint", "Hemavathi reservoir", "Coffee and cardamom estates", "Agni Gudda hill", "Shettihalli Rosary Church (seasonal)"],
      route: "Via Kunigal and Hassan on NH75. One of the easiest Western Ghats weekend drives.",
      note: "Best green and misty in the monsoon; roads can be slippery, so we plan buffer time." },
    { id: "dandeli", name: "Dandeli", slug: "bangalore-to-dandeli-tempo-traveller", km: 470, time: "8–9 hrs", trip: "2N/3D", season: "October to May", vehicle: "12–26 seater", region: "Uttara Kannada",
      places: ["White-water rafting on the Kali river (seasonal)", "Syntheri Rocks", "Kavala Caves", "Supa Dam viewpoint", "Jungle stays and kayaking", "Ulavi Channabasaveshwara Temple"],
      route: "Via NH48 to Hubballi and Dharwad, then west to Dandeli through forest roads.",
      note: "Rafting runs are subject to river and forest department rules each season." },
    { id: "jog-falls", name: "Jog Falls", slug: "bangalore-to-jog-falls-tempo-traveller", km: 400, time: "7–8 hrs", trip: "2N/3D", season: "August to December", vehicle: "12–20 seater", region: "Shivamogga",
      places: ["Jog Falls viewpoints", "Linganamakki Dam", "Honnemaradu backwaters", "Sigandur Chowdeshwari Temple", "Keladi and Ikkeri temples", "Combine with Murudeshwar and Gokarna"],
      route: "Via Tumakuru, Shivamogga and Sagara.",
      note: "The falls are at their fullest just after the monsoon; in summer the flow is thin." },
    { id: "pondicherry", name: "Pondicherry", slug: "bangalore-to-pondicherry-tempo-traveller", km: 310, time: "6 hrs", trip: "2N/3D", season: "October to March", vehicle: "10–26 seater", region: "Puducherry",
      places: ["French Quarter (White Town)", "Promenade Beach", "Auroville and the Matrimandir viewing point", "Paradise Beach (by boat from Chunnambar)", "Serenity Beach", "Sri Aurobindo Ashram"],
      route: "Via Hosur, Krishnagiri and Tiruvannamalai, or via Vellore.",
      note: "Puducherry and Tamil Nadu permits are extra; Tiruvannamalai is a popular stop on the way." },
    { id: "tirupati", kind: "pilgrimage", state: "Andhra Pradesh", name: "Tirupati", slug: "bangalore-to-tirupati-tempo-traveller", km: 250, time: "5–6 hrs", trip: "1N/2D", season: "All year (September to February is most pleasant)", vehicle: "10–26 seater", region: "Andhra Pradesh",
      places: ["Sri Venkateswara Temple, Tirumala", "Sri Padmavathi Ammavari Temple, Tiruchanur", "Srikalahasti Temple", "Kapila Theertham", "Talakona Falls", "Silathoranam and Srivari Padalu"],
      route: "Via Kolar, Mulbagal and Chittoor, then up the Tirumala ghat road.",
      note: "Book darshan tickets on the official TTD site in advance; Andhra Pradesh permit is extra." },

    /* ---------- Temples and pilgrimages ---------- */
    { id: "dharmasthala", kind: "pilgrimage", state: "Karnataka", name: "Dharmasthala", slug: "bangalore-to-dharmasthala-tempo-traveller", km: 300, time: "6–7 hrs", trip: "1N/2D", season: "All year (October to March is most pleasant)", vehicle: "10–26 seater", region: "Dakshina Kannada",
      places: ["Sri Manjunatha Swamy Temple", "Ratnagiri Bahubali statue", "Annappa Betta", "Manjusha Museum and vintage car collection", "Netravati river snana ghat", "Free annadana (meals) at the temple"],
      route: "Via Kunigal, Hassan and the Shiradi ghat, then via Uppinangady. Kukke Subramanya is about 50 km away, so most groups do both.",
      note: "Traditional dress is expected inside the temple. Darshan timings change on festival days, so we plan around them." },
    { id: "kukke", kind: "pilgrimage", state: "Karnataka", name: "Kukke Subramanya", slug: "bangalore-to-kukke-subramanya-tempo-traveller", km: 280, time: "6–7 hrs", trip: "1N/2D", season: "All year (October to March is most pleasant)", vehicle: "10–26 seater", region: "Dakshina Kannada",
      places: ["Kukke Sri Subrahmanya Temple", "Adi Subramanya Temple", "Holy dip in the Kumaradhara river", "Biladwara cave", "Kumara Parvatha trek base", "Dharmasthala (about 50 km) on the same trip"],
      route: "Via Kunigal, Hassan and Sakleshpur, then down the Shiradi ghat. The Bisle ghat shortcut is scenic but narrow.",
      note: "Sarpa Samskara and Ashlesha Bali poojas are booked in advance; Sarpa Samskara needs an overnight stay." },
    { id: "sringeri", kind: "pilgrimage", state: "Karnataka", name: "Sringeri", slug: "bangalore-to-sringeri-tempo-traveller", km: 330, time: "7 hrs", trip: "2N/3D (with Horanadu)", season: "September to March", vehicle: "10–20 seater", region: "Malnad",
      places: ["Sri Sharadamba Temple", "Vidyashankara Temple and its zodiac pillars", "Sringeri Sharada Peetham", "Tunga river ghat and the temple fish", "Kigga Rishyashringa Temple", "Sirimane Falls"],
      route: "Via Tumakuru, Kadur and Chikmagalur, or via Hassan and Belur. The last stretch is a winding Malnad ghat road.",
      note: "Combine with Horanadu (about 70 km) and Kalasa for a classic Malnad temple trip. Traditional dress is preferred." },
    { id: "horanadu", kind: "pilgrimage", state: "Karnataka", name: "Horanadu", slug: "bangalore-to-horanadu-tempo-traveller", km: 330, time: "7 hrs", trip: "1N/2D", season: "September to March", vehicle: "10–20 seater", region: "Malnad",
      places: ["Sri Annapoorneshwari Temple", "Kalaseshwara Temple, Kalasa", "Ambatheertha on the Bhadra river", "Kudremukh viewpoints", "Free annadana (meals) at the temple", "Sringeri (about 70 km) on the same trip"],
      route: "Via Hassan, Belur and Mudigere, or via Chikmagalur and Kalasa. Narrow ghat roads for the last stretch.",
      note: "A traditional dress code applies inside the temple (men in dhoti, women in saree or churidar)." },
    { id: "kollur", kind: "pilgrimage", state: "Karnataka", name: "Kollur Mookambika", slug: "bangalore-to-kollur-mookambika-tempo-traveller", km: 420, time: "8–9 hrs", trip: "2N/3D", season: "October to March", vehicle: "12–26 seater", region: "Udupi district",
      places: ["Sri Mookambika Temple", "Souparnika river", "Kodachadri peak (by jeep)", "Arishina Gundi falls", "Maravanthe beach on the way to the coast", "Udupi and Murudeshwar nearby"],
      route: "Via Tumakuru, Shivamogga and Hosanagara, then down the ghat to Kollur.",
      note: "Easy to combine with Udupi, Murudeshwar and Gokarna on our coastal temple circuit." },
    { id: "melukote", kind: "pilgrimage", state: "Karnataka", name: "Melukote & Shravanabelagola", slug: "bangalore-to-melukote-shravanabelagola-tempo-traveller", km: 150, time: "3 hrs", trip: "Day trip", season: "All year (October to February is best)", vehicle: "10–26 seater", region: "Mandya and Hassan",
      places: ["Cheluvanarayana Swamy Temple, Melukote", "Yoga Narasimha Temple on the hilltop", "Pancha Kalyani stepped tank", "Gommateshwara (Bahubali) statue, Shravanabelagola", "Chandragiri hill basadis", "Adichunchanagiri on the way"],
      route: "Melukote is about 150 km via Mandya or Nagamangala; Shravanabelagola is about 60 km further via Nagamangala.",
      note: "The Vindhyagiri climb at Shravanabelagola has over 600 rock-cut steps and is done barefoot; climb early in the day." },
    { id: "mm-hills", kind: "pilgrimage", state: "Karnataka", name: "Male Mahadeshwara Hills", slug: "bangalore-to-male-mahadeshwara-hills-tempo-traveller", km: 210, time: "5 hrs", trip: "1N/2D", season: "All year (Shivaratri and Deepavali are very crowded)", vehicle: "10–20 seater", region: "Chamarajanagar",
      places: ["Sri Male Mahadeshwara Swamy Temple", "Ghat road views over the sanctuary", "Shivanasamudra Falls on the way", "Kollegal silk town", "Biligiri Rangaswamy Temple, BR Hills (on a combined trip)", "Talakadu temples (on a combined trip)"],
      route: "Via Kanakapura and Kollegal, or via Malavalli. The last stretch is a forest ghat road.",
      note: "The road runs through a wildlife sanctuary; we avoid driving it late at night." },
    { id: "mantralayam", kind: "pilgrimage", state: "Andhra Pradesh", name: "Mantralayam", slug: "bangalore-to-mantralayam-tempo-traveller", km: 370, time: "7–8 hrs", trip: "1N/2D", season: "October to February", vehicle: "10–26 seater", region: "Kurnool, Andhra Pradesh",
      places: ["Sri Raghavendra Swamy Brindavana (Mutt)", "Tungabhadra river ghat", "Sri Manchalamma Temple", "Panchamukhi Anjaneya Temple (about 20 km)", "Free prasadam at the Mutt", "Hampi on a longer circuit"],
      route: "Via NH44 to Anantapur, then Guntakal and Adoni.",
      note: "Traditional dress is expected for darshan. Andhra Pradesh permit is extra." },
    { id: "puttaparthi", kind: "pilgrimage", state: "Andhra Pradesh", name: "Puttaparthi & Lepakshi", slug: "bangalore-to-puttaparthi-tempo-traveller", km: 160, time: "3.5–4 hrs", trip: "Day trip or 1N/2D", season: "October to March", vehicle: "10–26 seater", region: "Sri Sathya Sai district, Andhra Pradesh",
      places: ["Prasanthi Nilayam ashram", "Sai Kulwant Hall darshan", "Chaitanya Jyoti museum", "Lepakshi Veerabhadra Temple and its hanging pillar", "Lepakshi monolithic Nandi", "Hill View Stadium"],
      route: "Via NH44 towards Hyderabad. Lepakshi is a short detour about 120 km from Bangalore.",
      note: "Ashram rules: modest dress, silence in the darshan hall, no photography inside. Andhra Pradesh permit is extra." },
    { id: "srisailam", kind: "pilgrimage", state: "Andhra Pradesh", name: "Srisailam", slug: "bangalore-to-srisailam-tempo-traveller", km: 520, time: "10–11 hrs", trip: "2N/3D", season: "October to February (Maha Shivaratri is very crowded)", vehicle: "12–26 seater", region: "Nallamala hills, Andhra Pradesh",
      places: ["Sri Bhramaramba Mallikarjuna Swamy Temple (Jyotirlinga)", "Pathala Ganga and the ropeway", "Srisailam Dam", "Sakshi Ganapathi Temple", "Akkamahadevi caves (by boat)", "Mahanandi on a longer circuit"],
      route: "Via NH44 to Kurnool, then Atmakur and the Nallamala forest ghat road.",
      note: "The forest road into Srisailam is closed to traffic at night (roughly 9 pm to 6 am); we time the drive around it. Andhra Pradesh permit is extra." },
    { id: "tiruvannamalai", kind: "pilgrimage", state: "Tamil Nadu", name: "Tiruvannamalai", slug: "bangalore-to-tiruvannamalai-tempo-traveller", km: 190, time: "4–5 hrs", trip: "1N/2D", season: "October to March (Karthigai Deepam in Nov/Dec)", vehicle: "10–26 seater", region: "Tamil Nadu",
      places: ["Arunachaleswarar Temple", "Girivalam, the 14 km walk around Arunachala hill", "Sri Ramana Maharshi Ashram", "Virupaksha and Skandashram caves", "Sathanur Dam", "Gingee Fort (about 40 km)"],
      route: "Via Hosur, Krishnagiri and Chengam.",
      note: "Full-moon (Pournami) nights and Karthigai Deepam bring huge crowds; we plan parking and pickup points in advance. Tamil Nadu permit is extra." },
    { id: "kanchipuram", kind: "pilgrimage", state: "Tamil Nadu", name: "Kanchipuram", slug: "bangalore-to-kanchipuram-tempo-traveller", km: 280, time: "5–6 hrs", trip: "1N/2D", season: "October to March", vehicle: "10–26 seater", region: "Tamil Nadu",
      places: ["Kamakshi Amman Temple", "Ekambareswarar Temple", "Varadharaja Perumal Temple", "Kailasanathar Temple", "Kanchi Kamakoti Peetham", "Kanchipuram silk saree weavers"],
      route: "Via Hosur, Krishnagiri, Vellore and Arcot.",
      note: "Add the Sripuram Golden Temple at Vellore on the way. Tamil Nadu permit is extra." },
    { id: "madurai", kind: "pilgrimage", state: "Tamil Nadu", name: "Madurai", slug: "bangalore-to-madurai-tempo-traveller", km: 435, time: "8 hrs", trip: "2N/3D", season: "October to March", vehicle: "12–26 seater", region: "Tamil Nadu",
      places: ["Meenakshi Amman Temple", "Thirumalai Nayakkar Mahal", "Thiruparankundram Murugan Temple", "Alagar Kovil and Pazhamudircholai", "Gandhi Memorial Museum", "Rameswaram (about 175 km) on a longer trip"],
      route: "Via Hosur, Salem, Namakkal and Dindigul on NH44.",
      note: "The Meenakshi temple has a dress code and does not allow mobile phones inside. Tamil Nadu permit is extra." },
    { id: "rameswaram", kind: "pilgrimage", state: "Tamil Nadu", name: "Rameswaram", slug: "bangalore-to-rameswaram-tempo-traveller", km: 610, time: "11–12 hrs", trip: "3N/4D (with Madurai)", season: "October to April", vehicle: "12–26 seater", region: "Tamil Nadu",
      places: ["Ramanathaswamy Temple and its long corridors", "Agni Theertham and the temple's holy wells", "Dhanushkodi and Arichal Munai", "Pamban Bridge", "Dr. APJ Abdul Kalam Memorial", "Panchamukhi Hanuman Temple"],
      route: "Via Salem, Dindigul and Madurai, then over the Pamban road bridge onto the island.",
      note: "Most groups break the drive at Madurai. Tamil Nadu permit is extra." },
    { id: "velankanni", kind: "pilgrimage", state: "Tamil Nadu", name: "Velankanni", slug: "bangalore-to-velankanni-tempo-traveller", km: 480, time: "9–10 hrs", trip: "2N/3D", season: "October to March (annual feast late Aug to early Sept)", vehicle: "12–26 seater", region: "Tamil Nadu",
      places: ["Basilica of Our Lady of Good Health", "Our Lady's Tank and Morning Star Church", "Velankanni beach", "Nagore Dargah (about 12 km)", "Brihadeeswarar Temple, Thanjavur (on the way)", "Tharangambadi Danish fort"],
      route: "Via Krishnagiri, Salem, Tiruchirappalli and Thanjavur.",
      note: "The annual feast (29 August to 8 September) is very crowded; book early. Tamil Nadu permit is extra." },
    { id: "guruvayur", kind: "pilgrimage", state: "Kerala", name: "Guruvayur", slug: "bangalore-to-guruvayur-tempo-traveller", km: 480, time: "9–10 hrs", trip: "2N/3D", season: "September to March", vehicle: "12–26 seater", region: "Thrissur, Kerala",
      places: ["Sri Krishna Temple, Guruvayur", "Punnathur Kotta elephant sanctuary", "Mammiyoor Mahadeva Temple", "Vadakkunnathan Temple, Thrissur (about 30 km)", "Chavakkad beach", "Athirappilly Falls on a longer trip"],
      route: "Via Salem, Coimbatore, Palakkad and Thrissur.",
      note: "Strict dress code: men wear a mundu without a shirt, women a saree or traditional dress. Only Hindus may enter the temple. Kerala permit is extra." },
    { id: "sabarimala", kind: "pilgrimage", state: "Kerala", name: "Sabarimala", slug: "bangalore-to-sabarimala-tempo-traveller", km: 620, time: "12–13 hrs to Nilakkal", trip: "2N/3D", season: "Mandala–Makaravilakku (mid-November to mid-January) and monthly openings", vehicle: "12–26 seater", region: "Pathanamthitta, Kerala",
      places: ["Sri Ayyappa Temple, Sabarimala", "Pamba river and Pamba Ganapathi Temple", "Erumeli Sastha Temple and Vavar mosque", "Nilakkal base camp", "Pandalam Valiyakoyikkal Temple", "Chengannur Mahadeva Temple on the return"],
      route: "Via Salem, Coimbatore, Palakkad and Kottayam to Erumeli and Nilakkal, or via Madurai, Theni and Kumily.",
      note: "Private vehicles park at Nilakkal and KSRTC buses run to Pamba. Darshan needs an online Virtual Queue booking. Kerala permit is extra." },
  ],
};
