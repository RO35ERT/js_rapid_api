
async function generatedJoke(){

    const contents = document.querySelector(".contents");

    const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';
    const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		'X-RapidAPI-Key': 'dded7415cfmsha1def7377045f25p1dbc6ajsnb0199ca1b659',
		'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
	}
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        contents.innerHTML=result.value;
    } catch (error) {
        console.error(error);
    }
}

generatedJoke();

const generate = document.querySelector(".generate");

generate.addEventListener("click", () => {
    generatedJoke();
})

async function generateQuote(){

    const quote = document.querySelector('.quote');
    const author = document.querySelector('.quote_author')
    const url = 'https://quotes15.p.rapidapi.com/quotes/random/';
    const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'dded7415cfmsha1def7377045f25p1dbc6ajsnb0199ca1b659',
		'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
	}
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        author.innerHTML=result.originator.name
        quote.innerHTML=result.content
    } catch (error) {
        console.error(error);
    }
}

generateQuote()

const generateQuoteBtn = document.querySelector(".generate_quote");

generateQuoteBtn.addEventListener('click',()=>{
    generateQuote();
})

async function convertCurrency(){
    const from = document.querySelector('.from');
    const to = document.querySelector('.to');

    const fromValue =from.value.toUpperCase();
    const toValue = to.value.toUpperCase();

    const currency = document.querySelector('.currency')

    const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${fromValue}&to=${toValue}&q=1.0`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'dded7415cfmsha1def7377045f25p1dbc6ajsnb0199ca1b659',
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        currency.innerHTML=result.substring(0,5);
    } catch (error) {
        console.error(error);
    }
}

const convert = document.querySelector('.convert');

convert.addEventListener('click',()=>{
    convertCurrency();
})

const converter = document.querySelector('.converter_link');

const chuck_link = document.querySelector('.chuck_link');

const quotes_link = document.querySelector('.quotes_link');

const chuckNorissJokes = document.querySelector('.chuckNorissJokes');

const quotes = document.querySelector('.Quotes');

const currencyConverter = document.querySelector('.currencyConverter');

converter.addEventListener('click',(e)=>{
    e.preventDefault();
    chuckNorissJokes.style.visibility = "hidden";
    currencyConverter.style.visibility = "visible";
    quotes.style.visibility = "hidden";
})

chuck_link.addEventListener('click',(e)=>{
    e.preventDefault();
    chuckNorissJokes.style.visibility = "visible";
    currencyConverter.style.visibility = "hidden";
    quotes.style.visibility = "hidden";
})

quotes_link.addEventListener('click',(e)=>{
    e.preventDefault();
    chuckNorissJokes.style.visibility = "hidden";
    currencyConverter.style.visibility = "hidden";
    quotes.style.visibility = "visible";
})

