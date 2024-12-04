// This is the room.js file. It contains the Room class.

class Exit {
    constructor(direction, description) {
        this.direction = direction;
        this.description = description;
    }
}

class Room {
    constructor(name, description) {
        this.name = name;
        if (description === undefined) {
            // console log the error
            console.error("Description is required for a room" + name);
        }

        this.description = description;
        this.exits = []; // Array of Exit objects
        this.items = []; // Array of Item objects
    }

    addExit(exit) {
        this.exits.push(exit);
    }

    getDescription() {
        console.log(this)
        let description = this.description;
        for (let item of this.items) {
            description += `\n${item.description}`;
        }
        return description;
    }

    getExit(direction) {
        return this.exits.find((exit) => exit.direction === direction);
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }


    hasItem(itemName) {
        const item = this.items.find((item) => item.name === itemName);
        return item ? item : false;
    }
}

// Export the Room class
export { Room, Exit };