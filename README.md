# Text Adventure Game

## Overview

This project is a text-based adventure game set in an eerie, abandoned mall. The player navigates through various rooms, interacts with items, and executes commands to progress through the game. The game is built using JavaScript and HTML, with a focus on object-oriented programming and modular design.

## Project Structure

The project is organized into several JavaScript files, each responsible for different aspects of the game:

- `entry.js`: The main entry point of the game, handling user input and game state.
- `index.html`: The HTML file that sets up the game interface.
- `js/command.js`: Contains the `Command` class, which defines the structure and behavior of commands.
- `js/game/commandsBuilder.js`: Builds and adds commands to the parser.
- `js/game/roomsBuilder.js`: Builds and initializes the rooms in the game.
- `js/game.js`: Initializes the game, setting up rooms, commands, and the parser.
- `js/item.js`: Contains the `Item` class, which defines the structure and behavior of items.
- `js/parser.js`: Contains the `Parser` class, which parses and matches user input to commands.
- `js/room.js`: Contains the `Room` and `Exit` classes, which define the structure and behavior of rooms and exits.

## Techniques Used

### Object-Oriented Programming (OOP)

The game heavily relies on OOP principles to create reusable and modular code. Key classes include:

- `Room`: Represents a room in the game, with properties for name, description, exits, and items.
- `Exit`: Represents an exit from a room, with properties for direction and description.
- `Item`: Represents an item in the game, with properties for name, description, and usage behavior.
- `Command`: Represents a command that the player can execute, with properties for identifier, description, and callback function.
- `Parser`: Parses user input and matches it to commands.

### Modular Design

The game is divided into multiple modules, each responsible for a specific aspect of the game. This makes the codebase easier to manage and extend. For example, the `js/game/commandsBuilder.js` and `js/game/roomsBuilder.js` files are responsible for setting up commands and rooms, respectively.

### Event Handling

User input is handled through event listeners in `entry.js`. The game listens for button clicks and key presses to process commands and update the game state.

### Dynamic HTML Updates

The game interface is dynamically updated using JavaScript. The `appendMessage` function in `entry.js` appends messages to the game output, providing feedback to the player.

### State Management

The game state, including the current room, inventory, and alarm status, is managed through variables in `entry.js` and `js/game.js`. This allows the game to keep track of the player's progress and respond to their actions accordingly.

### Error Handling

The game includes error handling to ensure robustness. For example, the `Command` class checks for valid input types, and the `Parser` class checks for duplicate command identifiers.

## How to Play

1. Open `index.html` in a web browser.
2. Enter commands in the input field and press the "Submit" button or press "Enter".
3. Navigate through the rooms, interact with items, and solve puzzles to progress through the game.
4. Alternatively, you can play the game online at [my GitHub pages site.](https://daftscientist.github.io/text-adventure-game/).

## Example Commands

- `look`: Look around the current room.
- `go north`: Move to the room to the north.
- `take item`: Take an item from the current room.
- `use item`: Use an item from your inventory.

## Conclusion

This text adventure game demonstrates the use of object-oriented programming, modular design, and dynamic HTML updates to create an interactive and engaging experience. The techniques used in this project can be applied to a wide range of applications, making it a valuable learning experience.