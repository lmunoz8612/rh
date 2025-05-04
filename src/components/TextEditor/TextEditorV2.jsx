import { useTheme } from '@mui/material';
import React from 'react';
import {
    createButton,
    createDropdown,
    EditorProvider,
    Editor,
    Toolbar
} from 'react-simple-wysiwyg';
import { $ } from '../../assets/utils/utils';

const ButtonBold = createButton('Negrita', <i className="ri-bold"></i>, 'bold');
const ButtonItalic = createButton('Cursiva', <i className="ri-italic"></i>, 'italic');
const ButtonUnderline = createButton('Subrayado', <i className="ri-underline"></i>, 'underline');
const ButtonAlignLeft = createButton('Alinear a la isquierda', <i className="ri-align-left"></i>, 'justifyLeft');
const ButtonAlignCenter = createButton('Alinear al centro', <i className="ri-align-center"></i>, 'justifyCenter');
const ButtonAlignRight = createButton('Alinear a la derecha', <i className="ri-align-right"></i>, 'justifyRight');
const ButtonListBulleted = createButton('Viñetas', <i className="ri-list-unordered"></i>, 'insertUnorderedList');
const ButtonListNumbered = createButton('Numeración', <i className="ri-list-ordered"></i>, 'insertOrderedList');

const DropDownFontName = createDropdown('Fuente', [
    ['Arial', 'fontName', 'Arial'],
    ['Verdana', 'fontName', 'Verdana'],
    ['Times New Roman', 'fontName', 'Times New Roman'],
    ['Georgia', 'fontName', 'Georgia'],
    ['Courier New', 'fontName', 'Courier New'],
    ['Tahoma', 'fontName', 'Tahoma'],
    ['Impact', 'fontName', 'Impact'],
]);

const DropDownFontSize = createDropdown('Tamaño de Fuente', [
    ['1', 'fontSize', '1'],
    ['2', 'fontSize', '2'],
    ['3', 'fontSize', '3'],
    ['4', 'fontSize', '4'],
    ['5', 'fontSize', '5'],
    ['6', 'fontSize', '6'],
    ['7', 'fontSize', '7'],
]);

const editorContainerProps = {
    width: '100%',
};

const TextEditorV2 = ({ name, value, onChange }) => {
    const theme = useTheme();
    
    React.useEffect(() => {
        if ($(name)) {
            $(name).style.height = '40vh';
            $(name).style.maxHeight = '40vh';
            $(name).style.overflowY = 'scroll';
        }
    }, [name]);

    return (
        <EditorProvider>
            <Editor id={name} name={name} value={value} onChange={onChange} containerProps={{ style: editorContainerProps }}>
                <Toolbar>
                    <ButtonBold />
                    <ButtonItalic />
                    <ButtonUnderline />
                    <ButtonAlignLeft />
                    <ButtonAlignCenter />
                    <ButtonAlignRight />
                    <ButtonListBulleted />
                    <ButtonListNumbered />
                    <DropDownFontName style={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.fontSize,
                    }} />
                    <DropDownFontSize style={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.fontSize,
                    }} />
                </Toolbar>
            </Editor>
        </EditorProvider>
    )
};

export default TextEditorV2;