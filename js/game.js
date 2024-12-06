import { parse } from 'https://cdn.jsdelivr.net/npm/flatted@3.3.2/+esm';
import CommandsBuilder from "./game/commandsBuilder.js";
import RoomsBuilder from './game/roomsBuilder.js';

function Game() {
    let currentRoom = null;
    let rooms = [];
    let inventory = [];
    let parser = null;
    let alarm = {
        active: false,
        endTime: 0
    };

    rooms = RoomsBuilder(currentRoom, alarm);
    const outside0 = rooms[0];

    const commandsBuilder = CommandsBuilder(currentRoom, rooms, inventory);
    parser = commandsBuilder.getParser();

    currentRoom = outside0;

    return [parser, currentRoom, rooms, inventory, alarm];

}

export default Game;