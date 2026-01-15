fetch("data/agencies.json")
/* ===============================
   إنشاء الخريطة
================================ */
const map = L.map('map').setView([36.8, 10.18], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);


/* ===============================
   وكالات Tunisie Télécom (24 ولاية + هاتف)
================================ */
const agencies = [
  { name:"TT – Tunis", address:"Centre-ville Tunis", phone:"80101111", lat:36.8065, lng:10.1815 },
  { name:"TT – Ariana", address:"Ariana Centre", phone:"80101112", lat:36.8665, lng:10.1647 },
  { name:"TT – Ben Arous", address:"Ben Arous", phone:"80101113", lat:36.7531, lng:10.2189 },
  { name:"TT – Manouba", address:"Manouba", phone:"80101114", lat:36.8101, lng:10.0956 },

  { name:"TT – Nabeul", address:"Nabeul", phone:"80102111", lat:36.4513, lng:10.7351 },
  { name:"TT – Zaghouan", address:"Zaghouan", phone:"80102112", lat:36.4020, lng:10.1429 },
  { name:"TT – Bizerte", address:"Bizerte", phone:"80102113", lat:37.2746, lng:9.8739 },
  { name:"TT – Béja", address:"Béja", phone:"80102114", lat:36.7256, lng:9.1817 },
  { name:"TT – Jendouba", address:"Jendouba", phone:"80102115", lat:36.5011, lng:8.7802 },
  { name:"TT – Le Kef", address:"Le Kef", phone:"80102116", lat:36.1826, lng:8.7148 },
  { name:"TT – Siliana", address:"Siliana", phone:"80102117", lat:36.0848, lng:9.3708 },

  { name:"TT – Sousse", address:"Sousse", phone:"80103111", lat:35.8256, lng:10.6369 },
  { name:"TT – Monastir", address:"Monastir", phone:"80103112", lat:35.7643, lng:10.8113 },
  { name:"TT – Mahdia", address:"Mahdia", phone:"80103113", lat:35.5047, lng:11.0622 },
  { name:"TT – Kairouan", address:"Kairouan", phone:"80103114", lat:35.6781, lng:10.0963 },
  { name:"TT – Kasserine", address:"Kasserine", phone:"80103115", lat:35.1676, lng:8.8365 },
  { name:"TT – Sidi Bouzid", address:"Sidi Bouzid", phone:"80103116", lat:35.0382, lng:9.4841 },

  { name:"TT – Sfax", address:"Sfax", phone:"80104111", lat:34.7406, lng:10.7603 },
  { name:"TT – Gafsa", address:"Gafsa", phone:"80104112", lat:34.4311, lng:8.7757 },
  { name:"TT – Tozeur", address:"Tozeur", phone:"80104113", lat:33.9197, lng:8.1335 },
  { name:"TT – Kebili", address:"Kebili", phone:"80104114", lat:33.7044, lng:8.9690 },
  { name:"TT – Gabes", address:"Gabes", phone:"80104115", lat:33.8815, lng:10.0982 },
  { name:"TT – Medenine", address:"Medenine", phone:"80104116", lat:33.3549, lng:10.5055 },
  { name:"TT – Tataouine", address:"Tataouine", phone:"80104117", lat:32.9297, lng:10.4518 }
];


/* ===============================
   حساب المسافة
================================ */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}


/* ===============================
   أقرب وكالة
================================ */
function findNearestAgency(userLat, userLng) {
  let nearest=null, min=Infinity;
  agencies.forEach(a=>{
    const d=getDistance(userLat,userLng,a.lat,a.lng);
    if(d<min){ min=d; nearest={...a,distance:d}; }
  });
  return nearest;
}


/* ===============================
   تحديد الموقع
================================ */
navigator.geolocation.getCurrentPosition(pos=>{
  const nearest=findNearestAgency(
    pos.coords.latitude,
    pos.coords.longitude
  );

  map.setView([nearest.lat, nearest.lng], 14);

 L.marker([nearest.lat, nearest.lng]).addTo(map)
  .bindPopup(`
    <strong>${nearest.name}</strong><br>
    📍 ${translations[currentLang].address}: ${nearest.address}<br>
    ☎️ ${translations[currentLang].phone}: ${nearest.phone}<br>
    📏 ${translations[currentLang].distance}: ${nearest.distance.toFixed(2)} km
  `)
  .openPopup();
});
const translations = {
  ar: {
    title: "أقرب وكالة اتصالات تونس",
    description: "تسمح لك هذه الصفحة بتحديد أقرب وكالة اتصالات تونس حسب موقعك.",
    address: "العنوان",
    phone: "الهاتف",
    distance: "المسافة"
  },
  fr: {
    title: "Agence Tunisie Télécom la plus proche",
    description: "Cette page permet d’identifier l’agence Tunisie Télécom la plus proche de votre position.",
    address: "Adresse",
    phone: "Téléphone",
    distance: "Distance"
  },
  en: {
    title: "Nearest Tunisie Télécom Agency",
    description: "This page helps you find the nearest Tunisie Télécom agency based on your location.",
    address: "Address",
    phone: "Phone",
    distance: "Distance"
  }
};
let currentLang = "fr"; // افتراضي

function setLanguage(lang) {
  currentLang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key];
  });
}
setLanguage(currentLang);
