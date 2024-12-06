import { parse } from 'https://cdn.jsdelivr.net/npm/flatted@3.3.2/+esm';
import CommandsBuilder from './game/commandsBuilder.js';
import RoomsBuilder from './game/roomsBuilder.js';

function Game() {
    let inventory = [];
    let parser = null;
    let alarm = {
        active: false,
        endTime: 0
    };

    let roomsBuilderRes = RoomsBuilder(alarm);
    let rooms = roomsBuilderRes[0];
    let currentRoom = roomsBuilderRes[1];

    const commandsBuilder = CommandsBuilder(currentRoom, rooms, inventory);
    parser = commandsBuilder.getParser();


    return [parser, currentRoom, rooms, inventory, alarm];

}

export default Game;