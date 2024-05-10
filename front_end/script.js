import { createClient } from '@supabase/supabase-js'

// Supabase initialization
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to search people by name or driving license number
async function searchPeople(query) {
    const { data, error } = await supabase
        .from('People')
        .select('*')
        .ilike('Name', `%${query}%`) // Case insensitive partial name match
        .or('LicenseNumber', 'eq', query.toUpperCase()) // Case insensitive match for license number
    if (error) {
        console.error('Error searching people:', error.message)
        return []
    }
    return data
}

// Function to search vehicle by registration number
async function searchVehicle(registrationNumber) {
    const { data, error } = await supabase
        .from('Vehicle')
        .select('*')
        .eq('VehicleID', registrationNumber.toUpperCase()) // Case insensitive match for registration number
    if (error) {
        console.error('Error searching vehicle:', error.message)
        return null
    }
    return data[0] // Assuming there's only one vehicle per registration number
}

// Function to add a new vehicle
async function addVehicle(vehicleDetails) {
    const { data, error } = await supabase
        .from('Vehicle')
        .insert(vehicleDetails)
    if (error) {
        console.error('Error adding vehicle:', error.message)
        return false
    }
    return true
}

export { searchPeople, searchVehicle, addVehicle }