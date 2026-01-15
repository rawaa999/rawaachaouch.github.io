fetch("data/agencies.json")
let map = L.map('map').setView([34, 9], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

navigator.geolocation.getCurrentPosition(async position => {

  const userLat = position.coords.latitude;
  const userLng = position.coords.longitude;

  L.marker([userLat, userLng])
    .addTo(map)
    .bindPopup("📍 أنت هنا")
    .openPopup();

  map.setView([userLat, userLng], 12);

  const response = await fetch("data/agencies.json");
  const agencies = await response.json();

  let closestAgency = null;
  let minDistance = Infinity;

  agencies.forEach(agency => {

    const dist = getDistance(
      userLat,
      userLng,
      agency.lat,
      agency.lng
    );

    if (dist < minDistance) {
      minDistance = dist;
      closestAgency = agency;
    }

    L.marker([agency.lat, agency.lng])
      .addTo(map)
      .bindPopup(agency.name);
  });

  document.getElementById("info").innerHTML = `
    <b>أقرب وكالة:</b><br>
    ${closestAgency.name}<br>
    📍 ${closestAgency.address}<br>
    📞 ${closestAgency.phone}<br>
    📏 المسافة: ${minDistance.toFixed(2)} كم
  `;

}, () => {
  document.getElementById("info").innerText =
    "⚠️ الرجاء السماح بالوصول إلى الموقع";
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}