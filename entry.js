import Game from "./js/game.js";
import StateManager from "./js/stateManager.js";

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

// Function to append messages to the game output with typing effect
function appendMessage(message, warning = false, largeText = false, disableTypewriter = false) {
    const lines = message.split('\n');
    let currentLine = 0;

    function typeLine() {
        if (currentLine < lines.length) {
            const line = lines[currentLine];
            const messageElement = document.createElement('p');
            if (warning) {
                messageElement.classList.add('text-yellow-500');
                messageElement.classList.add('font-bold');
                messageElement.classList.add('text-lg');
            }
            if (largeText) {
                messageElement.classList.add('text-lg');
                messageElement.classList.add('font-bold');
            }
            gameOutput.appendChild(messageElement);

            if (disableTypewriter) {
                messageElement.innerHTML = line;
                currentLine++;
                typeLine();
            } else {
                let i = 0;
                function typeWriter() {
                    if (i < line.length) {
                        const char = line.charAt(i);
                        if (char === '<') {
                            const tagEnd = line.indexOf('>', i);
                            if (tagEnd !== -1) {
                                messageElement.innerHTML += line.substring(i, tagEnd + 1);
                                i = tagEnd + 1;
                            } else {
                                messageElement.innerHTML += char;
                                i++;
                            }
                        } else {
                            messageElement.innerHTML += char;
                            i++;
                        }
                        setTimeout(typeWriter, 15); // Adjust typing speed here
                    } else {
                        currentLine++;
                        typeLine(); // Move to the next line after the current one is fully typed
                    }
                }
                typeWriter();
            }
        } else {
            gameOutput.scrollTop = gameOutput.scrollHeight; // Scroll to the bottom
        }
    }

    typeLine();
}

// Say hello to the user
appendMessage(`<b>SYSTEM:</b> Welcome to the game!`);

// Append the current room description to the game output
if (currentRoom) {
    let exits = currentRoom.exits.map((exit) => exit.direction);
    appendMessage(`<b>GAME:</b> ${currentRoom.getDescription()}\n<b>GAME:</b> Exits: ${exits.join(', ')}`);
}

// Event listener for the submit button
submitBtn.addEventListener('click', () => {
    const userInput = gameInput.value.trim();
    if (userInput) {
        appendMessage(`<b>USER:</b> ${userInput}`, false, false, true);
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

const stateManager = new StateManager();

// Event listener for the save button
saveBtn.addEventListener('click', () => {
    const saveModal = document.getElementById('save-modal');
    saveModal.classList.add('active');
    saveModal.classList.remove('hidden');
});

// Event listener for the load button to open the load-save modal
loadBtn.addEventListener('click', async () => {
    const loadSaveModal = document.getElementById('load-save-modal');
    const saveOptionsContainer = document.getElementById('save-options-container');
    saveOptionsContainer.innerHTML = ''; // Clear existing options

    const saves = await stateManager.listSaves();
    saves.forEach(save => {
        const saveOption = document.createElement('li');
        saveOption.className = 'mb-4';
        saveOption.textContent = `${save.saveName} - ${new Date(save.timestamp).toLocaleString()}`;

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.className = 'px-1 rounded shadow-mysterious btn-blend ml-2';
        loadButton.addEventListener('click', async () => {
            const loadedState = await stateManager.loadState(save.id);
            console.log(loadedState)
            Object.assign(state, loadedState); // Update the current state with the loaded state
            loadSaveModal.classList.remove('active');
            loadSaveModal.classList.add('hidden');
            appendMessage(`<b>SYSTEM:</b> Loaded save: ${save.saveName}`, false, true);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'px-1 rounded shadow-mysterious btn-blend ml-2';
        deleteButton.addEventListener('click', async () => {
            await stateManager.deleteSave(save.id);
            saveOption.remove(); // Remove the save option from the list
            appendMessage(`<b>SYSTEM:</b> Deleted save: ${save.saveName}`, false, true);
        });

        saveOption.appendChild(loadButton);
        saveOption.appendChild(deleteButton);
        saveOptionsContainer.appendChild(saveOption);
    });

    loadSaveModal.classList.add('active');
    loadSaveModal.classList.remove('hidden');
});

// Event listener for the save form submission
document.getElementById('save-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveName = document.getElementById('save-name').value.trim();
    if (saveName) {
        await stateManager.saveState(state, saveName);
        const saveModal = document.getElementById('save-modal');
        saveModal.classList.remove('active');
        saveModal.classList.add('hidden');
        appendMessage(`<b>SYSTEM:</b> Game saved as: ${saveName}`);
    }
});

// Event listener for the close buttons in modals
document.querySelectorAll('.modal button').forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').classList.remove('active');
        button.closest('.modal').classList.add('hidden');
    });
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