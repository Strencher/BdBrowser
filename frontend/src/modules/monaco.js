import {IPCEvents} from "common/constants";
import DOM from "common/dom";
import ipcRenderer from "../ipc";
import fetch from "./fetch";
import Webpack from "./webpack";

const UserSettingsStore = Webpack.findByProps("theme", "afkTimeout");
const version = "5.62.0";

const links = [
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${version}/codemirror.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${version}/mode/css/css.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${version}/mode/javascript/javascript.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${version}/addon/search/search.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${version}/addon/search/searchcursor.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${version}/addon/search/jump-to-line.js`
];

const cssCodes = [
    "/*  Name:       material  Author:     Mattia Astorino (http://github.com/equinusocio)  Website:    https://material-theme.site/*/.cm-s-material-darker.CodeMirror {  background-color: #212121;  color: #EEFFFF;}.cm-s-material-darker .CodeMirror-gutters {  background: #212121;  color: #545454;  border: none;}.cm-s-material-darker .CodeMirror-guttermarker,.cm-s-material-darker .CodeMirror-guttermarker-subtle,.cm-s-material-darker .CodeMirror-linenumber {  color: #545454;}.cm-s-material-darker .CodeMirror-cursor {  border-left: 1px solid #FFCC00;}.cm-s-material-darker div.CodeMirror-selected {  background: rgba(97, 97, 97, 0.2);}.cm-s-material-darker.CodeMirror-focused div.CodeMirror-selected {  background: rgba(97, 97, 97, 0.2);}.cm-s-material-darker .CodeMirror-line::selection,.cm-s-material-darker .CodeMirror-line>span::selection,.cm-s-material-darker .CodeMirror-line>span>span::selection {  background: rgba(128, 203, 196, 0.2);}.cm-s-material-darker .CodeMirror-line::-moz-selection,.cm-s-material-darker .CodeMirror-line>span::-moz-selection,.cm-s-material-darker .CodeMirror-line>span>span::-moz-selection {  background: rgba(128, 203, 196, 0.2);}.cm-s-material-darker .CodeMirror-activeline-background {  background: rgba(0, 0, 0, 0.5);}.cm-s-material-darker .cm-keyword {  color: #C792EA;}.cm-s-material-darker .cm-operator {  color: #89DDFF;}.cm-s-material-darker .cm-variable-2 {  color: #EEFFFF;}.cm-s-material-darker .cm-variable-3,.cm-s-material-darker .cm-type {  color: #f07178;}.cm-s-material-darker .cm-builtin {  color: #FFCB6B;}.cm-s-material-darker .cm-atom {  color: #F78C6C;}.cm-s-material-darker .cm-number {  color: #FF5370;}.cm-s-material-darker .cm-def {  color: #82AAFF;}.cm-s-material-darker .cm-string {  color: #C3E88D;}.cm-s-material-darker .cm-string-2 {  color: #f07178;}.cm-s-material-darker .cm-comment {  color: #545454;}.cm-s-material-darker .cm-variable {  color: #f07178;}.cm-s-material-darker .cm-tag {  color: #FF5370;}.cm-s-material-darker .cm-meta {  color: #FFCB6B;}.cm-s-material-darker .cm-attribute {  color: #C792EA;}.cm-s-material-darker .cm-property {  color: #C792EA;}.cm-s-material-darker .cm-qualifier {  color: #DECB6B;}.cm-s-material-darker .cm-variable-3,.cm-s-material-darker .cm-type {  color: #DECB6B;}.cm-s-material-darker .cm-error {  color: rgba(255, 255, 255, 1.0);  background-color: #FF5370;}.cm-s-material-darker .CodeMirror-matchingbracket {  text-decoration: underline;  color: white !important;}",
    "/*Copyright (C) 2011 by MarkLogic CorporationAuthor: Mike Brevoort <mike@brevoort.com>Permission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the \"Software\"), to dealin the Software without restriction, including without limitation the rightsto use, copy, modify, merge, publish, distribute, sublicense, and/or sellcopies of the Software, and to permit persons to whom the Software isfurnished to do so, subject to the following conditions:The above copyright notice and this permission notice shall be included inall copies or substantial portions of the Software.THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS ORIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THEAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS INTHE SOFTWARE.*/.cm-s-xq-light span.cm-keyword { line-height: 1em; font-weight: bold; color: #5A5CAD; }.cm-s-xq-light span.cm-atom { color: #6C8CD5; }.cm-s-xq-light span.cm-number { color: #164; }.cm-s-xq-light span.cm-def { text-decoration:underline; }.cm-s-xq-light span.cm-variable { color: black; }.cm-s-xq-light span.cm-variable-2 { color:black; }.cm-s-xq-light span.cm-variable-3, .cm-s-xq-light span.cm-type { color: black; }.cm-s-xq-light span.cm-property {}.cm-s-xq-light span.cm-operator {}.cm-s-xq-light span.cm-comment { color: #0080FF; font-style: italic; }.cm-s-xq-light span.cm-string { color: red; }.cm-s-xq-light span.cm-meta { color: yellow; }.cm-s-xq-light span.cm-qualifier { color: grey; }.cm-s-xq-light span.cm-builtin { color: #7EA656; }.cm-s-xq-light span.cm-bracket { color: #cc7; }.cm-s-xq-light span.cm-tag { color: #3F7F7F; }.cm-s-xq-light span.cm-attribute { color: #7F007F; }.cm-s-xq-light span.cm-error { color: #f00; }.cm-s-xq-light .CodeMirror-activeline-background { background: #e8f2ff; }.cm-s-xq-light .CodeMirror-matchingbracket { outline:1px solid grey;color:black !important;background:yellow; }"
];

Promise.all(links.map((link, i) => {
    return fetch(link).then(res => res.text()).then(async code => {
        if (i > 0 && !window.CodeMirror) {
            while (!window.CodeMirror) {
                await new Promise(res => setTimeout(res, 200));
            }
        }
        eval(code);
    });
}));

fetch(`https://cdnjs.cloudflare.com/ajax/libs/codemirror/${version}/codemirror.min.css`).then(res => res.text()).then(code => {
    ipcRenderer.send(IPCEvents.INJECT_CSS, {
        css: code,
        id: "code-mirror-style"
    });
});

for (const css of cssCodes) {
    ipcRenderer.send(IPCEvents.INJECT_CSS, {
        css: css,
        id: "code-mirror-theme-" + cssCodes.indexOf(css)
    });
}

export const editor = {
    _active: [],
    setTheme: theme => {editor._active.forEach(e => e.setOption("theme", theme));},
    create: (element, props) => {
        const textarea = DOM.createElement("textarea", {});
        element.appendChild(textarea);
        const Editor = CodeMirror.fromTextArea(textarea, {
            mode: props.language,
            lineNumbers: true,
            theme: UserSettingsStore.theme === "light" ? "xq-light" : "material-darker",
        });
        Editor.setValue(props.value);
        editor._active.push(Editor);
        return {
            dispose: () => {
                editor._active.splice(editor._active.indexOf(Editor), 1);
            },
            onDidChangeModelContent: callback => {
                Editor.on("change", () => callback());
                return {dispose: () => Editor.off("change", callback)};
            },
            getValue: () => Editor.getValue(),
            setValue: value => Editor.setValue(value),
            layout: () => {},
            $defaultHandler: {
                commands: {
                    showSettingsMenu: {exec: () => {}}
                }
            }
        }
    }
};