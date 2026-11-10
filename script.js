const search = document.getElementById("search");

const cards = document.querySelectorAll(".card");

const filters = document.querySelectorAll(".filter");

const counter = document.getElementById("counter");

const terminalCounter =
    document.getElementById("terminalCounter");

const noResults =
    document.getElementById("noResults");


let currentFilter = "all";



/* =========================
   ПОИСК
========================= */

function updateCards() {

    const text =
        search.value.toLowerCase().trim();

    let visibleCards = 0;


    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        const type =
            card.dataset.type.toLowerCase();

        const allText =
            card.innerText.toLowerCase();


        const searchMatch =
            name.includes(text) ||
            type.includes(text) ||
            allText.includes(text);


        const filterMatch =
            currentFilter === "all" ||
            type.includes(currentFilter);


        if (searchMatch && filterMatch) {

            card.style.display = "block";

            visibleCards++;

        } else {

            card.style.display = "none";

        }

    });


    counter.textContent =
        visibleCards;

    terminalCounter.textContent =
        String(visibleCards).padStart(2, "0");


    if (visibleCards === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }

}



/* =========================
   INPUT SEARCH
========================= */

search.addEventListener(
    "input",
    updateCards
);



/* =========================
   ФИЛЬТРЫ
========================= */

filters.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            filters.forEach(item => {

                item.classList.remove("active");

            });


            this.classList.add("active");


            currentFilter =
                this.dataset.filter;


            updateCards();

        }
    );

});



/* =========================
   CTRL + K
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            search.focus();

        }


        if (event.key === "Escape") {

            closeCard();

        }

    }
);



/* =========================
   ОКНО КАРТОЧКИ
========================= */

const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const modalDesignation =
    document.getElementById(
        "modalDesignation"
    );

const modalThreat =
    document.getElementById(
        "modalThreat"
    );

const modalDescription =
    document.getElementById(
        "modalDescription"
    );



function openCard(
    title,
    designation,
    threat,
    description
) {

    modalTitle.textContent =
        title;

    modalDesignation.textContent =
        designation;

    modalThreat.textContent =
        threat;

    modalDescription.textContent =
        description;


    modal.classList.add("open");

}



function closeCard() {

    modal.classList.remove("open");

}



/* Закрыть при клике рядом */

modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            closeCard();

        }

    }
);



/* =========================
   НАЧАЛЬНЫЙ СЧЁТЧИК
========================= */

updateCards();