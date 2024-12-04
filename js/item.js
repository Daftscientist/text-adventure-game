// Class that stores the item data

class Item {
    constructor(name, description, onTake, onUse) {
        this.name = name;
        if (description === undefined) {
            // console log the error
            console.error("Description is required for an item" + name);
        }
        this.description = description;
        this.onTake = onTake;
        this.usageLocations = [];
        this.onDrop = () => `You drop the ${this.name}.`;
        this.onUse = onUse;
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
        console.log(this.usageLocations);
        console.log(location)
        return this.usageLocations.includes(location);
    }

    useItem() {
        return this.use;
    }
}

// Export the Item class
export default Item;