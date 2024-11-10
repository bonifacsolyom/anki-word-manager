import React from 'react';
import RegeneratePopup from './RegeneratePopup';
import AddWordFormStyles from './AddWordFormStyles';
import { WordData } from '../api/openAI';

interface WordListProps {
    addedWords: (WordData & { noteId?: number })[];
    regeneratePopup: { index: number; instructions: string } | null;
    handleRegenerate: (index: number) => void;
    handleRegenerateSubmit: () => void;
    handleDelete: (index: number) => void;
    renderEditableField: (
        word: WordData & { noteId?: number },
        index: number,
        field: keyof WordData
    ) => JSX.Element;
    onInstructionsChange: (instructions: string) => void;
}

const WordList: React.FC<WordListProps> = ({
    addedWords,
    regeneratePopup,
    handleRegenerate,
    handleRegenerateSubmit,
    handleDelete,
    renderEditableField,
    onInstructionsChange
}) => {
    return (
        <div style={AddWordFormStyles.addedWords}>
            <h3>Wörter im Deck</h3>
            <ul style={AddWordFormStyles.wordList}>
                {addedWords.map((word, index) => (
                    <li key={index} style={AddWordFormStyles.wordItem}>
                        <div style={AddWordFormStyles.wordContent}>
                            <strong>{renderEditableField(word, index, 'germanWord')}</strong>
                            : {renderEditableField(word, index, 'englishTranslation')}
                            <p style={AddWordFormStyles.example}>
                                {renderEditableField(word, index, 'exampleSentence')}
                            </p>
                        </div>
                        <div style={AddWordFormStyles.regenerateContainer}>
                            {regeneratePopup && regeneratePopup.index === index && (
                                <RegeneratePopup 
                                    instructions={regeneratePopup.instructions}
                                    onInstructionsChange={onInstructionsChange}
                                    onSubmit={handleRegenerateSubmit}
                                />
                            )}
                            <button onClick={() => handleRegenerate(index)} style={AddWordFormStyles.regenerateButton}>
                                🔄
                            </button>
                            <button onClick={() => handleDelete(index)} style={AddWordFormStyles.deleteButton}>
                                ❌
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WordList;