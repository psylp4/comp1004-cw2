import { createClient } from '@supabase/supabase-js'

// Supabase initialization
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co'
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlemRmcG1ldXdsZmZvdmx4aGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyOTg1MTMsImV4cCI6MjAzMDg3NDUxM30._yZHPPYwm0ScxEvFNRjQ4SdAjHx9ZyZZKCM0qbtT9Bk
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to look up people by name or driving license number
async function searchPeople(query) {
  const { data, error } = await supabase
    .from('People')
    .select('*')
    .ilike('Name', `%${query}%`)
    .or(`LicenseNumber.ilike.%${query}%`)
  if (error) {
    console.error('Error searching people:', error.message)
    return []
  }
  return data
}

// Function to look up vehicle registration number
async function searchVehicle(registrationNumber) {
  const { data, error } = await supabase
    .from('Vehicles')
    .select('*')
    .eq('VehicleID', registrationNumber)
  if (error) {
    console.error('Error searching vehicle:', error.message)
    return null
  }
  return data[0]
}

// Function to add a new vehicle with owner details
async function addVehicle(registrationNumber, make, model, colour, ownerID) {
  const { data, error } = await supabase
    .from('Vehicles')
    .insert([{ VehicleID: registrationNumber, Make: make, Model: model, Colour: colour, OwnerID: ownerID }])
  if (error) {
    console.error('Error adding vehicle:', error.message)
    return false
  }
  return true
}