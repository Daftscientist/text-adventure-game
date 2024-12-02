// Class that stores the item data

class Item {
    constructor(name, description, use) {
        this.name = name;
        this.description = description;
        this.use = use;
        this.usageLocations = [];
    }

    addUsageLocation(location) {
        this.usageLocations.push(location);
    }

    removeUsageLocation(location) {
        const index = this.usageLocations.indexOf(location);
        if (index !== -1) {
            this.usageLocations.splice(index, 1);
        }
    }

    canUse(location) {
        return this.usageLocations.includes(location);
    }

    useItem() {
        return this.use;
    }
}

// Export the Item class
export default Item;