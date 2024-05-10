// Initialize Supabase client
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemRmcG1ldXdsZmZvdmx4aGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyOTg1MTMsImV4cCI6MjAzMDg3NDUxM30._yZHPPYwm0ScxEvFNRjQ4SdAjHx9ZyZZKCM0qbtT9Bk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to handle form submission for querying vehicles
document.getElementById("queryVehiclesForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const searchInput = document.getElementById("searchInput").value.trim().toUpperCase();
    // Call function to search for vehicles in the database using the Supabase client
    const searchResults = await searchVehicles(searchInput);
    displaySearchResults(searchResults);
});

// Function to search for vehicles in the database
async function searchVehicles(searchInput) {
    const { data, error } = await supabase
        .from('Vehicle')
        .select('*')
        .eq('RegistrationNumber', searchInput);

    if (error) {
        console.error('Error searching for vehicles:', error.message);
        return [];
    }

    return data;
}

// Function to display search results
function displaySearchResults(results) {
    const searchResultsDiv = document.getElementById("searchResults");
    searchResultsDiv.innerHTML = "";

    if (results.length === 0) {
        searchResultsDiv.textContent = "No results found.";
        return;
    }

    const resultList = document.createElement("ul");
    results.forEach(vehicle => {
        const listItem = document.createElement("li");
        listItem.textContent = `${vehicle.Make} ${vehicle.Model} - ${vehicle.Colour}`;
        resultList.appendChild(listItem);
    });

    searchResultsDiv.appendChild(resultList);
}