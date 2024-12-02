// Description: This file contains the parser class.
import Command from "./command.js";

class Parser {
    constructor() {
        this.commands = [];
    }

    // Add a command to the parser
    addCommand(command) {
        // Check if the command is an instance of the Command class
        if (!(command instanceof Command)) {
            throw new Error("Command must be an instance of the Command class");
        }

        // Check for duplicate identifiers
        for (let existingCommand of this.commands) {
            if (existingCommand.identifier.join() === command.identifier.join()) {
                throw new Error("Command with the same identifier already exists");
            }
        }

        // Add the command to the commands array
        this.commands.push(command);
    }

    // Parse the input
    parse(input) {
        // Split the input by spaces
        input = input.split(" ");

        // Remove empty strings from the input
        input = input.filter((str) => str !== "");

        // Return the parsed input
        return input;
    }

    // Parse the input and match it to a command
    parseAndMatch(input) {
        // Parse the input
        input = this.parse(input);

        // Check if the input is empty
        if (input.length === 0) {
            return null;
        }

        // Find the command that matches the input
        for (let command of this.commands) {
            if (command.matchToInput(input)) {
                return command;
            }
        }

        // If no command matches the input, return null
        return null;
    }
};


// Example usage:
// // Import the Parser class
// import Parser from "./js/parser";

// // Create a new instance of the Parser class
// const parser = new Parser();

// // Add a command to the parser
// parser.addCommand(new Command(["help"], "Displays the help menu", () => {
//     // Display the help menu
//     console.log("Help menu");
// }));

// // Parse and match the input
// const input = "help";
// const matchedCommand = parser.parseAndMatch(input);

// // Execute the matched command
// if (matchedCommand) {
//     matchedCommand.execute();
// }

// Export the Parser class
export default Parser;