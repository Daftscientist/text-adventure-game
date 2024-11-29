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
        this.description = description;
        this.exits = []; // Array of Exit objects
    }

    addExit(exit) {
        this.exits.push(exit);
    }

    getExit(direction) {
        return this.exits[direction];
    }
}

// Export the Room class
export { Room, Exit };