import Game from "./js/game";

// Start the game

let Parser = Game();

// Parse and match the input
let command = Parser.parseAndMatch("look");

// Execute the command
command.execute();