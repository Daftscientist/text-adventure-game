import Game from "./js/game.js";

// Start the game
let gameres = Game();
let Parser = gameres[0];
let currentRoom = gameres[1];
let alarm = gameres[4];

// Get references to the DOM elements
const gameOutput = document.getElementById('game-output');
const gameInput = document.getElementById('game-input');
const submitBtn = document.getElementById('submit-btn');

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
appendMessage(`<b>GAME:</b> ${currentRoom.getDescription()}`);

// State the available exits
let exits = currentRoom.exits.map((exit) => exit.direction);
appendMessage(`<b>GAME:</b> Exits: ${exits.join(', ')}`);

// Event listener for the submit button
submitBtn.addEventListener('click', () => {
    const userInput = gameInput.value.trim();
    if (userInput) {
        if (alarm.status == true) {
            let alarmEndTime = alarm.endTime - Math.floor(Date.now() / 1000);
            appendMessage(`<b>SYSTEM:</b> The alarm is going off! You have ${alarmEndTime} seconds to disable it.`);
            return;
        }

        appendMessage(`<b>USER:</b> ${userInput}`);
        gameInput.value = '';

        // Parse and match the input
        let command = Parser.parseAndMatch(userInput);

        // Check if a command was matched
        if (!command) {
            appendMessage(`<b>SYSTEM:</b> Command not recognized.`);
            return;
        }

        // Execute the command and get the result
        if (command.isTwoWordCommand) {
            let input = Parser.parse(userInput);
            let secondWord = input[1];
            var result = command.callback(secondWord);
        } else {
            var result = command.callback();
        }

        // Append the result to the game output
        appendMessage(`<b>GAME:</b> ${result}`);
        return;
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

// add save capability
let saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
    let saveData = {
        parser: gameres[0],
        currentRoom: gameres[1],
        rooms: gameres[2],
        inventory: gameres[3]
    };
    // Save the game data to cookie keeping all the data as js objects with attributes and methods
    appendMessage(`<b>SYSTEM:</b> Game saved.`);
});