import Item from "./item.js";
import { Room, Exit } from "./room.js";
import Command from "./command.js";
import Parser from "./parser.js";

class StateManager {
    constructor() {
        this.dbName = "StateStorage";
        this.storeName = "states";
        this.db = null;
        this.initDB();
    }

    // Initialize the database
    initDB() {
        const request = indexedDB.open(this.dbName, 1);

        request.onerror = (event) => {
            console.error("Database error:", event.target.error);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(this.storeName)) {
                const store = db.createObjectStore(this.storeName, { keyPath: "id" });
                store.createIndex("timestamp", "timestamp", { unique: false });
                store.createIndex("saveName", "saveName", { unique: false });
            }
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log("Database initialized successfully");
        };
    }

    // Save state with a specific name
    async saveState(state, saveName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }

            // Create a serializable version of the state
            const stateToSave = {
                id: `${saveName}_${Date.now()}`,
                saveName: saveName,
                timestamp: new Date().toISOString(),
                state: this.serializeState(state)
            };

            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);

            const request = store.add(stateToSave);

            request.onsuccess = () => {
                resolve(stateToSave);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get all saves
    async listSaves() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const saves = [];
            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    saves.push({
                        id: cursor.value.id,
                        saveName: cursor.value.saveName,
                        timestamp: cursor.value.timestamp
                    });
                    cursor.continue();
                } else {
                    resolve(saves);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Load a specific save by its ID
    async loadState(saveId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(saveId);

            request.onsuccess = () => {
                if (request.result) {
                    console.log(request.result.state.alarm);
                    resolve(this.deserializeState(request.result.state, request.result.state));
                } else {
                    reject(new Error("Save not found"));
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Helper method to serialize state (including functions and nested objects)
    serializeState(state) {
        const serialized = {};
        for (const key in state) {
            if (typeof state[key] === 'function') {
                serialized[key] = state[key].toString();
            } else if (typeof state[key] === 'object' && state[key] !== null) {
                serialized[key] = {
                    __type: state[key].constructor.name,
                    __value: this.serializeState(state[key]),
                    __params: this.getConstructorParams(state[key])
                };
            } else {
                serialized[key] = state[key];
            }
        }
        return serialized;
    }

    deserializeState(serializedState, context = {}) {
        const state = {};
        for (const key in serializedState) {
            if (typeof serializedState[key] === 'string' && serializedState[key].startsWith('function')) {
                state[key] = eval(`(${serializedState[key]})`).bind(context);
            } else if (typeof serializedState[key] === 'string' && serializedState[key].startsWith('() =>')) {
                state[key] = eval(serializedState[key]).bind(context);
            } else if (typeof serializedState[key] === 'object' && serializedState[key] !== null) {
                if (serializedState[key].__type) {
                    const ClassConstructor = this.getClassConstructor(serializedState[key].__type);
                    state[key] = new ClassConstructor(...serializedState[key].__params); // Create an instance with parameters
                    Object.assign(state[key], this.deserializeState(serializedState[key].__value, context));
                } else {
                    state[key] = this.deserializeState(serializedState[key], context);
                }
            } else {
                state[key] = serializedState[key];
            }
        }
        return state;
    }

    // Delete a specific save by its ID
    async deleteSave(saveId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }

            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(saveId);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Helper method to get the class constructor by name
    getClassConstructor(className) {
        switch (className) {
            case 'Item':
                return Item;
            case 'Room':
                return Room;
            case 'Exit':
                return Exit;
            case 'Command':
                return Command;
            case 'Parser':
                return Parser;
            case 'Array':
                return Array;
            case 'Object':
                return Object;
            default:
                throw new Error(`Unknown class: ${className}`);
        }
    }

    // Helper method to get constructor parameters for serialization
    getConstructorParams(instance) {
        if (instance instanceof Item) {
            return [instance.name, instance.description, instance.onTake.toString(), instance.onUse.toString(), instance.emoji];
        } else if (instance instanceof Room) {
            return [instance.name, instance.description];
        } else if (instance instanceof Exit) {
            return [instance.direction, instance.description];
        } else if (instance instanceof Command) {
            return [instance.identifier, instance.description, instance.callback.toString(), instance.isTwoWordCommand];
        } else if (instance instanceof Parser) {
            return [];
        } else {
            return [];
        }
    }
}

export default StateManager;