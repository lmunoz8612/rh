import React from 'react';
import {
    Box,
    Button,
    styled
} from '@mui/material';
import {
    FormatAlignCenter,
    FormatAlignLeft,
    FormatAlignRight,
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    FormatUnderlined
} from '@mui/icons-material';

const TextEditorContainer = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    '[contenteditable]:focus': {
        outline: 'none',
    }
}));

const StylizedTextArea = styled(Box)(({ theme }) => ({
    height: '50vh',
    padding: theme.shape.padding * 2,
    width: '100%',
}));

const TextEditor = ({ id, content, onTextEdition }) => {
    const editorRef = React.useRef(null);

    const handleCommand = React.useCallback((command, value = null) => {
        document.execCommand(command, false, value);
    }, []);

    const handleInput = React.useCallback(e => {
        e.preventDefault();
        onTextEdition(e.target.innerHTML);
    }, [onTextEdition]);

    return (
        <TextEditorContainer>
            {/* Botones de formato */}
            <Box>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('bold')}><FormatBold /></Button>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('italic')}><FormatItalic /></Button>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('underline')}><FormatUnderlined /></Button>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('justifyLeft')}><FormatAlignLeft /></Button>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('justifyCenter')}><FormatAlignCenter /></Button>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('justifyRight')}><FormatAlignRight /></Button>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('insertUnorderedList')}><FormatListBulleted /></Button>
                <Button variant="outlined" size="large" color="secondary" sx={{ borderRadius: 0 }} onClick={() => handleCommand('insertOrderedList')}><FormatListNumbered /></Button>
            </Box>
            <Box pt={1}>
                <select defaultValue="Arial" onChange={(e) => handleCommand('fontName', e.target.value)} className="pd-1">
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Impact">Impact</option>
                </select>
                <select defaultValue={1} onChange={(e) => handleCommand('fontSize', e.target.value)} className="pd-1">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                </select>
            </Box>
            {/* Área editable */}
            <Box pt={1}>
                <hr />
                <StylizedTextArea id={id} ref={editorRef} contentEditable dangerouslySetInnerHTML={{ __html: content }} onInput={handleInput} pt={1} />
            </Box>
        </TextEditorContainer>
    );
};

export default TextEditor;