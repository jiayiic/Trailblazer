
const apiKey = 'mKBejuAfWI582qtAjjGa07FKwzAksZcyTJY9rta9'; // Replace with your actual API key

const endpoint = 'https://developer.nps.gov/api/v1/amenities/parksvisitorcenters'; // Replace with the API endpoint you want to access

// Create headers object with API key
const headers = {
  'X-Api-Key': apiKey,
};

// Make a GET request to the API
fetch(endpoint, {
  method: 'GET',
  headers: headers,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Now you can work with the 'data' variable, which contains the API response as a JavaScript object
    console.log(data);
  })
  .catch((error) => {
    if (error instanceof TypeError) {
      console.error('Network error:', error.message);
    } else {
      console.error('An error occurred:', error.message);
    }
  });

