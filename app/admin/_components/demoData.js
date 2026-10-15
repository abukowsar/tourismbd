// Sample records shown when the database is unreachable. Dates are relative to today.

function daysFromNow(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function demoVisitors() {
  return [
    ["Maria Thompson", "United Kingdom", "Dhaka", -3, "Pan Pacific Sonargaon", "+44 7700 900123", "Dhaka 2 days, Sonargaon 1 day, Sylhet 3 days", "guide assigned", "Mahmud Rahman"],
    ["Kenji Sato", "Japan", "Cox's Bazar", 2, "Sea Pearl Beach Resort", "+81 90 1234 5678", "Cox's Bazar 3 days, Saint Martin's Island 2 days", "new", ""],
    ["Amélie Laurent", "France", "Dhaka", 5, "InterContinental Dhaka", "+33 6 12 34 56 78", "Dhaka 1 day, Sundarbans 3 days, Bagerhat 1 day", "contacted", ""],
    ["Daniel Okafor", "Nigeria", "Chattogram", 9, "Radisson Blu Chattogram", "+234 803 123 4567", "Chattogram 1 day, Bandarban 3 days, Rangamati 2 days", "new", ""],
    ["Priya Nair", "India", "Sylhet", -6, "Rose View Hotel", "+91 98765 43210", "Sylhet 3 days, Sreemangal 2 days", "active", "Nusrat Jahan"],
    ["Lucas Schmidt", "Germany", "Dhaka", 1, "Amari Dhaka", "+49 151 23456789", "Dhaka 2 days, Sreemangal 2 days, Sylhet 3 days", "guide assigned", "Nusrat Jahan"],
    ["Emily Carter", "United States", "Dhaka", 12, "The Westin Dhaka", "+1 415 555 0134", "Dhaka 2 days, Kuakata 2 days", "new", ""],
    ["Ahmed Al-Farsi", "Saudi Arabia", "Dhaka", -14, "Le Méridien Dhaka", "+966 55 123 4567", "Dhaka 2 days, Cox's Bazar 3 days", "completed", "Mahmud Rahman"],
    ["Sofia Rossi", "Italy", "Cox's Bazar", 4, "Mermaid Beach Resort", "+39 347 123 4567", "Cox's Bazar 3 days, Bandarban 2 days", "new", ""],
    ["Chen Wei", "China", "Dhaka", 7, "Sheraton Dhaka", "+86 138 0013 8000", "Dhaka 1 day, Paharpur 1 day, Sundarbans 3 days", "contacted", ""],
    ["Oliver Brown", "Australia", "Sylhet", 3, "Nazimgarh Resort", "+61 412 345 678", "Sylhet 3 days, Tanguar Haor 2 days", "new", ""],
  ].map(([fullName, passportCountry, arrivalCity, offset, hotel, emergencyContact, plannedRoute, status, guideName], index) => ({
    id: `demo-v${index}`,
    fullName,
    passportCountry,
    arrivalCity,
    arrivalDate: daysFromNow(offset),
    hotel,
    emergencyContact,
    plannedRoute,
    status,
    guideName,
    notes: index === 0 ? [{ text: "Airport pickup confirmed with driver.", at: daysFromNow(-4) }] : [],
    createdAt: daysFromNow(Math.min(offset, 0) - 10 + index),
  }));
}

export function demoGuides() {
  return [
    { id: "demo-g1", name: "Mahmud Rahman", languages: "English, Bengali", regions: "Dhaka, Sonargaon", phone: "+880 1711 234567", email: "mahmud@example.com", licenseNo: "TG-1042", status: "assigned", notes: "" },
    { id: "demo-g2", name: "Nusrat Jahan", languages: "English, French, Bengali", regions: "Sylhet, Sreemangal", phone: "+880 1812 987654", email: "nusrat@example.com", licenseNo: "TG-1187", status: "assigned", notes: "" },
    { id: "demo-g3", name: "Arif Hossain", languages: "English, Hindi, Bengali", regions: "Sundarbans, Khulna, Bagerhat", phone: "+880 1913 456789", email: "arif@example.com", licenseNo: "TG-0921", status: "available", notes: "Licensed Sundarbans boat guide." },
    { id: "demo-g4", name: "Mong Sing Marma", languages: "English, Marma, Bengali", regions: "Bandarban, Rangamati", phone: "+880 1556 112233", email: "", licenseNo: "TG-1310", status: "available", notes: "Can arrange hill-area permissions." },
    { id: "demo-g5", name: "Tahmina Akter", languages: "English, Arabic, Bengali", regions: "Cox's Bazar, Saint Martin's", phone: "+880 1677 998877", email: "tahmina@example.com", licenseNo: "TG-1255", status: "off duty", notes: "Back next week." },
  ];
}

export function demoRequests() {
  return [
    { id: "demo-r1", title: "Airport pickup confirmation", visitorId: "demo-v1", visitorName: "Kenji Sato", category: "Airport pickup", priority: "high", state: "open", owner: "Support desk", details: "Arrives at CXB on the morning flight.", createdAt: daysFromNow(-1) },
    { id: "demo-r2", title: "Sylhet hotel contact verification", visitorId: "demo-v4", visitorName: "Priya Nair", category: "Accommodation", priority: "normal", state: "in review", owner: "Operations", details: "", createdAt: daysFromNow(-3) },
    { id: "demo-r3", title: "Lost passport copy at hotel", visitorId: "demo-v0", visitorName: "Maria Thompson", category: "Lost item", priority: "urgent", state: "new", owner: "", details: "Needs a certified copy before the Sylhet flight.", createdAt: daysFromNow(0) },
    { id: "demo-r4", title: "Sundarbans tour operator booking", visitorId: "demo-v2", visitorName: "Amélie Laurent", category: "Guide", priority: "normal", state: "new", owner: "Guide team", details: "3-day boat trip from Mongla.", createdAt: daysFromNow(-2) },
    { id: "demo-r5", title: "Dietary preference sent to guide", visitorId: "demo-v5", visitorName: "Lucas Schmidt", category: "Guide", priority: "low", state: "done", owner: "Guide team", details: "Vegetarian.", createdAt: daysFromNow(-5) },
  ];
}

export function demoAlerts() {
  return [
    { id: "demo-a1", title: "Saint Martin's ships running on limited schedule", message: "Visitor numbers are capped this season. Book ship tickets and overnight stays through licensed operators only.", level: "advisory", region: "Cox's Bazar", active: true, expiresAt: null, createdAt: daysFromNow(-2) },
    { id: "demo-a2", title: "Heavy rain expected in the Sylhet region", message: "Check with your guide before visiting Ratargul or Jaflong. Some boat routes may pause.", level: "warning", region: "Sylhet", active: false, expiresAt: daysFromNow(3), createdAt: daysFromNow(-6) },
  ];
}

export function demoOperations() {
  return [
    { id: "demo-o1", title: "Beach patrol — Kolatoli to Sugandha", type: "Patrol", status: "ongoing", zone: "Cox's Bazar", location: "Kolatoli, Sugandha and Laboni points", startAt: daysFromNow(0), endAt: daysFromNow(0), officerInCharge: "SI Rafiqul Islam", teamSize: "8", details: "Evening patrol along the main beach points.", outcome: "", updatedBy: "Demo", createdAt: daysFromNow(-1) },
    { id: "demo-o2", title: "Airport arrival help desk", type: "Checkpoint", status: "ongoing", zone: "Dhaka", location: "HSIA Terminal 2, arrival hall", startAt: daysFromNow(-2), endAt: daysFromNow(5), officerInCharge: "ASP Farhana Ahmed", teamSize: "4", details: "Help foreign arrivals with taxis and registered hotels.", outcome: "", updatedBy: "Demo", createdAt: daysFromNow(-3) },
    { id: "demo-o3", title: "Drive against fake tour operators", type: "Special drive", status: "planned", zone: "Sylhet", location: "Jaflong and Ratargul boat ghats", startAt: daysFromNow(3), endAt: null, officerInCharge: "Inspector Kamal Uddin", teamSize: "12", details: "Check licences of boat and tour operators.", outcome: "", updatedBy: "Demo", createdAt: daysFromNow(-1) },
    { id: "demo-o4", title: "Missing tourist search — Nilgiri trail", type: "Rescue", status: "completed", zone: "Bandarban", location: "Nilgiri to Thanchi trail", startAt: daysFromNow(-6), endAt: daysFromNow(-5), officerInCharge: "SI Mong Thoai", teamSize: "10", details: "Two hikers reported missing after dark.", outcome: "Both found safe and escorted back to Bandarban.", updatedBy: "Demo", createdAt: daysFromNow(-6) },
  ];
}

export function demoCriminals() {
  return [
    { id: "demo-c1", name: "Unknown (CCTV suspect)", alias: "Beach bag snatcher", age: "25-30", nationality: "Bangladesh", idNumber: "", offenseType: "Theft", caseNo: "CXB-2026-114", status: "wanted", threatLevel: "medium", zone: "Cox's Bazar", lastKnownLocation: "Sugandha Point", incidentDate: daysFromNow(-4), description: "Snatches bags from tourists on the beach; escapes on a motorbike.", updatedBy: "Demo", createdAt: daysFromNow(-4) },
    { id: "demo-c2", name: "Shafiq Mia", alias: "Fake guide", age: "34", nationality: "Bangladesh", idNumber: "NID 19xx-xxxx", offenseType: "Fraud / scam", caseNo: "SYL-2026-031", status: "arrested", threatLevel: "low", zone: "Sylhet", lastKnownLocation: "Jaflong ghat", incidentDate: daysFromNow(-10), description: "Took advance payments for boat trips that never ran.", updatedBy: "Demo", createdAt: daysFromNow(-10) },
    { id: "demo-c3", name: "Ring of 3 suspects", alias: "", age: "", nationality: "Bangladesh", idNumber: "", offenseType: "Robbery", caseNo: "DHK-2026-208", status: "under investigation", threatLevel: "high", zone: "Dhaka", lastKnownLocation: "Gulshan 2 area", incidentDate: daysFromNow(-2), description: "Posing as ride-share drivers near hotels at night.", updatedBy: "Demo", createdAt: daysFromNow(-2) },
  ];
}

export function demoSpotReports() {
  return [
    { id: "demo-s1", spotName: "Cox's Bazar Sea Beach (Sugandha Point)", address: "Sugandha Point, Cox's Bazar Sadar, Cox's Bazar", history: "Part of the world's longest natural sea beach; Sugandha became the main tourist point in the 2000s.", importance: "Main beach access, hotels and restaurants nearby, lifeguard posts, tourist police booth.", transport: "Flights to Cox's Bazar Airport; buses from Dhaka and Chattogram; trains on the Cox's Bazar line.", accommodation: "Over 500 hotels, motels and resorts from budget to five-star.", crimes: "Bag snatching, pickpocketing, overcharging by vendors, harassment of women tourists.", otherProblems: "Overcrowding on holidays, drowning risk at high tide, waste on the beach.", solutions: "More CCTV and night patrols, fixed price lists for vendors, more lifeguards at peak times.", dailyVisitors: "15,000–20,000; 50,000+ on holidays", attractionMeasures: "Better lighting and walkways, clean toilets, visitor information desks in English.", createdBy: "Demo", updatedBy: "Demo", createdAt: daysFromNow(-3), updatedAt: daysFromNow(-3) },
    { id: "demo-s2", spotName: "Ratargul Swamp Forest", address: "Gowainghat, Sylhet", history: "Freshwater swamp forest declared a protected area by the Forest Department.", importance: "Only freshwater swamp forest in Bangladesh; boat trips and a watch tower.", transport: "Car or CNG from Sylhet city (about 1.5 hours), then boats from the ghat.", accommodation: "No stays at the forest; hotels and resorts in Sylhet city.", crimes: "Overcharging by boatmen, fake guides.", otherProblems: "Poor road in the rainy season, no life jackets on many boats.", solutions: "Licensed boats with fixed fares, compulsory life jackets, police post at the ghat.", dailyVisitors: "1,000–2,000 in the monsoon season", attractionMeasures: "Repair the access road, build a visitor centre, publish boat fares online.", createdBy: "Demo", updatedBy: "Demo", createdAt: daysFromNow(-9), updatedAt: daysFromNow(-9) },
  ];
}

export function demoAdminUsers() {
  return [];
}
