export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  commmentError?: boolean;
  codeCreationError?: 'fixing' | 'done';
  iframeError?: boolean;
  iframeErrorState?: 'fixing' | 'done';
  errorCount?: number;
  showDevError?: boolean;
}
