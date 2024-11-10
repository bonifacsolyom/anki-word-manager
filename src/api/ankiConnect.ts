import axios from "axios";
import { WordData } from "./openAI";

const ANKI_CONNECT_URL = "http://localhost:8765";

export interface Deck {
	deckName: string;
}

export const getDecks = async (): Promise<string[]> => {
	try {
		const response = await axios.post(ANKI_CONNECT_URL, {
			action: "deckNames",
			version: 6,
		});
		return response.data.result;
	} catch (error) {
		console.error("Error fetching decks from AnkiConnect:", error);
		return [];
	}
};

export const createDeck = async (deckName: string): Promise<boolean> => {
	try {
		const response = await axios.post(ANKI_CONNECT_URL, {
			action: "createDeck",
			version: 6,
			params: {
				deck: deckName,
			},
		});
		return response.data.result;
	} catch (error) {
		console.error("Error creating deck in AnkiConnect:", error);
		return false;
	}
};

interface Note {
	deckName: string;
	modelName: string;
	fields: {
		Front: string;
		Back: string;
		Example: string;
	};
	tags?: string[];
}

export const addNote = async (note: Note): Promise<boolean> => {
	try {
		const response = await axios.post(ANKI_CONNECT_URL, {
			action: "addNote",
			version: 6,
			params: {
				note: note,
			},
		});
		return response.data.result;
	} catch (error) {
		console.error("Error adding note to AnkiConnect:", error);
		return false;
	}
};

export const getNotes = async (deckName: string): Promise<WordData[]> => {
	try {
		const response = await axios.post(ANKI_CONNECT_URL, {
			action: "findNotes",
			version: 6,
			params: {
				query: `deck:"${deckName}"`
			}
		});

		const noteIds = response.data.result;

		const notesInfo = await axios.post(ANKI_CONNECT_URL, {
			action: "notesInfo",
			version: 6,
			params: {
				notes: noteIds
			}
		});

		return notesInfo.data.result.map((note: any) => ({
			germanWord: note.fields.Back.value,
			englishTranslation: note.fields.Front.value,
			exampleSentence: note.fields.Example.value,
			noteId: note.noteId
		})).reverse(); // Reverse to get newest first
	} catch (error) {
		console.error("Error fetching notes from AnkiConnect:", error);
		return [];
	}
};

export const updateNote = async (noteId: number, updatedFields: Partial<WordData>): Promise<boolean> => {
	try {
		const response = await axios.post(ANKI_CONNECT_URL, {
			action: "updateNoteFields",
			version: 6,
			params: {
				note: {
					id: noteId,
					fields: {
						Back: updatedFields.germanWord || '',
						Front: updatedFields.englishTranslation || '',
						Example: updatedFields.exampleSentence || ''
					}
				}
			}
		});
		console.log('Update Note Response:', response.data);
		return response.data.error === null;
	} catch (error) {
		console.error("Error updating note in AnkiConnect:", error);
		return false;
	}
};

export const deleteNote = async (noteId: number): Promise<boolean> => {
	try {
		const response = await axios.post(ANKI_CONNECT_URL, {
			action: "deleteNotes",
			version: 6,
			params: {
				notes: [noteId]
			}
		});
		console.log('Delete Note Response:', response.data);
		return response.data.error === null;
	} catch (error) {
		console.error("Error deleting note in AnkiConnect:", error);
		return false;
	}
};
