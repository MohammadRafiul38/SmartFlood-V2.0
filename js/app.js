"use strict";

/*==========================================================
    SmartFlood
    app.js
    Core Application
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

        const ids = {

            // Pages
            homePage: "homePage",
            statisticsPage: "statisticsPage",

            // Navigation
            homeTab: "homeTab",
            statisticsTab: "statisticsTab",

            // Settings
            settingsBtn: "settingsBtn",
            settingsModal: "settingsModal",
            closeSettings: "closeSettings",

            // Profile
            profileBtn: "profileBtn",
            profileMenu: "profileMenu",

            // Overlay
            loadingOverlay: "loadingOverlay",
            notificationContainer: "notificationContainer",

            // Clock
            statusDate: "statusDate",
            statusTime: "statusTime"

        };

        for (const key in ids) {

            this.elements[key] = document.getElementById(ids[key]);

            if (!this.elements[key]) {

                console.error(
                    `App.cacheDOM: no element with id "${ids[key]}" found (expected for "${key}")`
                );

            }

        }

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

        if (typeof WeatherModule !== "undefined") {

            WeatherModule.handleStatisticsPageShown();

        }

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
        SETTINGS MODAL
    ======================================================*/

    openSettings() {

        this.elements.settingsModal.classList.remove("hidden");

        this.state.settingsOpen = true;

    },



    closeSettings() {

        this.elements.settingsModal.classList.add("hidden");

        this.state.settingsOpen = false;

    },



    toggleSettings(event) {

        // Stop this click from also being seen by the
        // document-level "click outside" listener below,
        // which would otherwise close the modal on the
        // same click that just opened it.
        if (event) event.stopPropagation();

        if (this.state.settingsOpen) {

            this.closeSettings();

        } else {

            this.openSettings();

        }

    },



    /*======================================================
        PROFILE MENU
    ======================================================*/

    openProfileMenu() {

        this.elements.profileMenu.classList.remove("hidden");

        this.state.profileOpen = true;

    },



    closeProfileMenu() {

        this.elements.profileMenu.classList.add("hidden");

        this.state.profileOpen = false;

    },



    toggleProfileMenu(event) {

        if (event) event.stopPropagation();

        if (this.state.profileOpen) {

            this.closeProfileMenu();

        } else {

            this.openProfileMenu();

        }

    },



    /*======================================================
        LOADING OVERLAY
    ======================================================*/

    showLoading() {

        this.elements.loadingOverlay.classList.remove("hidden");

        this.state.loading = true;

    },



    hideLoading() {

        this.elements.loadingOverlay.classList.add("hidden");

        this.state.loading = false;

    },



    /*======================================================
        GLOBAL UI EVENTS
    ======================================================*/

    initializeUI() {

        /* Settings */

        this.elements.settingsBtn.addEventListener(

            "click",

            (event) => {

                this.toggleSettings(event);

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

            (event) => {

                this.toggleProfileMenu(event);

            }

        );



        /* Escape Key */

        document.addEventListener(

            "keydown",

            (event) => {

                if (event.key !== "Escape") return;

                if (this.state.settingsOpen) this.closeSettings();

                if (this.state.profileOpen) this.closeProfileMenu();

            }

        );



        /* Outside Click */

        document.addEventListener(

            "click",

            (event) => {

                if (

                    this.state.settingsOpen &&

                    !this.elements.settingsModal.contains(event.target)

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

    },



    /*======================================================
        LIVE DATE & TIME
    ======================================================*/

    updateDateTime() {

        const now = new Date();

        if (this.elements.statusDate) {

            this.elements.statusDate.textContent =
                now.toLocaleDateString(undefined, {

                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"

                });

        }

        if (this.elements.statusTime) {

            this.elements.statusTime.textContent =
                now.toLocaleTimeString([], {

                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"

                });

        }

    },



    startClock() {

        this.updateDateTime();

        setInterval(() => {

            this.updateDateTime();

        }, 1000);

    },



    /*======================================================
        PAGE HELPERS
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



    refreshCurrentPage() {

        if (this.state.currentPage === "home") {

            console.log("Refreshing Home");

        }

        else {

            console.log("Refreshing Statistics");

        }

    },



    /*======================================================
        PLACEHOLDER INITIALIZERS
        (Implemented in js/map.js, js/weather.js,
        js/floodRisk.js, js/chatbot.js)
    ======================================================*/

    initializeMap() {

        if (typeof MapModule !== "undefined") {

            MapModule.init();

        } else {

            console.log("Map module pending...");

        }

    },



    initializeWeather() {

        if (typeof WeatherModule !== "undefined") {

            WeatherModule.init();

        } else {

            console.log("Weather module pending...");

        }

    },



    initializeFloodRisk() {

        console.log("Flood Risk module pending...");

    },



    initializeChatbot() {

        console.log("Chatbot module pending...");

    },



    /*======================================================
        STARTUP
    ======================================================*/

    start() {

        this.startClock();

        this.initializeMap();

        this.initializeWeather();

        this.initializeFloodRisk();

        this.initializeChatbot();

    },



    /*======================================================
        INITIALIZE
    ======================================================*/

    initialize() {

        console.log("--------------------------------");
        console.log("Starting SmartFlood...");
        console.log("--------------------------------");

        this.cacheDOM();

        this.showLoading();

        this.initializeNavigation();

        this.initializeUI();

        // Ensure Home is active
        this.hideAllPages();

        this.elements.homePage.classList.remove("hidden-page");
        this.elements.homePage.classList.add("active-page");

        this.activateNavigation(this.elements.homeTab);

        this.state.currentPage = "home";

        this.start();

        this.hideLoading();

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
    WINDOW EVENTS
==========================================================*/

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