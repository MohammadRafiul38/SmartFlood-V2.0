"use strict";

/*==========================================================
    SmartFlood
    app.js
    Part 1 - Core Application
==========================================================*/

const App = {

    /*======================================================
        APPLICATION STATE
    ======================================================*/

    state: {
        currentPage: "home",
        loading: false,
        settingsOpen: false,
        profileOpen: false
    },



    /*======================================================
        DOM CACHE
    ======================================================*/

    elements: {},



    /*======================================================
        CACHE DOM ELEMENTS
    ======================================================*/

    cacheDOM() {

        // Pages
        this.elements.homePage =
            document.getElementById("homePage");

        this.elements.statisticsPage =
            document.getElementById("statisticsPage");


        // Navigation
        this.elements.homeTab =
            document.getElementById("homeTab");

        this.elements.statisticsTab =
            document.getElementById("statisticsTab");


        // Settings
        this.elements.settingsBtn =
            document.getElementById("settingsBtn");

        this.elements.settingsModal =
            document.getElementById("settingsModal");

        this.elements.closeSettings =
            document.getElementById("closeSettings");


        // Profile
        this.elements.profileBtn =
            document.getElementById("profileBtn");

        this.elements.profileMenu =
            document.getElementById("profileMenu");


        // Overlay
        this.elements.loadingOverlay =
            document.getElementById("loadingOverlay");

        this.elements.notificationContainer =
            document.getElementById("notificationContainer");

    },



    /*======================================================
        PAGE MANAGEMENT
    ======================================================*/

    hideAllPages() {

        this.elements.homePage.classList.remove("active-page");
        this.elements.statisticsPage.classList.remove("active-page");

        this.elements.homePage.classList.add("hidden-page");
        this.elements.statisticsPage.classList.add("hidden-page");

    },



    activateNavigation(button) {

        this.elements.homeTab.classList.remove("active");
        this.elements.statisticsTab.classList.remove("active");

        button.classList.add("active");

    },



    showHomePage() {

        if (this.state.currentPage === "home") return;

        this.hideAllPages();

        this.elements.homePage.classList.remove("hidden-page");
        this.elements.homePage.classList.add("active-page");

        this.activateNavigation(this.elements.homeTab);

        this.state.currentPage = "home";

        console.log("Switched to Home");

    },



    showStatisticsPage() {

        if (this.state.currentPage === "statistics") return;

        this.hideAllPages();

        this.elements.statisticsPage.classList.remove("hidden-page");
        this.elements.statisticsPage.classList.add("active-page");

        this.activateNavigation(this.elements.statisticsTab);

        this.state.currentPage = "statistics";

        console.log("Switched to Statistics");

    },



    /*======================================================
        NAVIGATION EVENTS
    ======================================================*/

    initializeNavigation() {

        this.elements.homeTab.addEventListener(

            "click",

            (event) => {

                event.preventDefault();

                this.showHomePage();

            }

        );



        this.elements.statisticsTab.addEventListener(

            "click",

            (event) => {

                event.preventDefault();

                this.showStatisticsPage();

            }

        );

    },



    /*======================================================
        HELPERS
    ======================================================*/

    getCurrentPage() {

        return this.state.currentPage;

    },



    isHomePage() {

        return this.state.currentPage === "home";

    },



    isStatisticsPage() {

        return this.state.currentPage === "statistics";

    },



    /*======================================================
        INITIALIZE
    ======================================================*/

 initialize() {

    console.log("--------------------------------");
    console.log("Starting SmartFlood...");
    console.log("--------------------------------");

    this.cacheDOM();

    this.initializeNavigation();

    this.initializeUI();

    // Ensure Home is active
    this.hideAllPages();

    this.elements.homePage.classList.remove("hidden-page");
    this.elements.homePage.classList.add("active-page");

    this.activateNavigation(this.elements.homeTab);

    this.state.currentPage = "home";

    this.start();

    console.log("DOM Cached");
    console.log("Navigation Ready");
    console.log("Application Ready");

}
};



/*==========================================================
    GLOBAL ACCESS
==========================================================*/

window.App = App;



/*==========================================================
    START APPLICATION
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        App.initialize();

    }

);
/*==========================================================
    SETTINGS MODAL
==========================================================*/

App.openSettings = function () {

    this.elements.settingsModal.classList.remove("hidden");

    this.state.settingsOpen = true;

};

App.closeSettings = function () {

    this.elements.settingsModal.classList.add("hidden");

    this.state.settingsOpen = false;

};

App.toggleSettings = function () {

    if (this.state.settingsOpen) {

        this.closeSettings();

    } else {

        this.openSettings();

    }

};



/*==========================================================
    PROFILE MENU
==========================================================*/

App.openProfileMenu = function () {

    this.elements.profileMenu.classList.remove("hidden");

    this.state.profileOpen = true;

};

App.closeProfileMenu = function () {

    this.elements.profileMenu.classList.add("hidden");

    this.state.profileOpen = false;

};

App.toggleProfileMenu = function () {

    if (this.state.profileOpen) {

        this.closeProfileMenu();

    } else {

        this.openProfileMenu();

    }

};



/*==========================================================
    LOADING OVERLAY
==========================================================*/

App.showLoading = function () {

    this.elements.loadingOverlay.classList.remove("hidden");

    this.state.loading = true;

};

App.hideLoading = function () {

    this.elements.loadingOverlay.classList.add("hidden");

    this.state.loading = false;

};



/*==========================================================
    GLOBAL UI EVENTS
==========================================================*/

App.initializeUI = function () {

    /* Settings */

    this.elements.settingsBtn.addEventListener(

        "click",

        () => {

            this.toggleSettings();

        }

    );



    this.elements.closeSettings.addEventListener(

        "click",

        () => {

            this.closeSettings();

        }

    );



    /* Profile */

    this.elements.profileBtn.addEventListener(

        "click",

        () => {

            this.toggleProfileMenu();

        }

    );



    /* Escape Key */

    document.addEventListener(

        "keydown",

        (event) => {

            if (event.key !== "Escape") return;

            this.closeSettings();

            this.closeProfileMenu();

        }

    );



    /* Outside Click */

    document.addEventListener(

        "click",

        (event) => {

            if (

                this.state.settingsOpen &&

                !this.elements.settingsModal.contains(event.target) &&

                event.target !== this.elements.settingsBtn

            ) {

                this.closeSettings();

            }



            if (

                this.state.profileOpen &&

                !this.elements.profileMenu.contains(event.target) &&

                !this.elements.profileBtn.contains(event.target)

            ) {

                this.closeProfileMenu();

            }

        }

    );

};
/*==========================================================
    LIVE DATE & TIME
==========================================================*/

App.updateDateTime = function () {

    const now = new Date();

    const dateElement =
        document.getElementById("statusDate");

    const timeElement =
        document.getElementById("statusTime");

    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString(undefined, {

                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"

            });

    }

    if (timeElement) {

        timeElement.textContent =
            now.toLocaleTimeString([], {

                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"

            });

    }

};



/*==========================================================
    START CLOCK
==========================================================*/

App.startClock = function () {

    this.updateDateTime();

    setInterval(() => {

        this.updateDateTime();

    }, 1000);

};



/*==========================================================
    PAGE HELPERS
==========================================================*/

App.refreshCurrentPage = function () {

    if (this.state.currentPage === "home") {

        console.log("Refreshing Home");

    }

    else {

        console.log("Refreshing Statistics");

    }

};



/*==========================================================
    PLACEHOLDER INITIALIZERS
    (Implemented later)
==========================================================*/

App.initializeMap = function () {

    console.log("Map module pending...");

};



App.initializeWeather = function () {

    console.log("Weather module pending...");

};



App.initializeFloodRisk = function () {

    console.log("Flood Risk module pending...");

};



App.initializeChatbot = function () {

    console.log("Chatbot module pending...");

};



/*==========================================================
    STARTUP
==========================================================*/

App.start = function () {

    this.startClock();

    this.initializeMap();

    this.initializeWeather();

    this.initializeFloodRisk();

    this.initializeChatbot();

};



/*==========================================================
    UPDATE INITIALIZE()
==========================================================*/

/*
Inside App.initialize()

AFTER:

this.initializeNavigation();

this.initializeUI();

ADD:

this.start();

*/



/*==========================================================
    WINDOW EVENTS
==========================================================*/

window.addEventListener(

    "resize",

    () => {

        console.log("Window resized");

    }

);



window.addEventListener(

    "online",

    () => {

        console.log("Internet Connected");

    }

);



window.addEventListener(

    "offline",

    () => {

        console.log("Internet Disconnected");

    }

);