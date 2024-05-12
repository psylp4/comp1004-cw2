import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemRmcG1ldXdsZmZvdmx4aGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyOTg1MTMsImV4cCI6MjAzMDg3NDUxM30._yZHPPYwm0ScxEvFNRjQ4SdAjHx9ZyZZKCM0qbtT9Bk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to search for people by name or driving license number
async function searchPeople(query) {
  const { data, error } = await supabase
    .from('People')
    .select('*')
    .or(`Name.ilike.%${query}%, LicenseNumber.ilike.%${query}%`);

  if (error) {
    console.error('Error searching for people:', error.message);
    return [];
  }

  return data;
}

// Function to search for vehicle details by registration number
async function searchVehicle(registrationNumber) {
  const { data, error } = await supabase
    .from('Vehicles')
    .select('Make, Model, Colour, OwnerID')
    .eq('VehicleID', registrationNumber);

  if (error) {
    console.error('Error searching for vehicle:', error.message);
    return null;
  }

  return data[0] || null;
}

// Function to add details for a new vehicle
async function addVehicle(registrationNumber, make, model, colour, ownerID) {
  const { data, error } = await supabase
    .from('Vehicles')
    .insert([{ VehicleID: registrationNumber, Make: make, Model: model, Colour: colour, OwnerID: ownerID }]);

  if (error) {
    console.error('Error adding vehicle:', error.message);
    return false;
  }

  return true;
}

// Function to handle form submission for people search
document.getElementById('people-search-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission
  
  const name = document.getElementById('name').value.trim(); // Get name input value
  const license = document.getElementById('license').value.trim(); // Get license number input value
  
  // Call function to search for people based on name or license number
  const results = await searchPeople(name, license);
  
  // Display search results
  displaySearchResults(results);
});

// Function to handle form submission for vehicle search
document.getElementById('vehicle-search-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission
  
  const rego = document.getElementById('rego').value.trim(); // Get registration number input value
  
  // Call function to search for vehicle details by registration number
  const result = await searchVehicle(rego);
  
  // Display search result
  displaySearchResult(result);
});

// Function to handle form submission for adding a vehicle
document.getElementById('add-vehicle-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission
  
  const rego = document.getElementById('rego').value.trim(); // Get registration number input value
  const make = document.getElementById('make').value.trim(); // Get make input value
  const model = document.getElementById('model').value.trim(); // Get model input value
  const colour = document.getElementById('colour').value.trim(); // Get colour input value
  const ownerID = document.getElementById('owner').value.trim(); // Get owner ID input value
  
  // Call function to add new vehicle details
  const success = await addVehicle(rego, make, model, colour, ownerID);
  
  // Display success or error message
  displayMessage(success);
});

// Function to display search results for people
function displaySearchResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
  } else {
    const ul = document.createElement('ul');
    results.forEach(person => {
      const li = document.createElement('li');
      li.textContent = `${person.Name}, ${person.Address}, DOB: ${person.DOB}, License: ${person.LicenseNumber}`;
      ul.appendChild(li);
    });
    resultsContainer.appendChild(ul);
  }
}

// Function to display search result for vehicle
function displaySearchResult(result) {
  const resultContainer = document.getElementById('results');
  resultContainer.innerHTML = ''; // Clear previous result
  
  if (!result) {
    resultContainer.innerHTML = '<p>No results found.</p>';
  } else {
    const { Make, Model, Colour, OwnerID } = result;
    resultContainer.innerHTML = `<p>Make: ${Make}, Model: ${Model}, Colour: ${Colour}, OwnerID: ${OwnerID}</p>`;
  }
}

// Function to display success or error message
function displayMessage(success) {
  const messageContainer = document.getElementById('message');
  messageContainer.innerHTML = ''; // Clear previous message
  
  if (success) {
    messageContainer.innerHTML = '<p>Vehicle added successfully!</p>';
  } else {
    messageContainer.innerHTML = '<p>Error adding vehicle. Please try again.</p>';
  }
}