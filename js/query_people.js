// Initialize Supabase client
const supabase = createSupabaseClient();

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