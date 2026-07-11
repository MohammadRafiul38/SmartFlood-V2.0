"use strict";

/*==========================================================
    SmartFlood
    map.js
    Leaflet Flood Risk Map
==========================================================*/

const MapModule = {

    /*======================================================
        STATE
    ======================================================*/

    map: null,
    userMarker: null,

    defaultCenter: [23.8103, 90.4125], // Dhaka, Bangladesh
    defaultZoom: 12,



    /*======================================================
        DOM CACHE
    ======================================================*/

    elements: {},

    cacheDOM() {

        this.elements.locationName =
            document.getElementById("locationName");

        this.elements.riskStatus =
            document.getElementById("riskStatus");

        this.elements.lastUpdated =
            document.getElementById("lastUpdated");

        this.elements.zoomIn =
            document.getElementById("zoomIn");

        this.elements.zoomOut =
            document.getElementById("zoomOut");

        this.elements.locateMe =
            document.getElementById("locateMe");

        this.elements.toggleLayers =
            document.getElementById("toggleLayers");

        this.elements.recenterMap =
            document.getElementById("recenterMap");

    },



    /*======================================================
        INIT
    ======================================================*/

    init() {

        if (typeof L === "undefined") {

            console.error("MapModule.init: Leaflet (L) is not loaded.");

            return;

        }

        this.cacheDOM();

        this.map = L.map("map", {

            zoomControl: false,
            attributionControl: true

        }).setView(this.defaultCenter, this.defaultZoom);

        L.tileLayer(

            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",

            {
                maxZoom: 20,
                subdomains: "abcd",
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
                    '&copy; <a href="https://carto.com/attributions">CARTO</a>'
            }

        ).addTo(this.map);

        this.bindControls();

        this.renderRiskZones(this.defaultCenter);

        this.locateUser();

        console.log("MapModule: map initialized");

    },



    /*======================================================
        CONTROLS
    ======================================================*/

    bindControls() {

        if (this.elements.zoomIn) {

            this.elements.zoomIn.addEventListener(
                "click",
                () => this.map.zoomIn()
            );

        }

        if (this.elements.zoomOut) {

            this.elements.zoomOut.addEventListener(
                "click",
                () => this.map.zoomOut()
            );

        }

        if (this.elements.locateMe) {

            this.elements.locateMe.addEventListener(
                "click",
                () => this.locateUser()
            );

        }

        if (this.elements.recenterMap) {

            this.elements.recenterMap.addEventListener(
                "click",
                () => this.locateUser()
            );

        }

        if (this.elements.toggleLayers) {

            this.elements.toggleLayers.addEventListener(
                "click",
                () => this.toggleLayerStyle()
            );

        }

    },



    /*======================================================
        GEOLOCATION
    ======================================================*/

    locateUser() {

        if (this.elements.locationName) {

            this.elements.locationName.textContent = "Detecting...";

        }

        if (!navigator.geolocation) {

            this.handleLocationUnavailable("Geolocation not supported");

            return;

        }

        navigator.geolocation.getCurrentPosition(

            (position) => this.handleLocationSuccess(position),

            (error) => this.handleLocationError(error),

            {
                enableHighAccuracy: true,
                timeout: 8000
            }

        );

    },



    handleLocationSuccess(position) {

        const { latitude, longitude } = position.coords;

        this.setUserLocation(latitude, longitude);

        this.renderRiskZones([latitude, longitude]);

        if (this.elements.locationName) {

            this.elements.locationName.textContent =
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

        }

        if (this.elements.lastUpdated) {

            this.elements.lastUpdated.textContent =
                `Updated ${new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}`;

        }

    },



    handleLocationError(error) {

        console.warn("MapModule: geolocation error", error.message);

        this.handleLocationUnavailable(

            error.code === error.PERMISSION_DENIED
                ? "Permission denied"
                : "Location unavailable"

        );

    },



    handleLocationUnavailable(message) {

        if (this.elements.locationName) {

            this.elements.locationName.textContent = message;

        }

        if (this.elements.lastUpdated) {

            this.elements.lastUpdated.textContent =
                "Showing default location";

        }

    },



    setUserLocation(lat, lng) {

        this.map.setView([lat, lng], 14);

        if (this.userMarker) {

            this.userMarker.setLatLng([lat, lng]);

        } else {

            // A styled circle marker instead of L.marker's default
            // icon, which renders as a broken image when Leaflet
            // is loaded from a CDN without its imagePath configured.
            this.userMarker = L.circleMarker([lat, lng], {

                radius: 9,
                weight: 3,
                color: "#ffffff",
                fillColor: "var(--primary)",
                fillOpacity: 1,
                className: "user-location-dot"

            }).addTo(this.map);

        }

    },



    /*======================================================
        RISK ZONES (placeholder)

        These are illustrative only — there is no real
        hydrological data source wired up yet. Replace this
        with real geodata once floodRisk.js exists.
    ======================================================*/

    riskZoneLayer: null,

    mockRiskZones: [
        { offset: [ 0.012,  0.016], level: "high" },
        { offset: [-0.009,  0.020], level: "medium" },
        { offset: [ 0.017, -0.011], level: "low" },
        { offset: [-0.021, -0.014], level: "extreme" },
        { offset: [ 0.006, -0.026], level: "medium" },
        { offset: [-0.014,  0.006], level: "low" }
    ],

    riskColors: {
        low: "#4CAF50",
        medium: "#F6C453",
        high: "#F28C38",
        extreme: "#D64545"
    },

    renderRiskZones(center) {

        if (this.riskZoneLayer) {

            this.map.removeLayer(this.riskZoneLayer);

        }

        const markers = this.mockRiskZones.map((zone) => {

            const lat = center[0] + zone.offset[0];
            const lng = center[1] + zone.offset[1];
            const color = this.riskColors[zone.level];

            return L.circleMarker([lat, lng], {

                radius: 18,
                weight: 1,
                color: color,
                fillColor: color,
                fillOpacity: 0.35,
                className: `risk-zone risk-zone-${zone.level}`

            }).bindPopup(

                `Flood risk: ${zone.level.toUpperCase()} <br><small>(placeholder data)</small>`

            );

        });

        this.riskZoneLayer = L.layerGroup(markers).addTo(this.map);

    },



    /*======================================================
        LAYER TOGGLE
        (Hook for future satellite/street style switch)
    ======================================================*/

    toggleLayerStyle() {

        console.log("MapModule: layer toggle not implemented yet");

    }

};

window.MapModule = MapModule;