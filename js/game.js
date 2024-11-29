import Parser from "./parser";
import Command from "./command";
import { Room, Exit } from "./room";

function Game() {
    // Setup rooms

    let currentRoom = null;
    let rooms = [];

    const room1 = new Room("Room 1", "This is room 1");
    const room2 = new Room("Room 2", "This is room 2");

    room1.addExit(new Exit("north", "Room 2"));
    room2.addExit(new Exit("south", "Room 1"));

    rooms.push(room1, room2);

    // Initialize parser

    const parser = new Parser();

    // Add commands

    parser.addCommand(new Command(["look"], "Look around the room", () => {
        console.log(currentRoom.description);
    }));

    parser.addCommand(new Command(["go", "north"], "Go to the room to the north", () => {
        const exit = currentRoom.getExit("north");

        if (exit) {
            currentRoom = rooms.find((room) => room.name === exit.description);
            console.log("You go north.");
        } else {
            console.log("There is no exit to the north.");
        }
    }));

    parser.addCommand(new Command(["go", "south"], "Go to the room to the south", () => {
        const exit = currentRoom.getExit("south");

        if (exit) {
            currentRoom = rooms.find((room) => room.name === exit.description);
            console.log("You go south.");
        } else {
            console.log("There is no exit to the south.");
        }
    }));

    // Start the game

    currentRoom = room1;
    console.log(room1.description);
    return parser;
}

export default Game;