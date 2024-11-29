// Contains the command object

// Command object
class Command {
    constructor(identifier, description, callback) {
        this.identifier = identifier; // Array of strings
        this.description = description; // String
        this.callback = callback; // Function to execute command
    }

    execute() {
        // Call the callback function
        this.callback();
    }

    matchToInput(input) {
        // Check if the input matches the command
        if (!input.isArray()) {
            throw new Error("Input must be an array of strings");
        }

        // Convert input to lowercase
        input = input.map((str) => str.toLowerCase());

        // Check if the input length is the same as the identifier length
        // Do this before the looping comparison to avoid unnecessary iterations and blocking of the thread
        if (input.length !== this.identifier.length) {
            return false;
        }

        // Compare the input to the identifier
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== this.identifier[i]) {
                return false;
            }
        }

        // If the input matches the identifier, return true
        return true;
    }
}

// new Command("help", "Displays the help menu", () => {
//     // Display the help menu
//     console.log("Help menu");
// });

// Export the Command object
export default Command;