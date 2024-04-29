const modal = document.getElementById("inputInfo");
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.querySelector('#inputInfo .close');


openModalButton.addEventListener("click", function() {
    modal.classList.add("show");
    modal.style.display = "block";
});

closeModalButton.addEventListener("click", function() {
    modal.classList.remove("show");
    modal.style.display = "none";
  });


mapboxgl.accessToken = "pk.eyJ1IjoianljaGVuMDc1IiwiYSI6ImNsamQxeTZpNTF1ZHEzam1oeHh1enhoNDgifQ.R7MWfRiu_ns5I0FR8PNCxg";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-71.0589, 42.3601],
  zoom: 14
});
