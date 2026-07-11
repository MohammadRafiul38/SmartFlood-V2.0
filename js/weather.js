"use strict";

/*==========================================================
    SmartFlood
    weather.js
    Live Weather Data

    Source: Open-Meteo (https://open-meteo.com)
    Free, no API key required — deliberately chosen so this
    file never repeats the hardcoded paid-API-key issue found
    in the earlier code audit.
==========================================================*/

const WeatherModule = {

    /*======================================================
        STATE
    ======================================================*/

    elements: {},
    chart: null,
    data: null,

    fallbackCenter: [23.8103, 90.4125], // Dhaka, Bangladesh



    /*======================================================
        DOM CACHE
    ======================================================*/

    cacheDOM() {

        this.elements.temperatureValue =
            document.getElementById("temperatureValue");

        this.elements.humidityValue =
            document.getElementById("humidityValue");

        this.elements.windValue =
            document.getElementById("windValue");

        this.elements.rainValue =
            document.getElementById("rainValue");

        this.elements.rainProbability =
            document.getElementById("rainProbability");

        this.elements.statusLocation =
            document.getElementById("statusLocation");

        this.elements.environmentChartCanvas =
            document.getElementById("environmentChart");

    },



    /*======================================================
        INIT
    ======================================================*/

    async init() {

        this.cacheDOM();

        if (typeof Utils === "undefined") {

            console.error(
                "WeatherModule.init: utils.js must load before weather.js."
            );

            return;

        }

        const location = await Utils.getUserLocation();

        const lat = location.lat !== null ? location.lat : this.fallbackCenter[0];
        const lng = location.lng !== null ? location.lng : this.fallbackCenter[1];

        this.resolveLocationName(lat, lng);

        await this.fetchWeather(lat, lng);

        console.log("WeatherModule: initialized");

    },



    /*======================================================
        REVERSE GEOCODE
        (OpenStreetMap Nominatim — free, no API key)
    ======================================================*/

    async resolveLocationName(lat, lng) {

        if (!this.elements.statusLocation) return;

        try {

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10&addressdetails=1`
            );

            if (!response.ok) {

                throw new Error(`Nominatim responded ${response.status}`);

            }

            const data = await response.json();
            const address = data.address || {};

            const place =
                address.city || address.town || address.village ||
                address.county || address.state || null;

            this.elements.statusLocation.textContent =
                place && address.country
                    ? `${place}, ${address.country}`
                    : (place || address.country || "Unknown location");

        } catch (error) {

            console.warn("WeatherModule.resolveLocationName:", error.message);

            this.elements.statusLocation.textContent = "Unknown location";

        }

    },



    /*======================================================
        FETCH WEATHER
    ======================================================*/

    async fetchWeather(lat, lng) {

        const url =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${lat}&longitude=${lng}` +
            "&current=temperature_2m,relative_humidity_2m,wind_speed_10m" +
            "&hourly=temperature_2m" +
            "&daily=precipitation_sum,precipitation_probability_max" +
            "&timezone=auto&forecast_days=1";

        try {

            const response = await fetch(url);

            if (!response.ok) {

                throw new Error(`Open-Meteo responded ${response.status}`);

            }

            const data = await response.json();

            this.data = data;

            this.renderCurrentConditions(data);

            this.renderEnvironmentChart(data);

        } catch (error) {

            console.error("WeatherModule.fetchWeather:", error.message);

            this.renderUnavailable();

        }

    },



    /*======================================================
        RENDER CURRENT CONDITIONS
    ======================================================*/

    renderCurrentConditions(data) {

        const current = data.current || {};
        const daily = data.daily || {};

        if (this.elements.temperatureValue) {

            this.elements.temperatureValue.textContent =
                current.temperature_2m !== undefined
                    ? `${Utils.formatNumber(current.temperature_2m, 1)}°C`
                    : "--";

        }

        if (this.elements.humidityValue) {

            this.elements.humidityValue.textContent =
                current.relative_humidity_2m !== undefined
                    ? `${Math.round(current.relative_humidity_2m)}%`
                    : "--";

        }

        if (this.elements.windValue) {

            this.elements.windValue.textContent =
                current.wind_speed_10m !== undefined
                    ? `${Utils.formatNumber(current.wind_speed_10m, 0)} km/h`
                    : "--";

        }

        if (this.elements.rainValue) {

            const rain =
                daily.precipitation_sum ? daily.precipitation_sum[0] : undefined;

            this.elements.rainValue.textContent =
                rain !== undefined ? `${Utils.formatNumber(rain, 1)} mm` : "--";

        }

        if (this.elements.rainProbability) {

            const prob =
                daily.precipitation_probability_max
                    ? daily.precipitation_probability_max[0]
                    : undefined;

            this.elements.rainProbability.textContent =
                prob !== undefined ? `${Math.round(prob)}%` : "--";

        }

    },



    renderUnavailable() {

        const fields = [

            this.elements.temperatureValue,
            this.elements.humidityValue,
            this.elements.windValue,
            this.elements.rainValue,
            this.elements.rainProbability

        ];

        fields.forEach((el) => {

            if (el) el.textContent = "N/A";

        });

    },



    /*======================================================
        ENVIRONMENT CHART

        Temperature is real (Open-Meteo hourly forecast).
        Tide is a placeholder wave pattern — there is no real
        tide data source wired up yet. Replace this dataset
        once a tide module exists.
    ======================================================*/

    renderEnvironmentChart(data) {

        if (typeof Chart === "undefined") {

            console.error(
                "WeatherModule.renderEnvironmentChart: Chart.js is not loaded."
            );

            return;

        }

        if (!this.elements.environmentChartCanvas) return;

        const hourly = data.hourly || {};

        const labels = (hourly.time || []).map((timeString) => {

            const date = new Date(timeString);

            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        });

        const temperatures = hourly.temperature_2m || [];

        const placeholderTide = temperatures.map((_, index) =>
            +(1 + Math.sin(index / 3) * 0.6).toFixed(2)
        );

        if (this.chart) {

            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = temperatures;
            this.chart.data.datasets[1].data = placeholderTide;
            this.chart.update();

            return;

        }

        this.chart = new Chart(this.elements.environmentChartCanvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {
                        label: "Temperature (°C)",
                        data: temperatures,
                        borderColor: "#D64545",
                        backgroundColor: "rgba(214,69,69,.15)",
                        yAxisID: "y",
                        tension: 0.35,
                        pointRadius: 2
                    },

                    {
                        label: "Tide Level (m) — placeholder",
                        data: placeholderTide,
                        borderColor: "#3B82F6",
                        backgroundColor: "rgba(59,130,246,.12)",
                        yAxisID: "y1",
                        tension: 0.35,
                        pointRadius: 2
                    }

                ]

            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                scales: {

                    y: {
                        type: "linear",
                        position: "left",
                        grid: { color: "rgba(255,255,255,.06)" },
                        ticks: { color: "#8AA0AE" }
                    },

                    y1: {
                        type: "linear",
                        position: "right",
                        grid: { drawOnChartArea: false },
                        ticks: { color: "#8AA0AE" }
                    },

                    x: {
                        grid: { color: "rgba(255,255,255,.04)" },
                        ticks: { color: "#8AA0AE", maxTicksLimit: 8 }
                    }

                },

                plugins: {

                    legend: { display: false },

                    tooltip: {
                        backgroundColor: "#1E2935",
                        titleColor: "#FFFFFF",
                        bodyColor: "#C7D1D9",
                        borderColor: "rgba(255,255,255,.08)",
                        borderWidth: 1
                    }

                }

            }

        });

    },



    /*======================================================
        Called by App when the Statistics page is shown.
        Chart.js can't correctly size a canvas that was
        created while its container was display:none.
    ======================================================*/

    handleStatisticsPageShown() {

        if (this.chart) {

            this.chart.resize();

        }

    }

};

window.WeatherModule = WeatherModule;