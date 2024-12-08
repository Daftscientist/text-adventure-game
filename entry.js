import Game from "./js/game.js";

// Start the game
let state = Game();
let parser = state.parser;
let currentRoom = state.currentRoom;

// Get references to the DOM elements
const gameOutput = document.getElementById('game-output');
const gameInput = document.getElementById('game-input');
const submitBtn = document.getElementById('submit-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');

// Function to append messages to the game output
function appendMessage(message) {
    const lines = message.split('\n');
    lines.forEach(line => {
        const p = document.createElement('p');
        p.innerHTML = line;
        gameOutput.appendChild(p);
    });
    gameOutput.scrollTop = gameOutput.scrollHeight; // Scroll to the bottom
}

// Say hello to the user
appendMessage(`<b>SYSTEM:</b> Welcome to the game!`);

// Append the current room description to the game output
if (currentRoom) {
    appendMessage(`<b>GAME:</b> ${currentRoom.getDescription()}`);
}

// State the available exits
if (currentRoom) {
    let exits = currentRoom.exits.map((exit) => exit.direction);
    appendMessage(`<b>GAME:</b> Exits: ${exits.join(', ')}`);
}

// Event listener for the submit button
submitBtn.addEventListener('click', () => {
    const userInput = gameInput.value.trim();
    if (userInput) {
        appendMessage(`<b>USER:</b> ${userInput}`);
        gameInput.value = '';

        // Parse and match the input
        let command = parser.parseAndMatch(userInput);

        // Check if a command was matched
        if (!command) {
            appendMessage(`<b>SYSTEM:</b> Command not recognized.`);
            return;
        }

        // Execute the command and get the result
        let result;
        if (command.isTwoWordCommand) {
            let input = parser.parse(userInput);
            let secondWord = input[1];
            result = command.callback(secondWord);
        } else {
            result = command.callback();
        }

        // Append the result to the game output
        appendMessage(`<b>GAME:</b> ${result}`);
    }
});

// Optional: Allow pressing Enter to submit the command
gameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});

// Optional: Focus on the input when the page loads
gameInput.focus();

// Event listener for the save button
saveBtn.addEventListener('click', () => {
    const saveData = {
        currentRoom: state.currentRoom.name,
        rooms: state.rooms.map(room => ({
            name: room.name,
            description: room.description,
            exits: room.exits,
            items: room.items
        })),
        inventory: state.inventory.map(item => ({
            name: item.name,
            description: item.description,
            onTake: item.onTake.toString(),
            onUse: item.onUse.toString(),
            usageLocations: item.usageLocations
        }))
    };
    document.cookie = `gameState=${JSON.stringify(saveData)}; path=/;`;
    appendMessage(`<b>SYSTEM:</b> Game saved.`);
});

// Event listener for the load button
loadBtn.addEventListener('click', () => {
    const cookies = document.cookie.split('; ');
    const gameStateCookie = cookies.find(cookie => cookie.startsWith('gameState='));
    if (gameStateCookie) {
        const gameState = JSON.parse(gameStateCookie.split('=')[1]);
        state.currentRoom = state.rooms.find(room => room.name === gameState.currentRoom);
        gameState.rooms.forEach(savedRoom => {
            const room = state.rooms.find(room => room.name === savedRoom.name);
            room.description = savedRoom.description;
            room.exits = savedRoom.exits.map(exit => new Exit(exit.direction, exit.description));
            room.items = savedRoom.items.map(item => new Item(item.name, item.description, eval(item.onTake), eval(item.onUse)));
        });
        state.inventory = gameState.inventory.map(item => new Item(item.name, item.description, eval(item.onTake), eval(item.onUse)));
        appendMessage(`<b>SYSTEM:</b> Game loaded.`);
        appendMessage(`<b>GAME:</b> ${state.currentRoom.getDescription()}`);
        let exits = state.currentRoom.exits.map((exit) => exit.direction);
        appendMessage(`<b>GAME:</b> Exits: ${exits.join(', ')}`);
    } else {
        appendMessage(`<b>SYSTEM:</b> No saved game found.`);
    }
});

const compassBtn = document.getElementById('compass-btn');
const closeCompassModalBtn = document.getElementById('close-compass-modal');
const compassModal = document.getElementById('compass-modal');

// Event listener for the compass button
compassBtn.addEventListener('click', () => {
    compassModal.classList.add('active');
    compassModal.classList.remove('hidden');
});

// Event listener for the close compass modal button
closeCompassModalBtn.addEventListener('click', () => {
    compassModal.classList.remove('active');
    compassModal.classList.add('hidden');
});