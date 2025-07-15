document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const appContent = document.getElementById('app-content');
    const loader = document.querySelector('.loader-container');
    const nav = document.querySelector('.nav');

    // --- API Configuration ---
    const API_KEY = 'dded7415cfmsha1def7377045f25p1dbc6ajsnb0199ca1b659'; // Your RapidAPI Key
    const JOKES_API_HOST = 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com';
    const QUOTES_API_HOST = 'quotes15.p.rapidapi.com';
    const CURRENCY_API_HOST = 'currency-exchange.p.rapidapi.com';

    // --- State ---
    let currentPage = 'jokes';

    // --- Utility Functions ---
    const showLoader = () => loader.classList.add('visible');
    const hideLoader = () => loader.classList.remove('visible');

    const updateActiveNav = (page) => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    };

    // --- Render Functions ---
    const renderError = (message) => {
        appContent.innerHTML = `<p class="error-message">😔 Oops! ${message}</p>`;
    };

    const renderJoke = (joke) => {
        appContent.innerHTML = `
            <div>
                <h2 class="content-title">Chuck Norris Joke</h2>
                <p class="joke-text">"${joke}"</p>
                <button class="action-btn" id="generate-joke-btn">Get Another Joke</button>
            </div>
        `;
        document.getElementById('generate-joke-btn').addEventListener('click', fetchJoke);
    };

    const renderQuote = (quote, author) => {
        appContent.innerHTML = `
            <div>
                <h2 class="content-title">Inspirational Quote</h2>
                <p class="quote-text">"${quote}"</p>
                <p class="quote_author">- ${author}</p>
                <button class="action-btn" id="generate-quote-btn">Get Another Quote</button>
            </div>
        `;
        document.getElementById('generate-quote-btn').addEventListener('click', fetchQuote);
    };

    const renderConverter = (rate = null) => {
        appContent.innerHTML = `
            <div class="converter-form">
                <h2 class="content-title">Currency Converter</h2>
                <div class="input-group">
                    <label for="from">From</label>
                    <input class="currency-input" id="from" type="text" value="USD">
                </div>
                <div class="input-group">
                    <label for="to">To</label>
                    <input class="currency-input" id="to" type="text" value="ZMW">
                </div>
                <button class="action-btn" id="convert-btn">Convert</button>
                ${rate !== null ? `<p class="conversion-result">1 USD = ${rate} ZMW</p>` : ''}
            </div>
        `;
        document.getElementById('convert-btn').addEventListener('click', () => {
             const from = document.getElementById('from').value;
             const to = document.getElementById('to').value;
             fetchConversion(from, to);
        });
    };
    
    // --- API Fetching Functions ---
    const fetchData = async (url, options) => {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        // Quotes API returns a number, others return JSON
        if (options.headers['X-RapidAPI-Host'] === CURRENCY_API_HOST) {
            return response.text();
        }
        return response.json();
    };

    const fetchJoke = async () => {
        showLoader();
        try {
            const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'X-RapidAPI-Key': API_KEY,
                    'X-RapidAPI-Host': JOKES_API_HOST
                }
            };
            const result = await fetchData(url, options);
            renderJoke(result.value);
        } catch (error) {
            renderError('Could not fetch a joke.');
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const fetchQuote = async () => {
        showLoader();
        try {
            const url = 'https://quotes15.p.rapidapi.com/quotes/random/';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': API_KEY,
                    'X-RapidAPI-Host': QUOTES_API_HOST
                }
            };
            const result = await fetchData(url, options);
            renderQuote(result.content, result.originator.name);
        } catch (error) {
            renderError('Could not fetch a quote.');
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const fetchConversion = async (from, to) => {
        showLoader();
        try {
            const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${from.toUpperCase()}&to=${to.toUpperCase()}&q=1.0`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': API_KEY,
                    'X-RapidAPI-Host': CURRENCY_API_HOST
                }
            };
            const result = await fetchData(url, options);
            // Convert result to a number and format it
            const rate = parseFloat(result).toFixed(2);
            if (isNaN(rate)) throw new Error("Invalid currency codes provided.");

            renderConverter(); // Re-render the form
            // Update the result in the newly rendered form
            appContent.querySelector('.converter-form').innerHTML += `<p class="conversion-result">1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()}</p>`;

        } catch (error) {
            renderError('Could not convert currency. Please check the currency codes.');
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    // --- Navigation ---
    const navigateTo = (page) => {
        currentPage = page;
        appContent.classList.add('loading');
        
        setTimeout(() => {
            switch (page) {
                case 'jokes':
                    fetchJoke();
                    break;
                case 'quotes':
                    fetchQuote();
                    break;
                case 'converter':
                    showLoader();
                    renderConverter();
                    hideLoader();
                    break;
            }
            updateActiveNav(page);
            appContent.classList.remove('loading');
        }, 200); // Wait for fade-out transition
    };

    nav.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page !== currentPage) {
                navigateTo(page);
            }
        }
    });

    // --- Initial Load ---
    navigateTo(currentPage);
});