export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  commmentError?: boolean;
  codeCreationError?: 'fixing' | 'done';
  iframeError?: boolean;
  iframeErrorState?: 'fixing' | 'done';
  errorCount?: number;
  showDevError?: boolean;
}

// export interface ChatHistory {
//   role: 'system' | 'user' | 'assistant';
//   content: string;
//   commmentError?: boolean;
//   codeCreationError?: 'fixing' | 'done';
//   iframeError?: boolean;
//   iframeErrorState?: 'fixing' | 'done';
//   errorCount?: number;
//   showDevError?: boolean;
// }
