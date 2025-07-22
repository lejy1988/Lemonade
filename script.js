let day=1;


let prices = {
  lemons: 0.1,
  ice: 0.05,
  sugar: 0.02,
  cups: 0.1,
};

let bank = 5.0; 

let inventory = {
  lemons: 100,
  ice: 5,
  sugar: 5,
  cups: 20,
};

// Buy Function
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

// Update UI Function
function updateUI() {
  document.querySelector("main section h2").textContent = `Bank Balance: £${bank.toFixed(2)}`;
  document.getElementById("day-counter").textContent = `📅 Day: ${day}`;
  const inventoryList = document.querySelectorAll("ul li");
  inventoryList[0].textContent = `🍋 Lemons: ${inventory.lemons}`;
  inventoryList[1].textContent = `🧊 Ice: ${inventory.ice} bags`;
  inventoryList[2].textContent = `🍚 Sugar: ${inventory.sugar} bags`;
  inventoryList[3].textContent = `🥤 Cups: ${inventory.cups}`;
  // Location remains static for now
}

// buying stuff. 
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("buy-lemons-btn").addEventListener("click", () => {
    buyItem("lemons", "buy-lemons-amount");
  });

  document.getElementById("buy-ice-btn").addEventListener("click", () => {
    buyItem("ice", "buy-ice-amount");
  });

  document.getElementById("buy-sugar-btn").addEventListener("click", () => {
    buyItem("sugar", "buy-sugar-amount");
  });

  document.getElementById("buy-cups-btn").addEventListener("click", () => {
    buyItem("cups", "buy-cups-amount");
  });

  updateUI();
});

// Selling Function

let sellingPrice = 1.00

// set selling price
document.getElementById("set-price-btn").addEventListener("click", () => {
  const priceInput = parseFloat(document.getElementById("price-per-cup").value);
  if (isNaN(priceInput) || priceInput <= 0) {
    alert("❌ Please enter a valid selling price.");
    return;
  }
  sellingPrice = priceInput;
  alert(`✅ Price set to £${sellingPrice.toFixed(2)} per cup.`);
});


//simulated selling 
document.getElementById("open-stall-btn").addEventListener("click", () => {
  if (
    inventory.lemons < 1 ||
    inventory.cups < 1 ||
    inventory.sugar < 1 ||
    inventory.ice < 1
  ) {
    alert("❌ Not enough supplies to sell lemonade!");
    return;
  }

  const popup = document.getElementById("day-popup");
  popup.classList.remove("hidden"); // Show popup with animation

  setTimeout(() => {
    // Increment day
    day++;

    // Calculate customers and sales
    let maxCustomers = 100;
    let priceFactor = Math.floor(sellingPrice * 10);
    let customerReduction = priceFactor * 3;
    let potentialCustomers = Math.max(0, maxCustomers - customerReduction);
    let customers = Math.floor(Math.random() * (potentialCustomers + 1));

    let maxSales = Math.min(customers, inventory.lemons, inventory.cups, inventory.sugar, inventory.ice);
    let earnings = maxSales * sellingPrice;

    // Update bank and inventory
    bank += earnings;
    inventory.lemons -= maxSales;
    inventory.cups -= maxSales;
    inventory.sugar -= maxSales;
    inventory.ice -= maxSales;

    // Refresh UI
    updateUI();

    // Show sales summary message
    const salesInfo = document.getElementById("sales-info");
    salesInfo.textContent = `You sold ${maxSales} cup${maxSales !== 1 ? "s" : ""} and made £${earnings.toFixed(2)}!`;

    // Wait 3 seconds so user can read sales summary, then hide popup
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 3000);

  }, 5000); // 5 seconds animation duration
});
