let quotesData = [];
let usedQuotes = [];

// Fetch quotes data from the JSON file
async function fetchQuotes() {
  try {
    const response = await fetch('quotes.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    quotesData = await response.json();
    loadRandomQuote(); // Load the first quote on page load
  } catch (error) {
    console.error('Could not fetch quotes: ', error);
  }
}

function loadRandomQuote() {
  if (quotesData.length === 0) return; // If no quotes data, do nothing

  let quoteData;
  do {
    const personIndex = Math.floor(Math.random() * quotesData.length);
    const person = quotesData[personIndex];
    const quoteIndex = Math.floor(Math.random() * person.quotes.length);
    const quote = person.quotes[quoteIndex];

    quoteData = `${person.name}: "${quote}"`; // Combine name and quote for checking
  } while (
    usedQuotes.includes(quoteData) &&
    usedQuotes.length < totalQuotesCount()
  );

  if (usedQuotes.length >= totalQuotesCount()) usedQuotes = []; // Reset if all quotes were shown

  const selectedPerson = quotesData.find((person) =>
    person.quotes.includes(quoteData.split(': "')[1].slice(0, -1))
  );
  document.querySelector('.card-image').src = selectedPerson.image;
  document.querySelector('.card-image').alt = 'Image of ' + selectedPerson.name;
  document.querySelector('.quote').textContent = quoteData
    .split(': "')[1]
    .slice(0, -1);
  document.querySelector('.name').textContent = selectedPerson.name;

  usedQuotes.push(quoteData); // Add the shown quote to the usedQuotes array
}

// Helper function to count total quotes
function totalQuotesCount() {
  return quotesData.reduce((acc, person) => acc + person.quotes.length, 0);
}

document.addEventListener('DOMContentLoaded', (event) => {
  fetchQuotes();
});

document.querySelector('.card').addEventListener('click', loadRandomQuote);
