import Parser from "./parser.js";
import Command from "./command.js";
import { Room, Exit } from "./room.js";
import Item from "./item.js";
import { parse } from 'https://cdn.jsdelivr.net/npm/flatted@3.3.2/+esm';

function Game() {

    // Check local storage for saved game
    //const savedgame = // grab the saved game from a cookie
    
    let currentRoom = null;
    let rooms = [];
    let inventory = [];
    let parser = null;
    let alarm = {
        active: false,
        endTime: 0
    };
    
    
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
        }, () => {
            if (currentRoom.name !== "Room 3") {
                return "You can't use the crowbar here.";
            }
            // add exit to room 9 from current room
            currentRoom.addExit(new Exit("north", "Room 9"));
            return "You use the crowbar to open the elevator door.";
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
        }, () => {
            // check that the user is in 13
            if (currentRoom.name !== "Room 13") {
                return "You can't use the hammer here.";
            }
            alarm.active = true;
            // give user 5 mins to disarm
            alarm.endTime = Math.floor(Date.now() / 1000) + 300;
            // add exit to room 9 from current room
            currentRoom.addExit(new Exit("north", "Room 9"));
            return "You use the hammer to break the window.";
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
        }, () => {
            // add an exit to the elevator room
            return "You use the key to unlock the elevator door.";
        }));



        const room7 = new Room("Room 7", 
            `
                The room is tucked away in a corner of the unfinished building, at the base of the elevator shaft, and is far enough from prying eyes to avoid detection by those involved in the illicit activities above.
                The walls are made of thick concrete or steel panels, adorned only by a series of surveillance monitors and a few control panels that oversee the elevator’s operation and security systems within the mall. 
            `
        );
        room7.addExit(new Exit("north", "Room 3"));
        room7.addExit(new Exit("south", "Room 11"));
        room7.addExit(new Exit("west", "Room 6"));


        const room8 = new Room("Room 8", 
            `
                You find yourself standing at the edge of a once-bustling shopping center, now eerily silent and forgotten. The towering structure before you is a haunting reminder of a time long past—its once-glowing neon signs now flicker faintly, and its wide glass doors are sealed shut, leaving only the whispers of the past to haunt the crumbling walls. The overgrown parking lot stretches out like a graveyard for abandoned vehicles, and the fading murals on the walls tell stories of an era that seems lost to time.
                As you gaze up at the decaying mall, a sense of curiosity and unease mixes in your chest. What happened to the people who once roamed these halls? Why was this place abandoned? And more importantly—what lies within, waiting to be discovered?
            `
        );
        room8.addExit(new Exit("north", "Room 4"));
        room8.addExit(new Exit("south", "Room 12"));


        const room9 = new Room("Room 9", 
            `
                As you step into the room, an ear-piercing alarm blares, echoing off the walls and sending a jolt of adrenaline through your veins.
                The room is dimly lit, with shadows dancing across the concrete floor.
                A digital keypad glows ominously on the wall, demanding a code to silence the alarm.
                The air is thick with tension, and you realize that failure to disarm the alarm could have dire consequences.
                A cryptic hint is scrawled on the wall: "Look outside for the key to your survival."
                The urgency of the situation presses upon you—time is running out.
            `
        );
        room9.addExit(new Exit("north", "Room 5"));
        room9.addExit(new Exit("south", "Room 13"));


        const room10 = new Room("Room 10", 
            `
                The room is eerily empty, with only the faintest hint of light seeping through the cracks in the walls.
                The air is thick with dust, and every step you take echoes ominously in the silence.
                The walls are bare, save for a few cobwebs that cling to the corners, and the floor is covered in a thin layer of grime.
                As you look around, a sense of unease settles over you, as if the room itself is watching, waiting for something to happen.
            `
        );
        room10.addExit(new Exit("north", "Room 6"));
        room10.addExit(new Exit("south", "Room 14"));

        
        const room11 = new Room("Room 11", 
            `
                The room is empty, save for the shadows that stretch across the walls and floor, creating an eerie and unsettling atmosphere.
                The air feels still, as if the space has been untouched for a long time. 
                There is no sound here, except for the occasional creak or groan of the building, or the distant hum of something mechanical outside.
                The silence feels heavy, almost oppressive, as if the room itself is holding its breath, waiting for something to happen. 
            `
        );
        room11.addExit(new Exit("north", "Room 7"));
        room11.addExit(new Exit("west", "Room 10"));

        const room12 = new Room("Room 12", 
            `
                You find yourself on an empty street, illuminated by a single flickering streetlamp.
                The light casts eerie shadows on the ground, and the silence is almost deafening.
                The air is cool, and you can feel a slight breeze as you stand there, wondering what lies ahead.
                The street feels abandoned, with no signs of life, and the flickering light adds to the unsettling atmosphere. 
                Every now and then, the streetlamp buzzes, casting brief moments of darkness that make you feel even more isolated.
            `
        );
        // go north and east
        room12.addExit(new Exit("north", "Room 8"));
        room12.addExit(new Exit("east", "Room 13"));
        // add key that can be used to disable alarm
        room12.addItem(new Item("key", "A small key lies on the ground, its surface glinting in the dim light. It looks like it could be used in an alarm system.", () => {
            return "You pick up the key.";
        }, () => {
            // check that the user is in 9
            if (currentRoom.name !== "Room 9") {
                return "You can't use the key here.";
            }
            alarm.active = false;
            alarm.endTime = 0;

            return "You use the key to disable the alarm.";
        }
        ));

        const room13 = new Room("Room 13", 
            `
                The shop’s large front window is clouded with grime, obscuring much of what lies inside.
                A faint flicker of dim light pushes through the dirt-streaked glass, casting elongated shadows that dance along the dusty floor.
                You can just make out the outlines of old, forgotten objects—shelves cluttered with tarnished silver, cracked porcelain dolls, and weathered books, all draped in layers of dust.
                The shop feels frozen, as though it has not been touched in years. The silence is suffocating, broken only by the distant hum of the decaying mall.
                But there is something about the place that sends a shiver down your spine.
                A cold, unnatural stillness hangs in the air, and the way the faint light flickers in the corner of the shop makes it feel as if something—or someone—is watching from the shadows.
                The window, though intact, is like a barrier between you and a world locked away in time, hiding its secrets just out of reach.
                The window looks fragile, as if it could be broken with a bit of force.
            `
        );
        // west and east
        room13.addExit(new Exit("west", "Room 12"));
        room13.addExit(new Exit("north", "Room 14"));


        const room14 = new Room("Room 14", 
            `
                You find yourself outside a window that has been securely boarded up.
                The wooden planks are old and weathered, but they still hold strong.
                The area is deserted, and the silence is almost oppressive.
                You wonder what secrets lie behind the boarded-up window.
            `
        );
        // west and east
        room14.addExit(new Exit("south", "Room 13"));
        room14.addExit(new Exit("north", "Room 15"));

        
        const room15 = new Room("Room 15", 
            `
                You stand outside another window that has been securely boarded up.
                The wooden planks are old and weathered, but they still hold strong.
                The area is quiet and deserted, and the silence is almost oppressive.
                You wonder what secrets lie behind the boarded-up window.
            `
        );
        room15.addExit(new Exit("south", "Room 14"));
        // add rock that can be used to break window
        room15.addItem(new Item("rock", "A small rock lies on the ground, its surface smooth and worn. It looks like it could be used to break something.", () => {
            return "You pick up the rock.";
        }, () => {
            // check that the user is in 13
            if (currentRoom.name !== "Room 13") {
                return "You can't use the rock here.";
            }
            // add exit to room 9 from current room
            // give user 5 mins to disarm
            alarm.active = true;
            alarm.endTime = Math.floor(Date.now() / 1000) + 300;
            currentRoom.addExit(new Exit("north", "Room 9"));
            return "You use the rock to break the window.";
        }));

        rooms.push(outside0, room1, room2, room3, room4, room5, room6, room7, room8, room9, room10, room11, room12, room13, room14, room15);



        // Initialize parser

        parser = new Parser();

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

        parser.addCommand(new Command(["use"], "Use requested item.",  (secondWord) => {
            const item = inventory.find((item) => item.name === secondWord.toLowerCase());
            if (item) {
                // check if the item can be used in the current room
                if (!item.canUse(currentRoom.name)) {
                    return "You can't use this item here.";
                }
                return item.onUse();
            } else {
                return "You don't have such an item in your inventory.";
            }
        }));

        currentRoom = outside0;
    

    // Start the game

    
    return [parser, currentRoom, rooms, inventory, alarm];

}

export default Game;