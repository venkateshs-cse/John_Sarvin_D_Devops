document.addEventListener("DOMContentLoaded", () => {

    // Generate floating dots
    function createDots() {
        const bgContainer = document.getElementById("background-elements");
        const dotCount = 50; // Number of dots

        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");

            // Random properties for each dot
            const size = Math.random() * 5 + 2; // Size between 2px and 7px
            const posX = Math.random() * 100; // Random X position (vw)
            const duration = Math.random() * 10 + 10; // Animation duration 10s - 20s
            const delay = Math.random() * 20; // Random delay

            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.left = `${posX}vw`;
            dot.style.bottom = `-10px`; // Start slightly below the screen
            dot.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;

            bgContainer.appendChild(dot);
        }
    }
    createDots();

    const elements = {
        ip: document.getElementById("ip-value"),
        os: document.getElementById("os-value"),
        browser: document.getElementById("browser-value"),
        screen: document.getElementById("screen-value"),
        location: document.getElementById("location-value"),
        country: document.getElementById("country-value"),
        timezone: document.getElementById("timezone-value"),
        isp: document.getElementById("isp-value"),
        org: document.getElementById("org-value"),
    };

    const cards = {
        ip: document.getElementById("ip-card"),
        os: document.getElementById("os-card"),
        browser: document.getElementById("browser-card"),
        screen: document.getElementById("screen-card"),
        location: document.getElementById("location-card"),
        country: document.getElementById("country-card"),
        timezone: document.getElementById("timezone-card"),
        isp: document.getElementById("isp-card"),
        org: document.getElementById("org-card"),
    };

    const refreshBtn = document.getElementById("refresh-btn");
    const searchBtn = document.getElementById("search-btn");
    const ipInput = document.getElementById("ip-input");

    function getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = "Unknown Browser";

        if (userAgent.includes("Firefox")) {
            browserName = "Mozilla Firefox";
        } else if (userAgent.includes("SamsungBrowser")) {
            browserName = "Samsung Internet";
        } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
            browserName = "Opera";
        } else if (userAgent.includes("Edge") || userAgent.includes("Edg")) {
            browserName = "Microsoft Edge";
        } else if (userAgent.includes("Chrome")) {
            browserName = "Google Chrome";
        } else if (userAgent.includes("Safari")) {
            browserName = "Apple Safari";
        } else if (userAgent.includes("Trident")) {
            browserName = "Internet Explorer";
        }

        return browserName;
    }

    function getOSInfo() {
        const userAgent = navigator.userAgent.toLowerCase();
        let osName = "Unknown OS";

        // Modern approach
        if (navigator.userAgentData && navigator.userAgentData.platform) {
            osName = navigator.userAgentData.platform;
        } else {
            // Fallback approach
            if (userAgent.includes("win")) osName = "Windows";
            else if (userAgent.includes("mac")) osName = "macOS";
            else if (userAgent.includes("linux")) osName = "Linux";
            else if (userAgent.includes("android")) osName = "Android";
            else if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod")) osName = "iOS";
        }

        return osName;
    }

    function getScreenSize() {
        return `${window.screen.width} × ${window.screen.height}`;
    }

    async function fetchNetworkAndLocation(searchIp = '') {
        try {
            // Using ipapi.co for free IP and location data
            const url = searchIp ? `https://ipapi.co/${searchIp}/json/` : 'https://ipapi.co/json/';
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.error) {
                updateCard('ip', 'Invalid IP');
                updateCard('location', 'Not Found');
                updateCard('country', 'N/A');
                updateCard('timezone', 'N/A');
                updateCard('isp', 'N/A');
                updateCard('org', 'N/A');
                return;
            }

            updateCard('ip', data.ip || 'Unavailable');
            updateCard('location', `${data.city || 'Unknown City'}, ${data.region || 'Unknown Region'}`);
            updateCard('country', data.country_name || 'Unknown Country');
            updateCard('timezone', data.timezone || 'Unknown Timezone');
            updateCard('isp', data.org || 'Unknown ISP'); // ipapi.co usually returns ISP in 'org'
            updateCard('org', data.asn || 'Unknown Organization'); // we map asn to org

        } catch (error) {
            console.error("Error fetching location data:", error);
            updateCard('ip', 'Unable to fetch');
            updateCard('location', 'Blocked / Error');
            updateCard('country', 'Error');
            updateCard('timezone', 'Error');
            updateCard('isp', 'Error');
            updateCard('org', 'Error');
        }
    }

    function updateCard(key, value) {
        elements[key].textContent = value;
        cards[key].classList.remove('loading');
    }

    function gatherAndDisplayData(ipToSearch = '') {
        // Reset to loading state
        Object.keys(cards).forEach(key => cards[key].classList.add('loading'));
        Object.keys(elements).forEach(key => elements[key].textContent = '...');

        // Synchronous gathers
        setTimeout(() => {
            updateCard('browser', getBrowserInfo());
            updateCard('os', getOSInfo());
            updateCard('screen', getScreenSize());
        }, 800); // Artificial delay to show slick loading animation

        // Async gathers
        fetchNetworkAndLocation(ipToSearch);
    }

    refreshBtn.addEventListener("click", () => {
        ipInput.value = ''; // clear search Box
        gatherAndDisplayData('');
    });

    searchBtn.addEventListener("click", () => {
        const ip = ipInput.value.trim();
        gatherAndDisplayData(ip);
    });

    ipInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const ip = ipInput.value.trim();
            gatherAndDisplayData(ip);
        }
    });

    // Initial load
    gatherAndDisplayData('');
});
