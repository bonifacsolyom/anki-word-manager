import React from 'react';
import AddWordFormStyles from './AddWordFormStyles';
import { WordData } from '../api/openAI';

interface EditableFieldProps {
    word: WordData & { noteId?: number };
    index: number;
    field: keyof WordData;
    handleFieldClick: (index: number, field: keyof WordData, event: React.MouseEvent<HTMLSpanElement>) => void;
    handleEdit: (index: number, field: keyof WordData, value: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLSpanElement>, index: number, field: keyof WordData) => void;
    editingField: { index: number; field: keyof WordData } | null;
}

const EditableField: React.FC<EditableFieldProps> = ({
    word,
    index,
    field,
    handleFieldClick,
    handleEdit,
    handleKeyDown,
    editingField,
}) => {
    const isEditing = editingField?.index === index && editingField.field === field;
    const value = word[field];
    const style = isEditing
        ? { ...AddWordFormStyles.editableField, backgroundColor: 'rgba(0, 123, 255, 0.1)' } // Slight highlight
        : AddWordFormStyles.editableField;

    return (
        <span
            onClick={(e) => handleFieldClick(index, field, e)}
            onBlur={(e) => {
                handleEdit(index, field, e.currentTarget.textContent || '');
            }}
            onKeyDown={(e) => handleKeyDown(e, index, field)}
            contentEditable={true}
            suppressContentEditableWarning={true}
            style={{
                ...style,
                display: 'inline-block',
                minWidth: '1px',
            }}
        >
            {value}
        </span>
    );
};

export default EditableField;