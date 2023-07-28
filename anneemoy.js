     
// Calcul de l'année minimale et maximale pour chaque commune
var yearsByCommune = jsonData.reduce((acc, item) => {
    // Si la commune n'est pas encore dans l'accumulateur, l'ajouter avec l'année actuelle
    if (!acc[item["NOM_COM"]]) {
        acc[item["NOM_COM"]] = { minYear: item["ANNEE"], maxYear: item["ANNEE"] };
    } else {
        // Sinon, mettre à jour l'année minimale et maximale si nécessaire
        if (item["ANNEE"] < acc[item["NOM_COM"]].minYear) {
            acc[item["NOM_COM"]].minYear = item["ANNEE"];
        }
        if (item["ANNEE"] > acc[item["NOM_COM"]].maxYear) {
            acc[item["NOM_COM"]].maxYear = item["ANNEE"];
        }
    }
    return acc;
  }, {});
  
  console.log(yearsByCommune); // Imprime les années minimale et maximale pour chaque commune
  
  
  // creer une variable qui selectionne la commune 
  var selectedCommune1 = document.getElementById("liste-choix").value; // Obtenir la commune sélectionnée
  console.log(selectedCommune1)