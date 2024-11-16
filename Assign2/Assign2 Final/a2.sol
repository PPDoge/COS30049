// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameItemsMarketplace {
    struct Item {
        uint256 id;
        string name;
        uint256 price;
        address owner;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount = 0;

    function addItem(string memory name, uint256 price) public {
        itemCount++;
        items[itemCount] = Item(itemCount, name, price, msg.sender);
    }

    function purchaseItem(uint256 itemId) public payable {
        Item memory item = items[itemId];
        require(msg.value == item.price, "Incorrect payment amount");
        require(item.owner != msg.sender, "You already own this item");

        payable(item.owner).transfer(msg.value);
        items[itemId].owner = msg.sender;
    }
}
