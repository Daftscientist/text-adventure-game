import Parser from "./parser.js";
import Command from "./command.js";
import { Room, Exit } from "./room.js";
import Item from "./item.js";

function Game() {
    // Setup rooms

    let currentRoom = null;
    let rooms = [];
    let inventory = [];

    // Create rooms and exits

    const outside0 = new Room("Outside 0",
        `
            You stand before the unfinished shell of a once-promising mall, now a hollow, crumbling monument to abandonment. 
            The skeletal structure looms in the distance, a mishmash of steel beams and exposed concrete, as if construction was abruptly halted mid-project.
            A faint, musty smell hangs in the air—decay, dust, and something more acrid, almost chemical.
            The windows that once might have offered a glimpse into what could have been stores are now boarded up, the planks of wood nailed tightly over the openings.
            They are rough and uneven, hastily slapped into place with no care for symmetry, giving the place an even more abandoned, desperate look. 
            The faintest sounds leak from the cracks—muffled voices, a low murmur that disappears as soon as you try to focus on it.
            There is no movement, but you can’t shake the feeling that something is happening inside, just out of view...
        `
    );
    outside0.addExit(new Exit("south", "Room 4"));


    const room1 = new Room("Room 1",
        `
            The room is empty, save for the shadows that stretch across the walls and floor, creating an eerie and unsettling atmosphere.
            The air feels still, as if the space has been untouched for a long time. 
            There is no sound here, except for the occasional creak or groan of the building, or the distant hum of something mechanical outside. 
            The silence feels heavy, almost oppressive, as if the room itself is holding its breath, waiting for something to happen. 
        `
    );


    const room2 = new Room("Room 2", "security room, if room (9) alarm isn’t disarmed security kills the character, but if disarmed security let the character go");
    const room3 = new Room("Room 3", "lift key locked, or open with crowbar");


    const room4 = new Room("Room 4",
        `
            You find yourself outside the same eerie mall, but from a different angle. The skeletal structure of the building looms even more ominously here, with steel beams jutting out at odd angles, casting long, twisted shadows on the ground.
            The boarded-up windows are just as haphazardly covered, but from this side, you can see where some of the boards have started to come loose, revealing dark, empty spaces behind them.
            The air is thick with the smell of decay and something metallic, almost like rust. The ground is littered with debris—broken glass, scraps of metal, and pieces of wood.
            Among the rubble, you spot a hammer lying on the ground. It looks old and worn, but still sturdy. It might come in handy later.
            The faint sounds of the mall's interior are still present, but from this angle, they seem even more distant and elusive, as if the building itself is trying to keep its secrets hidden.
            You can't shake the feeling that you're being watched, but there's no one in sight. The sense of unease is palpable, making you question whether you should proceed or turn back.
        `
    );
    room4.addItem(new Item("hammer", "An old and worn hammer lies still on the floor.", () => {
        return "You pick up the hammer.";
    }));
    room4.addExit(new Exit("south", "Room 8"));
    room4.addExit(new Exit("north", "Outside 0"));


    const room5 = new Room("Room 5", "Corridor");
    const room6 = new Room("Room 6", "key for lift");
    const room7 = new Room("Room 7", "kills security, so that the corridor to the lift is open");
    const room8 = new Room("Room 8", "Outside window boarded up");
    const room9 = new Room("Room 9", "Inside on enter alarm going off enter code to disarm – if not they die – Hint on death look for code outside");
    const room10 = new Room("Room 10", "get a gun");
    const room11 = new Room("Room 11", "empty dark room");

    rooms.push(outside0, room1, room2, room3, room4, room5, room6, room7, room8, room9, room10, room11);


    rooms.push(room1, room2);

    // Initialize parser

    const parser = new Parser();

    // Add commands

    parser.addCommand(new Command(["look"], "Look around the room", () => {
        return currentRoom.getDescription();
    }));

    parser.addCommand(new Command(["help"], "Look around the room", () => {
        // Get a list of all the commands
        const commands = parser.commands.map((command) => command.identifier.join(', ')).join(', ');
        return `Available commands: ${commands}\nType 'help' followed by a command to get more information about it.`;        
    }));

    parser.addCommand(new Command(["exits"], "List the rooms exits", () => {
        return currentRoom.exits.map((exit) => exit.direction).join(', ');
    }));

    parser.addCommand(new Command(["go"], "Go in the spesified direction.",  (secondWord) => {
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
            return `Inventory: ${inventory.map((item) => item.name).join(', ')}`;
        } else {
            return "Your inventory is empty.";
        }
    }));

    parser.addCommand(new Command(["take"], "Take requested item.",  (secondWord) => {
        const item = currentRoom.hasItem(secondWord.toLowerCase());
        if (item) {
            inventory.push(item);
            currentRoom.removeItem(item);
            return item.onTake();
        } else {
            return "There is no such item in the room.";
        }
    }, true));

    parser.addCommand(new Command(["drop"], "Drop requested item.",  (secondWord) => {
        const item = inventory.find((item) => item.name === secondWord.toLowerCase());
        if (item) {
            inventory.splice(inventory.indexOf(item), 1);
            currentRoom.addItem(item);
            return item.onDrop();
        } else {
            return "You don't have such an item in your inventory.";
        }
    }, true));

    // Start the game

    currentRoom = outside0;
    return [parser, currentRoom];
}

export default Game;