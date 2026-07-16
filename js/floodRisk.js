"use strict";

/*==========================================================
    SmartFlood
    floodRisk.js
    Flood Intelligence Engine
==========================================================*/

const FloodRiskModule = {

    /*======================================================
        STATE
    ======================================================*/

    riskScore: 0,

    riskLevel: "LOW",

    riskColor: "#4CAF50",

    latestData: null,



    /*======================================================
        CONFIGURATION
    ======================================================*/

    thresholds: {

        LOW: 20,

        MEDIUM: 45,

        HIGH: 70,

        EXTREME: 100

    },



    colors: {

        LOW: "#4CAF50",

        MEDIUM: "#F6C453",

        HIGH: "#F28C38",

        EXTREME: "#D64545"

    },



    /*======================================================
        SCORE CALCULATION
    ======================================================*/

    calculateScore(data) {

        let score = 0;

        /* Rainfall */

        if (data.rainfall >= 100) {

            score += 30;

        }

        else if (data.rainfall >= 50) {

            score += 25;

        }

        else if (data.rainfall >= 20) {

            score += 18;

        }

        else if (data.rainfall >= 5) {

            score += 8;

        }



        /* Tide */

        switch (data.tide) {

            case "EXTREME":

                score += 20;

                break;

            case "HIGH":

                score += 12;

                break;

            case "NORMAL":

                score += 5;

                break;

        }



        /* Elevation */

        if (data.elevation <= 5) {

            score += 20;

        }

        else if (data.elevation <= 10) {

            score += 12;

        }

        else if (data.elevation <= 20) {

            score += 5;

        }



        /* Humidity */

        if (data.humidity >= 80) {

            score += 10;

        }

        else if (data.humidity >= 60) {

            score += 5;

        }



        /* Wind */

        if (data.wind >= 50) {

            score += 10;

        }

        else if (data.wind >= 30) {

            score += 6;

        }

        else if (data.wind >= 15) {

            score += 3;

        }



        /* Historical Flood Frequency */

        switch (data.history) {

            case "FREQUENT":

                score += 10;

                break;

            case "OCCASIONAL":

                score += 6;

                break;

            case "RARE":

                score += 3;

                break;

        }

        return Math.min(score, 100);

    },



    /*======================================================
        RISK CLASSIFICATION
    ======================================================*/

    classifyRisk(score) {

        if (score <= this.thresholds.LOW) {

            return "LOW";

        }

        if (score <= this.thresholds.MEDIUM) {

            return "MEDIUM";

        }

        if (score <= this.thresholds.HIGH) {

            return "HIGH";

        }

        return "EXTREME";

    },



    /*======================================================
        UPDATE STATE
    ======================================================*/

    update(data) {

        this.latestData = data;

        this.riskScore = this.calculateScore(data);

        this.riskLevel = this.classifyRisk(this.riskScore);

        this.riskColor = this.colors[this.riskLevel];

        console.log(

            `Flood Risk: ${this.riskLevel} (${this.riskScore}/100)`

        );

    },



    /*======================================================
        PUBLIC GETTERS
    ======================================================*/

    getScore() {

        return this.riskScore;

    },



    getLevel() {

        return this.riskLevel;

    },



    getColor() {

        return this.riskColor;

    }

};

window.FloodRiskModule = FloodRiskModule;


/*======================================================
    DATA COLLECTION
======================================================*/

collectInputs() 

    const weather = window.WeatherModule?.data || null;

    if (!weather) {

        return null;

    }

    const current = weather.current || {};
    const daily = weather.daily || {};

    return {

        rainfall:
            daily.precipitation_sum?.[0] ?? 0,

        humidity:
            current.relative_humidity_2m ?? 0,

        wind:
            current.wind_speed_10m ?? 0,

        tide:
            this.getTideLevel(),

        elevation:
            this.getElevation(),

        historical:
            this.getHistoricalFloodLevel()

    };




/*======================================================
    PLACEHOLDER DATA SOURCES
======================================================*/

getTideLevel() 
    // TODO:
    // Replace with real tide API later

    return "normal";




getElevation() 

    // TODO:
    // Replace with DEM / elevation API

    return 8;




getHistoricalFloodLevel()

    // TODO:
    // Replace with flood-data.json

    return "occasional";




/*======================================================
    CALCULATE RISK SCORE
======================================================*/

calculateRisk() 

    const inputs = this.collectInputs();

    if (!inputs) {

        console.warn("FloodRisk: Weather data unavailable.");

        return;

    }

    this.state.inputs = inputs;

    let score = 0;



    /*------------------------------
        Rainfall (30)
    ------------------------------*/

    if (inputs.rainfall >= 100) {

        score += 30;

    }

    else if (inputs.rainfall >= 50) {

        score += 25;

    }

    else if (inputs.rainfall >= 20) {

        score += 18;

    }

    else if (inputs.rainfall >= 5) {

        score += 8;

    }



    /*------------------------------
        Tide (20)
    ------------------------------*/

    switch (inputs.tide) {

        case "extreme":

            score += 20;
            break;

        case "high":

            score += 12;
            break;

        case "normal":

            score += 5;
            break;

    }



    /*------------------------------
        Elevation (20)
    ------------------------------*/

    if (inputs.elevation <= 5) {

        score += 20;

    }

    else if (inputs.elevation <= 10) {

        score += 12;

    }

    else if (inputs.elevation <= 20) {

        score += 5;

    }



    /*------------------------------
        Humidity (10)
    ------------------------------*/

    if (inputs.humidity >= 80) {

        score += 10;

    }

    else if (inputs.humidity >= 60) {

        score += 5;

    }



    /*------------------------------
        Wind (10)
    ------------------------------*/

    if (inputs.wind >= 50) {

        score += 10;

    }

    else if (inputs.wind >= 30) {

        score += 6;

    }

    else if (inputs.wind >= 15) {

        score += 3;

    }



    /*------------------------------
        Historical Flooding (10)
    ------------------------------*/

    switch (inputs.historical) {

        case "frequent":

            score += 10;
            break;

        case "occasional":

            score += 6;
            break;

        case "rare":

            score += 3;
            break;

    }



    this.state.score = Math.min(score, 100);

    this.state.level =
        this.getRiskLevel(this.state.score);

    console.log(
        `FloodRisk: ${this.state.score}/100 (${this.state.level})`
    );

    /*======================================================
    DASHBOARD
======================================================*/

updateDashboard() 

    if (this.elements.riskScore) {

        this.elements.riskScore.textContent =
            `${this.state.score}/100`;

    }

    if (this.elements.riskLevel) {

        this.elements.riskLevel.textContent =
            this.state.level;

    }

    if (this.elements.riskBadge) {

        this.elements.riskBadge.textContent =
            this.state.level;

        this.elements.riskBadge.classList.remove(

            "risk-low",
            "risk-medium",
            "risk-high",
            "risk-extreme"

        );

        this.elements.riskBadge.classList.add(

            `risk-${this.state.level.toLowerCase()}`

        );

    }



/*======================================================
    MAP INTEGRATION
======================================================*/

updateMap() 

    if (

        typeof MapModule === "undefined" ||

        !MapModule.map

    ) {

        return;

    }

    if (

        typeof MapModule.updateFloodRisk === "function"

    ) {

        MapModule.updateFloodRisk(

            this.state.score,

            this.state.level

        );

    }


/*======================================================
    PUBLIC API
======================================================*/

getRiskScore() 

    return this.state.score;


getRiskLevel()

    return this.state.level;


getRiskData() 

    return {

        score: this.state.score,

        level: this.state.level,

        inputs: structuredClone(this.state.inputs)

    };

refresh()

    this.calculateRisk();

    this.updateDashboard();

    this.updateMap();

/*======================================================
    AUTO UPDATE
======================================================*/

startAutoRefresh()

    setInterval(() => {

        this.refresh();

    }, 300000); // 5 minutes
/*======================================================
    INITIALIZATION
======================================================*/

cacheDOM() 

    this.elements.riskScore =
        document.getElementById("riskScore");

    this.elements.riskLevel =
        document.getElementById("riskLevel");

    this.elements.riskBadge =
        document.getElementById("riskBadge");


init() 
    this.cacheDOM();

    if (typeof WeatherModule === "undefined") {

        console.error(
            "FloodRiskModule.init: WeatherModule not found."
        );

        return;

    }

    this.refresh();

    this.startAutoRefresh();

    console.log("FloodRiskModule: initialized");




/*==========================================================
    GLOBAL ACCESS
==========================================================*/

window.FloodRiskModule = FloodRiskModule;
