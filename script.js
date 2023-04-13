const apiKey = 'qYlQE6LqAsd6q4WWB0oza8yn4eJ8UeFI5ubO7aGO';
const apiUrl = 'https://api.nasa.gov/planetary/apod';
const apodElement = document.getElementById('apod');
const favoriteButton = document.getElementById('favorite-button');
const calendarInput = document.getElementById('calendar-input');
const favoritesGallery = document.getElementById('favorites-gallery');

let currentApod = null;
let favorites = [];

async function fetchApod(date) {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}${date ? `&date=${date}` : ''}`);
    const data = await response.json();
    return data;
}

function showApod(apod) {
  if (!apodElement) return;
  currentApod = apod;
  apodElement.innerHTML = `
    <img src="${apod.url}" alt="${apod.title}">
  `;
  const dateBox = document.getElementById("date-box");
  dateBox.innerText = apod.date;

  const descriptionElement = document.getElementById("description");
  descriptionElement.innerHTML = `
    <h3>${apod.title}</h3>
    <p>${apod.explanation}</p>
  `;
}

function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
    }
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function showFavorites() {
    if (!favoritesGallery) return;
    favoritesGallery.innerHTML = '';
    favorites.forEach(favorite => {
        const img = document.createElement('img');
        img.src = favorite.url;
        img.alt = favorite.title;
        favoritesGallery.appendChild(img);
    });
}

function updateFavoriteButton() {
  if (!currentApod) return;
  const index = favorites.findIndex(fav => fav.date === currentApod.date);
  if (index === -1) {
    favoriteButton.classList.remove('favorited');
  } else {
    favoriteButton.classList.add('favorited');
  }
}

if (calendarInput) {
    const calendar = flatpickr(calendarInput, {
        onChange: async (selectedDates) => {
            if (selectedDates.length === 0) return;
            const date = selectedDates[0].toISOString().split('T')[0];
            localStorage.setItem('selectedDate', date);
            window.location.href = 'index.html';
        },
    });
}

if (favoriteButton) {
    favoriteButton.addEventListener('click', () => {
        if (!currentApod) return;
        const index = favorites.findIndex(fav => fav.date === currentApod.date);
        if (index === -1) {
            favorites.push(currentApod);
            favoriteButton.classList.add('favorited');
        } else {
            favorites.splice(index, 1);
            favoriteButton.classList.remove('favorited');
        }
        saveFavorites();
    });
}

loadFavorites();
showFavorites();

(async () => {
    if (apodElement) {
        const selectedDate = localStorage.getItem('selectedDate');
        const apod = await fetchApod(selectedDate);
        showApod(apod);
        updateFavoriteButton(); // Add this line
        localStorage.removeItem('selectedDate');
    }
})();
