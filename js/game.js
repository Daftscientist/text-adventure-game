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

// Get references to the modal elements
const mapModal = document.getElementById('map-modal');
const closeModalBtn = document.getElementById('close-modal');
const mapBtn = document.getElementById('map-btn');
const mapContainer = document.getElementById('map-container');

// Function to create the map
function createMap(rooms, currentRoom) {
    mapContainer.innerHTML = ''; // Clear existing map
    rooms.forEach((room, index) => {
        const roomDiv = document.createElement('div');
        roomDiv.classList.add('room');
        roomDiv.textContent = room.name;
        if (room.name === currentRoom.name) {
            roomDiv.classList.add('highlight');
        }
        mapContainer.appendChild(roomDiv);
    });
}

// Event listener to open the map modal
mapBtn.addEventListener('click', () => {
    createMap(rooms, currentRoom); // Create the map with the current room highlighted
    mapModal.classList.add('active');
});

// Event listener to close the map modal
closeModalBtn.addEventListener('click', () => {
    mapModal.classList.remove('active');
});

    return [parser, currentRoom, rooms, inventory, alarm];
};

export default Game;