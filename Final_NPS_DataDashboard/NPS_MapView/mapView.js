


// const apiKey = "EuMlTootGBcfp1i57CvVcYIJJ6d1J8yZjASqI8IG"
const baseUrlTwo = "https://developer.nps.gov/api/v1/parks"

let map

const stateCoordinates = {
    'al': [32.806671, -86.791130],
    'ak': [61.370716, -152.404419],
    'az': [33.729759, -111.431221],
    'ar': [34.969704, -92.373123],
    'ca': [36.116203, -119.681564],
    'co': [39.059811, -105.311104],
    'ct': [41.597782, -72.755371],
    'de': [39.318523, -75.507141],
    'fl': [27.766279, -81.686783],
    'ga': [33.040619, -83.643074],
    'hi': [21.094318, -157.498337],
    'id': [44.240459, -114.478828],
    'il': [40.349457, -88.986137],
    'in': [39.849426, -86.258278],
    'ia': [42.011539, -93.210526],
    'ks': [38.526600, -96.726486],
    'ky': [37.668140, -84.670067],
    'la': [31.169546, -91.867805],
    'me': [44.693947, -69.381927],
    'md': [39.063946, -76.802101],
    'ma': [42.230171, -71.530106],
    'mi': [43.326618, -84.536095],
    'mn': [45.694454, -93.900192],
    'ms': [32.741646, -89.678696],
    'mo': [38.456085, -92.288368],
    'mt': [46.921925, -110.454353],
    'ne': [41.125370, -98.268082],
    'nv': [38.313515, -117.055374],
    'nh': [43.452492, -71.563896],
    'nj': [40.298904, -74.521011],
    'nm': [34.840515, -106.248482],
    'ny': [42.165726, -74.948051],
    'nc': [35.630066, -79.806419],
    'nd': [47.528912, -99.784012],
    'oh': [40.388783, -82.764915],
    'ok': [35.565342, -96.928917],
    'or': [44.572021, -122.070938],
    'pa': [40.590752, -77.209755],
    'ri': [41.680893, -71.511780],
    'sc': [33.856892, -80.945007],
    'sd': [44.299782, -99.438828],
    'tn': [35.747845, -86.692345],
    'tx': [31.054487, -97.563461],
    'ut': [40.150032, -111.862434],
    'vt': [44.045876, -72.710686],
    'va': [37.769337, -78.169968],
    'wa': [47.400902, -121.490494],
    'wv': [38.491226, -80.954570],
    'wi': [44.268543, -89.616508],
    'wy': [42.755966, -107.302490]
};



// Move the event listener setup to a separate function
const setupEventListeners = () => {
    document.getElementById('stateSelect').addEventListener('change', () => {
        const selectedState = document.getElementById('stateSelect').value;
        if (selectedState) {
            queryParks(selectedState);
        } else {
            map.setView([39.8283, -98.5795], 4.4);
            clearMarkers();
        }
    });
}


const queryParks = (stateCode) => {
    fetch(`${baseUrlTwo}?stateCode=${stateCode}&api_key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {


            clearMarkers()
            displayParksOnMap(data.data)
            // displayParkInfo(data.data)

            const selectedStateText = document.getElementById('stateSelect').options[document.getElementById('stateSelect').selectedIndex].text;
            // displayParkInfo(data.data, selectedStateText);

            // displayParkInfo(data.data, document.getElementById('stateSelect').options[document.getElementById('stateSelect').selectedIndex].text);


            // Update global variable with the current state's park data
            // currentStateParkData = data.data;

            // Use the global variable for displaying park info
            displayParkInfo(currentStateParkData, stateCode);

            if (stateCoordinates[stateCode]) {
                map.setView(stateCoordinates[stateCode], 4.5); // Adjust the zoom level as needed
            }

            console.log(data.data);

            // Log the fetched dataset here
            console.log(data.data);

        })
        .catch((error) => console.error("Error fetching data:", error))
}

// console.log(queryParks);

const displayParksOnMap = (parks) => {
    parks.forEach((park) => {
        const {latitude, longitude, fullName, url, images} = park
        if (latitude && longitude) {
            const popupContent = `<b>${fullName}</b><br>`
            if (images && images.length > 0) {
                const imageUrl = images[0].url // Assuming the first image is used
                const parkImage = `<img src="${imageUrl}" alt="${fullName}" style="max-width: 100%; height: auto;">`
                const parkLink = url
                    ? `<a href="${url}" target="_blank">Visit official website</a>`
                    : ""
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(popupContent + parkImage + parkLink, {
                        minWidth: 200,
                    })
            } else {
                const parkLink = url
                    ? `<a href="${url}" target="_blank">Visit official website</a>`
                    : ""
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(popupContent + parkLink, {minWidth: 200})
            }
        }
    })
}

// const displayParkInfo = (parks) => {
//     const totalParks = document.getElementById("totalParks");
//     document.getElementById('stateSelect').addEventListener('change', function() {
//         var selectedState = event.target.value;
//         console.log(selectedState);
//
//     if (parks.length > 0) {
//         const firstPark = parks[0]
//
//             // console.log(selectedState)
//             totalParks.textContent = `Total National Parks in ${selectedState}: ${parks.length}`
//     } else {
//         parkName.textContent = "No parks found in the selected state."
//         totalParks.textContent = "";
//     }
// });



    const displayParkInfo = (parks, stateCode) => {
        const totalParks = document.getElementById("totalParks")

        const parkInfoContainer = document.getElementById("parkInfo");


        document.getElementById('stateSelect').addEventListener('change', function() {
            // var selectedState = event.target.value;

            // To get the text of the user's selected option.
            const selectedState = this.options[this.selectedIndex].text;

            const h3Element = document.getElementById("parkInfo-subtitle");


            if (selectedState === "All States") {
                totalParks.textContent = ""; // Don't display the total parks if the user selects "All States"
                // parkName.textContent = "";
                if (h3Element) {
                    h3Element.remove();
                }
                return;
            }

            // totalParks.textContent = `Total National Parks in ${selectedState}: ${parks.length}`
            if (parks.length > 0) {
                const firstPark = parks[0]
                totalParks.textContent = `Total National Parks in ${selectedState}: ${parks.length}`;

                // parkInfoContainer.style.backgroundColor = "#80ced6";
                totalParks.style.color = "rgb(255,255,255)";
                parkInfoContainer.style.transition = "background-color 0.5s ease";


                // Remove the <h3 id="parkInfo-subtitle"> element here if it exists when displaying the totalParks.textContent
                if (h3Element) {
                    h3Element.remove(); // Remove the <h3> element if it exists
                }


            } else {
                parkName.textContent = "No parks found in the selected state."
                totalParks.textContent = ""
            }

        });

    };

// changeState();

//
// document.getElementById('stateSelect').addEventListener('change', function() {
//     const selectedState = this.options[this.selectedIndex].text;
//     const selectedValue = this.value;
//
//     if (selectedValue) {
//         queryParks(selectedValue);
//     } else {
//         displayParkInfo([], "All States");
//     }
// });



    // const displayParkInfo = (parks) => {
    //     const totalParks = document.getElementById("totalParks")
    //
    //     if (parks.length > 0) {
    //         const firstPark = parks[0]
    //         totalParks.textContent = `Total National Parks in State: ${parks.length}`
    //     } else {
    //         parkName.textContent = "No parks found in the selected state."
    //         totalParks.textContent = ""
    //     }
    // }

const clearMarkers = () => {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer)
        }
    })
}


let currentStateParkData = [];

const changeState = () => {
    const stateSelect = document.getElementById("stateSelect")
    const selectedState = stateSelect.value
    // queryParks(selectedState)

    if (selectedState) {
        queryParks(selectedState);
    } else {
        // Reset the map view to show the entire US

        // map.setView([39.8283, -98.5795], 4);

        // Reset the map view to show the entire US
        map.setView([39.8283, -98.5795], 4.4);

        clearMarkers();
    }

}

// document.getElementById('stateSelect').addEventListener('change', changeState);


// Initial query based on the default state (Alabama)
map = L.map("map").setView([39.8283, -98.5795], 4)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map)

// Add the change event listener to the select element
document.getElementById('stateSelect').addEventListener('change', changeState);

// Optionally, call changeState initially to handle the default selected option
changeState();



// Initial setup
// map = L.map("map").setView([39.8283, -98.5795], 4); // This sets the initial view to the entire US
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "© OpenStreetMap contributors",
// }).addTo(map);


// queryParks("al")
// queryParks()

const mapUrl =
    "https://raw.githubusercontent.com/theozh2022/Trailblazer/main/us-census17-geo.json"
const parksUrl =
    "https://raw.githubusercontent.com/theozh2022/Trailblazer/main/nps-geo-boundary.json"
const forestsUrl =
    "https://raw.githubusercontent.com/theozh2022/Trailblazer/main/national-forests-geo.json"

censusLayer = L.geoJSON(null, {
    style: {
        color: "#ffffff", // Set the boundary line color to white
        // fillColor: "#595cae", // Set the fill color
        fillColor:"#C3E1AF",
        fillOpacity: 0.3, // Set the fill opacity
        weight: 1, // Set the weight of the boundary line
    },
}).addTo(map)

const parksLayer = L.geoJSON(null, {
    style: {
        color: "#f18973", // Set the boundary color to blue
        fillColor: "#f18973", // Set the fill color to blue
        fillOpacity: 0.5, // Set the fill opacity
        weight: 1, // Set the weight of the boundary line
    },
}).addTo(map)

const forestsLayer = L.geoJSON(null, {
    style: {
        color: "#0b8457", // Set the boundary color to blue
        fillColor: "#0b8457", // Set the fill color to blue
        fillOpacity: 0.5, // Set the fill opacity
        weight: 1, // Set the weight of the boundary line
    },
}).addTo(map)

fetch(mapUrl)
    .then((response) => response.json())
    .then((data) => censusLayer.addData(data))
fetch(parksUrl)
    .then((response) => response.json())
    .then((data) => parksLayer.addData(data))
fetch(forestsUrl)
    .then((response) => response.json())
    .then((data) => forestsLayer.addData(data))



