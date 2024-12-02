import Game from "./js/game.js";

// Start the game
let gameres = Game();
let Parser = gameres[0];
let currentRoom = gameres[1];

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
appendMessage(`Welcome to the game!`);

// Append the current room description to the game output
appendMessage(`<b>SYSTEM:</b> ${currentRoom.getDescription()}`);

// State the available exits
let exits = currentRoom.exits.map((exit) => exit.direction);
appendMessage(`<b>SYSTEM:</b> Exits: ${exits.join(', ')}`);

// Event listener for the submit button
submitBtn.addEventListener('click', () => {
    const userInput = gameInput.value.trim();
    if (userInput) {
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
        appendMessage(`<b>SYSTEM:</b> ${result}`);
    }
});





// Optional: Allow pressing Enter to submit the command
gameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});