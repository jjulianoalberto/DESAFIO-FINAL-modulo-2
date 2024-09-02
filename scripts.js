document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://rickandmortyapi.com/api/character/";
  const charactersPerPage = 6;
  let currentPage = 1;
  let totalPages = 0;
  let allCharacters = [];
  let pagesFetched = {};

  function fetchCharacters(page = 1, name = "") {
    let url = `${apiUrl}?page=${page}`;
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }

    axios
      .get(url)
      .then((response) => {
        const fetchedCharacters = response.data.results;
        totalPages = response.data.info.pages;

        allCharacters = [
          ...allCharacters.slice(0, (page - 1) * charactersPerPage),
          ...fetchedCharacters,
        ];
        pagesFetched[page] = fetchedCharacters;

        displayCharacters(getCharactersForPage(page));
        setupPagination(totalPages, page);
      })
      .catch((error) => console.error("Erro ao buscar personagens:", error));
  }

  function displayCharacters(characters) {
    const list = document.getElementById("characters-list");
    list.innerHTML = "";
    characters.forEach((character) => {
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
                <div class="card fade-in bg-transparent p-3">
                    <img src="${character.image}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title text-white">${character.name}</h5>
                        <p class="card-text text-white">Status: ${character.status}</p>
                        <p class="card-text text-white">Espécie: ${character.species}</p>
                        <a href="details.html?id=${character.id}" class="btn btn-primary">Ver detalhes</a>
                    </div>
                </div>
            `;
      list.appendChild(card);

      setTimeout(() => card.querySelector(".card").classList.add("show"), 10);
    });
  }

  function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (currentPage > 1) {
      const prevItem = document.createElement("li");
      prevItem.className = "page-item";
      prevItem.innerHTML =
        '<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
      prevItem.addEventListener("click", function (event) {
        event.preventDefault();
        fetchCharacters(currentPage - 1);
      });
      pagination.appendChild(prevItem);
    }

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      const pageItem = document.createElement("li");
      pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
      pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pageItem.addEventListener("click", function (event) {
        event.preventDefault();
        fetchCharacters(i);
      });
      pagination.appendChild(pageItem);
    }

    if (currentPage < totalPages) {
      const nextItem = document.createElement("li");
      nextItem.className = "page-item";
      nextItem.innerHTML =
        '<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>';
      nextItem.addEventListener("click", function (event) {
        event.preventDefault();
        fetchCharacters(currentPage + 1);
      });
      pagination.appendChild(nextItem);
    }
  }

  function getCharactersForPage(page) {
    const start = (page - 1) * charactersPerPage;
    const end = start + charactersPerPage;
    return allCharacters.slice(start, end);
  }

  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("search-input").value.trim();
      currentPage = 1;
      fetchCharacters(currentPage, name);
    });

  fetchCharacters();
});
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://rickandmortyapi.com/api/character/";

  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get("id");

  if (characterId) {
    axios
      .get(`${apiUrl}${characterId}`)
      .then((response) => {
        const character = response.data;
        document.getElementById("character-image").src = character.image;
        document.getElementById("character-name").textContent = character.name;
        document.getElementById(
          "character-status"
        ).textContent = `Status: ${character.status}`;
        document.getElementById(
          "character-species"
        ).textContent = `Espécie: ${character.species}`;
        document.getElementById(
          "character-location"
        ).textContent = `Localização: ${character.location.name}`;
      })
      .catch((error) =>
        console.error("Erro ao buscar detalhes do personagem:", error)
      );
  } else {
    console.error("ID do personagem não encontrado na URL.");
  }
});
