import React, { useEffect, useRef, useState } from 'react';
// import { Box } from '@chakra-ui/react';
// import { UserBubble } from './UserBubble';
// import { AgentBubble } from './AgentBubble';
// import { LoadingBubble } from './LoadingBubble';
import { Message } from '@/types/message';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-terminal';
import { extractCode } from '@/utils/fileParser';
import ace from 'ace-builds/src-noconflict/ace';

// import { ImageBubble } from './ImageBubble';
// import { ImageBubbleArray } from '../promptSection';

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

interface ChatContainerProps {
  messages: Message[];

  isLoading?: boolean;
  // imageBubbleArray: ImageBubbleArray[];
  setChatHistory: (
    newHistory: Message[] | ((prev: Message[]) => Message[])
  ) => void;
  // messageCount: number;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  // imageBubbleArray,
  setChatHistory,
  // messageCount,
  chatEndRef
}) => {
  const agentMessage = (message: string) => {
    const { before, files, after } = extractCode(message);

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

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.map((msg) => (
        <div
          className={`flex ${
            msg.role === 'user' ? 'justify-end' : 'justify-start w-full'
          }`}>
          <div
            className={`px-4 py-2 rounded-sm ${
              msg.role === 'user'
                ? 'bg-neoplay-gray text-white max-w-[80%]'
                : 'bg-neoplay-darkGreen bg-opacity-20 border border-neoplay-green text-neoplay-green w-full'
            }`}>
            <p className='whitespace-pre-wrap'>
              {msg.role === 'user' ? msg.content : agentMessage(msg.content)}
              {/* <p className='whitespace-pre-wrap'>{msg.content}</p> */}
            </p>
            <div className='text-xs text-gray-400 mt-1'>
              {/* {msg.timestamp.toLocaleTimeString()} */}
            </div>
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};
