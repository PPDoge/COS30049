// Function to handle item purchases and save to localStorage
function buyItem(itemName, price) {
    alert(`You have successfully bought: ${itemName}`); // Notify user of successful purchase
    
    // Retrieve existing purchase history or create an empty array
    let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || []; // Get purchase history from localStorage
    purchaseHistory.push({ itemName, price }); // Add the new purchase to history
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory)); // Save updated history back to localStorage

    // Redirect to the purchase confirmation page
    window.location.href = 'purchase.html'; 
    
    // Save selected item name and price to localStorage for confirmation page
    localStorage.setItem('selectedItem', itemName);
    localStorage.setItem('selectedPrice', price);
}

// Display purchase information on purchase.html
document.addEventListener('DOMContentLoaded', function() {
    let itemName = localStorage.getItem('selectedItem'); // Get selected item name
    let price = localStorage.getItem('selectedPrice'); // Get selected item price

    // Update the confirmation page with item details if they exist
    if (itemName && price) {
        document.getElementById('item-name').textContent = itemName; // Display item name
        document.getElementById('item-price').textContent = price; // Display item price
    }
});

// Display purchase history on history.html
document.addEventListener('DOMContentLoaded', function() {
    let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || []; // Retrieve purchase history
    let historyList = document.getElementById('purchase-history'); // Get the purchase history list element

    // Clear current history list
    if (historyList) {
        historyList.innerHTML = ''; // Clear existing content
        if (purchaseHistory.length > 0) {
            // Iterate through each purchase and add to the list
            purchaseHistory.forEach(purchase => {
                let listItem = document.createElement('li'); // Create a new list item
                listItem.textContent = `Item: ${purchase.itemName} - Price: $${purchase.price}`; // Set text content
                historyList.appendChild(listItem); // Append the new list item to the history list
            });
        } else {
            historyList.innerHTML = '<li>No purchase history available.</li>'; // Message if no history exists
        }
    }
});

// Function to filter items based on search input
function filterItems() {
    let input = document.getElementById('search-input').value.toLowerCase(); // Get the search input value
    let itemList = document.getElementsByClassName('item-list')[0]; // Get the item list element
    let items = itemList.getElementsByTagName('li'); // Get all item list items

    // Loop through each item to show/hide based on search input
    for (let i = 0; i < items.length; i++) {
        let itemName = items[i].getElementsByTagName('h3')[0].textContent.toLowerCase(); // Get item name
        // Check if the item name includes the search input
        if (itemName.includes(input)) {
            items[i].style.display = ''; // Show item if it matches search
        } else {
            items[i].style.display = 'none'; // Hide item if it does not match
        }
    }
}
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameItemsMarketplace", function () {
    let marketplace;
    let owner;
    let buyer;

    beforeEach(async function () {
        const Marketplace = await ethers.getContractFactory("GameItemsMarketplace");
        marketplace = await Marketplace.deploy();
        await marketplace.deployed();

        [owner, buyer] = await ethers.getSigners();
    });

    it("Should add a new item", async function () {
        await marketplace.addItem("Sword", 100);
        const item = await marketplace.items(1);
        expect(item.name).to.equal("Sword");
        expect(item.price).to.equal(100);
        expect(item.owner).to.equal(owner.address);
    });

    it("Should allow purchase of an item", async function () {
        await marketplace.addItem("Sword", 100);
        await marketplace.connect(buyer).purchaseItem(1, { value: 100 });
        const item = await marketplace.items(1);
        expect(item.owner).to.equal(buyer.address);
    });

    it("Should revert if incorrect payment amount is sent", async function () {
        await marketplace.addItem("Sword", 100);
        await expect(
            marketplace.connect(buyer).purchaseItem(1, { value: 50 })
        ).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should revert if the buyer already owns the item", async function () {
        await marketplace.addItem("Sword", 100);
        await marketplace.connect(buyer).purchaseItem(1, { value: 100 });
        await expect(
            marketplace.connect(buyer).purchaseItem(1, { value: 100 })
        ).to.be.revertedWith("You already own this item");
    });

    it("Should update itemCount correctly", async function () {
        await marketplace.addItem("Sword", 100);
        await marketplace.addItem("Shield", 50);
        expect(await marketplace.itemCount()).to.equal(2);
    });

    it("Should transfer funds to the seller", async function () {
        await marketplace.addItem("Sword", 100);
        const sellerBalanceBefore = await ethers.provider.getBalance(owner.address);
        await marketplace.connect(buyer).purchaseItem(1, { value: 100 });
        const sellerBalanceAfter = await ethers.provider.getBalance(owner.address);
        // Note: Gas fees will affect the exact balance, so we check for an increase
        expect(sellerBalanceAfter).to.be.above(sellerBalanceBefore); 
    });
});