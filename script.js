// Global Variables
let day = 1;
let bank = 5.0;
let sellingPrice = 1.00;

// Item Price and Inventory Data
const prices = {
  lemons: 0.2,
  ice: 0.1,
  sugar: 0.1,
  cups: 0.1,
};

const inventory = {
  lemons: 100,
  ice: 5,
  sugar: 5,
  cups: 20,
};

//function for days of the week
function getDayName(dayNumber) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[(dayNumber - 1) % 7];
}

//location options with multipliers
const locationData = {
  streetcorner: { name: "Street Corner", multiplier: 1.0, rent: 1 },
  highstreet: { name: "High Street", multiplier: 1.5, rent: 5 },
  festival: { name: "Festival", multiplier: 2.0, rent: 10 },
  wedding: { name: "Wedding", multiplier: 1.8, rent: 20 },
  stadium: { name: "Sports Stadium", multiplier: 2.5, rent: 30 },
};

// weather types with bonuses
const weatherTypes = {
  Sunny: { bonus: 1.2 },
  Cloudy: { bonus: 1.0 },
  Rainy: { bonus: 0.6 },
  Cold: { bonus: 0.7 },
};

//Upgarde levels and costs
let staffLevel = 0;
let marketingLevel = 0;

const staffUpgradeCosts = {
  intern: 5,
  apprentice: 20,
  senior: 60,
  wizard: 180,
};

const marketingUpgradeCosts = {
  paper: 30,
  signspinner: 70,
  radio: 150,
  tv: 400,
};

//recipe managment
let recipe = { lemons: 1, sugar: 1, ice: 1 };
const idealRecipe = { lemons: 2, sugar: 2, ice: 1 };

//perfect recipe score
function getRecipeScore() {
  const diff =
    Math.abs(recipe.lemons - idealRecipe.lemons) +
    Math.abs(recipe.sugar - idealRecipe.sugar) +
    Math.abs(recipe.ice - idealRecipe.ice);

  if (diff === 0) return 1.2; // perfect
  if (diff <= 2) return 1.0; // almost perfect
  return 0.8; // poor recipe
}

//cost per cup function
function calculateCostPerCup() {
  return (
    (recipe.lemons * prices.lemons) +
    (recipe.sugar * prices.sugar) +
    (recipe.ice * prices.ice) +
    prices.cups
  );
}
function updateEstimates() {
  const cost = calculateCostPerCup();
  const profit = sellingPrice - cost;

  document.getElementById("cost-preview").textContent = `£${cost.toFixed(2)}`;
  document.getElementById("profit-preview").textContent = `£${profit.toFixed(2)}`;
}


// purchase items function
function buyItem(item, inputId) {
  const amount = parseInt(document.getElementById(inputId).value);
  if (isNaN(amount) || amount <= 0) {
    alert("❌ Please enter a valid number.");
    return;
  }
  const cost = prices[item] * amount;
  if (bank >= cost) {
    bank -= cost;
    inventory[item] += amount;
    updateUI();
  } else {
    alert(`❌ Not enough money to buy ${amount} ${item}!`);
  }
}

// Staff and Marketing upgrades 
let currentStaffUpgrade = "";
let currentMarketingUpgrade = "";

function applyStaffUpgrade() {
  const selected = document.getElementById("upgrade-staff-select").value;
  const cost = staffUpgradeCosts[selected];
  if (bank >= cost) {
    bank -= cost;
    staffLevel++;
    currentStaffUpgrade = selected;
    alert(`✅ Staff upgrade applied: ${selected} (Level ${staffLevel}).`);
    updateUI();
  } else {
    alert("❌ Not enough money to apply Staff upgrade.");
  }
}

function applyMarketingUpgrade() {
  const selected = document.getElementById("upgrade-marketing-select").value;
  const cost = marketingUpgradeCosts[selected];
  if (bank >= cost) {
    bank -= cost;
    marketingLevel++;
    currentMarketingUpgrade = selected;
    alert(`✅ Marketing upgrade applied: ${selected} (Level ${marketingLevel}).`);
    updateUI();
  } else {
    alert("❌ Not enough money to apply Marketing upgrade.");
  }
}
// update UI function
function updateUI() {
  document.querySelector("main section h2").textContent = `Bank Balance: £${bank.toFixed(2)}`;
  document.getElementById("day-counter").textContent = `📅 Day ${day} – ${getDayName(day)}`;

  const inventoryList = document.querySelectorAll("ul li");
  inventoryList[0].textContent = `🍋 Lemons: ${inventory.lemons}`;
  inventoryList[1].textContent = `🧊 Ice: ${inventory.ice} bags`;
  inventoryList[2].textContent = `🍚 Sugar: ${inventory.sugar} bags`;
  inventoryList[3].textContent = `🥤 Cups: ${inventory.cups}`;
  const selectedLoc = document.getElementById("upgrade-location-select").value;
  inventoryList[4].textContent = `🗺️ Location: ${locationData[selectedLoc].name}`;

  const staffLevelDisplay = document.getElementById("staff-level-display");
  const marketingLevelDisplay = document.getElementById("marketing-level-display");

  if (staffLevelDisplay)
    staffLevelDisplay.textContent = `Staff: ${currentStaffUpgrade || "None"} (Level ${staffLevel})`;

  if (marketingLevelDisplay)
    marketingLevelDisplay.textContent = `Marketing: ${currentMarketingUpgrade || "None"} (Level ${marketingLevel})`;
}

// event listeners for buttons and inputs
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("buy-lemons-btn").addEventListener("click", () => buyItem("lemons", "buy-lemons-amount"));
  document.getElementById("buy-ice-btn").addEventListener("click", () => buyItem("ice", "buy-ice-amount"));
  document.getElementById("buy-sugar-btn").addEventListener("click", () => buyItem("sugar", "buy-sugar-amount"));
  document.getElementById("buy-cups-btn").addEventListener("click", () => buyItem("cups", "buy-cups-amount"));

  document.getElementById("upgrade-staff-btn").addEventListener("click", applyStaffUpgrade);
  document.getElementById("upgrade-marketing-btn").addEventListener("click", applyMarketingUpgrade);

  document.getElementById("lemonsInput").addEventListener("input", e => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) recipe.lemons = val;
    updateEstimates();
  });
  document.getElementById("sugarInput").addEventListener("input", e => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) recipe.sugar = val;
    updateEstimates();
  });
  document.getElementById("iceInput").addEventListener("input", e => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) recipe.ice = val;
    updateEstimates();
  });

  updateUI();
});

// set selling price
document.getElementById("set-price-btn").addEventListener("click", () => {
  const priceInput = parseFloat(document.getElementById("price-per-cup").value);
  if (isNaN(priceInput) || priceInput <= 0) {
    alert("❌ Please enter a valid selling price.");
    return;
  }
  sellingPrice = priceInput;
  alert(`✅ Price set to £${sellingPrice.toFixed(2)} per cup.`);
  updateEstimates();
});

// open stall and start selling function
document.getElementById("open-stall-btn").addEventListener("click", () => {
  const pricePerCup = parseFloat(document.getElementById("price-per-cup").value);
  recipe.lemons = parseInt(document.getElementById("lemonsInput").value);
  recipe.sugar = parseInt(document.getElementById("sugarInput").value);
  recipe.ice = parseInt(document.getElementById("iceInput").value);

  if (
    inventory.lemons < 1 || inventory.cups < 1 ||
    inventory.sugar < 1 || inventory.ice < 1
  ) {
    alert("❌ Not enough supplies to sell lemonade!");
    return;
  }

  const maxPossibleCups = Math.min(
    Math.floor(inventory.lemons / recipe.lemons),
    Math.floor(inventory.sugar / recipe.sugar),
    Math.floor(inventory.ice / recipe.ice),
    inventory.cups
  );

  if (maxPossibleCups <= 0) {
    alert("❌ Not enough supplies to make any lemonade!");
    return;
  }

  let totalCupsSold = 0;
  const numberOfCustomers = Math.floor(Math.random() * 10) + 5;

  // simulate 1-3 cups wanted by each customer
  for (let i = 0; i < numberOfCustomers; i++) {
    const cupsWanted = Math.floor(Math.random() * 3) + 1;
    const cupsAvailable = Math.min(
      Math.floor(inventory.lemons / recipe.lemons),
      Math.floor(inventory.sugar / recipe.sugar),
      Math.floor(inventory.ice / recipe.ice),
      inventory.cups
    );

    const cupsToSell = Math.min(cupsWanted, cupsAvailable);

    if (cupsToSell > 0) {
      inventory.lemons -= recipe.lemons * cupsToSell;
      inventory.sugar -= recipe.sugar * cupsToSell;
      inventory.ice -= recipe.ice * cupsToSell;
      inventory.cups -= cupsToSell;
      totalCupsSold += cupsToSell;
    } else {
      break;
    }
  }

  // End of day processing
  const popup = document.getElementById("day-popup");
  popup.classList.remove("hidden");

  setTimeout(() => {
    day++;

    // weather and location effects and multiplier
    const weatherKeys = Object.keys(weatherTypes);
    const randomWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
    const weatherBonus = weatherTypes[randomWeather].bonus;
    document.getElementById("weather-info").textContent = `Weather is ${randomWeather}.`;

    const locationKey = document.getElementById("upgrade-location-select").value;
    const location = locationData[locationKey];
    const locationMultiplier = location.multiplier;
    const locationRent = location.rent;

    // Display location info
    const baseMaxCustomers = 100;
    const priceFactor = Math.floor(sellingPrice * 10);
    const customerReduction = priceFactor * 3;
    const adjustedMaxCustomers = Math.max(0, baseMaxCustomers - customerReduction);
    const baseCustomers = Math.floor(Math.random() * (adjustedMaxCustomers + 1));

    const recipeMultiplier = getRecipeScore();
    const finalCustomers = Math.floor(
      baseCustomers *
      weatherBonus *
      locationMultiplier *
      (1 + marketingLevel * 0.5) *
      recipeMultiplier
    );

    // sales calculations
    const revenue = totalCupsSold * pricePerCup;
    const tipsPerCup = 0.1 * staffLevel;
    const totalTips = totalCupsSold * tipsPerCup;
    const costPerCup = calculateCostPerCup();
    const profitPerCup = pricePerCup - costPerCup;
    const netProfit = (profitPerCup * totalCupsSold) + totalTips - locationRent;
    bank += netProfit;

    // sales feedback
    let tasteFeedback = "😊 The recipe was balanced!";
    if (recipeMultiplier === 1.2) tasteFeedback = "😋 Customers loved the perfect taste!";
    else if (recipeMultiplier === 0.8) tasteFeedback = "😕 The recipe was off — fewer customers.";

    updateUI();
    const salesInfo = document.getElementById("sales-info");
    salesInfo.innerHTML = `
      🧑‍🤝‍🧑 Customers: ${finalCustomers} <br>
      🧾 Sold: ${totalCupsSold} cup${totalCupsSold !== 1 ? "s" : ""} <br>
      💰 Revenue: £${revenue.toFixed(2)} <br>
      💵 Tips: £${totalTips.toFixed(2)} <br>
      🧾 Cost per Cup: £${costPerCup.toFixed(2)} <br>
       📈 Profit per Cup: £${profitPerCup.toFixed(2)} <br>
      💸 Rent: £${locationRent.toFixed(2)} <br>
      📉 Net Profit: £${netProfit.toFixed(2)} <br>
      🏦 Bank: £${bank.toFixed(2)} <br>
      ${tasteFeedback}
    `;

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 3000);
  }, 5000);
});

