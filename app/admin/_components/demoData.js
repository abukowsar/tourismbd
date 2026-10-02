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
