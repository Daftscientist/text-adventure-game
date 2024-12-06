import Parser from "./parser.js";
import Command from "./command.js";
import Item from "./item.js";

function CommandsBuilder(currentRoom, rooms, inventory) {
    const parser = new Parser();

    // Add commands

    function getParser() {
        return parser;
    }

    parser.addCommand(new Command(["look"], "Look around the room", () => {
        return currentRoom.getDescription();
    }));

    parser.addCommand(new Command(["help"], "Look around the room", (command) => {
        // Get a list of all the commands
        const commands = parser.commands.map((command) => command.identifier.join(', ')).join(', ');
        return `Available commands: ${commands}`;
    }));

    parser.addCommand(new Command(["exits"], "List the rooms exits", () => {
        return currentRoom.exits.map((exit) => exit.direction).join(', ');
    }));

    parser.addCommand(new Command(["go"], "Go in the spesified direction.", (secondWord) => {
        const exit = currentRoom.getExit(secondWord.toLowerCase());

        if (!secondWord.toLowerCase() in ["north", "south", "east", "west"]) {
            return "Invalid direction.";
        }

        if (exit) {
            currentRoom = rooms.find((room) => room.name === exit.description);
            return `You go ${secondWord.toLowerCase()}.`;
        } else {
            return `There is no exit to the ${secondWord.toLowerCase()}.`;
        }
    }, true));

    parser.addCommand(new Command(["inventory"], "Check your inventory", () => {
        if (inventory.length > 0) {
            return `Inventory:\n ${inventory.map((item) => `- ${item.name}`).join('\n')}`;
        } else {
            return "Your inventory is empty.";
        }
    }));

    parser.addCommand(new Command(["take"], "Take requested item.", (secondWord) => {
        const item = currentRoom.hasItem(secondWord.toLowerCase());
        if (item) {
            inventory.push(item);
            currentRoom.removeItem(item);
            return item.onTake();
        } else {
            return "There is no such item in the room.";
        }
    }, true));

    parser.addCommand(new Command(["drop"], "Drop requested item.", (secondWord) => {
        const item = inventory.find((item) => item.name === secondWord.toLowerCase());
        if (item) {
            inventory.splice(inventory.indexOf(item), 1);
            currentRoom.addItem(item);
            return item.onDrop();
        } else {
            return "You don't have such an item in your inventory.";
        }
    }, true));

    parser.addCommand(new Command(["use"], "Use requested item.", (secondWord) => {
        const item = inventory.find((item) => item.name === secondWord.toLowerCase());
        if (item) {
            // check if the item can be used in the current room
            if (!item.canUse(currentRoom.name)) {
                return "You can't use this item here.";
            }
            return item.onUse();
        } else {
            return "You don't have such an item in your inventory.";
        }
    }, true));
}

// Export the parser
export default CommandsBuilder;