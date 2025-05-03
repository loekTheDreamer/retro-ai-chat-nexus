import { GameFiles } from '@/store/useCurrentGameState';
import useAuthStore from '@/store/useAuthStore';

const baseURL = import.meta.env.VITE_BASEURL;

export interface PublishedGame {
  id: string;
  author: string;
  title: string;
}

interface SaveFilesToDisk {
  gameFiles: GameFiles[];
  gameId: string;
}

export const saveFilesToDiskApi = async ({
  gameFiles,
  gameId
}: SaveFilesToDisk) => {
  const token = useAuthStore.getState().token;

  // Immutably update the code property of index.html, if present
  const updatedGameFiles = Array.isArray(gameFiles)
    ? gameFiles.map((f) =>
        f.filename === 'index.html'
          ? {
              ...f,
              code: f.code.replace(
                '<head>',
                `<head>
        <script>
          (function() {
            // Report errors to parent
            function reportError(type, details) {
              window.parent.postMessage({
                type: 'iframe-error',
                ...details
              }, '*');
            }

            // Catch runtime JavaScript errors
            window.onerror = function(msg, url, line, col, error) {
              reportError('runtime', {
                msg: msg instanceof Error ? msg.message : msg,
                url: url || window.location.href,
                line: line || 0,
                col: col || 0,
                stack: error?.stack || 'No stack trace'
              });
              return false;
            };

            // Catch resource loading errors (e.g., 404s)
            window.addEventListener('load', function() {
              document.querySelectorAll('img, script, link').forEach((el) => {
                el.onerror = function() {
                  reportError('resource', {
                    msg: 'Failed to load resource: ' + el.src,
                    url: el.src || window.location.href,
                    line: 0,
                    col: 0
                  });
                };
              });
            });

            // Catch unhandled promise rejections
            window.onunhandledrejection = function(event) {
              reportError('promise', {
                msg: event.reason?.message || 'Unhandled Promise rejection',
                url: event.reason?.fileName || window.location.href,
                line: event.reason?.lineNumber || 0,
                col: event.reason?.columnNumber || 0,
                stack: event.reason?.stack || 'No stack trace'
              });
            };
          })();
        </script>
        <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
        <script>
          window.addEventListener('message', async (event) => {
            if (event.data?.type === 'capture-screenshot') {
              console.log('Iframe received capture-screenshot message');
              const canvas = await html2canvas(document.body); // or target node
              const imageData = canvas.toDataURL('image/png');
              window.parent.postMessage({ type: 'screenshot-data', imageData }, '*');
              console.log('Iframe sent screenshot data back');
            }
          });
        </script>
        `
              )
            }
          : f
      )
    : gameFiles;

  // Use updatedGameFiles in the request below
  console.log('gameFiles', updatedGameFiles);
  console.log('sending files to server with gameId:', gameId);

  try {
    const response = await fetch(`${baseURL}/game/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ gameFiles: updatedGameFiles, gameId })
    });

    if (response.status === 401) {
      console.log('Unauthorized!!!');
      return 'Unauthorized';
      // throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error('Failed to save files');
    }
    console.log('Files saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving files:', error);
    return false;
  }
};

export const getPublishedGames = async (): Promise<
  PublishedGame[] | undefined
> => {
  try {
    const response = await fetch(`${baseURL}/published`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch published games');
    }
    return await response.json();
  } catch (error) {
    console.log('Error fetching published games:', error);
  }
};

export const serveCurrentGameApi = async (address: string) => {
  console.log('go');
  try {
    const response = await fetch(`${baseURL}/serve-current`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address })
    });
    if (!response.ok) {
      throw new Error('Failed to serve game');
    }
    const parsedResponse = await response.json();
    return parsedResponse.url;
  } catch (error) {
    console.log('Error serving game:', error);
  }
};

export const createGameApi = async (token: string) => {
  try {
    const response = await fetch(`${baseURL}/game`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token, // token is your JWT string
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to create game');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating game:', error);
  }
};

export const uploadCoverImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${baseURL}/upload-cover-image`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading cover image:', error);
    throw error;
  }
};

export const getUserGamesApi = async (token: string, threadId: string) => {
  console.log('threadId sending to api:', threadId);
  try {
    const response = await fetch(`${baseURL}/game/user?threadId=${threadId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user games');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user games:', error);
  }
};

export const updateGameNameApi = async (newName: string, gameId: string) => {
  const token = useAuthStore.getState().token;

  try {
    const response = await fetch(`${baseURL}/game/name`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newName, gameId })
    });
    if (!response.ok) {
      throw new Error('Failed to update game name');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating game name:', error);
  }
};

export const addThreadApi = async (gameId: string) => {
  const token = useAuthStore.getState().token;

  try {
    const response = await fetch(`${baseURL}/game/thread`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gameId })
    });
    if (!response.ok) {
      throw new Error('Failed to add thread');
    }
    return response.json();
  } catch (error) {
    console.error('Error adding thread:', error);
  }
};

export const getThreadsApi = async (id: string) => {
  const token = useAuthStore.getState().token;

  try {
    const response = await fetch(`${baseURL}/game/thread?id=${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to get threads');
    }
    const thread = await response.json();
    return thread;
  } catch (error) {
    console.error('Error getting threads:', error);
  }
};

export const createNewGame = async () => {
  const token = useAuthStore.getState().token;

  try {
    console.log('Creating new game');
    console.log('token:', token);
    const response = await fetch(`${baseURL}/game`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    if (!response.ok) {
      throw new Error('Failed to create game');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating game:', error);
  }
};

export const createGameFilesApi = async (gameId: string) => {
  const token = useAuthStore.getState().token;
  try {
    console.log('Creating game files');

    const response = await fetch(`${baseURL}/files/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gameId })
    });

    if (!response.ok) {
      throw new Error('Failed to create game files');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating game files:', error);
  }
};

export const deleteThreadApi = async (threadId: string): Promise<boolean> => {
  const token = useAuthStore.getState().token;
  try {
    console.log('Deleting thread');

    const response = await fetch(`${baseURL}/game/thread`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ threadId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete thread');
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting thread:', error);
  }
};
