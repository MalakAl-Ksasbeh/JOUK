// Select all tabs

const tabs = document.querySelectorAll(".details-tab");

const contents = document.querySelectorAll(".tab-content");



tabs.forEach(tab => {


    tab.addEventListener("click", function(){


        // remove active from all tabs

        tabs.forEach(t => {
            t.classList.remove("active");
        });



        // hide all contents

        contents.forEach(content => {

            content.classList.remove("active");

        });



        // activate clicked tab

        this.classList.add("active");



        // show related content

        const target = this.dataset.target;


        document
        .getElementById(target)
        .classList.add("active");


    });


});