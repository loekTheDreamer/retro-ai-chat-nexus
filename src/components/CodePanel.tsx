import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/theme-github';
import './ace.css'; // For basic styling
import useCurrentGameState, { GameFiles } from '@/store/useCurrentGameState';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-tsx';
import 'ace-builds/src-noconflict/ext-language_tools';
import { registerAceMyCustomTheme } from '../utils/aceMyCustomTheme';

// Sample file data (replace with your own data source, e.g., API or local files)
// const files = [
//   {
//     name: 'file1.js',
//     content:
//       "// File 1 content\nfunction hello() {\n  console.log('Hello from file1');\n}"
//   },
//   {
//     name: 'file2.js',
//     content: '// File 2 content\nconst data = [1, 2, 3];\nconsole.log(data);'
//   },
//   {
//     name: 'file3.js',
//     content: '// File 3 content\nlet x = 10;\nconsole.log(x);'
//   }
// ];
registerAceMyCustomTheme();

function App() {
  const { allGameFiles } = useCurrentGameState();

  useEffect(() => {
    console.log('allGameFiles', allGameFiles);
  }, [allGameFiles]);
  // State to track selected file and its content
  const [selectedFile, setSelectedFile] = useState<GameFiles>(
    allGameFiles.length === 0
      ? { filename: '', code: '', type: '' }
      : allGameFiles[0]
  );

  useEffect(() => {
    setSelectedFile(
      allGameFiles.length === 0
        ? { filename: '', code: '', type: '' }
        : allGameFiles[0]
    );
  }, [allGameFiles]);

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  // Handle code changes in the editor
  const handleCodeChange = (newValue) => {
    setSelectedFile((prev) => ({ ...prev, content: newValue }));
  };

  if (!selectedFile) {
    return null;
  }

  return (
    <div className='app-container'>
      {/* Sidebar */}
      <div className='sidebar'>
        <ul>
          {allGameFiles.map((file) => (
            <li
              key={file.filename}
              className={
                file.filename === selectedFile.filename ? 'selected' : ''
              }
              onClick={() => handleFileSelect(file)}>
              {file.filename}
            </li>
          ))}
        </ul>
      </div>

      {/* Ace Editor */}

      <AceEditor
        mode={selectedFile.type}
        theme='mycustom'
        value={selectedFile.code}
        name={`editor_${selectedFile.filename}`}
        onChange={handleCodeChange}
        editorProps={{ $blockScrolling: true }}
        width='100%'
        height='100%'
        wrapEnabled={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
          highlightGutterLine: false,
          wrap: true
        }}
      />
    </div>
  );
}

export default App;
