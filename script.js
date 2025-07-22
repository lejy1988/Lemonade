let day = 1;
let bank = 5.0;
let sellingPrice = 1.00;

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

const locationData = {
  streetcorner: { name: "Street Corner", multiplier: 1.0, rent: 1 },
  highstreet: { name: "High Street", multiplier: 1.5, rent: 5 },
  festival: { name: "Festival", multiplier: 2.0, rent: 10 },
  wedding: { name: "Wedding", multiplier: 1.8, rent: 20 },
  stadium: { name: "Sports Stadium", multiplier: 2.5, rent: 30 }
};

const weatherTypes = {
  Sunny: { bonus: 1.2 },
  Cloudy: { bonus: 1.0 },
  Rainy: { bonus: 0.6 },
  Cold: { bonus: 0.7 }
};

// upgrade data and levels
let staffLevel = 0;
let marketingLevel = 0;

const staffUpgradeCosts = {
  intern: 5,
  apprentice: 20,
  senior: 60,
  wizard: 180
};

const marketingUpgradeCosts = {
  paper: 30,
  signspinner: 70,
  radio: 150,
  tv: 400
};

// Recipe related variables 
let recipe = { lemons: 1, sugar: 1, ice: 1 };
const idealRecipe = { lemons: 2, sugar: 2, ice: 1 };

function getRecipeScore() {
  const diff =
    Math.abs(recipe.lemons - idealRecipe.lemons) +
    Math.abs(recipe.sugar - idealRecipe.sugar) +
    Math.abs(recipe.ice - idealRecipe.ice);

  if (diff === 0) return 1.2;    // Perfect recipe boosts customers by 20%
  if (diff <= 2) return 1.0;     // Acceptable, no bonus or penalty
  return 0.8;                    // Poor recipe reduces customers to 80%
}

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

// Track current upgrade names
let currentStaffUpgrade = "";
let currentMarketingUpgrade = "";

function applyStaffUpgrade() {
  const selected = document.getElementById("upgrade-staff-select").value;
  const cost = staffUpgradeCosts[selected];
  if (bank >= cost) {
    bank -= cost;
    staffLevel++;
    currentStaffUpgrade = selected;
    const capName = selected.charAt(0).toUpperCase() + selected.slice(1);
    alert(`✅ Staff upgrade applied: ${capName} (Level ${staffLevel}).`);
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
    const capName = selected.charAt(0).toUpperCase() + selected.slice(1);
    alert(`✅ Marketing upgrade applied: ${capName} (Level ${marketingLevel}).`);
    updateUI();
  } else {
    alert("❌ Not enough money to apply Marketing upgrade.");
  }
}

function updateUI() {
  document.querySelector("main section h2").textContent = `Bank Balance: £${bank.toFixed(2)}`;
  document.getElementById("day-counter").textContent = `📅 Day: ${day}`;
  const inventoryList = document.querySelectorAll("ul li");
  inventoryList[0].textContent = `🍋 Lemons: ${inventory.lemons}`;
  inventoryList[1].textContent = `🧊 Ice: ${inventory.ice} bags`;
  inventoryList[2].textContent = `🍚 Sugar: ${inventory.sugar} bags`;
  inventoryList[3].textContent = `🥤 Cups: ${inventory.cups}`;
  const selectedLoc = document.getElementById("upgrade-location-select").value;
  inventoryList[4].textContent = `🗺️ Location: ${locationData[selectedLoc].name}`;

  // Show Staff and Marketing level with names
  const staffLevelDisplay = document.getElementById("staff-level-display");
  const marketingLevelDisplay = document.getElementById("marketing-level-display");

  if (staffLevelDisplay) {
    const capStaffName = currentStaffUpgrade
      ? currentStaffUpgrade.charAt(0).toUpperCase() + currentStaffUpgrade.slice(1)
      : "None";
    staffLevelDisplay.textContent = `Staff: ${capStaffName} (Level ${staffLevel})`;
  }

  if (marketingLevelDisplay) {
    const capMarketingName = currentMarketingUpgrade
      ? currentMarketingUpgrade.charAt(0).toUpperCase() + currentMarketingUpgrade.slice(1)
      : "None";
    marketingLevelDisplay.textContent = `Marketing: ${capMarketingName} (Level ${marketingLevel})`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("buy-lemons-btn").addEventListener("click", () => buyItem("lemons", "buy-lemons-amount"));
  document.getElementById("buy-ice-btn").addEventListener("click", () => buyItem("ice", "buy-ice-amount"));
  document.getElementById("buy-sugar-btn").addEventListener("click", () => buyItem("sugar", "buy-sugar-amount"));
  document.getElementById("buy-cups-btn").addEventListener("click", () => buyItem("cups", "buy-cups-amount"));

  document.getElementById("upgrade-staff-btn").addEventListener("click", applyStaffUpgrade);
  document.getElementById("upgrade-marketing-btn").addEventListener("click", applyMarketingUpgrade);

  // Recipe inputs event listeners
  document.getElementById("lemonsInput").addEventListener("input", e => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) recipe.lemons = val;
  });
  document.getElementById("sugarInput").addEventListener("input", e => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) recipe.sugar = val;
  });
  document.getElementById("iceInput").addEventListener("input", e => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) recipe.ice = val;
  });

  updateUI();
});

document.getElementById("set-price-btn").addEventListener("click", () => {
  const priceInput = parseFloat(document.getElementById("price-per-cup").value);
  if (isNaN(priceInput) || priceInput <= 0) {
    alert("❌ Please enter a valid selling price.");
    return;
  }
  sellingPrice = priceInput;
  alert(`✅ Price set to £${sellingPrice.toFixed(2)} per cup.`);
});

document.getElementById("open-stall-btn").addEventListener("click", () => {
  if (
    inventory.lemons < 1 || inventory.cups < 1 ||
    inventory.sugar < 1 || inventory.ice < 1
  ) {
    alert("❌ Not enough supplies to sell lemonade!");
    return;
  }

  const popup = document.getElementById("day-popup");
  popup.classList.remove("hidden");

  setTimeout(() => {
    day++;

    // Weather Randomization
    const weatherKeys = Object.keys(weatherTypes);
    const randomWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
    const weatherBonus = weatherTypes[randomWeather].bonus;
    document.getElementById("weather-info").textContent = `Weather is ${randomWeather}.`;

    // Location Effects
    const locationKey = document.getElementById("upgrade-location-select").value;
    const location = locationData[locationKey];
    const locationMultiplier = location.multiplier;
    const locationRent = location.rent;

    // Calculate customers
    const baseMaxCustomers = 100;
    const priceFactor = Math.floor(sellingPrice * 10);
    const customerReduction = priceFactor * 3;
    const adjustedMaxCustomers = Math.max(0, baseMaxCustomers - customerReduction);
    const baseCustomers = Math.floor(Math.random() * (adjustedMaxCustomers + 1));
    
    //Apply marketing upgrade bonus and recipe impact 
    const recipeMultiplier = getRecipeScore();
    const finalCustomers = Math.floor(
      baseCustomers *
      weatherBonus *
      locationMultiplier *
      (1 + marketingLevel * 0.5) *
      recipeMultiplier
    );

    // Max possible sales
    const maxSales = Math.min(finalCustomers, inventory.lemons, inventory.cups, inventory.sugar, inventory.ice);
    const revenue = maxSales * sellingPrice;

    // === Calculate tips from staff upgrades ===
    const tipsPerSale = 0.1 * staffLevel; // 10p tip per sale per staff level
    const totalTips = maxSales * tipsPerSale;

    const netProfit = revenue + totalTips - locationRent;
    bank += netProfit;

    // 📉 Update inventory
    inventory.lemons -= maxSales;
    inventory.cups -= maxSales;
    inventory.sugar -= maxSales;
    inventory.ice -= maxSales;

    // 🧾 Update UI and sales

    let tasteFeedback = "😊 The recipe was balanced!";
    if (recipeMultiplier === 1.2) tasteFeedback = "😋 Customers loved the perfect taste!";
    else if (recipeMultiplier === 0.8) tasteFeedback = "😕 The recipe was off — fewer customers.";

    updateUI();
    const salesInfo = document.getElementById("sales-info");
    salesInfo.innerHTML = `
      🧑‍🤝‍🧑 Customers: ${finalCustomers} <br>
      🧾 Sold: ${maxSales} cup${maxSales !== 1 ? "s" : ""} <br>
      💰 Revenue: £${revenue.toFixed(2)} <br>
      💵 Tips: £${totalTips.toFixed(2)} <br>
      💸 Rent: £${locationRent.toFixed(2)} <br>
      📉 Net Profit: £${netProfit.toFixed(2)} <br>
      🏦 Bank: £${bank.toFixed(2)} <br>
      ${tasteFeedback}
    `;

    setTimeout(() => {
      popup.classList.add("hidden");
    }, 3000);
  }, 5000); // 5s animation
});
