// Initialize Supabase client
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemRmcG1ldXdsZmZvdmx4aGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyOTg1MTMsImV4cCI6MjAzMDg3NDUxM30._yZHPPYwm0ScxEvFNRjQ4SdAjHx9ZyZZKCM0qbtT9Bk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to handle form submission for querying people
document.getElementById("queryPeopleForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    // Call function to search for people in the database using the Supabase client
    const searchResults = await searchPeople(searchTerm);
    displaySearchResults(searchResults);
});

// Function to search for people in the database
async function searchPeople(searchTerm) {
    const { data, error } = await supabase
        .from('People')
        .select('*')
        .or(`Name.ilike.%${searchTerm}%`, { LicenseNumber: searchTerm });
    
    if (error) {
        console.error('Error searching for people:', error.message);
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
    results.forEach(person => {
        const listItem = document.createElement("li");
        listItem.textContent = `${person.Name} - ${person.Address}`;
        resultList.appendChild(listItem);
    });

    searchResultsDiv.appendChild(resultList);
}