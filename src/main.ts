
interface Animal {
  id: number;
  name: string;
  species: string;
  age: number;
}

interface SpeciesCount {
  species: string;
  _count: number;
}

const API_URL = "http://localhost:3000";


async function fetchAnimals(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/animals`);
    const animals: Animal[] = await response.json();
    populateAnimalsTable(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
  }
}


function populateAnimalsTable(animals: Animal[]): void {
  const tableBody = document.getElementById("animals-body") as HTMLElement;
  const template = document.getElementById("animal-row-template") as HTMLTemplateElement;

  tableBody.innerHTML = ""; 
  animals.forEach((animal) => {
    const clone = template.content.cloneNode(true) as HTMLElement;
    (clone.querySelector(".animal-id") as HTMLElement).textContent = animal.id.toString();
    (clone.querySelector(".animal-name") as HTMLElement).textContent = animal.name;
    (clone.querySelector(".animal-species") as HTMLElement).textContent = animal.species;
    (clone.querySelector(".animal-age") as HTMLElement).textContent = animal.age.toString();

    

    tableBody.appendChild(clone);
  });
}

async function fetchSpeciesCount(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/animals/bySpecies`);
    const speciesCounts: SpeciesCount[] = await response.json();
    populateSpeciesTable(speciesCounts);
  } catch (error) {
    console.error("Error fetching species count:", error);
  }
}


function populateSpeciesTable(speciesCounts: SpeciesCount[]): void {
  const tableBody = document.getElementById("species-body") as HTMLElement;
  const template = document.getElementById("species-row-template") as HTMLTemplateElement;

  tableBody.innerHTML = ""; 
  speciesCounts.forEach((species) => {
    const clone = template.content.cloneNode(true) as HTMLElement;
    
    // Handle undefined or missing species count
    const speciesCount = species._count !== undefined && species._count !== null ? species._count.toString() : 'N/A';
    
    (clone.querySelector(".species-name") as HTMLElement).textContent = species.species;
    (clone.querySelector(".species-count") as HTMLElement).textContent = speciesCount;

    

    tableBody.appendChild(clone);
  });
}

async function addAnimal(event: Event): Promise<void> {
  event.preventDefault();

  
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const species = (document.getElementById("species") as HTMLInputElement).value;
  const age = parseInt((document.getElementById("age") as HTMLInputElement).value);

  const animal = { name, species, age };

  try {
    const response = await fetch(`${API_URL}/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(animal)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unknown error');
    }

    fetchAnimals();
  } catch (error) {
    displayErrorMessage(error.message);
  }
}

function displayErrorMessage(message: string): void {
  const errorMessageElement = document.getElementById("error-message") as HTMLElement;
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = 'block';
}

function init(): void {
  fetchAnimals();
  fetchSpeciesCount();

  const addAnimalForm = document.getElementById("add-animal-form") as HTMLFormElement;
  addAnimalForm.addEventListener("submit", addAnimal);
}



document.addEventListener("DOMContentLoaded", init);


