import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
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

export { searchPeople, searchVehicle, addVehicle }