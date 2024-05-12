import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemRmcG1ldXdsZmZvdmx4aGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyOTg1MTMsImV4cCI6MjAzMDg3NDUxM30._yZHPPYwm0ScxEvFNRjQ4SdAjHx9ZyZZKCM0qbtT9Bk'
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to search for people by name or driving license number
async function searchPeople(query) {
    const { data, error } = await supabase
        .from('People')
        .select('*')
        .ilike('name', `%${query}%`) // Search by partial name
        .or(`license_number.eq.${query}`) // Search by license number
        .order('name')

    if (error) {
        console.error('Error searching for people:', error.message)
        return []
    }

    return data
}

// Function to search for vehicle registration number
async function searchVehicle(registrationNumber) {
    const { data, error } = await supabase
        .from('Vehicle')
        .select('*')
        .eq('registration_number', registrationNumber)

    if (error) {
        console.error('Error searching for vehicle:', error.message)
        return null
    }

    return data[0] // Assuming registration numbers are unique, so only one result is expected
}

// Function to add details for a new vehicle
async function addVehicle(registrationNumber, make, model, color, ownerId) {
    const { data, error } = await supabase
        .from('Vehicle')
        .insert([
            {
                registration_number: registrationNumber,
                make: make,
                model: model,
                color: color,
                owner_id: ownerId
            }
        ])

    if (error) {
        console.error('Error adding new vehicle:', error.message)
        return null
    }

    return data[0]
}

// Function to handle form submission from index.html
document.getElementById('people-search-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting via the browser

    const formData = new FormData(event.target);
    const name = formData.get('name');
    const licenseNumber = formData.get('license');

    const peopleData = await searchPeople(name, licenseNumber);

    if (peopleData.length > 0) {
        // Display people data on the page
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results
        peopleData.forEach(person => {
            const personDiv = document.createElement('div');
            personDiv.innerHTML = `<p>Name: ${person.name}</p><p>Address: ${person.address}</p><p>Date of Birth: ${person.dob}</p><p>License Number: ${person.licenseNumber}</p><p>License Expiry Date: ${person.expiryDate}</p>`;
            resultsDiv.appendChild(personDiv);
        });
    } else {
        document.getElementById('results').innerText = 'No matching records found.';
    }
});


// Function to handle form submission from search-vehicles.html (assuming similar form structure)
document.getElementById('search-vehicle-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting via the browser

    const formData = new FormData(event.target);
    const registrationNumber = formData.get('rego');

    const vehicleData = await searchVehicle(registrationNumber);

    if (vehicleData) {
        // Display vehicle data on the page
        document.getElementById('results').innerText = JSON.stringify(vehicleData, null, 2);
    } else {
        document.getElementById('results').innerText = 'Vehicle not found.';
    }
});

// Function to handle form submission from add-vehicle.html
document.getElementById('add-vehicle-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting via the browser

    const formData = new FormData(event.target);
    const registrationNumber = formData.get('rego');
    const make = formData.get('make');
    const model = formData.get('model');
    const color = formData.get('colour'); // 'colour' should match the name attribute in the HTML form
    const ownerId = formData.get('owner');

    const addedVehicle = await addVehicle(registrationNumber, make, model, color, ownerId);

    if (addedVehicle) {
        // Display success message or added vehicle data on the page
        document.getElementById('message').innerText = 'Vehicle added successfully!';
    } else {
        document.getElementById('message').innerText = 'Error adding vehicle. Please try again.';
    }
});