// Get place name from URL
const params = new URLSearchParams(window.location.search);

const placeID = params.get("place") || "deadsea";


// Load JSON file

fetch("../data/places.json")

.then(response => response.json())

.then(data => {


    const place = data[placeID];


    if (!place) {
        console.log("Place not found");
        return;
    }



    // Main information

    document.getElementById("place-name").textContent =
    place.name;



    document.getElementById("place-location").textContent =
    place.location;



    document.getElementById("place-image").src =
    place.image;



    document.getElementById("place-rating").textContent =
    place.rating;





    // Place info


    document.getElementById("best-time").textContent =
    place.info.bestTime;



    document.getElementById("visit-time").textContent =
    place.info.visitTime;



    document.getElementById("best-for").textContent =
    place.info.bestFor;



    document.getElementById("nearby").textContent =
    place.info.nearby;







    // About


    document.getElementById("about-title").textContent =
    place.aboutTitle;



    document.getElementById("about-text").textContent =
    place.about;







    // Quick Info


    document.getElementById("elevation").textContent =
    place.quickInfo.elevation;



    document.getElementById("quick-best").textContent =
    place.quickInfo.bestFor;



    document.getElementById("access").textContent =
    place.quickInfo.access;



    document.getElementById("distance").textContent =
    place.quickInfo.distance;







    // Things To Do


    const thingsList =
    document.getElementById("things-list");


    place.thingsToDo.forEach(item => {


        const li = document.createElement("li");

        li.textContent = item;

        thingsList.appendChild(li);


    });







    // Photos


    const photosContainer =
    document.getElementById("photos-container");



    place.photos.forEach(photo => {


        const img = document.createElement("img");

        img.src = photo;

        photosContainer.appendChild(img);


    });








    // Highlights


    const highlightsContainer =
    document.getElementById("highlights-container");



    place.highlights.forEach(item => {


        const card = document.createElement("div");

        card.className = "highlight-card";



        card.innerHTML = `

            <img src="${item.image}">

            <h3>
                ${item.title}
            </h3>

        `;



        highlightsContainer.appendChild(card);


    });



})

.catch(error => {

    console.log("Error loading JSON:", error);

});