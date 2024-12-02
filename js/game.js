import Parser from "./parser.js";
import Command from "./command.js";
import { Room, Exit } from "./room.js";
import Item from "./item.js";


function loadGame() {
    let savedgame = localStorage.getItem("savedgame");
    if (savedgame) {
        let savedgameobj = JSON.parse(savedgame);
        let currentRoomName = savedgameobj.currentRoom;
        let rooms = savedgameobj.rooms;
        let inventory = savedgameobj.inventory;
        let currentRoom = rooms.find((room) => room.name === currentRoomName);
        return [currentRoom, rooms, inventory];
    } else {
        return [null, [], []];
    }
}

function Game() {
    // Setup rooms

    // check local storage for saved game
    // if there is a saved game, load it

    let savedgame = loadGame();

    let currentRoom = savedgame[0];
    let rooms = savedgame[1];
    let inventory = savedgame[2];

    // save game listener

    window.addEventListener('beforeunload', function (e) {
        let savedgame = {
            currentRoom: currentRoom.name,
            rooms: rooms,
            inventory: inventory
        };
        localStorage.setItem("savedgame", JSON.stringify(savedgame));
    });

    // save on button press

    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', () => {
        let savedgame = {
            currentRoom: currentRoom.name,
            rooms: rooms,
            inventory: inventory
        };
        localStorage.setItem("savedgame", JSON.stringify(savedgame));
    });

    // Create rooms and exits

    const outside0 = new Room("Outside 0",
        `
            You stand before the unfinished shell of a once-promising mall, now a hollow, crumbling monument to abandonment. 
            The skeletal structure looms in the distance, a mishmash of steel beams and exposed concrete, as if construction was abruptly halted mid-project.
            A faint, musty smell hangs in the air—decay, dust, and something more acrid, almost chemical.
            The windows that once might have offered a glimpse into what could have been stores are now boarded up, the planks of wood nailed tightly over the openings.
            They are rough and uneven, hastily slapped into place with no care for symmetry, giving the place an even more abandoned, desperate look. 
            The faintest sounds leak from the cracks—muffled voices, a low murmur that disappears as soon as you try to focus on it.
            There is no movement, but you can’t shake the feeling that something is happening inside, just out of view...
        `
    );
    outside0.addExit(new Exit("south", "Room 4"));


    const room1 = new Room("Room 1",
        `
            The room is empty, save for the shadows that stretch across the walls and floor, creating an eerie and unsettling atmosphere.
            The air feels still, as if the space has been untouched for a long time. 
            There is no sound here, except for the occasional creak or groan of the building, or the distant hum of something mechanical outside. 
            The silence feels heavy, almost oppressive, as if the room itself is holding its breath, waiting for something to happen. 
        `
    );
    room1.addExit(new Exit("South", "Room 5"));
    room1.addExit(new Exit("East", "Room 2"));
    room1.addItem(new Item("crowbar", "A crowbar lies on the floor, its metal surface cold and slightly rusted. It looks like it could be useful for prying open something.", () => {
        return "You pick up the crowbar.";
    }));

    const room2 = new Room("Room 2",
        `
            The security room is a high-stakes, covert operations hub designed to monitor and protect the elevator shaft that leads to the top of an unfinished mall. The room is filled with high-tech surveillance equipment, flickering monitors, and a maze of wires and cables running along the walls and floor.
            The air is tense, charged with the urgency of preventing any unwanted interference or police intervention. The personnel here move with precision and purpose, their eyes constantly scanning the screens for any signs of trouble.
            The room serves as a focal point for surveillance, access control, and rapid response. The hum of electronic devices and the occasional crackle of a radio transmission are the only sounds that break the heavy silence.
            The atmosphere is one of constant vigilance, as the team works to maintain surveillance on the illicit activities taking place inside the unfinished mall. The sense of unease is palpable, as they know that any mistake could lead to detection and a swift response from law enforcement.
            This high-tech, strategic hub is designed to protect the elevator system that connects the different levels of this criminal enterprise, ensuring that the illicit operations continue without interruption.
            It seems that the security measures are particularly focused on protecting the elevator, which is a crucial link in the operation.
        `
    );
    room2.addExit(new Exit("West", "Room 1"));
    room2.addExit(new Exit("South", "Room 6"));

    const room3 = new Room("Room 3",
        `
            You find yourself outside the same eerie mall, but from a different angle. The skeletal structure of the building looms even more ominously here, with steel beams jutting out at odd angles, casting long, twisted shadows on the ground.
            The boarded-up windows are just as haphazardly covered, but from this side, you can see where some of the boards have started to come loose, revealing dark, empty spaces behind them.
            The air is thick with the smell of decay and something metallic, almost like rust. The ground is littered with debris—broken glass, scraps of metal, and pieces of wood.
            Among the rubble, you spot a hammer lying on the ground. It looks old and worn, but still sturdy. It might come in handy later.
            Right ahead of you is a lift. The lift's exterior is a patchwork of rusted metal panels and peeling paint, with exposed wiring hanging loosely. The shaft is dimly lit, casting long shadows across the unfinished building. Graffiti and faded warning signs mark the walls, while the faint scent of oil and damp concrete fills the air. The lift ascends slowly, creaking with every movement, as if reluctant to carry you higher into the shadowed, hidden world above.
        `
    );
    // end of game once you go into lift here
    room3.addExit(new Exit("south", "Room 7"));
    room3.addExit(new Exit("west", "Room 2"));


    const room4 = new Room("Room 4",
        `
            You find yourself outside the same eerie mall, but from a different angle. The skeletal structure of the building looms even more ominously here, with steel beams jutting out at odd angles, casting long, twisted shadows on the ground.
            The boarded-up windows are just as haphazardly covered, but from this side, you can see where some of the boards have started to come loose, revealing dark, empty spaces behind them.
            The air is thick with the smell of decay and something metallic, almost like rust. The ground is littered with debris—broken glass, scraps of metal, and pieces of wood.
            Among the rubble, you spot a hammer lying on the ground. It looks old and worn, but still sturdy. It might come in handy later.
            The faint sounds of the mall's interior are still present, but from this angle, they seem even more distant and elusive, as if the building itself is trying to keep its secrets hidden.
            You can't shake the feeling that you're being watched, but there's no one in sight. The sense of unease is palpable, making you question whether you should proceed or turn back.
        `
    );
    room4.addItem(new Item("hammer", "An old and worn hammer lies still on the floor.", () => {
        return "You pick up the hammer.";
    }));
    room4.addExit(new Exit("south", "Room 8"));
    room4.addExit(new Exit("north", "Outside 0"));


    const room5 = new Room("Room 5",
        `
            The corridor is dark and narrow, a long stretch of blackness that seems to swallow any hint of light.
            The air is thick with stillness, and the faintest breath feels heavy in the silence.
            The only sound is the soft, distant echo of footsteps—if you move, they’re amplified, bouncing off the walls, but otherwise, there is nothing.
            No hum of electricity, no whisper of wind, just the oppressive quiet.
        `
    );
    room5.addExit(new Exit("north", "Room 1"));
    room5.addExit(new Exit("south", "Room 9"));
    room5.addExit(new Exit("east", "Room 6"));

    const room6 = new Room("Room 6",
        `
            The room is small and unremarkable, with bare concrete walls and a single flickering light bulb hanging from the ceiling. The air is stale, carrying the faint scent of dust and old paper.
            In the center of the room, there is a small table, its surface cluttered with various tools and scraps of metal. The walls are lined with shelves holding old, rusted equipment and forgotten supplies.
            The atmosphere is one of neglect and abandonment, as if this place has not seen much use in a long time. The silence is heavy, broken only by the occasional drip of water from a leaky pipe somewhere in the distance.
            Despite its disuse, the room feels like it holds secrets, remnants of past activities that were once important but are now long forgotten.
        `
    );
    room6.addExit(new Exit("west", "Room 5"));
    room6.addExit(new Exit("north", "Room 2"));
    room6.addExit(new Exit("east", "Room 7"));
    room6.addExit(new Exit("south", "Room 10"));
    room6.addItem(new Item("key", `
        There rests a key.
        It's an old-fashioned brass key, worn smooth from use, but still distinctly functional. 
        Its shape is simple, unassuming—a single, heavy object that holds great potential. The key is tied to a purposeful lock—one that secures the elevator shaft leading to the top floors of the incomplete mall, where drug dealing is taking place. 
        The key doesn’t belong to any regular access point; it’s a tool of control, the kind that grants entry to places hidden from plain sight, places where dark business is conducted far from the law. 
        The key’s presence in the room feels deliberate, as though it was placed there for someone who understands its significance—someone who is meant to use it. Its surface gleams dully in the intermittent light, and a strange sense of urgency fills the air around it.
        To hold the key is to hold the means of access, the only thing standing between the outside world and the criminal operations above. 
        `, () => {
        return "You pick up the key.";
    }));



    const room7 = new Room("Room 7", "kills security, so that the corridor to the lift is open");
    const room8 = new Room("Room 8", "Outside window boarded up");
    const room9 = new Room("Room 9", "Inside on enter alarm going off enter code to disarm – if not they die – Hint on death look for code outside");
    const room10 = new Room("Room 10", "get a gun");
    const room11 = new Room("Room 11", "empty dark room");

    rooms.push(outside0, room1, room2, room3, room4, room5, room6, room7, room8, room9, room10, room11);


    rooms.push(room1, room2);

    // Initialize parser

    const parser = new Parser();

    // Add commands

    parser.addCommand(new Command(["look"], "Look around the room", () => {
        return currentRoom.getDescription();
    }));

    parser.addCommand(new Command(["help"], "Look around the room", (command) => {
        // Get a list of all the commands
        const commands = parser.commands.map((command) => command.identifier.join(', ')).join(', ');
        return `Available commands: ${commands}`;       
    }));

    parser.addCommand(new Command(["exits"], "List the rooms exits", () => {
        return currentRoom.exits.map((exit) => exit.direction).join(', ');
    }));

    parser.addCommand(new Command(["go"], "Go in the spesified direction.",  (secondWord) => {
        const exit = currentRoom.getExit(secondWord.toLowerCase());

        if (!secondWord.toLowerCase() in ["north", "south", "east", "west"]) {
            return "Invalid direction.";
        }

        if (exit) {
            currentRoom = rooms.find((room) => room.name === exit.description);
            return `You go ${secondWord.toLowerCase()}.`;
        } else {
            return `There is no exit to the ${secondWord.toLowerCase()}.`;
        }
    }, true));

    parser.addCommand(new Command(["inventory"], "Check your inventory", () => {
        if (inventory.length > 0) {
            return `Inventory:\n ${inventory.map((item) => `- ${item.name}`).join('\n')}`;
        } else {
            return "Your inventory is empty.";
        }
    }));

    parser.addCommand(new Command(["take"], "Take requested item.",  (secondWord) => {
        const item = currentRoom.hasItem(secondWord.toLowerCase());
        if (item) {
            inventory.push(item);
            currentRoom.removeItem(item);
            return item.onTake();
        } else {
            return "There is no such item in the room.";
        }
    }, true));

    parser.addCommand(new Command(["drop"], "Drop requested item.",  (secondWord) => {
        const item = inventory.find((item) => item.name === secondWord.toLowerCase());
        if (item) {
            inventory.splice(inventory.indexOf(item), 1);
            currentRoom.addItem(item);
            return item.onDrop();
        } else {
            return "You don't have such an item in your inventory.";
        }
    }, true));

    // Start the game

    currentRoom = outside0;
    return [parser, currentRoom];
}

export default Game;