"use strict";

/*==========================================================
    SmartFlood
    utils.js
    Shared Helpers
==========================================================*/

const Utils = {

    /*======================================================
        GEOLOCATION (shared / cached)

        Several modules (map, weather, ...) all need the
        user's coordinates. Without a shared cache, each one
        calling navigator.geolocation independently means
        multiple permission prompts and multiple GPS reads
        for a single page load. Everything should call
        Utils.getUserLocation() instead of the browser API
        directly.
    ======================================================*/

    _locationPromise: null,

    getUserLocation(forceRefresh = false) {

        if (!forceRefresh && this._locationPromise) {

            return this._locationPromise;

        }

        this._locationPromise = new Promise((resolve) => {

            if (!navigator.geolocation) {

                resolve({ lat: null, lng: null, error: "unsupported" });

                return;

            }

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    resolve({

                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        error: null

                    });

                },

                (error) => {

                    resolve({

                        lat: null,
                        lng: null,
                        error:
                            error.code === error.PERMISSION_DENIED
                                ? "denied"
                                : "unavailable"

                    });

                },

                {
                    enableHighAccuracy: true,
                    timeout: 8000
                }

            );

        });

        return this._locationPromise;

    },



    /*======================================================
        FORMATTING
    ======================================================*/

    formatNumber(value, decimals = 1) {

        if (value === null || value === undefined || isNaN(value)) {

            return "--";

        }

        return Number(value).toFixed(decimals);

    }

};

window.Utils = Utils;