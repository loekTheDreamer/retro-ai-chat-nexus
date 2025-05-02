import useAuthStore from '@/store/useAuthStore';
const baseURL = import.meta.env.VITE_BASEURL;

export interface PublishGame {
  name: string;
  genre: string;
  description: string;
  tags: string;
  coverImage: string;
  id: string;
}

export const publishGameApi = async ({
  id,
  name,
  genre,
  description,
  tags,
  coverImage
}: PublishGame) => {
  const token = useAuthStore.getState().token;
  try {
    const response = await fetch(`${baseURL}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ id, name, genre, description, tags, coverImage })
    });
    if (!response.ok) {
      throw new Error('Failed to publish game');
    }
    return response.json();
  } catch (error) {
    console.error('Error publishing game:', error);
  }
};

export const getPublishedGamesApi = async () => {
  const token = useAuthStore.getState().token;
  try {
    console.log('Getting published games');
    const response = await fetch(`${baseURL}/publish`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to get published games');
    }
    return response.json();
  } catch (error) {
    console.error('Error getting published games:', error);
  }
};

export const likePublishedGameApi = async (gameId: string) => {};

export const playPublishedGameApi = async (
  gameId: string,
  playedByMe: boolean
) => {
  const token = useAuthStore.getState().token;
  try {
    const response = await fetch(`${baseURL}/publish/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ gameId, playedByMe })
    });
    if (!response.ok) {
      console.log('Failed to play create published game');
    }
    return response.json();
  } catch (error) {
    console.error('Error playing published game:', error);
  }
};
