// Initialisation du fond de carte
var map = new maplibregl.Map({
  container: "carte",
  // Définition du fond de carte
  style:
    "https://api.maptiler.com/maps/voyager/style.json?key=rrASqj6frF6l2rrOFR4A",
  // Niveau de zoom par défaut
  zoom: 8,
  // Coordonnées de centrage de la carte par défaut
  center: [-1.68, 48.1272],
  // Zoom minimal pour l'utilisateur
  minZoom: 8,
  // Lien vers le site du master SIGAT( à voir plus tard)
  customAttribution:
    '<a href="https://esigat.wordpress.com/">© Master SIGAT</a>',
});
