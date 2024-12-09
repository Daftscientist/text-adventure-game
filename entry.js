import Game from "./js/game.js";
import { stringify, parse } from 'https://cdn.jsdelivr.net/npm/flatted@3.2.5/esm/index.js';

// Helper function to serialize functions
function serializeFunctions(obj) {
    return JSON.parse(stringify(obj, (key, value) => {
        if (typeof value === 'function') {
            return `__FUNCTION__${value.toString()}`;
        }
        return value;
    }));
}

// Helper function to deserialize functions
function deserializeFunctions(obj) {
    return parse(JSON.stringify(obj), (key, value) => {
        if (typeof value === 'string' && value.startsWith('__FUNCTION__')) {
            return eval(`(${value.slice(12)})`);
        }
        return value;
    });
}

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
function appendMessage(message, warning=false) {
    const lines = message.split('\n');
    lines.forEach((line) => {
        const messageElement = document.createElement('p');
        messageElement.innerHTML = line;
        if (warning) {
            messageElement.classList.add('text-yellow-500');
            messageElement.classList.add('font-bold');
            messageElement.classList.add('text-lg');
        }
        gameOutput.appendChild(messageElement);
    }
    );
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
        // check if alarm has expired
        if (state.alarm.active && Date.now() > state.alarm.endTime) {
            appendMessage(`<b>GAME:</b> The alarm has expired.`, true);
            appendMessage(`<b>GAME:</b> Game over!`, true);
            state.alarm.active = true;
            gameInput.disabled = true;
            return;
        }

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
        // if alarm is active and command does not start with use then warn
        if (state.alarm.active && !userInput.startsWith('use')) {
            appendMessage(`<b>GAME:</b> Warning! The alarm is active. You have ${Math.ceil((state.alarm.endTime - Date.now()) / 1000)} seconds left.`, true);
            // instructions to disable
            appendMessage(`<b>GAME:</b> To disable the alarm, use a special item you should have found earlier.`, true);
        }
    }
});

// Optional: Allow pressing Enter to submit the command
gameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});

// Optional: Focus on the input when the page loads
document.addEventListener('DOMContentLoaded', () => {
    gameInput.focus();
});

// Event listener for the save button
saveBtn.addEventListener('click', () => {
    // lets save using indexedDB instead of local storage
    // no need to sterlilize anymore
    const saveData = {
        state: state
    };


});

// Event listener for the load button
loadBtn.addEventListener('click', () => {
        // lets save using indexedDB instead of local storage

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

const inventoryBtn = document.getElementById('inventory-btn');
const closeInventoryModalBtn = document.getElementById('close-inventory-modal');
const inventoryModal = document.getElementById('inventory-modal');
const inventoryContainer = document.getElementById('inventory-container');

// Event listener for the inventory button
inventoryBtn.addEventListener('click', () => {
    // Clear the inventory container
    inventoryContainer.innerHTML = '';
    // Add inventory items to the container
    state.inventory.forEach(item => {
        const itemDiv = document.createElement('li');
        const itemNameCap = item.name.charAt(0).toUpperCase() + item.name.slice(1);

        itemDiv.textContent = `${item.emoji} - ${itemNameCap}`;
        inventoryContainer.appendChild(itemDiv);
    });
    inventoryModal.classList.add('active');
    inventoryModal.classList.remove('hidden');
});

// Event listener for the close inventory modal button
closeInventoryModalBtn.addEventListener('click', () => {
    inventoryModal.classList.remove('active');
    inventoryModal.classList.add('hidden');
});