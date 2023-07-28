
// Ouverture du paramétrage de la carte
map.on("load", function () {
  // Accès au geojson des bâtiments via l'appel à une constante
  const geojsonUrl = "./data/BD_BATI.geojson";
  // Transformation du geojson en un tableau de données
  fetch(geojsonUrl)
    .then((response) => response.json())
    .then((data) => {
      const geojson = data;

      // Mise en forme de la couche des bâtiments en points
      map.addLayer({
        id: "ID_BAT",
        type: "circle",
        source: {
          type: "geojson",
          data: geojson,
        
        },
        paint: {
          // Utilisation d'une expression pour définir la couleur en fonction de la propriété "RENOVVATION"
          "circle-color": [
            "match",
            ["get", "RENOVATION"],
            "Oui", "#FFA500", // Si la valeur de "RENOVVATION" est "oui", la couleur est rouge
            "Non", "#808080", // Si la valeur de "RENOVVATION" est "no", la couleur est noire
            "#808080" // Par défaut, la couleur est noire
          ],
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      
      });
});


// fin du map

// Bouton de géolocalisation()
map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
  })
);

// Echelle cartographique
map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 100,
    unit: "metric",
  })
);

// Boutons de navigation
var nav = new maplibregl.NavigationControl();
map.addControl(nav, "top-left");

})