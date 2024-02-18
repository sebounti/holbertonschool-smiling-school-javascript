$(document).ready(function () {
  // Fonction pour afficher les citations dans le carrousel
  function displayQuotes() {
    // Afficher le loader avant de lancer la requête
    $(".loader").show();

    $.ajax({
      method: "GET",
      url: "https://smileschool-api.hbtn.info/quotes",
      dataType: "json",
    }).done(function (response) {
      // Masquer le loader lorsque la requête est terminée
      $(".loader").hide();

      // Ajouter les citations dynamiques au carrousel
      $.each(response, function (index, quote) {
        let isActive = index === 0 ? "active" : "";
        $("#carouselExampleControls .carousel-inner").append(`
          <div class="carousel-item ${isActive}">
            <div class="row mx-auto align-items-center">
              <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                <img src="${
                  quote.pic_url
                }" class="d-block align-self-center rounded-circle" alt="Carousel Pic ${index + 1}" />
              </div>
              <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                <div class="quote-text">
                  <p class="text-white">"${quote.text}"</p>
                  <h4 class="text-white font-weight-bold">${quote.name}</h4>
                  <span class="text-white">${quote.title}</span>
                </div>
              </div>
            </div>
          </div>
        `);
      });
    });
  }

  // Fonction pour charger et afficher les tutoriels populaires
  function loadPopularTutorials() {
    // Affiche le loader au début du chargement des données
    $("#Loader").show();

    // Exécute une requête AJAX pour récupérer les tutoriels populaires
    $.ajax({
      url: "https://smileschool-api.hbtn.info/popular-tutorials", // URL de l'API pour obtenir les tutoriels
      type: "get", // Méthode HTTP pour la requête
      beforeSend: function () {
        // (Optionnel) Affiche à nouveau le loader juste avant d'envoyer la requête
        $("#VideosLoader").show();
      },
      success: function (response) {
        // Cache le loader une fois que la réponse est reçue
        $("#VideosLoader").hide();
        // Vide le contenu actuel du carrousel pour préparer l'ajout de nouveaux éléments
        $("#carouselVideos.carousel-inner").empty();

        // Définit le nombre d'items à afficher par slide
        let itemsPerSlide = 4;
        // Compteur pour suivre le nombre d'items ajoutés
        let itemsAdded = 0;

        // Commence à construire le HTML pour le premier item du carrousel, qui sera actif
        let carouselItemHtml =
          '<div class="carousel-item active"><div class="row">';

        // Boucle à travers chaque tutoriel reçu en réponse
        response.forEach(function (tutorial, index) {
          // Génère les étoiles basées sur l'évaluation du tutoriel
          let $stars = createStars(tutorial.star);

          // Construit le HTML pour chaque tutoriel et l'ajoute à la chaîne carouselItemHtml
          carouselItemHtml += `
            <div class="col-12 col-sm-6 col-md-3">
              <div class="text-center">
                <div class="position-relative">
                  <img class="w-100" src="${tutorial.thumb_url}" alt="smile image">
                  <img src="/images/play.png" alt="play" class="play-btn rounded-circle position-absolute" width="64" height="64" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
                </div>
                <div class="mx-3">
                  <div class="font-weight-bold text-dark text-left mt-3">${tutorial.title}</div>
                  <div class="text-secondary text-left mt-3 mb-3">${tutorial["sub-title"]}</div>
                  <div class="d-flex align-items-center mb-3">
                    <img src="${tutorial.author_pic_url}" class="rounded-circle mr-3 video-carousel-img-profile" alt="profile image" width="30" height="30">
                    <div class="purple-text font-weight-bold">${tutorial.author}</div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="d-flex pt-1">${$stars}</div>
                    <div class="purple-text font-weight-bold">${tutorial.duration}</div>
                  </div>
                </div>
              </div>
            </div>`;

          // Incrémente le compteur d'items ajoutés
          itemsAdded++;
          // Si le nombre d'items par slide est atteint et qu'il reste des éléments, commence un nouveau slide
          if (itemsAdded % itemsPerSlide === 0 && index < response.length - 1) {
            carouselItemHtml += `</div></div><div class="carousel-item"><div class="row">`;
          }
        });

        // Ferme les balises ouvertes pour le dernier item du carrousel
        carouselItemHtml += `</div></div>`;
        // Ajoute le HTML construit au carrousel
        $("#carouselVideos .carousel-inner").append(carouselItemHtml);
        // Initialise ou rafraîchit le carrousel pour prendre en compte les nouveaux éléments ajoutés
        $("#carouselVideos").carousel();
      },
    });
  }

  // Fonction pour générer les étoiles en fonction de la note du tutoriel
  function createStars(numberOfStars) {
    let starsHtml = "";
    for (let i = 0; i < numberOfStars; i++) {
      starsHtml +=
        '<img src="./images/star_on.png" class="mr-1 carousel-star-icon" alt="star icon filled in purple" width="15" height="15">';
    }
    for (let i = numberOfStars; i < 5; i++) {
      starsHtml +=
        '<img src="./images/star_off.png" class="carousel-star-icon" alt="star icon filled in grey" width="15" height="15">';
    }
    return starsHtml;
  }

  // Fonction pour charger et afficher les dernières vidéos
  function loadLatestVideos() {
    $.ajax({
      url: "https://smileschool-api.hbtn.info/latest-videos",
      type: "GET",
      beforeSend: function () {
        $("#LVideosLoader").show();
      },
      success: function (response) {
        $("#LVideosLoader").hide();
        displayVideos(response, "#carouselVideos4 .carousel-inner");
      },
    });
  }

  // Fonction pour afficher les vidéos dans les carrousels
  function displayVideos(videos, selector) {
    videos.forEach(function (video, index) {
      let stars = getStars(video.star);
      let videoHtml = `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="${video.thumb_url}" alt="Thumbnail of ${
        video.title
      }" class="img-fluid">
            <div class="carousel-caption d-none d-md-block">
                <h5>${video.title}</h5>
                <p>${video["sub-title"]}</p>
                <div class="video-rating">${stars}</div>
            </div>
        </div>`;
      $(selector).append(videoHtml);
    });
  }

  // Fonction pour générer des étoiles en fonction de la note
  function getStars(rating) {
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      starsHtml +=
        i < rating
          ? '<img src="./images/star_on.png" alt="star">'
          : '<img src="./images/star_off.png" alt="star">';
    }
    return starsHtml;
  }

  // Ajoutez un gestionnaire d'événements pour l'événement de clic de la flèche droite
  $("#nextButton").click(function () {
    // Appelez la fonction pour charger les dernières vidéos
    loadLatestVideos();
  });

  // Appel des fonctions pour charger les données
  displayQuotes();
  loadPopularTutorials();
  loadLatestVideos();
});

// course.html task 5
// Fonction pour rechercher et afficher les tutoriels
function searchvideos() {
  const search = $("#search").val();
  const topic = $("#topic").val();
  const sortby = $("#sortby").val();

  console.log("Search:", search);
  console.log("Topic:", topic);
  console.log("SortBy:", sortby);

  // afficher le loader
  $("#Loader").show();
  $("#container").hide();

  $.ajax({
    url: "https://smileschool-api.hbtn.info/courses",
    type: "GET",
    data: {
      q: search,
      topics: topic,
      sorts: sortby,
    },

    success: function (response) {
      console.log("Response:", response);
      // Cache le loader
      $("#coursesLoader").hide();
      // Vide et prépare le conteneur pour les nouvelles cartes
      $("#coursesContainer").empty();

      // Met à jour la valeur de recherche et les filtres dropdown
      $("#search").val(response.q);
      updateFilters(response.topics, "topic", topic);
      updateFilters(response.sorts, "sortBy", sortby);

      // Boucle sur les cours et ajoute chaque carte
      response.courses.forEach(function (course) {
        appendCourseElement(course);
      });
    },
  });
}

// Fonction pour mettre à jour les filtres
function updateFilters(items, elementId, currentValue) {
  const selector = $("#" + elementId);
  selector.empty(); // vider le contenu actuel du filtre

  console.log("Items:", items);
  console.log("Current value:", currentValue);

  items.forEach(function (item) {
    console.log("Item:", item);
    selector.append(
      $("<option>", {
        value: item,
        text: item,
        selected: item === currentValue, // sélectionner l'élément actuel
      }),
    );
  });
}

// Fonction pour ajouter un élément de cours à la page
function appendCourseElement(courses) {
  //
  $("#coursesContainer").append(`
          <div class="col-12 col-sm-6 col-md-3">
          <div class="text-center">
            <div class="position-relative">
              <img class="w-100" src="${courses.thumb_url}" alt="smile image">
              <img src="/images/play.png" alt="play" class="play-btn rounded-circle position-absolute" width="64" height="64" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
            </div>
            <div class="mx-3">
              <div class="font-weight-bold text-dark text-left mt-3">${courses.title}</div>
              <div class="text-secondary text-left mt-3 mb-3">${courses["sub-title"]}</div>
              <div class="d-flex align-items-center mb-3">
                <img src="${courses.author_pic_url}" class="rounded-circle mr-3 video-carousel-img-profile" alt="profile image" width="30" height="30">
                <div class="purple-text font-weight-bold">${courses.author}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div class="d-flex pt-1">${$stars}</div>
                <div class="purple-text font-weight-bold">${courses.duration}</div>
              </div>
            </div>
          </div>
        </div>`);
}

// Appel de la fonction de recherche lorsque le formulaire est soumis
$("#search").on("input", searchvideos);
$("#topic").on("change", searchvideos);
$("#sortby").on("change", searchvideos);
