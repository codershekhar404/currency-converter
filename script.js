// Get references to HTML elements
var amountOne = document.getElementById("amountOne");
var amountTwo = document.getElementById("amountTwo");
var currency_one;
var currency_two;

var apiKey = "e18f7c5abd9421c6763ca989";

// Function to fetch currency codes and populate dropdowns
async function fetchCurrency() {
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`;

  const data = await fetch(url);
  const res = await data.json();

  const codes = res.supported_codes;

  for (let i = 0; i < codes.length; i++) {
    const elem = codes[i];

    // Exclude specific currencies
    if (!["ANG", "XAF", "XCD", "XDR", "XOF", "XPF"].includes(elem[0])) {
      // Create and append option tags to dropdowns
      const optionTagFrom = document.createElement("option");
      fromDropdown.appendChild(optionTagFrom);
      optionTagFrom.value = elem[0];
      optionTagFrom.innerHTML = `${elem[0]} - ${elem[1]}`;

      const optionTagTo = document.createElement("option");
      optionTagTo.value = elem[0];
      optionTagTo.innerHTML = `${elem[0]} - ${elem[1]}`;
      toDropdown.appendChild(optionTagTo);
    }
  }
}

// Initial currency code fetch and dropdown population
fetchCurrency();

// Function to get selected currency options
function getSelectedOption() {
  var selectedOptionFrom = fromDropdown.options[fromDropdown.selectedIndex];
  currency_one = selectedOptionFrom.value;

  var selectedOptionTo = toDropdown.options[toDropdown.selectedIndex];
  currency_two = selectedOptionTo.value;
}

// Function to update conversion results
async function updateResult(inputElement, outputElement, baseCurrency, targetCurrency) {
  const base_url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

  const userInput = parseFloat(inputElement.value);

  try {
    // Fetch exchange rates
    const data = await fetch(base_url);
    const res = await data.json();

    // Calculate and display conversion result
    const rate = res.conversion_rates[targetCurrency];
    const result = userInput * rate;
    outputElement.value = result.toFixed(2);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to swap values between two elements
const swapValues = (element1, element2) => {
  const temp = element1.value;
  element1.value = element2.value;
  element2.value = temp;
};

// Event listeners for dropdown changes and input fields
fromDropdown.addEventListener("change", updateResult.bind(null, amountOne, amountTwo));
toDropdown.addEventListener("change", updateResult.bind(null, amountOne, amountTwo));
amountOne.addEventListener("input", async function () {
  getSelectedOption();
  await updateResult(amountOne, amountTwo, currency_one, currency_two);
});

amountTwo.addEventListener("input", async function () {
  getSelectedOption();
  await updateResult(amountTwo, amountOne, currency_two, currency_one);
});

// Event listener for swap button
document.getElementById("swapButton").addEventListener("click", function () {
  swapValues(amountOne, amountTwo);
  swapValues(fromDropdown, toDropdown);
});
