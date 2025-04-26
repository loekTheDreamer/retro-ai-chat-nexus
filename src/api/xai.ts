import { Message } from '@/types/message';

interface xaiChatRequest {
  chatHistory: Message[];
  onMessage: (content: string) => void;
  onDone: () => void;
}

const baseURL = import.meta.env.VITE_BASEURL;
console.log('baseURL:', baseURL);

let currentEventSource: EventSource | null = null; // Keep track of the current EventSource instance

export const xaiStreamEvent = async ({
  chatHistory,
  onMessage,
  onDone
}: xaiChatRequest) => {
  console.log('anthropic stream Event');

  // Close any existing EventSource connection
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = null;
  }

  try {
    console.log('setup chat context');
    // POST /setup-chat-context
    const setupResponse = await fetch(`${baseURL}/setup-xai-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatHistory }),
      credentials: 'include'
    });

    if (!setupResponse.ok) {
      const errorData = await setupResponse
        .json()
        .catch(() => ({ error: 'Failed to read setup error' }));
      console.error(`Setup failed: ${setupResponse.status}`, errorData);
      return;
    }
    // const frog = await setupResponse.json();
    console.log('Setup context response:', setupResponse);
    const setupResult = await setupResponse.json();
    console.log('Setup context response:', setupResult.message); // "Chat context ready for streaming."

    const eventSourceUrl = `${baseURL}/xai-stream`;
    console.log('Connecting EventSource to:', eventSourceUrl);

    // EVENT-SOURCE /stream
    const evtSource = new EventSource(eventSourceUrl, {
      withCredentials: true
    });
    currentEventSource = evtSource; // Store the new instance

    evtSource.onopen = () => {
      console.log('SSE connection opened');
    };
    evtSource.addEventListener('keep-alive', (event) => {
      // This will fire when the backend yields { event: 'keep-alive', data: '' }
      console.log('Received keep-alive event:', event.data);
    });

    // --- NEW BACKEND PROTOCOL: OpenAI-style SSE events ---
    evtSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data);
        if (data.content && onMessage) {
          onMessage(data.content);
        }
      } catch (err) {
        console.error('Malformed SSE message:', err, event);
      }
    });

    evtSource.addEventListener('done', () => {
      evtSource.close();
      currentEventSource = null;
      if (onDone) onDone();
    });

    evtSource.addEventListener('error', (event) => {
      console.error('SSE connection error:', event);
      evtSource.close();
      currentEventSource = null;
      if (onDone) onDone();
    });
  } catch (error) {
    console.log('anthropicStreamEvent:', error);
    if (currentEventSource) {
      currentEventSource.close();
      currentEventSource = null;
    }
  }
};
