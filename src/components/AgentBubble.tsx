import React, { useEffect, useRef, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

import AceEditor from 'react-ace';
import ace from 'ace-builds';

// Import necessary Ace Editor modules
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-tsx';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';

import { ImageBubble } from './ImageBubble';
import useErrorDetectedStore from '@/stores/useErrorDetectedStore';
import { Message } from '@/api/api';
import { ErrorFoundBubble } from './ErrorFoundBubble';
import { DevErrorBubble } from './DevErrorBubble';
import { extractCode, parseChatCode } from '@/utils/fileParser';
import Editor from '@monaco-editor/react';
import classNames from 'classnames';
import useChatStore from '@/stores/useChatStore';
import useCurrentGameState from '@/stores/useCurrentGameState';

// import { parseContentChat } from '@/utils/htmlParser';
interface AgentBubbleProps {
  content: string;
  commentError?: boolean;
  iframeErrorState?: 'fixing' | 'done';
  showDevError?: boolean;
  codeCreationError?: 'fixing' | 'done';
  setChatHistory: (
    newHistory: Message[] | ((prev: Message[]) => Message[])
  ) => void;
  messageCount: number;
}

export const AgentBubble: React.FC<AgentBubbleProps> = ({
  content,
  commentError,
  iframeErrorState,
  codeCreationError,
  setChatHistory,
  showDevError,
  messageCount
}) => {
  const { errorMessage, setError, setHasError } = useErrorDetectedStore();
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

  // console.log('files:', gameFiles);

  useEffect(() => {
    if (commentError) {
      console.log('commentError:', commentError);
      return;
    }

    const { before, files, after } = extractCode(content);

    setBeforeCode(before);

    setFiles(files);
    setGameFiles(files);
    setAfterCode(after);
  }, [
    commentError,
    setGameFiles,
    setFiles,
    content,
    errorMessage,
    setChatHistory,
    setError,
    setHasError
  ]);
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

  if (showDevError) {
    return <DevErrorBubble />;
  }

  return (
    <Box
      // p='4'
      width='full'
      bg='white'
      _dark={{ bg: 'transparent' }}
      borderRadius='md'>
      <VStack align='stretch' gap={4}>
        {iframeErrorState && (
          <ErrorFoundBubble
            message='Error found in game code:'
            errorState={iframeErrorState}
          />
        )}
        {beforeCode && (
          <Box>
            <ReactMarkdown>{beforeCode}</ReactMarkdown>
          </Box>
        )}
        {/* <Box> */}

        {/* <ReactMarkdown>{content}</ReactMarkdown> */}
        {/* <Text whiteSpace='pre-wrap'>{content}</Text> */}
        {/* </Box> */}
        {codeCreationError && (
          <ErrorFoundBubble
            message='Error found in code creation:'
            errorState={codeCreationError}
          />
        )}
        {files &&
          files.map((file) =>
            file.filename ? (
              <Box key={file.filename}>
                <ReactMarkdown>{file.filename}</ReactMarkdown>
                <AceEditor
                  ref={editorRef}
                  onScroll={handleScroll}
                  mode={file.type}
                  theme='dracula'
                  value={file.code}
                  name='UNIQUE_ID_OF_DIV'
                  width='100%'
                  height='300px'
                  fontSize={14}
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
                  // minLines={3}
                  // maxLines={15}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'gray.600',
                    cursor: 'default',
                    overflow: 'auto'
                  }}
                  editorProps={{ $blockScrolling: true }}
                />
              </Box>
            ) : null
          )}

        {/* {files &&
          files.map((file) =>
            file.filename ? (
              <Box key={file.filename}>
                <ReactMarkdown>{file.filename}</ReactMarkdown>
                <Editor
                  // language={
                  //   file.filename.endsWith('.javascript')
                  //     ? 'javascript'
                  //     : 'html'
                  // }
                  language={file.type}
                  theme='vs-dark'
                  height='200px'
                  className={classNames(
                    'h-[calc(100dvh-90px)] lg:h-[calc(100dvh-96px)]',
                    {
                      'pointer-events-none': isLoading
                    }
                  )}
                  defaultLanguage='javascript'
                  // defaultValue={test}
                  value={file.code}
                  // onChange={(value) => {
                  //   const newValue = value ?? '';
                  //   setCode(newValue);
                  //   // setError(false);
                  // }}
                />
              </Box>
            ) : null
          )} */}

        {/* {code && (
          <Editor
            language='html'
            theme='vs-dark'
            height='300px'
            // className={classNames(
            //   'h-[calc(100dvh-90px)] lg:h-[calc(100dvh-96px)]',
            //   {
            //     'pointer-events-none': isLoading
            //   }
            // )}
            defaultLanguage='javascript'
            // defaultValue={test}
            value={code}
            onChange={(value) => {
              const newValue = value ?? '';
              setCode(newValue);
              // setError(false);
            }}
          />
        )} */}

        {/* {code && (
          <AceEditor
            ref={editorRef}
            onScroll={handleScroll}
            mode='typescript'
            theme='dracula'
            value={code}
            name='UNIQUE_ID_OF_DIV'
            width='100%'
            height='300px'
            fontSize={14}
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
            // minLines={3}
            // maxLines={15}
            style={{
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'gray.600',
              cursor: 'default',
              overflow: 'auto'
            }}
            editorProps={{ $blockScrolling: true }}
          />
        )} */}

        {imageBubble && <ImageBubble content={imageBubble} />}

        {/* {code && (
          <Box
            borderRadius='md'
            overflow='hidden'
            border='1px'
            borderColor='gray.200'
            _focus={{
              border: 'none',
              borderColor: 'transparent',
              boxShadow: 'none',
              outline: 'none'
            }}>
            <SyntaxHighlighter language='html' style={docco}>
              {code}
            </SyntaxHighlighter>
          </Box>
        )} */}
        {afterCode && (
          <Box mt={4}>
            <ReactMarkdown>{afterCode}</ReactMarkdown>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
