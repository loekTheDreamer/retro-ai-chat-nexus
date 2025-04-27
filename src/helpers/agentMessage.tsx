import useCurrentGameState, { GameFiles } from '@/store/useCurrentGameState';
import { extractCode } from '@/utils/fileParser';
import ace from 'ace-builds/src-noconflict/ace';
import { useEffect } from 'react';
import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/theme-terminal';

ace.define(
  'ace/theme/mycustom',
  ['require', 'exports', 'module', 'ace/lib/dom'],
  function (require, exports, module) {
    exports.isDark = true;
    exports.cssClass = 'ace-mycustom';
    exports.cssText = `
    .ace-mycustom .ace_gutter {
      background: #102b13 !important;
      color: #4AFF00 !important;
      border-right: 1px solid #4AFF00 !important;
    }
    .ace-mycustom {
      background-color: #102b13 !important;
      color: #4AFF00 !important;
      border: 1px solid #4AFF00;
      font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
      font-size: 0.95rem;
    }
    .ace-mycustom .ace_cursor {
      color: #4AFF00 !important;
    }
    .ace-mycustom .ace_print-margin {
      display: none !important;
    }
    .ace-mycustom .ace_marker-layer,
    .ace-mycustom .ace_active-line {
      background: none !important;
    }
    .ace-mycustom .ace_gutter-active-line {
      background-color: #102b13 !important;
    }
    .ace-mycustom .ace_line {
      color: #4AFF00 !important;
    }
    `;
    const dom = require('../lib/dom');
    dom.importCssString(exports.cssText, exports.cssClass);
  }
);

export const agentMessage = (
  message: string,
  onSetGameFiles: (files: GameFiles[]) => void
) => {
  const { before, files, after } = extractCode(message);
  // const { setGameFiles } = useCurrentGameState();
  // setGameFiles(files);
  // useCurrentGameState.setState({ gameFiles: files });
  // useEffect(() => {
  //   useCurrentGameState.setState({ gameFiles: files });
  // }, [files]);
  // if (onSetGameFiles && files) {
  //   onSetGameFiles(files);
  // }
  return (
    <div>
      <div>{before}</div>

      {files &&
        files.map((file) =>
          file.filename ? (
            <div key={file.filename}>
              {'\n'}
              {file.filename}
              <AceEditor
                mode={file.type}
                theme='mycustom'
                value={file.code}
                name='UNIQUE_ID_OF_DIV'
                width='100%'
                readOnly={true}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={false}
                setOptions={{
                  showLineNumbers: true,
                  tabSize: 2,
                  useWorker: false,
                  highlightGutterLine: false,
                  wrap: true
                }}
                wrapEnabled={true}
                editorProps={{ $blockScrolling: true }}
              />
            </div>
          ) : null
        )}
      <div>{after}</div>
    </div>
  );
};
