

//    GESTION DU MENU DE GAUCHE 





/// Récupération des données des bâtiments depuis le fichier GeoJSON
$.ajax({
  url: "./data/BD_BATI.geojson",
  dataType: "json",
  success: function (data) {
    // 1. Trier les données GeoJSON par NOM_BATI et COMMUNE en ordre alphabétique
    data.features.sort((a, b) => {
      const aCommune = a.properties.NOM_COM;
      const bCommune = b.properties.NOM_COM;
      const aNomBati = a.properties.NOM_BATI;
      const bNomBati = b.properties.NOM_BATI;

      if (aCommune === bCommune) {
        return aNomBati.localeCompare(bNomBati);
      }

      return aCommune.localeCompare(bCommune);
    });

    // 2. Grouper les bâtiments par COMMUNE
    const groupedByCommune = data.features.reduce((groups, feature) => {
      const commune = feature.properties.NOM_COM;
      if (!groups[commune]) {
        groups[commune] = [];
      }
      groups[commune].push(feature);
      return groups;
    }, {});

    const filterElem = document.getElementById("listings");
    filterElem.multiple = true;
    filterElem.addEventListener("mousedown", function (e) {
      e.preventDefault();
      filterElem.addEventListener("scroll", function () {
        sessionStorage.setItem("scrollPosition", this.scrollTop);
      });

      // Gérer les sélections d'options de bâtiments
      const option = e.target;
      if (option.tagName === "OPTION") {
        if (option.selected) {
          option.selected = false;
        } else {
          option.selected = true;
        }
        const event = new Event("change");
        this.dispatchEvent(event);
      }
    });

    // 3. Créer des sections pour chaque commune avec un en-tête
    Object.entries(groupedByCommune).forEach(([commune, features]) => {
      const optGroup = document.createElement("optgroup");
      optGroup.label = commune;

      // Ajouter les options de bâtiments dans chaque section
      features.forEach((feature) => {
        const opt = document.createElement("option");
        opt.value = feature.properties.NOM_BATI;
        opt.innerText = feature.properties.NOM_BATI;
        optGroup.appendChild(opt);
      });

      filterElem.appendChild(optGroup);
    });

    // Gérer le changement de sélection des bâtiments
    filterElem.onchange = () => {
      const selectedTypes = Array.from(
        filterElem.selectedOptions,
        (option) => option.value
      );

      // Fermer les pop-ups précédentes et mettre à jour la carte
      closeAllPopups();
      updateMap(data, selectedTypes);

      // Mettre à jour la liste des bâtiments sélectionnés
      updateSelectionsList(selectedTypes);
    };





    // Mettre à jour la liste des bâtiments sélectionnés quand l'utilisateur selctionne une commune 
    function updateSelectionsListe1(selectionsCom){
      const selection
    }





    // Mettre à jour la liste des bâtiments sélectionnés
    function updateSelectionsList(selectedTypes) {
      const selectionsListElem = document.getElementById("selections-liste");
      const selectionsBatiLabelElem = document.getElementById(
        "selections-bati-label"
      );

      // Vider les sélections précédentes
      while (selectionsListElem.firstChild) {
        selectionsListElem.firstChild.remove();
      }

      // Ajouter les sélections actuelles
      if (selectedTypes.length > 0) {
        const selectedTypesText = selectedTypes.join(", ");
        selectionsBatiLabelElem.innerHTML = "<strong>Bâtiments :</strong> ";
        selectionsListElem.appendChild(selectionsBatiLabelElem);
        selectionsListElem.innerHTML += selectedTypesText;
      } else {
        selectionsBatiLabelElem.innerHTML = " ";
        selectionsListElem.appendChild(selectionsBatiLabelElem);
      }

      // Si un seul bâtiment est sélectionné, afficher une pop-up pour celui-ci
      if (selectedTypes.length === 1) {
        const selectedFeature = data.features.find(
          (feature) => feature.properties.NOM_BATI === selectedTypes[0]
        );
        createPopUp(selectedFeature);
      }
    }

    updateMap(data, []);

    // Désélectionner tous les éléments de la liste déroulante et réinitialiser la carte et les sélections
    const deselectAllBtn = document.getElementById("deselect-all");
    deselectAllBtn.addEventListener("click", () => {
      const selectElem = document.getElementById("listings");
      for (let i = 0; i < selectElem.options.length; i++) {
        selectElem.options[i].selected = false;
      }
      // Ferme les pop-ups précédentes
      closeAllPopups();
      // Mettre à jour la carte et les sélections
      updateMap(data, []);
      updateSelectionsList([]);
    });
    // Restaurer la position de défilement précédente
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");
    if (savedScrollPosition !== null) {
      filterElem.scrollTop = parseInt(savedScrollPosition, 10);
    }
  },
});

// Cette fonction met à jour la carte en fonction des bâtiments sélectionnés dans la liste déroulante
function updateMap(data, selectedTypes) {
  const newGeoJSON = { ...data };
  if (selectedTypes.length > 0) {
    // Filtrer les bâtiments en fonction des types sélectionnés
    newGeoJSON.features = data.features.filter((feature) =>
      selectedTypes.includes(feature.properties.NOM_BATI)
    );

    // Calculer les limites de la carte en fonction des bâtiments filtrés et afficher une pop-up pour chaque bâtiment
    const bounds = new maplibregl.LngLatBounds();
    newGeoJSON.features.forEach((feature) => {
      bounds.extend(feature.geometry.coordinates);
      createPopUp(feature);
    });
    // Ajuster la carte pour afficher les bâtiments filtrés
    map.fitBounds(bounds, {
      padding: 20,
      duration: 1000,
      maxZoom: 17,
    });
  } else {
    // Afficher tous les bâtiments
    newGeoJSON.features = [...data.features];
    map.flyTo({
      zoom: 8,
      center: [-1.68, 48.1272],
    });
  }
}

// Cette fonction crée une pop-up pour un bâtiment donné
function createPopUp(feature, forceClose) {
  const coordinates = feature.geometry.coordinates;
  const nomBati = feature.properties.NOM_BATI;

  // Créer une fenêtre contextuelle et la lier au bâtiment correspondant sur la carte
  const popup = new maplibregl.Popup({ closeOnClick: false })
    .setLngLat(coordinates)
    .setHTML(
      "<h3>" +
        feature.properties.NOM_BATI +
        "</h3><h4>" +
        "Identifiant: " +
        feature.properties.ID_BAT +
        "<br/>"+
        "Adresse : " +
        feature.properties.ADRESSE +
        "<br/>" +
        "Surface : " +
        feature.properties.SURFACE +
        "m²" +
        "<br/>" +
        "Type : " +
        feature.properties.TYPE +
        "<br/>" +
        "Déjà rénové : " +
        feature.properties.RENOVATION +
        "</h4>"
    )
    .addTo(map);

  // Si cette fonction est appelée avec forceClose=true, fermer la pop-up correspondante
  if (activeFeatureId === feature.properties.id && forceClose) {
    const oldPopup = document.getElementById(`popup-${activeFeatureId}`);
    if (oldPopup) oldPopup.remove();
    activeFeatureId = null;
  } else {
    // Sinon, attribuer un identifiant unique à la pop-up et enregistrer l'ID du bâtiment correspondant pour une utilisation ultérieure
    popup.getElement().id = `popup-${feature.properties.id}`;
    activeFeatureId = feature.properties.id;
  }
}

// Cette fonction ferme toutes les fenêtres contextuelles ouvertes sur la carte
function closeAllPopups() {
  const popUps = document.getElementsByClassName("maplibregl-popup");
  while (popUps[0]) {
    popUps[0].remove();
  }
  activeFeatureId = null;
}





/////////////////////////////////////////////////////////////////////////////////

// Ecouteur d'événements pour le bouton "Communes"
document.getElementById("btn-choix").addEventListener("click", function() {
  const listeContainer = document.getElementById("liste-container");
  if (listeContainer.style.display === "none") {
      listeContainer.style.display = "block";
  } else {
      listeContainer.style.display = "none";
  }
});

// Ecouteur d'événements pour la sélection des communes
document.getElementById("liste-choix").addEventListener("change", function() {
  const selectedCommunes = Array.from(this.selectedOptions, option => option.value);
  const listingsElement = document.getElementById("listings");
  
  if (selectedCommunes.length > 0) {
      // Si une ou plusieurs communes valides sont sélectionnées, affichez le menu de sélection des bâtiments
      listingsElement.style.display = "block";
      // Ici, vous pouvez également filtrer les bâtiments de ces communes et les ajouter au menu de sélection des bâtiments
  } else {
      // Si aucune commune n'est sélectionnée, cachez le menu de sélection des bâtiments
      listingsElement.style.display = "none";
  }
});




//je souhaite dans ce menu en plus des selection possible , le menu s'affiche que lorsque l'utilisateur aura selectionné une commune coorespondante