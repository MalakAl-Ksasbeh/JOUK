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



    // ================= MAIN INFORMATION =================

    document.getElementById("place-name").textContent =
    place.name;


    document.getElementById("place-location").textContent =
    place.location;


    document.getElementById("place-image").src =
    place.image;


    document.getElementById("place-rating").textContent =
    place.rating;



    // ================= PLACE INFO =================

    document.getElementById("best-time").textContent =
    place.info.bestTime;


    document.getElementById("visit-time").textContent =
    place.info.visitTime;


    document.getElementById("best-for").textContent =
    place.info.bestFor;


    document.getElementById("nearby").textContent =
    place.info.nearby;



    // ================= ABOUT =================

    document.getElementById("about-title").textContent =
    place.aboutTitle;


    document.getElementById("about-text").textContent =
    place.about;



    // ================= QUICK INFO =================

    document.getElementById("elevation").textContent =
    place.quickInfo.elevation;


    document.getElementById("quick-best").textContent =
    place.quickInfo.bestFor;


    document.getElementById("access").textContent =
    place.quickInfo.access;


    document.getElementById("distance").textContent =
    place.quickInfo.distance;



    // ================= THINGS TO DO =================

    const thingsList =
    document.getElementById("things-list");


    place.thingsToDo.forEach(item => {


        const li = document.createElement("li");

        li.textContent = item;

        thingsList.appendChild(li);


    });



    // ================= PHOTOS =================

    const photosContainer =
    document.getElementById("photos-container");


    place.photos.forEach(photo => {


        const img = document.createElement("img");

        img.src = photo;

        photosContainer.appendChild(img);


    });



    // ================= HIGHLIGHTS =================

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



    // ================= ADD TO MY PATH =================

    const addToPathBtn =
    document.getElementById("add-to-path-btn");


    if (addToPathBtn) {


        addToPathBtn.addEventListener("click", function () {


            // Get places already saved

            let myPath =
            JSON.parse(localStorage.getItem("myPath")) || [];



            // Check if this place is already added

            const alreadyAdded =
            myPath.includes(placeID);



            // Add the place only once

            if (!alreadyAdded) {


                myPath.push(placeID);


                localStorage.setItem(
                    "myPath",
                    JSON.stringify(myPath)
                );


            }



            // Go to My Path page

            window.location.href = "../path.html";


        });


    }


})

.catch(error => {


    console.log("Error loading JSON:", error);


});