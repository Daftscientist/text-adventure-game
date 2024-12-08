import CommandsBuilder from './game/commandsBuilder.js';
import RoomsBuilder from './game/roomsBuilder.js';

function Game() {
    let state = {
        inventory: [],
        currentRoom: null,
        alarm: {
            active: false,
            endTime: 0
        },
        parser: null,
        rooms: []
    };

    RoomsBuilder(state);

    CommandsBuilder(state);

    // Get references to the modal elements
    const mapModal = document.getElementById('map-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const mapBtn = document.getElementById('map-btn');
    const mapContainer = document.getElementById('map-container');

    // Function to create the map
    function createMap(rooms, currentRoom) {
        mapContainer.innerHTML = ''; // Clear existing map
        rooms.forEach((room) => {
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
        createMap(state.rooms, state.currentRoom); // Create the map with the current room highlighted
        mapModal.classList.add('active');
    });

    // Event listener to close the map modal
    closeModalBtn.addEventListener('click', () => {
        mapModal.classList.remove('active');
    });

    return state;
}

export default Game;