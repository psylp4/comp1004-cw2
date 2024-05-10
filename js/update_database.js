// Initialize Supabase client
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemRmcG1ldXdsZmZvdmx4aGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyOTg1MTMsImV4cCI6MjAzMDg3NDUxM30._yZHPPYwm0ScxEvFNRjQ4SdAjHx9ZyZZKCM0qbtT9Bk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to handle form submission for updating the database with a new vehicle
document.getElementById("updateDatabaseForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const registrationNumber = document.getElementById("registrationNumber").value.trim().toUpperCase();
    const make = document.getElementById("make").value.trim();
    const model = document.getElementById("model").value.trim();
    const colour = document.getElementById("colour").value.trim();
    const ownerID = document.getElementById("ownerID").value.trim(); // Assuming ownerID is obtained from another form field
    // Call function to add a new vehicle to the database using the Supabase client
    const success = await addVehicleToDatabase(registrationNumber, make, model, colour, ownerID);
    displayUpdateResult(success);
});

// Function to add a new vehicle to the database
async function addVehicleToDatabase(registrationNumber, make, model, colour, ownerID) {
    const { error } = await supabase
        .from('Vehicle')
        .insert([{ RegistrationNumber: registrationNumber, Make: make, Model: model, Colour: colour, OwnerID: ownerID }]);
    
    if (error) {
        console.error('Error adding vehicle to database:', error.message);
        return false;
    }

    return true;
}

// Function to display update result
function displayUpdateResult(success) {
    const updateResultDiv = document.getElementById("updateResult");
    updateResultDiv.textContent = success ? "Vehicle added successfully." : "Failed to add vehicle.";
}