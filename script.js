// left side of pokedex
const mainScreen = document.querySelector(".main-screen");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeFrontImage = document.querySelector(".poke-front-image");
const pokeBackImage = document.querySelector(".poke-back-image");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeWeight = document.querySelector(".poke-weight");
const pokeHeight = document.querySelector(".poke-height");

// right side of pokedex
const pokeListItems = document.querySelectorAll(".list-item");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");

// variables
let prevUrl = "null";
let nextUrl = "null";
let currentType = "hide";

// helper functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const handleLeftButton = () => {
  if (prevUrl) {
    getPokemon(prevUrl);
  }
};

const handleRightButton = () => {
  if (nextUrl) {
    getPokemon(nextUrl);
  }
};

const handleClick = (e) => {
  if (!e.target) return;

  if (!e.target.textContent) return;

  getPokemonInfo(e.target.textContent.split(".")[0]);
};

const getPokemonInfo = async (pokemon) => {
  try {
    const fetchResult = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );

    if (!fetchResult.ok) throw new Error("Problem getting pokemon");

    const data = await fetchResult.json();

    // pokemon information
    pokeName.textContent = data.name;
    pokeId.textContent = `#${data.id.toString().padStart(3, "0")}`;
    pokeWeight.textContent = data.weight;
    pokeHeight.textContent = data.height;

    // pokemon type(s)
    const pokeTypes = data.types;
    pokeTypeOne.textContent = pokeTypes[0].type.name;

    if (pokeTypes.length > 1) {
      pokeTypeTwo.classList.remove("hide");
      pokeTypeTwo.textContent = pokeTypes[1].type.name;
    } else {
      pokeTypeTwo.classList.add("hide");
      pokeTypeTwo.textContent = "";
    }
    mainScreen.classList.remove(currentType);
    mainScreen.classList.add(pokeTypes[0].type.name);
    currentType = pokeTypes[0].type.name;

    // pokemon image
    pokeFrontImage.src = data.sprites.front_default || "";
    pokeBackImage.src = data.sprites.back_default || "";
  } catch (err) {
    console.log(err);
  }
};

const getPokemon = async (url) => {
  try {
    const fetchResult = await fetch(url);

    if (!fetchResult.ok) throw new Error("Problem getting pokemon list");

    const { results, previous, next } = await fetchResult.json();
    prevUrl = previous;
    nextUrl = next;

    pokeListItems.forEach((item, index) => {
      if (results[index]) {
        const urlArray = results[index].url.split("/");
        const id = urlArray.slice(-2, -1)[0];
        item.textContent = `${id}. ${capitalize(results[index].name)}`;

        item.addEventListener("click", handleClick);
      } else {
        item.textContent = "";
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const init = () => {
  getPokemon("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
};

leftButton.addEventListener("click", handleLeftButton);
rightButton.addEventListener("click", handleRightButton);

// init
init();
