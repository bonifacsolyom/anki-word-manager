import React, { useState, useEffect, useRef } from 'react';
import { getDecks, createDeck, addNote, getNotes, updateNote, deleteNote } from '../api/ankiConnect';
import { fetchWordData, WordData } from '../api/openAI';
import WordList from './WordList';
import AddWordFormStyles from './AddWordFormStyles';

const DEFAULT_DECK = 'German words';

const AddWordForm: React.FC = () => {
    const [wordInput, setWordInput] = useState('');
    const [decks, setDecks] = useState<string[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<string>(DEFAULT_DECK);
    const [status, setStatus] = useState('');
    const [addedWords, setAddedWords] = useState<(WordData & { noteId?: number })[]>([]);
    const [editingField, setEditingField] = useState<{ index: number; field: keyof WordData } | null>(null);
    const editInputRef = useRef<HTMLInputElement | null>(null);
    const [regeneratePopup, setRegeneratePopup] = useState<{ index: number; instructions: string } | null>(null);

    useEffect(() => {
        const initializeDecks = async () => {
            const existingDecks = await getDecks();
            if (!existingDecks.includes(DEFAULT_DECK)) {
                await createDeck(DEFAULT_DECK);
                existingDecks.push(DEFAULT_DECK);
            }
            setDecks(existingDecks);
            setSelectedDeck(DEFAULT_DECK);
        };
        initializeDecks();
    }, []);

    useEffect(() => {
        if (selectedDeck) {
            loadWordsFromDeck(selectedDeck);
        }
    }, [selectedDeck]);

    const loadWordsFromDeck = async (deckName: string) => {
        const words = await getNotes(deckName);
        setAddedWords(words);
    };

    const handleAdd = async () => {
        if (!wordInput.trim() || !selectedDeck) {
            setStatus('Bitte geben Sie ein deutsches Wort ein und wählen Sie ein Deck aus.');
            return;
        }

        setStatus('Daten von OpenAI abrufen...');
        const wordData: WordData | null = await fetchWordData(wordInput.trim());
        if (!wordData) {
            setStatus('Fehler beim Abrufen der Daten von OpenAI.');
            return;
        }

        setStatus('Notiz zu Anki hinzufügen...');
        const noteAdded = await addNote({
            deckName: selectedDeck,
            modelName: 'Input',
            fields: {
                Front: wordData.englishTranslation,
                Back: wordData.germanWord,
                Example: wordData.exampleSentence,
            }
        });

        if (noteAdded) {
            setStatus('Wort erfolgreich zu Anki hinzugefügt!');
            await loadWordsFromDeck(selectedDeck);
            setWordInput('');
        } else {
            setStatus('Fehler beim Hinzufügen der Notiz zu Anki.');
        }
    };

    const handleRegenerate = async (index: number) => {
        setRegeneratePopup({ index, instructions: '' });
    };

    const handleRegenerateSubmit = async () => {
        if (!regeneratePopup) return;

        const { index, instructions } = regeneratePopup;
        const word = addedWords[index];
        
        console.log('Starting regeneration for word:', word);
        console.log('Instructions:', instructions);

        setStatus('Regeneriere Wort mit OpenAI...');
        try {
            const newWordData = await fetchWordData(word.germanWord, instructions);
            console.log('Received new word data from OpenAI:', newWordData);
            
            if (newWordData) {
                console.log('Attempting to update note with ID:', word.noteId);
                console.log('Update payload:', {
                    germanWord: newWordData.germanWord,
                    englishTranslation: newWordData.englishTranslation,
                    exampleSentence: newWordData.exampleSentence,
                });
                
                const success = await updateNote(word.noteId!, {
                    germanWord: newWordData.germanWord,
                    englishTranslation: newWordData.englishTranslation,
                    exampleSentence: newWordData.exampleSentence,
                });
                
                console.log('Update note response:', success);
                
                if (success) {
                    setStatus('Wort erfolgreich regeneriert!');
                    const updatedWords = [...addedWords];
                    updatedWords[index] = { ...updatedWords[index], ...newWordData };
                    setAddedWords(updatedWords);
                    console.log('Successfully updated word in state:', updatedWords[index]);
                } else {
                    console.error('Failed to update note in Anki');
                    setStatus('Fehler beim Aktualisieren der Notiz in Anki.');
                }
            } else {
                console.error('Failed to get new word data from OpenAI');
                setStatus('Fehler beim Abrufen der Daten von OpenAI.');
            }
        } catch (error) {
            console.error('Error during regeneration:', error);
            setStatus('Ein Fehler ist aufgetreten.');
        }

        setRegeneratePopup(null);
    };

    const handleDelete = async (index: number) => {
        const word = addedWords[index];
        if (!word.noteId) return;

        console.log('Deleting note with ID:', word.noteId);
        try {
            const success = await deleteNote(word.noteId);
            if (success) {
                const updatedWords = addedWords.filter((_, i) => i !== index);
                setAddedWords(updatedWords);
                setStatus('Wort erfolgreich gelöscht!');
            } else {
                setStatus('Fehler beim Löschen des Wortes.');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            setStatus('Fehler beim Löschen des Wortes.');
        }
    };

    // Add useEffect to handle clicks outside the regeneration popup
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const popupElement = document.getElementById('regenerate-popup');
            if (popupElement && !popupElement.contains(event.target as Node)) {
                setRegeneratePopup(null);
            }
        };

        if (regeneratePopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [regeneratePopup]);

    const handleEdit = async (index: number, field: keyof WordData, value: string) => {
        console.log('Editing:', index, field, value);
        const updatedWords = [...addedWords];
        updatedWords[index] = { ...updatedWords[index], [field]: value };
        setAddedWords(updatedWords);

        if (updatedWords[index].noteId) {
            const updatePayload = {
                germanWord: updatedWords[index].germanWord,
                englishTranslation: updatedWords[index].englishTranslation,
                exampleSentence: updatedWords[index].exampleSentence,
                [field]: value
            };
            
            console.log('Sending update with payload:', updatePayload);
            const success = await updateNote(updatedWords[index].noteId!, updatePayload);
            
            console.log('Update Note Success:', success);
            if (success) {
                setStatus('Änderungen gespeichert');
            } else {
                setStatus('Fehler beim Speichern der Änderungen');
            }
        }
        setEditingField(null);
    };

    const handleFieldClick = (index: number, field: keyof WordData, event: React.MouseEvent<HTMLSpanElement>) => {
        console.log('Field clicked:', index, field);
        setEditingField({ index, field });
        
        // Use setTimeout to ensure cursor placement happens after re-render
        setTimeout(() => {
            const selection = window.getSelection();
            const range = document.createRange();
            const node = event.target as Node;
            const offset = (event.nativeEvent as MouseEvent).offsetX;
            
            // Find the text node and offset within it
            let currentNode = node.firstChild;
            let currentOffset = 0;
            while (currentNode && currentOffset + currentNode.textContent!.length < offset) {
                currentOffset += currentNode.textContent!.length;
                currentNode = currentNode.nextSibling;
            }
            
            if (currentNode) {
                range.setStart(currentNode, Math.min(offset - currentOffset, currentNode.textContent!.length));
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>, index: number, field: keyof WordData) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const target = e.currentTarget;
            target.blur();
            handleEdit(index, field, target.textContent || '');
        }
    };

    const renderEditableField = (word: WordData & { noteId?: number }, index: number, field: keyof WordData) => {
        const isEditing = editingField?.index === index && editingField.field === field;
        const value = word[field];

        return (
            <span
                onClick={(e) => handleFieldClick(index, field, e)}
                onBlur={(e) => {
                    handleEdit(index, field, e.currentTarget.textContent || '');
                    setEditingField(null);
                }}
                onKeyDown={(e) => handleKeyDown(e, index, field)}
                contentEditable={true}
                suppressContentEditableWarning={true}
                style={{
                    ...AddWordFormStyles.editableField,
                    display: 'inline-block',
                    minWidth: '1px',
                }}
            >
                {value}
            </span>
        );
    };

    return (
        <div style={AddWordFormStyles.container}>
            <h2>Deutsches Wort zu Anki hinzufügen</h2>
            <div style={AddWordFormStyles.formGroup}>
                <label htmlFor="wordInput">Deutsches Wort:</label>
                <input
                    type="text"
                    id="wordInput"
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    style={AddWordFormStyles.input}
                    placeholder="Geben Sie ein deutsches Wort ein"
                />
            </div>
            <div style={AddWordFormStyles.formGroup}>
                <label htmlFor="deckSelect">Deck auswählen:</label>
                <select
                    id="deckSelect"
                    value={selectedDeck}
                    onChange={(e) => setSelectedDeck(e.target.value)}
                    style={AddWordFormStyles.select}
                >
                    {decks.map((deck) => (
                        <option key={deck} value={deck}>
                            {deck}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleAdd} style={AddWordFormStyles.button}>
                Hinzufügen
            </button>
            {status && <p style={AddWordFormStyles.status}>{status}</p>}

            <WordList 
                addedWords={addedWords} 
                regeneratePopup={regeneratePopup}
                handleRegenerate={handleRegenerate}
                handleRegenerateSubmit={handleRegenerateSubmit}
                handleDelete={handleDelete}
                renderEditableField={renderEditableField}
                onInstructionsChange={(instructions: string) => {
                    if (regeneratePopup) {
                        setRegeneratePopup({
                            ...regeneratePopup,
                            instructions
                        });
                    }
                }}
            />
        </div>
    );
};

export default AddWordForm;