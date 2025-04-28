import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import AceEditor from 'react-ace';
import ace from 'ace-builds/src-noconflict/ace';

// Import necessary Ace Editor modules
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-tsx';
import 'ace-builds/src-noconflict/ext-language_tools';

import { Message } from '@/types/message';
import { extractCode } from '@/utils/fileParser';

import useCurrentGameState from '@/store/useCurrentGameState';
import useChatStore from '@/store/useChatStore';

// import { parseContentChat } from '@/utils/htmlParser';
interface AgentBubbleProps {
  content: string;
  commentError?: boolean;
  iframeErrorState?: 'fixing' | 'done';
  showDevError?: boolean;
  codeCreationError?: 'fixing' | 'done';
  // setChatHistory: (
  //   newHistory: Message[] | ((prev: Message[]) => Message[])
  // ) => void;
  messageCount: number;
}

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

export const AgentBubble: React.FC<AgentBubbleProps> = ({
  content,
  commentError,
  iframeErrorState,
  codeCreationError,
  // setChatHistory,
  showDevError,
  messageCount
}) => {
  const [beforeCode, setBeforeCode] = useState('');
  const [code, setCode] = useState<string | null>(null);
  interface FileType {
    filename: string;
    code: string;
    type: string;
  }

  const [files, setFiles] = useState<FileType[]>([]);
  const [afterCode, setAfterCode] = useState<string | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const isScrollingProgrammatically = useRef(false);
  const { isLoading } = useChatStore();
  const { setGameFiles } = useCurrentGameState();

  useEffect(() => {
    if (commentError) {
      console.log('commentError:', commentError);
      return;
    }

    const { before, files, after } = extractCode(content);

    setBeforeCode(before);
    console.log('files:', files);
    setFiles(files);
    setGameFiles(files);
    setAfterCode(after);
  }, [commentError, setGameFiles, setFiles, content]);
  // console.log('shouldAutoScroll: ', shouldAutoScroll);
  const editorRef = useRef<AceEditor>(null);

  useEffect(() => {
    ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');
  }, []);

  useEffect(() => {
    setShouldAutoScroll(true);
  }, [messageCount]);

  useEffect(() => {
    if (code && shouldAutoScroll && editorRef.current) {
      const session = editorRef.current.editor.getSession();

      const lastLine = session.getLength() - 1;
      isScrollingProgrammatically.current = true;
      editorRef.current.editor.scrollToLine(lastLine, true, true);
      editorRef.current.editor.gotoLine(lastLine + 1);
      // Reset the flag after the scroll operation
      requestAnimationFrame(() => {
        isScrollingProgrammatically.current = false;
        setShouldAutoScroll(true);
      });
    }
  }, [code, shouldAutoScroll]);

  const handleScroll = () => {
    if (!isScrollingProgrammatically.current) {
      setShouldAutoScroll(false);
    }
  };

  // useEffect(() => {
  //   console.log('content: ', content);
  //   console.log('before:', beforeCode);
  //   console.log('code: ', code);
  //   console.log('after:', afterCode);
  // }, [afterCode, beforeCode, code, content]);

  return (
    <div>
      <div className='prose prose-invert'>
        <ReactMarkdown>{beforeCode}</ReactMarkdown>
      </div>

      {/* Render files outside of Markdown-generated <p> */}
      {files && files.length > 0 && (
        <div>
          {files.map((file) =>
            file.filename ? (
              <div key={file.filename}>
                {'\n'}
                {file.filename}
                <AceEditor
                  mode={file.type}
                  theme='mycustom'
                  value={file.code}
                  name={`editor_${file.filename}`}
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
                  height='300px'
                  wrapEnabled={true}
                />
              </div>
            ) : null
          )}
        </div>
      )}

      <div className='prose prose-invert'>
        <ReactMarkdown>{afterCode}</ReactMarkdown>
      </div>
    </div>
  );
};
