// remember to update the API key
// const apiKey = 'udYYnz7XKY2N9BDiXZRh6NJTTIsLeBrrDd7WQB6V'; // Replace with your actual API key

// const apiKey = 'kqCs0NhBDJCNe1SK3BQRSM0OHnmYgpfgGrtWSbJn';

const apiKey = 'c52d7PjFyVgXZlLBW6SbiLgRbt271J69TqYHbeQc';

// const apiKey = 'mKBejuAfWI582qtAjjGa07FKwzAksZcyTJY9rta9'; // Replace with your actual API key
const endpoint = 'https://developer.nps.gov/api/v1/activities/parks'; // Replace with the API endpoint you want to access

// Create headers object with API key
const headers = {
    'X-Api-Key': apiKey,
};

let originData = []

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

// Important: Now you can work with the 'data' variable, which contains the API response as a JavaScript object
        originData = data.data

        console.log(originData)

        renderPieChart(originData.map(item => {
            return {
                name: item.name,
                value: item.parks.length
            }
        }))

        // renderHoney(originData)

        renderBarChart(originData);

        renderTable(originData);


    //     // To display total number of parks in each state
    //     let parksPerState = {}
    //     originData.forEach(item => {
    //         item.parks.forEach(park => {
    //
    //             // To split the states, some parks boarder multiple states
    //             park.states.split(',').forEach(state => {
    //
    //                 // If the state is already in the object, add the park in the corresponding state
    //                 // to the count
    //                 if (parksPerState[state]) {
    //                     parksPerState[state].add(park.name);
    //                 } else {
    //                     const parksSet = new Set();
    //                     parksSet.add(park.name);
    //                     parksPerState[state] = parksSet;
    //                 }
    //             })
    //         })
    //     })
    //
    //     // To count and display the total number of parks in each state.
    //     const parkCountsPerState = {};
    //     Object.keys(parksPerState).forEach(key => {
    //         parkCountsPerState[key] = parksPerState[key].size;
    //     })
    //
    //     console.log("Parks per State:", parksPerState)
    //     console.log("Total number of pars per state:", parkCountsPerState)
    //
    //     // Convert the object of parkCountsPerSate to an array.
    // //    Array to display in descending order
    //     const dataArrayParkPerState = Object.keys(parkCountsPerState).map(key => {
    //         return {
    //             name: key,
    //             value: parkCountsPerState[key]
    //         }
    //     }).sort((a, b) => b.value - a.value)
    //
    //     console.log("Data array of total number of parks in each state:", dataArrayParkPerState)
    //
    //     // initiateBarChart(parkCountsPerState)

    })


    .catch((error) => {
            if (error instanceof TypeError) {
                console.error('Network error:', error.message);
            } else {
                console.error('An error occurred:', error.message);
            }
    });






const baseUrl = "https://developer.nps.gov/api/v1/parks"

let initialData = [];

const fetchParksData = (start = 0) => {
    fetch(`${baseUrl}?start=${start}&api_key=${apiKey}&limit=50`) // Ensure limit is set if needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            initialData = initialData.concat(data.data);

            // renderHoney(initialData);

            // If there is more data to fetch, call the function recursively
            if (initialData.length < parseInt(data.total, 10)) {
                fetchParksData(initialData.length);
            } else {
                // All data has been fetched, process initialData here
                console.log(`Total number of parks: ${initialData.length}`);


                renderHoney(initialData);

            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
};

// Call the function to start fetching data.
fetchParksData();


let myChart = echarts.init(document.getElementById('chart2'))

function renderPieChart(dataset) {
    // let myChart = echarts.init(document.getElementById('chart2'))

    // Customize the color of each pie chart sector
    const datasetWithColors = dataset.map(item => {
        if (item.value > 300) {
            item.itemStyle = {color: '#d2f1dc'}; // Number of Parks > 300
        } else if (item.value > 250) {
            item.itemStyle = {color: '#98c39a'}; // Number of Parks > 200
        } else if (item.value > 200) {
            item.itemStyle = {color: '#879d95'}; // Number of Parks > 150
        } else {
            item.itemStyle = {color: '#516850'}; // Other
        }
        return item;
    });

//
    const legendData = [
        {name: 'Number of Parks > 200', icon: 'circle', textStyle: {color: '#C6D8B7'}},
        {name: 'Number of Parks > 100', icon: 'circle', textStyle: {color: '#718D74'}},
        {name: 'Other', icon: 'circle', textStyle: {color: '#CBCCC7'}},
    ];

// Customize Pie colors
    const customColors = ['#718D74', '#84A786', '#9DBDA5', '#A5B497', '#BBD1AA',
        '#C6D8B7', '#CFD5B8', '#D3E2C3', '#E0E3D0', '#CBCCC7',];

    myChart.setOption({
        tooltip: {
            trigger: 'item',
            // formatter: '{a} <br/>{b} : {c} ({d}%)'

        },
        color: customColors,


        title: {
            text: 'Activities', // The title text
            subtext: 'Try to click the legend!', // A subtitle for additional information (optional)
            left: '70%', // Position the title in the center
            top: 20, // Distance from the top of the container
            textStyle: {
                color: '#333', // Choose a color for the text
                fontWeight: 'bold', // Optionally make the text bold
                fontSize: 16 // Choose an appropriate font size
            }
        },

        legend: {
            // Place the legend at the bottom center
            orient: 'vertical',
            left: '70%',
            bottom: '10%', // Adjust the position of the legend to 5% from the bottom of the container

    // other legend configuration...
            formatter: function (name) {
                let item = legendData.find(item => item.name.includes(name));
                return item ? item.name : name;
            },


        },
// Set the color for the pie chart sectors
        color: ['#718D74', '#C6D8B7', '#CBCCC7'],

        series: [
            {
                name: 'Number of Parks',
                type: 'pie',
                radius: '75%',
                center: ['40%', '50%'],

// In descending order, only show the top 10 popular activities.
                data: dataset.sort((a, b) => b.value - a.value).slice(0, 10),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    })
}


function updatePieChart(selectedState) {
    const dataset = originData.map(item => {

        let count = item.parks.filter(park => park.states.split(',').includes(selectedState)).length
        let newItem = {
            name: item.name,
            value: count
        };



        if (newItem.value > 29) {
            newItem.itemStyle = {color: '#75a690'};

        } else if (newItem.value > 27) {
            newItem.itemStyle = {color: '#84A786'};

        } else if (newItem.value > 25) {
            newItem.itemStyle = {color: '#718D74'};

        } else if (newItem.value > 23) {
            newItem.itemStyle = {color: '#A5B497'};

        } else if (newItem.value > 21) {
            newItem.itemStyle = {color: '#95aca4'};

        } else if (newItem.value > 19) {
            newItem.itemStyle = {color: '#9DBDA5'};

        } else if (newItem.value > 17) {
            newItem.itemStyle = {color: '#BBD1AA'};

        } else if (newItem.value > 15) {
            newItem.itemStyle = {color: '#cfd7b0'};

        } else if (newItem.value > 13) {
            newItem.itemStyle = {color: '#C6D8B7'};

        } else if (newItem.value > 11) {
            newItem.itemStyle = {color: '#E0E3D0'};

        } else if (newItem.value > 9) {
            newItem.itemStyle = {color: '#a79591'};

        } else if (newItem.value > 7) {
            newItem.itemStyle = {color: '#afbbc9'};

        } else if (newItem.value > 5) {
            newItem.itemStyle = {color: '#ecc984'};

        } else if (newItem.value > 3) {
            newItem.itemStyle = {color: '#f1f1f1'};
        } else {
            newItem.itemStyle = {color: '#b9b8b3'}; // Other
        }

        return newItem;


    })

    // Customize the color of each pie chart sector
    // const datasetWithColors = dataset.map(item => {
    //     if (item.value > 300) {
    //         item.itemStyle = {color: '#d2f1dc'}; // Number of Parks > 300
    //     } else if (item.value > 250) {
    //         item.itemStyle = {color: '#98c39a'}; // Number of Parks > 200
    //     } else if (item.value > 200) {
    //         item.itemStyle = {color: '#879d95'}; // Number of Parks > 150
    //     } else {
    //         item.itemStyle = {color: '#516850'}; // Other
    //     }
    //     return item;
    // });


    const legendData = [
        {name: 'Number of Parks > 15', icon: 'circle', textStyle: {color: '#40472e'}},
        {name: 'Number of Parks > 10', icon: 'circle', textStyle: {color: '#ae7c4b'}},
        {name: 'Other', icon: 'circle', textStyle: {color: '#CBCCC7'}},
    ];

    // Customize Pie colors
    const customColors = ['#718D74', '#84A786', '#9DBDA5', '#A5B497', '#BBD1AA',
        '#C6D8B7', '#CFD5B8', '#D3E2C3', '#E0E3D0', '#CBCCC7',];




    myChart.setOption({
        // title: {
        //     text: 'Activities in ' + selectedState,
        //     // left: 'center'
        //     left: '80%', // Position the title in the center
        //     top: 20, // Distance from the top of the container
        // },
        //
        // legend: {
        //     bottom: 0
        // },

        title: {
            text: 'Activities in ' + selectedState,
            subtext: 'Try to click the legend!', // A subtitle for additional information (optional)
            left: '75%', // Position the title in the center
            top: 20, // Distance from the top of the container
            textStyle: {
                color: '#333', // Choose a color for the text
                fontWeight: 'bold', // Optionally make the text bold
                fontSize: 16 // Choose an appropriate font size
            }
        },

        legend: {
            // Place the legend at the bottom center
            orient: 'vertical',
            left: '75%',
            bottom: '10%', // Adjust the position of the legend to 5% from the bottom of the container
        },


        series: [
            {
                data: dataset.sort((a, b) => b.value - a.value).slice(0, 10)
            }
        ]
    })
}


window.onresize = function() {
    myChart.resize();
};



const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "10px")
    .style(" pointer-events", "none");



// Initialize the histogram to display before user's interaction
// function initiateBarChart(dataset) {
//     const maxHeight = 400;
//     // const maxWidth = 600;
//     const maxWidth = 650;
//     const colorArray = ['#718D74', '#84A786', '#9DBDA5',
//         '#A5B497', '#BBD1AA','#C6D8B7',
//         '#CFD5B8', '#D3E2C3', '#E0E3D0', '#CBCCC7'];
//     // let result = []
//
//     const margin = {
//         top: 20,
//         right: 60,
//         bottom: 60,
//         // left: 60,
//         left: 110,
//     };
//     // dataset.forEach(item => {
//     //     item.parks.forEach(park => {
//     //         park.states.split(',').forEach(state => {
//     //             let findItem = result.find(el => el.name === state)
//     //             if (findItem) {
//     //                 findItem.value++
//     //                 findItem.parks.add(park.name)
//     //             } else {
//     //                 const parks = new Set()
//     //                 parks.add(park.name)
//     //                 result.push({
//     //                     name: state,
//     //                     value: 1,
//     //                     parks
//     //                 })
//     //             }
//     //         })
//     //     })
//     // })
//     let result = Object.keys(dataset).map(key => {
//         return {
//             name: key,
//             value: dataset[key]
//         };
//     });
//
//     result = result.sort((a, b) => b.value - a.value).slice(0, 10)
//
//
//
// // Define the width of each bar in the bar chart
//     const barWidth = 20;
//
// // Create an array to hold tick values for x-axis
//     const xTicks = new Array(result.length + 1);
//     for (let i = 0; i <= result.length; i++) {
//         xTicks[i] = i;
//     }
//
// // Functions to extract 'x' and 'y' values for scaling
//     const getX = (d) => d.name;
//     const getY = (d) => d.value;
//
// // Create a point scale for x-axis using D3
//     const scaleX = d3.scalePoint()
//         .domain(result.map(getX)) // Set the domain based on 'name' data
//         .range([0, maxWidth - margin.left - margin.right]) // Set the range based on available width
//         .padding(0.2); // Add padding between the bars
//
// // Create a linear scale for y-axis using D3
//     const scaleY = d3.scaleLinear()
//         .domain([0, d3.max(result, getY)]) // Set the domain based on 'value' data
//         .range([maxHeight - margin.top - margin.bottom, 0]); // Set the range within the available height
//
// // Remove any existing SVG elements from the 'chart1' div
//     document.querySelectorAll('#chart1>svg').forEach(item => {
//         item.remove();
//     });
//
// // Create an SVG element for the bar chart and set its width and height
//     const svg = d3.select('#chart1')
//         .append('svg')
//         .attr('width', maxWidth)
//         .attr('height', maxHeight);
//
// // Create bars in the bar chart for each data point
//     const bar = svg.selectAll('rect')
//         .data(result)
//         .enter()
//         .append('rect')
//         .attr('x', (d) => scaleX(getX(d)) + margin.left - barWidth / 2) // Set x position of the bars
//         .attr('y', (d) => scaleY(getY(d)) + margin.top) // Set y position of the bars
//         .attr('width', barWidth) // Set the width of each bar
//         .attr('height', (d) => maxHeight - margin.bottom - margin.top - scaleY(getY(d))) // Set the height of each bar
//         .attr('fill', (d, i) => colorArray[i % colorArray.length]) // Apply color to the bars
//         .on("mouseover", function (d) {
//             tooltip.html(Array.from(d.parks).join('<br>')); // Display parks' names on hover
//             tooltip.style("opacity", 1); // Set tooltip opacity to make it visible
//         })
//         .on("mousemove", function (d) {
//             tooltip.style("left", (d3.event.pageX + 10) + "px") // Adjust tooltip position according to mouse movement
//                 .style("top", (d3.event.pageY) + "px");
//         })
//         .on("mouseout", function (d) {
//             tooltip.style("opacity", 0); // Hide the tooltip on mouseout
//         })
//
//         .on('click', function (d) {
//             updatePieChart(d.name)
//             renderTable(originData.filter(item => item.name === d.name)[0].parks)
//         })
//
//         .style('cursor', 'pointer');
//
//
// // Create and append the y-axis to the SVG chart
//     const axisLeft = d3.axisLeft(scaleY);
//     svg.append('g')
//         .attr('transform', `translate(${margin.left}, ${margin.top})`)
//         .call(axisLeft);
//
// // Create and append the x-axis to the SVG chart
//     const axisBottom = d3.axisBottom(scaleX);
//     svg.append('g')
//         .attr('transform', `translate(${margin.left}, ${maxHeight - margin.bottom})`)
//         .call(axisBottom);
//
//     // Label the x-axis for 'State'
//     svg.append("text")
//         .attr("x", maxWidth / 2)
//         .attr("y", maxHeight - 5)
//         .attr("fill", '#fff')
//         .style("text-anchor", "middle")
//         .text("State")
//
//     // Label the y-axis for 'Number of Parks'
//     svg.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("x", 0 - maxHeight / 2)
//         // .attr("y", 10)
//         .attr("y", margin.left/2)
//         .attr("fill", '#fff')
//         .style("text-anchor", "middle")
//         .text("Number of Parks")
//         .style("text-anchor", "middle")
//
// }


// Created bar chart by using D3 library.
function renderBarChart(dataset) {
    const maxHeight = 400;
    // const maxWidth = 600;
    const maxWidth = 650;
    const colorArray = ['#718D74', '#84A786', '#9DBDA5',
        '#A5B497', '#BBD1AA','#C6D8B7',
        '#CFD5B8', '#D3E2C3', '#E0E3D0', '#CBCCC7'];


    // let result = []

    const margin = {
        top: 20,
        right: 60,
        bottom: 60,
        // left: 60,
        left: 110,
    };

    let stateSet = {}
    dataset.forEach(item => {
        item.parks.forEach(park => {
            park.states.split(',').forEach(state => {
                if (stateSet[state]){
                    stateSet[state].add(park.name)
                } else {
                    const parkSet = new Set()
                    parkSet.add(park.name)
                    stateSet[state] = parkSet
                }
            })
        })
    })

    let result = []

    Object.keys(stateSet).forEach(key => {
        result[key] = stateSet[key].size
        result.push({
            name: key,
            value: stateSet[key].size,
            parks: Array.from(stateSet[key])
        })
    })

    console.log(result)

    //             let findItem = result.find(el => el.name === state)
    //             if (findItem) {
    //                 findItem.value++
    //                 findItem.parks.add(park.name)
    //             } else {
    //                 const parks = new Set()
    //                 parks.add(park.name)
    //                 result.push({
    //                     name: state,
    //                     value: 1,
    //                     parks
    //                 })
    //             }
    //         })
    //     })
    // })

    result = result.sort((a, b) => b.value - a.value).slice(0, 10)

// Define the width of each bar in the bar chart
    const barWidth = 20;

// Create an array to hold tick values for x-axis
    const xTicks = new Array(result.length + 1);
    for (let i = 0; i <= result.length; i++) {
        xTicks[i] = i;
    }

// Functions to extract 'x' and 'y' values for scaling
    const getX = (d) => d.name;
    const getY = (d) => d.value;

// Create a point scale for x-axis using D3
    const scaleX = d3.scalePoint()
        .domain(result.map(getX)) // Set the domain based on 'name' data
        .range([0, maxWidth - margin.left - margin.right]) // Set the range based on available width
        .padding(0.2); // Add padding between the bars

// Create a linear scale for y-axis using D3
    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(result, getY)]) // Set the domain based on 'value' data
        .range([maxHeight - margin.top - margin.bottom, 0]); // Set the range within the available height

// Remove any existing SVG elements from the 'chart1' div
    document.querySelectorAll('#chart1>svg').forEach(item => {
        item.remove();
    });

// Create an SVG element for the bar chart and set its width and height
    const svg = d3.select('#chart1')
        .append('svg')
        .attr('width', maxWidth)
        .attr('height', maxHeight);

// Create bars in the bar chart for each data point
    const bar = svg.selectAll('rect')
        .data(result)
        .enter()
        .append('rect')
        .attr('x', (d) => scaleX(getX(d)) + margin.left - barWidth / 2) // Set x position of the bars
        .attr('y', (d) => scaleY(getY(d)) + margin.top) // Set y position of the bars
        .attr('width', barWidth) // Set the width of each bar
        .attr('height', (d) => maxHeight - margin.bottom - margin.top - scaleY(getY(d))) // Set the height of each bar
        .attr('fill', (d, i) => colorArray[i % colorArray.length]) // Apply color to the bars
        .on("mouseover", function (d) {
            tooltip.html(Array.from(d.parks).join('<br>')); // Display parks' names on hover
            tooltip.style("opacity", 1); // Set tooltip opacity to make it visible
        })
        .on("mousemove", function (d) {
            tooltip.style("left", (d3.event.pageX + 10) + "px") // Adjust tooltip position according to mouse movement
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.style("opacity", 0); // Hide the tooltip on mouseout
        })

        .style('cursor', 'pointer')

        .on('click', function (d) {
            updatePieChart(d.name)
        });

// Create and append the y-axis to the SVG chart
    const axisLeft = d3.axisLeft(scaleY);
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(axisLeft);

// Create and append the x-axis to the SVG chart
    const axisBottom = d3.axisBottom(scaleX);
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${maxHeight - margin.bottom})`)
        .call(axisBottom);

    // Label the x-axis for 'State'
    svg.append("text")
        .attr("x", maxWidth / 2)
        .attr("y", maxHeight - 5)
        .attr("fill", '#fff')
        .style("text-anchor", "middle")
        .text("State")

    // Label the y-axis for 'Number of Parks'
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - maxHeight / 2)
        // .attr("y", 10)
        .attr("y", margin.left/2)
        .attr("fill", '#fff')
        .style("text-anchor", "middle")
        .text("Number of Parks")
        .style("text-anchor", "middle")

}

$('#bar-chart-wrapper').mouseout(function () {
    tooltip.style("opacity", 0);
})



// $('#user-search-btn').click(function () {
//     let searchContent = $('#user-search-input').val().toLowerCase()
//     let searchList = originData.filter(item => item.name.toLowerCase().indexOf(searchContent) !== -1)
//
//     let parksPerState = {}
//     originData.forEach(item => {
//         item.parks.forEach(park => {
//
//             // To split the states, some parks boarder multiple states
//             park.states.split(',').forEach(state => {
//
//                 // If the state is already in the object, add the park in the corresponding state
//                 // to the count
//                 if (parksPerState[state]) {
//                     parksPerState[state].add(park.name);
//                 } else {
//                     const parksSet = new Set();
//                     parksSet.add(park.name);
//                     parksPerState[state] = parksSet;
//                 }
//             })
//         })
//     })
//
//     // To count and display the total number of parks in each state.
//     const parkCountsPerState = {};
//     Object.keys(parksPerState).forEach(key => {
//         parkCountsPerState[key] = parksPerState[key].size;
//     })
//
//     if (searchList.length === 0) {
//
//         initiateBarChart(parkCountsPerState);
//     } else {
//         console.log(searchList);
//         renderBarChart(searchList);
//     }
//
//     // console.log(searchList)
//     // renderBarChart(searchList)
// // renderTable(searchList)
// })


function search() {
    // let searchContent = $('#user-search-input').val().toLowerCase();
    let searchContent = $('#user-search-input').val().toLowerCase().trim();

    // let searchList = originData.filter(item => item.name.toLowerCase().indexOf(searchContent) !== -1);

    let searchList = [];

    if (searchContent !== '') {
        searchList = originData.filter(item => item.name.toLowerCase().includes(searchContent));
    }

    let parksPerState = {}
    originData.forEach(item => {
        item.parks.forEach(park => {

            // To split the states, some parks boarder multiple states
            park.states.split(',').forEach(state => {

                // If the state is already in the object, add the park in the corresponding state
                // to the count
                if (parksPerState[state]) {
                    parksPerState[state].add(park.name);
                } else {
                    const parksSet = new Set();
                    parksSet.add(park.name);
                    parksPerState[state] = parksSet;
                }
            })
        })
    })

    // To count and display the total number of parks in each state.
    const parkCountsPerState = {};
    Object.keys(parksPerState).forEach(key => {
        parkCountsPerState[key] = parksPerState[key].size;
    })


    if (searchList.length === 0) {
        // initiateBarChart(parkCountsPerState);
        renderBarChart(originData);
    } else {
        console.log(searchList);
        renderBarChart(searchList);
    }

    // console.log(searchList);
    // renderBarChart(searchList);
    // renderTable(searchList);
}

// Press the button to search
// $('#user-search-btn').click(search);

$('#user-search-btn').click(function() {
    search();
});

// $('#user-search-input').on('input', search);

$('#user-search-input').keypress(function (e) {
    if (e.which === 13) { // 13 for Enter button on keyboard
        search();
    }
});


let table = new DataTable('#table', {
    processing: true,
// searching: false,
    paging: true,
    pageLength: 10,
    serverSide: false
});


// The function for honeycomb chart by fetching Park API.

function renderHoney(dataset) {

    // Process the state park counts
    const stateParkCounts = dataset.reduce((acc, park) => {
        const states = Array.isArray(park.states) ? park.states.join(',') : park.states;
        const stateList = states.split(',');
        stateList.forEach(state => {
            const trimmedState = state.trim();
            acc[trimmedState] = (acc[trimmedState] || 0) + 1;
        });
        return acc;
    }, {});

    const totalParksPerState = Object.keys(stateParkCounts).map(state => ({
        state: state,
        count: stateParkCounts[state]
    }));

    console.log("look", totalParksPerState);

    let parksPerState = {};

    // Map the initialData to the format required by the chart.
    totalParksPerState.forEach(item => {
        parksPerState[item.state] = item.count;





    });

    console.log("Parks per State just before chart initialization:", parksPerState);

    Highcharts.chart('container2', {
        chart: {
            type: 'tilemap',
            inverted: true,
            height: '80%',

            events: {
                load: function () {
                    // This function runs when the chart is loaded
                    var series = this.series[0]; // Assuming it's the first series

                    series.data.forEach(function (point) {

                        console.log(point['hc-a2'], parksPerState[point['hc-a2']]);

                        if (parksPerState.hasOwnProperty(point['hc-a2'])) {
                            point.value = parksPerState[point['hc-a2']];
                        } else {
                            point.value = 0;
                        }
                    });

                    this.redraw();
                }
            }
        },

        accessibility: {
            description: 'iles are positioned to geographically echo the map of the USA. A color-coded legend states the population levels as below 1 million (beige), 1 to 5 million (orange), 5 to 20 million (pink) and above 20 million (hot pink). The chart is interactive, and the individual state data points are displayed upon hovering. Three states have a population of above 20 million: California (39.3 million), Texas (27.9 million) and Florida (20.6 million). The northern US region from Massachusetts in the Northwest to Illinois in the Midwest contains the highest concentration of states with a population of 5 to 20 million people. The southern US region from South Carolina in the Southeast to New Mexico in the Southwest contains the highest concentration of states with a population of 1 to 5 million people. 6 states have a population of less than 1 million people; these include Alaska, Delaware, Wyoming, North Dakota, South Dakota and Vermont. The state with the lowest population is Wyoming in the Northwest with 584,153 people.',
            screenReaderSection: {
                beforeChartFormat:
                    '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            },
            point: {
                valueDescriptionFormat: '{index}. {xDescription}, {point.value}.'
            }
        },

        title: {
            text: 'The Total Number of National Parks in Each State',
            style: {
                fontSize: '1em'
            }
        },

        // subtitle: {
        //     text: 'Source:<a href="https://simple.wikipedia.org/wiki/List_of_U.S._states_by_population">Wikipedia</a>'
        // },

        xAxis: {
            visible: false
        },

        yAxis: {
            visible: false
        },

        colorAxis: {
            dataClasses: [{
                from: 0,
                to: 5,
                color: '#d3e2c3',
                name: '< 5'
            }, {
                from: 5,
                to: 10,
                color: '#8fc4a8',
                name: '5 - 10'
            }, {
                from: 10,
                to: 15,
                color: '#a0c7c6',
                name: ' 10 - 15'
            }, {
                from: 15,
                color: '#3f7283',
                name: '> 15'
            }]
        },

        tooltip: {
            headerFormat: '',
            pointFormat: 'Total number of National Park in <b> {point.name}</b> is <b>{point.value}</b>'
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.hc-a2}',
                    color: '#000000',
                    style: {
                        textOutline: false
                    }
                }
            }
        },


        series: [{
            name: '',
            data: [{
                'hc-a2': 'AL',
                name: 'Alabama',
                region: 'South',
                x: 6,
                y: 7,
                value: parksPerState['AL']
            }, {
                'hc-a2': 'AK',
                name: 'Alaska',
                region: 'West',
                x: 0,
                y: 0,
                value: parksPerState['AK']
            }, {
                'hc-a2': 'AZ',
                name: 'Arizona',
                region: 'West',
                x: 5,
                y: 3,
                value: parksPerState['AZ']
            }, {
                'hc-a2': 'AR',
                name: 'Arkansas',
                region: 'South',
                x: 5,
                y: 6,
                value: 2994079
            }, {
                'hc-a2': 'CA',
                name: 'California',
                region: 'West',
                x: 5,
                y: 2,
                value: 39250017
            }, {
                'hc-a2': 'CO',
                name: 'Colorado',
                region: 'West',
                x: 4,
                y: 3,
                value: 5540545
            }, {
                'hc-a2': 'CT',
                name: 'Connecticut',
                region: 'Northeast',
                x: 3,
                y: 11,
                value: 3596677
            }, {
                'hc-a2': 'DE',
                name: 'Delaware',
                region: 'South',
                x: 4,
                y: 9,
                value: 935614
            }, {
                'hc-a2': 'DC',
                name: 'District of Columbia',
                region: 'South',
                x: 4,
                y: 10,
                value: 7288000
            }, {
                'hc-a2': 'FL',
                name: 'Florida',
                region: 'South',
                x: 8,
                y: 8,
                value: 20612439
            }, {
                'hc-a2': 'GA',
                name: 'Georgia',
                region: 'South',
                x: 7,
                y: 8,
                value: 10310371
            }, {
                'hc-a2': 'HI',
                name: 'Hawaii',
                region: 'West',
                x: 8,
                y: 0,
                value: 1419561
            }, {
                'hc-a2': 'ID',
                name: 'Idaho',
                region: 'West',
                x: 3,
                y: 2,
                value: 1634464
            }, {
                'hc-a2': 'IL',
                name: 'Illinois',
                region: 'Midwest',
                x: 3,
                y: 6,
                value: 12801539
            }, {
                'hc-a2': 'IN',
                name: 'Indiana',
                region: 'Midwest',
                x: 3,
                y: 7,
                value: 6596855
            }, {
                'hc-a2': 'IA',
                name: 'Iowa',
                region: 'Midwest',
                x: 3,
                y: 5,
                value: 3107126
            }, {
                'hc-a2': 'KS',
                name: 'Kansas',
                region: 'Midwest',
                x: 5,
                y: 5,
                value: 2904021
            }, {
                'hc-a2': 'KY',
                name: 'Kentucky',
                region: 'South',
                x: 4,
                y: 6,
                value: 4413457
            }, {
                'hc-a2': 'LA',
                name: 'Louisiana',
                region: 'South',
                x: 6,
                y: 5,
                value: 4649676
            }, {
                'hc-a2': 'ME',
                name: 'Maine',
                region: 'Northeast',
                x: 0,
                y: 11,
                value: 1330089
            }, {
                'hc-a2': 'MD',
                name: 'Maryland',
                region: 'South',
                x: 4,
                y: 8,
                value: 6016447
            }, {
                'hc-a2': 'MA',
                name: 'Massachusetts',
                region: 'Northeast',
                x: 2,
                y: 10,
                value: 6811779
            }, {
                'hc-a2': 'MI',
                name: 'Michigan',
                region: 'Midwest',
                x: 2,
                y: 7,
                value: 9928301
            }, {
                'hc-a2': 'MN',
                name: 'Minnesota',
                region: 'Midwest',
                x: 2,
                y: 4,
                value: 5519952
            }, {
                'hc-a2': 'MS',
                name: 'Mississippi',
                region: 'South',
                x: 6,
                y: 6,
                value: 2984926
            }, {
                'hc-a2': 'MO',
                name: 'Missouri',
                region: 'Midwest',
                x: 4,
                y: 5,
                value: 6093000
            }, {
                'hc-a2': 'MT',
                name: 'Montana',
                region: 'West',
                x: 2,
                y: 2,
                value: 1023579
            }, {
                'hc-a2': 'NE',
                name: 'Nebraska',
                region: 'Midwest',
                x: 4,
                y: 4,
                value: 1881503
            }, {
                'hc-a2': 'NV',
                name: 'Nevada',
                region: 'West',
                x: 4,
                y: 2,
                value: 2839099
            }, {
                'hc-a2': 'NH',
                name: 'New Hampshire',
                region: 'Northeast',
                x: 1,
                y: 11,
                value: 1326813
            }, {
                'hc-a2': 'NJ',
                name: 'New Jersey',
                region: 'Northeast',
                x: 3,
                y: 10,
                value: 8944469
            }, {
                'hc-a2': 'NM',
                name: 'New Mexico',
                region: 'West',
                x: 6,
                y: 3,
                value: 2085572
            }, {
                'hc-a2': 'NY',
                name: 'New York',
                region: 'Northeast',
                x: 2,
                y: 9,
                value: 19745289
            }, {
                'hc-a2': 'NC',
                name: 'North Carolina',
                region: 'South',
                x: 5,
                y: 9,
                value: 10146788
            }, {
                'hc-a2': 'ND',
                name: 'North Dakota',
                region: 'Midwest',
                x: 2,
                y: 3,
                value: 739482
            }, {
                'hc-a2': 'OH',
                name: 'Ohio',
                region: 'Midwest',
                x: 3,
                y: 8,
                value: 11614373
            }, {
                'hc-a2': 'OK',
                name: 'Oklahoma',
                region: 'South',
                x: 6,
                y: 4,
                value: 3878051
            }, {
                'hc-a2': 'OR',
                name: 'Oregon',
                region: 'West',
                x: 4,
                y: 1,
                value: 3970239
            }, {
                'hc-a2': 'PA',
                name: 'Pennsylvania',
                region: 'Northeast',
                x: 3,
                y: 9,
                value: 12784227
            }, {
                'hc-a2': 'RI',
                name: 'Rhode Island',
                region: 'Northeast',
                x: 2,
                y: 11,
                value: 1055173
            }, {
                'hc-a2': 'SC',
                name: 'South Carolina',
                region: 'South',
                x: 6,
                y: 8,
                value: 4832482
            }, {
                'hc-a2': 'SD',
                name: 'South Dakota',
                region: 'Midwest',
                x: 3,
                y: 4,
                value: 853175
            }, {
                'hc-a2': 'TN',
                name: 'Tennessee',
                region: 'South',
                x: 5,
                y: 7,
                value: 6651194
            }, {
                'hc-a2': 'TX',
                name: 'Texas',
                region: 'South',
                x: 7,
                y: 4,
                value: 27862596
            }, {
                'hc-a2': 'UT',
                name: 'Utah',
                region: 'West',
                x: 5,
                y: 4,
                value: 2942902
            }, {
                'hc-a2': 'VT',
                name: 'Vermont',
                region: 'Northeast',
                x: 1,
                y: 10,
                value: 626011
            }, {
                'hc-a2': 'VA',
                name: 'Virginia',
                region: 'South',
                x: 5,
                y: 8,
                value: 8411808
            }, {
                'hc-a2': 'WA',
                name: 'Washington',
                region: 'West',
                x: 2,
                y: 1,
                value: 7288000
            }, {
                'hc-a2': 'WV',
                name: 'West Virginia',
                region: 'South',
                x: 4,
                y: 7,
                value: 1850326
            }, {
                'hc-a2': 'WI',
                name: 'Wisconsin',
                region: 'Midwest',
                x: 2,
                y: 5,
                value: 5778708
            }, {
                'hc-a2': 'WY',
                name: 'Wyoming',
                region: 'West',
                x: 3,
                y: 3,
                value: 584153
            }]
        }]


    });

    console.log(parksPerState);
}


// function renderHoney(dataset) {
//
//     let newParkData = {};
//
//     // Ensure that originData is populated before processing it
//     originData.forEach(item => {
//         // let park = item.parks; // Make sure this matches the data structure
//         newParkData = item.parks;
//
//         // console.log("newpark data:" + newParkData)
//     });
//
//     let parksPerState = newParkData.reduce((accumulator, park) => {
//         let state = park.states;
//
//         accumulator[state] = (accumulator[state] || 0) + 1;
//
//         return accumulator;
//     }, {});
//
//     // let parksPerState = newParkData.reduce((accumulator, park) => {
//     //     // Check if the state is already a property on the accumulator
//     //     // If it is, increment the count, otherwise set it to 1
//     //     accumulator[park.states] = (accumulator[park.states] || 0) + 1;
//     //     return accumulator;
//     // }, {});
//
//
// // let parksPerState = newParkData.reduce((accumulator, park) => {
// //     // Check if the state is already a property on the accumulator
// //     // If it is, increment the count, otherwise set it to 1
// //     accumulator[park.states] = (accumulator[park.states] || 0) + 1;
// //     return accumulator;
// // }, {});
//
//
//     Highcharts.chart('container2', {
//         chart: {
//             type: 'tilemap',
//             inverted: true,
//             height: '80%',
//
//             events: {
//                 load: function () {
//                     // This function runs when the chart is loaded
//                     var series = this.series[0]; // Assuming it's the first series
//
//                     series.data.forEach(function (point) {
//                         if (parksPerState.hasOwnProperty(point['hc-a2'])) {
//                             point.value = parksPerState[point['hc-a2']];
//                         } else {
//                             point.value = 0;
//                         }
//                     });
//
//                     // You might need to redraw/update the chart if you're modifying the series after the chart's initial render
//                     this.redraw();
//                 }
//             }
//         },
//
//         accessibility: {
//             description: 'iles are positioned to geographically echo the map of the USA. A color-coded legend states the population levels as below 1 million (beige), 1 to 5 million (orange), 5 to 20 million (pink) and above 20 million (hot pink). The chart is interactive, and the individual state data points are displayed upon hovering. Three states have a population of above 20 million: California (39.3 million), Texas (27.9 million) and Florida (20.6 million). The northern US region from Massachusetts in the Northwest to Illinois in the Midwest contains the highest concentration of states with a population of 5 to 20 million people. The southern US region from South Carolina in the Southeast to New Mexico in the Southwest contains the highest concentration of states with a population of 1 to 5 million people. 6 states have a population of less than 1 million people; these include Alaska, Delaware, Wyoming, North Dakota, South Dakota and Vermont. The state with the lowest population is Wyoming in the Northwest with 584,153 people.',
//             screenReaderSection: {
//                 beforeChartFormat:
//                     '<h5>{chartTitle}</h5>' +
//                     '<div>{chartSubtitle}</div>' +
//                     '<div>{chartLongdesc}</div>' +
//                     '<div>{viewTableButton}</div>'
//             },
//             point: {
//                 valueDescriptionFormat: '{index}. {xDescription}, {point.value}.'
//             }
//         },
//
//         title: {
//             text: 'The Total Number of National Parks in Each State',
//             style: {
//                 fontSize: '1em'
//             }
//         },
//
// // subtitle: {
// //     text: 'Source:<a href="https://simple.wikipedia.org/wiki/List_of_U.S._states_by_population">Wikipedia</a>'
// // },
//
//         xAxis: {
//             visible: false
//         },
//
//         yAxis: {
//             visible: false
//         },
//
//         colorAxis: {
//             dataClasses: [{
//                 from: 0,
//                 to: 1,
//                 color: '#d3e2c3',
//                 name: ' = 1'
//             }, {
//                 from: 2,
//                 to: 5,
//                 color: '#8fc4a8',
//                 name: '2 - 5'
//             }, {
//                 from: 6,
//                 to: 10,
//                 color: '#a0c7c6',
//                 name: ' 6 - 10'
//             }, {
//                 from: 10,
//                 color: '#3f7283',
//                 name: '> 10'
//             }]
//         },
//
//         tooltip: {
//             headerFormat: '',
//             pointFormat: 'Total number of National Park in <b> {point.name}</b> is <b>{point.value}</b>'
//         },
//
//         plotOptions: {
//             series: {
//                 dataLabels: {
//                     enabled: true,
//                     format: '{point.hc-a2}',
//                     color: '#000000',
//                     style: {
//                         textOutline: false
//                     }
//                 }
//             }
//         },
//
//
//         series: [{
//             name: '',
//             data: [{
//                 'hc-a2': 'AL',
//                 name: 'Alabama',
//                 region: 'South',
//                 x: 6,
//                 y: 7,
//                 value: parksPerState['AL']
//             }, {
//                 'hc-a2': 'AK',
//                 name: 'Alaska',
//                 region: 'West',
//                 x: 0,
//                 y: 0,
//                 value: parksPerState['AK']
//             }, {
//                 'hc-a2': 'AZ',
//                 name: 'Arizona',
//                 region: 'West',
//                 x: 5,
//                 y: 3,
//                 value: parksPerState['AZ']
//             }, {
//                 'hc-a2': 'AR',
//                 name: 'Arkansas',
//                 region: 'South',
//                 x: 5,
//                 y: 6,
//                 value: 2994079
//             }, {
//                 'hc-a2': 'CA',
//                 name: 'California',
//                 region: 'West',
//                 x: 5,
//                 y: 2,
//                 value: 39250017
//             }, {
//                 'hc-a2': 'CO',
//                 name: 'Colorado',
//                 region: 'West',
//                 x: 4,
//                 y: 3,
//                 value: 5540545
//             }, {
//                 'hc-a2': 'CT',
//                 name: 'Connecticut',
//                 region: 'Northeast',
//                 x: 3,
//                 y: 11,
//                 value: 3596677
//             }, {
//                 'hc-a2': 'DE',
//                 name: 'Delaware',
//                 region: 'South',
//                 x: 4,
//                 y: 9,
//                 value: 935614
//             }, {
//                 'hc-a2': 'DC',
//                 name: 'District of Columbia',
//                 region: 'South',
//                 x: 4,
//                 y: 10,
//                 value: 7288000
//             }, {
//                 'hc-a2': 'FL',
//                 name: 'Florida',
//                 region: 'South',
//                 x: 8,
//                 y: 8,
//                 value: 20612439
//             }, {
//                 'hc-a2': 'GA',
//                 name: 'Georgia',
//                 region: 'South',
//                 x: 7,
//                 y: 8,
//                 value: 10310371
//             }, {
//                 'hc-a2': 'HI',
//                 name: 'Hawaii',
//                 region: 'West',
//                 x: 8,
//                 y: 0,
//                 value: 1419561
//             }, {
//                 'hc-a2': 'ID',
//                 name: 'Idaho',
//                 region: 'West',
//                 x: 3,
//                 y: 2,
//                 value: 1634464
//             }, {
//                 'hc-a2': 'IL',
//                 name: 'Illinois',
//                 region: 'Midwest',
//                 x: 3,
//                 y: 6,
//                 value: 12801539
//             }, {
//                 'hc-a2': 'IN',
//                 name: 'Indiana',
//                 region: 'Midwest',
//                 x: 3,
//                 y: 7,
//                 value: 6596855
//             }, {
//                 'hc-a2': 'IA',
//                 name: 'Iowa',
//                 region: 'Midwest',
//                 x: 3,
//                 y: 5,
//                 value: 3107126
//             }, {
//                 'hc-a2': 'KS',
//                 name: 'Kansas',
//                 region: 'Midwest',
//                 x: 5,
//                 y: 5,
//                 value: 2904021
//             }, {
//                 'hc-a2': 'KY',
//                 name: 'Kentucky',
//                 region: 'South',
//                 x: 4,
//                 y: 6,
//                 value: 4413457
//             }, {
//                 'hc-a2': 'LA',
//                 name: 'Louisiana',
//                 region: 'South',
//                 x: 6,
//                 y: 5,
//                 value: 4649676
//             }, {
//                 'hc-a2': 'ME',
//                 name: 'Maine',
//                 region: 'Northeast',
//                 x: 0,
//                 y: 11,
//                 value: 1330089
//             }, {
//                 'hc-a2': 'MD',
//                 name: 'Maryland',
//                 region: 'South',
//                 x: 4,
//                 y: 8,
//                 value: 6016447
//             }, {
//                 'hc-a2': 'MA',
//                 name: 'Massachusetts',
//                 region: 'Northeast',
//                 x: 2,
//                 y: 10,
//                 value: 6811779
//             }, {
//                 'hc-a2': 'MI',
//                 name: 'Michigan',
//                 region: 'Midwest',
//                 x: 2,
//                 y: 7,
//                 value: 9928301
//             }, {
//                 'hc-a2': 'MN',
//                 name: 'Minnesota',
//                 region: 'Midwest',
//                 x: 2,
//                 y: 4,
//                 value: 5519952
//             }, {
//                 'hc-a2': 'MS',
//                 name: 'Mississippi',
//                 region: 'South',
//                 x: 6,
//                 y: 6,
//                 value: 2984926
//             }, {
//                 'hc-a2': 'MO',
//                 name: 'Missouri',
//                 region: 'Midwest',
//                 x: 4,
//                 y: 5,
//                 value: 6093000
//             }, {
//                 'hc-a2': 'MT',
//                 name: 'Montana',
//                 region: 'West',
//                 x: 2,
//                 y: 2,
//                 value: 1023579
//             }, {
//                 'hc-a2': 'NE',
//                 name: 'Nebraska',
//                 region: 'Midwest',
//                 x: 4,
//                 y: 4,
//                 value: 1881503
//             }, {
//                 'hc-a2': 'NV',
//                 name: 'Nevada',
//                 region: 'West',
//                 x: 4,
//                 y: 2,
//                 value: 2839099
//             }, {
//                 'hc-a2': 'NH',
//                 name: 'New Hampshire',
//                 region: 'Northeast',
//                 x: 1,
//                 y: 11,
//                 value: 1326813
//             }, {
//                 'hc-a2': 'NJ',
//                 name: 'New Jersey',
//                 region: 'Northeast',
//                 x: 3,
//                 y: 10,
//                 value: 8944469
//             }, {
//                 'hc-a2': 'NM',
//                 name: 'New Mexico',
//                 region: 'West',
//                 x: 6,
//                 y: 3,
//                 value: 2085572
//             }, {
//                 'hc-a2': 'NY',
//                 name: 'New York',
//                 region: 'Northeast',
//                 x: 2,
//                 y: 9,
//                 value: 19745289
//             }, {
//                 'hc-a2': 'NC',
//                 name: 'North Carolina',
//                 region: 'South',
//                 x: 5,
//                 y: 9,
//                 value: 10146788
//             }, {
//                 'hc-a2': 'ND',
//                 name: 'North Dakota',
//                 region: 'Midwest',
//                 x: 2,
//                 y: 3,
//                 value: 739482
//             }, {
//                 'hc-a2': 'OH',
//                 name: 'Ohio',
//                 region: 'Midwest',
//                 x: 3,
//                 y: 8,
//                 value: 11614373
//             }, {
//                 'hc-a2': 'OK',
//                 name: 'Oklahoma',
//                 region: 'South',
//                 x: 6,
//                 y: 4,
//                 value: 3878051
//             }, {
//                 'hc-a2': 'OR',
//                 name: 'Oregon',
//                 region: 'West',
//                 x: 4,
//                 y: 1,
//                 value: 3970239
//             }, {
//                 'hc-a2': 'PA',
//                 name: 'Pennsylvania',
//                 region: 'Northeast',
//                 x: 3,
//                 y: 9,
//                 value: 12784227
//             }, {
//                 'hc-a2': 'RI',
//                 name: 'Rhode Island',
//                 region: 'Northeast',
//                 x: 2,
//                 y: 11,
//                 value: 1055173
//             }, {
//                 'hc-a2': 'SC',
//                 name: 'South Carolina',
//                 region: 'South',
//                 x: 6,
//                 y: 8,
//                 value: 4832482
//             }, {
//                 'hc-a2': 'SD',
//                 name: 'South Dakota',
//                 region: 'Midwest',
//                 x: 3,
//                 y: 4,
//                 value: 853175
//             }, {
//                 'hc-a2': 'TN',
//                 name: 'Tennessee',
//                 region: 'South',
//                 x: 5,
//                 y: 7,
//                 value: 6651194
//             }, {
//                 'hc-a2': 'TX',
//                 name: 'Texas',
//                 region: 'South',
//                 x: 7,
//                 y: 4,
//                 value: 27862596
//             }, {
//                 'hc-a2': 'UT',
//                 name: 'Utah',
//                 region: 'West',
//                 x: 5,
//                 y: 4,
//                 value: 2942902
//             }, {
//                 'hc-a2': 'VT',
//                 name: 'Vermont',
//                 region: 'Northeast',
//                 x: 1,
//                 y: 10,
//                 value: 626011
//             }, {
//                 'hc-a2': 'VA',
//                 name: 'Virginia',
//                 region: 'South',
//                 x: 5,
//                 y: 8,
//                 value: 8411808
//             }, {
//                 'hc-a2': 'WA',
//                 name: 'Washington',
//                 region: 'West',
//                 x: 2,
//                 y: 1,
//                 value: 7288000
//             }, {
//                 'hc-a2': 'WV',
//                 name: 'West Virginia',
//                 region: 'South',
//                 x: 4,
//                 y: 7,
//                 value: 1850326
//             }, {
//                 'hc-a2': 'WI',
//                 name: 'Wisconsin',
//                 region: 'Midwest',
//                 x: 2,
//                 y: 5,
//                 value: 5778708
//             }, {
//                 'hc-a2': 'WY',
//                 name: 'Wyoming',
//                 region: 'West',
//                 x: 3,
//                 y: 3,
//                 value: 584153
//             }]
//         }]
//
//
//     });
//
//     console.log(parksPerState);
// }


// The function to render the table.
function renderTable(searchList) {

    // const filteredList = searchList.filter(item => item.states.includes(selectedStateCode));
    // let filteredList = searchList.filter(item => item.states.includes(selectedStateCode));


    let tableResult = []
    searchList.forEach(item => {
        tableResult.push(...item.parks.map(el => {
            return {
                activity: item.name,
                ...el
            }
        }))
    })

    table.destroy();
    table = $('#table').DataTable({
        processing: true,
        // searching: false,
        paging: true,
        data: tableResult.map(item => [item.name, item.fullName, item.states, item.designation, item.activity]),
        pageLength: 10,
        serverSide: false,
        columns: [
            {title: "Park", width: "40%"}, // Adjust the width as needed
            {title: "Full Name", width: "40%"},
            {title: "State", width: "1%"},
            {title: "Designation", width: "50%"},
            {title: "Activity", width: "50%"},
        ]
    })
}

// $('#user-search-btn').click(function () {
//     let searchContent = $('#user-search-input').val().toLowerCase()
//     let searchList = originData.filter(item => item.name.toLowerCase().indexOf(searchContent) !== -1)
//     console.log(searchList)
//     renderBarChart(searchList)
// // renderTable(searchList)
// })



// Map View Section

function renderMapView() {


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
                displayParkInfo(data.data)


                // displayParkInfo(selectedState, data.data)
                //
                // console.log('nihao', selectedState, data.data)


                // displayParkInfo(data.data, selectedStateText);

                // displayParkInfo(data.data, document.getElementById('stateSelect').options[document.getElementById('stateSelect').selectedIndex].text);


                // Update global variable with the current state's park data
                // currentStateParkData = data.data;

                // Use the global variable for displaying park info
                // displayParkInfo(data.data);

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



    const displayParkInfo = (parks) => {
        const totalParks = document.getElementById("totalParks")
        const stateSelect = document.getElementById("stateSelect")
        // const selectedState = stateSelect.value

        if (stateSelect.value === "allStatesOption") {
        // if (stateSelect.options[stateSelect.selectedIndex].id === "allStatesOption") {
            totalParks.textContent = ""
            map.setView([39.8283, -98.5795], 4.4)

            // totalParks.content = ""
        } else if (parks.length > 0) {
            const firstPark = parks[0]
            totalParks.textContent = `Total National Parks in ${stateSelect.value}: ${parks.length}`
        } else {
            parkName.textContent = "No parks found in the selected state."
            totalParks.textContent = ""
        }
    }


    const clearMarkers = () => {
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer)
            }
        })
    }


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




}
renderMapView();