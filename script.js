// API Configuration
const APP_ID = '7f47cf53'; // Replace with your Edamam API ID
const APP_KEY = '9940305ce2543ac5e336800b947c1096'; // Replace with your Edamam API Key

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const recipesContainer = document.getElementById('recipes-container');
const loadingElement = document.getElementById('loading');

// Event Listeners
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Search Function
async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    showLoading(true);
    recipesContainer.innerHTML = '';

    try {
        const response = await fetch(
            `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=12`
        );
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayRecipes(data.hits);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showError('Error loading recipes. Please try again.');
    }

    showLoading(false);
}

// Display Recipes Function
function displayRecipes(recipes) {
    if (!recipes.length) {
        showError('No recipes found. Try another search!');
        return;
    }

    recipes.forEach(({ recipe }) => {
        const card = createRecipeCard(recipe);
        recipesContainer.appendChild(card);
    });
}

// Create Recipe Card Function
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const healthLabels = recipe.healthLabels.slice(0, 3);
    const calories = Math.round(recipe.calories);
    const servings = recipe.yield;

    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.label}" class="recipe-image">
        <div class="recipe-content">
            <h2 class="recipe-title">${recipe.label}</h2>
            <div class="recipe-info">
                <span>🔥 ${calories} cal</span>
                <span>👥 ${servings} servings</span>
            </div>
            <div class="recipe-tags">
                ${healthLabels.map(label => `<span class="tag">${label}</span>`).join('')}
            </div>
            <a href="${recipe.url}" target="_blank" class="view-recipe">View Recipe</a>
        </div>
    `;

    return card;
}

// Utility Functions
function showLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
}

function showError(message) {
    recipesContainer.innerHTML = `<p style="text-align: center; width: 100%;">${message}</p>`;
}

// Initialize with default search
window.addEventListener('load', () => {
    searchInput.value = 'pasta';
    performSearch();
});
