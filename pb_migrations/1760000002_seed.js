migrate((db) => {
  const dao = new Dao(db), col = dao.findCollectionByNameOrId("listings");
  const base = { status: "available", featured: false, offer: false, old_price: 0, offer_note: "", bedrooms: 0, bathrooms: 0 };
  [
    { title: "Modern 3BR Apartment", price: 185000, type: "sale", location: "Westlands", size: 140, bedrooms: 3, bathrooms: 2, description: "Bright apartment close to shops and transport.", featured: true },
    { title: "Family Bungalow with Garden", price: 1200, type: "rent", location: "Karen", size: 320, bedrooms: 4, bathrooms: 3, description: "Spacious home in a quiet neighbourhood.", featured: true },
    { title: "Quarter-Acre Plot", price: 40000, type: "land", location: "Kiambu", size: 1012, description: "Titled plot, ready for development." },
    { title: "Prime Office Floor", price: 3500, type: "commercial", location: "Upper Hill", size: 450, bathrooms: 2, description: "Open-plan office with parking and backup power." },
    { title: "Penthouse with City Views", price: 270000, type: "sale", location: "Kilimani", size: 230, bedrooms: 4, bathrooms: 4, description: "Top-floor luxury with private terrace.", offer: true, old_price: 300000, offer_note: "10% off this month" },
    { title: "Gated Townhouse", price: 950, type: "rent", location: "Lavington", size: 210, bedrooms: 3, bathrooms: 3, description: "Secure estate with pool and gym.", offer: true, old_price: 1100, offer_note: "First month free" },
  ].forEach((d) => dao.saveRecord(new Record(col, Object.assign({}, base, d))));
}, (db) => {});
