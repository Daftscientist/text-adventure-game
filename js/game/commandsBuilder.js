import Parser from "../parser.js";
import Command from "../command.js";

function CommandsBuilder(state) {
    state.parser = new Parser();

    // Add commands
    state.parser.addCommand(new Command(["look"], "Look around the room", () => {
        return state.currentRoom.getDescription();
    }));

    state.parser.addCommand(new Command(["help"], "Display available commands", () => {
        const commands = state.parser.commands.map((command) => command.identifier.join(', ')).join(', ');
        return `Available commands: ${commands}`;
    }));

    state.parser.addCommand(new Command(["exits"], "List the room's exits", () => {
        return state.currentRoom.exits.map((exit) => exit.direction).join(', ');
    }));

    state.parser.addCommand(new Command(["go"], "Go in the specified direction", (secondWord) => {
        const exit = state.currentRoom.getExit(secondWord.toLowerCase());
        if (exit) {
            state.currentRoom = state.rooms.find((room) => room.name === exit.description);
            return `You go ${secondWord.toLowerCase()}.`;
        } else {
            return `There is no exit to the ${secondWord.toLowerCase()}.`;
        }
    }, true));

    state.parser.addCommand(new Command(["inventory"], "Check your inventory", () => {
        if (state.inventory.length > 0) {
            return `Inventory:\n ${state.inventory.map((item) => `- ${item.name}`).join('\n')}`;
        } else {
            return "Your inventory is empty.";
        }
    }));

    state.parser.addCommand(new Command(["take"], "Take requested item", (secondWord) => {
        const item = state.currentRoom.hasItem(secondWord.toLowerCase());
        if (item) {
            state.inventory.push(item);
            state.currentRoom.removeItem(item);
            return item.onTake();
        } else {
            return "There is no such item in the room.";
        }
    }, true));

    state.parser.addCommand(new Command(["drop"], "Drop requested item", (secondWord) => {
        const item = state.inventory.find((item) => item.name === secondWord.toLowerCase());
        if (item) {
            state.inventory.splice(state.inventory.indexOf(item), 1);
            state.currentRoom.addItem(item);
            return item.onDrop();
        } else {
            return "You don't have such an item in your inventory.";
        }
    }, true));

    state.parser.addCommand(new Command(["use"], "Use requested item", (secondWord) => {
        const item = state.inventory.find((item) => item.name === secondWord.toLowerCase());
        if (item) {
            if (!item.canUse(state.currentRoom.name)) {
                return "You can't use this item here.";
            }
            return item.onUse();
        } else {
            return "You don't have such an item in your inventory.";
        }
    }, true));

    return state;
}

export default CommandsBuilder;