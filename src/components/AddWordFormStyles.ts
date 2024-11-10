const AddWordFormStyles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: '#f9f9f9',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    select: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    status: {
        marginTop: '15px',
        fontStyle: 'italic',
    },
    addedWords: {
        marginTop: '20px',
    },
    regenerateContainer: {
        position: 'relative',
    },
    regeneratePopup: {
        position: 'absolute',
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '5px',
        marginRight: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    regenerateInput: {
        border: 'none',
        outline: 'none',
        padding: '5px',
        fontSize: '14px',
        width: '200px',
    },
    regenerateSubmit: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        padding: '0 5px',
    },
    regenerateButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '2px',
    },
    wordContent: {
        flex: 1,
        marginRight: '10px',
    },
    editableField: {
        cursor: 'text',
        padding: '2px',
        borderRadius: '2px',
        transition: 'background-color 0.3s',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        outline: 'none',
        backgroundColor: 'rgba(0, 123, 255, 0.1)', // Slight highlight when editing
    },
    wordList: {
        listStyleType: 'none',
        padding: 0,
    },
    wordItem: {
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    example: {
        fontStyle: 'italic',
        marginTop: '5px',
        fontSize: '0.9em',
    },
    deleteButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '2px',
        color: '#ff4444',
    },
};

export default AddWordFormStyles;