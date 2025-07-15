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

    // --- Data ---
    const supportedCurrencies = [
        'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
        'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR', 'ZMW'
    ];

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

    const renderConverter = (from = 'USD', to = 'ZMW', resultHTML = '') => {
        const createOptions = (selectedValue) => supportedCurrencies
            .map(code => `<option value="${code}" ${code === selectedValue ? 'selected' : ''}>${code}</option>`)
            .join('');

        appContent.innerHTML = `
            <div class="converter-form">
                <h2 class="content-title">Currency Converter</h2>
                <div class="input-group">
                    <label for="from-currency">From</label>
                    <select class="currency-select" id="from-currency">${createOptions(from)}</select>
                </div>
                <div class="input-group">
                    <label for="to-currency">To</label>
                    <select class="currency-select" id="to-currency">${createOptions(to)}</select>
                </div>
                <button class="action-btn" id="convert-btn">Convert</button>
                ${resultHTML}
            </div>
        `;
        document.getElementById('convert-btn').addEventListener('click', handleConversion);
    };
    
    // --- API & Event Handler Functions ---
    const fetchData = async (url, options) => {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        if (options.headers['X-RapidAPI-Host'] === CURRENCY_API_HOST) {
            return response.text();
        }
        return response.json();
    };

    const fetchJoke = async () => {
        showLoader();
        try {
            const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';
            const options = { method: 'GET', headers: { accept: 'application/json', 'X-RapidAPI-Key': API_KEY, 'X-RapidAPI-Host': JOKES_API_HOST } };
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
            const options = { method: 'GET', headers: { 'X-RapidAPI-Key': API_KEY, 'X-RapidAPI-Host': QUOTES_API_HOST } };
            const result = await fetchData(url, options);
            renderQuote(result.content, result.originator.name);
        } catch (error) {
            renderError('Could not fetch a quote.');
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const handleConversion = async () => {
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        
        showLoader();
        try {
            const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${fromCurrency}&to=${toCurrency}&q=1.0`;
            const options = { method: 'GET', headers: { 'X-RapidAPI-Key': API_KEY, 'X-RapidAPI-Host': CURRENCY_API_HOST } };
            const result = await fetchData(url, options);
            const rate = parseFloat(result).toFixed(2);

            if (isNaN(rate)) throw new Error("Invalid currency codes provided.");

            const resultHTML = `<p class="conversion-result">1 ${fromCurrency} = ${rate} ${toCurrency}</p>`;
            renderConverter(fromCurrency, toCurrency, resultHTML);

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
                    renderConverter(); // Render with default values
                    hideLoader();
                    break;
            }
            updateActiveNav(page);
            appContent.classList.remove('loading');
        }, 200);
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