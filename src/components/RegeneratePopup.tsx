import React from 'react';
import AddWordFormStyles from './AddWordFormStyles';

interface RegeneratePopupProps {
    instructions: string;
    onInstructionsChange: (instructions: string) => void;
    onSubmit: () => void;
}

const RegeneratePopup: React.FC<RegeneratePopupProps> = ({ 
    instructions, 
    onInstructionsChange,
    onSubmit 
}) => {
    return (
        <div id="regenerate-popup" style={AddWordFormStyles.regeneratePopup}>
            <input
                type="text"
                value={instructions}
                onChange={(e) => onInstructionsChange(e.target.value)}
                placeholder="Anweisungen zur Regenerierung"
                style={AddWordFormStyles.regenerateInput}
            />
            <button onClick={onSubmit} style={AddWordFormStyles.regenerateSubmit}>
                ✅
            </button>
        </div>
    );
};

export default RegeneratePopup;