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
  
      // Fetch the updated animals list after adding a new one
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
  