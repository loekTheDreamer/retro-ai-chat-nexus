const baseURL = import.meta.env.VITE_BASEURL;

export const authNonce = async (walletAddress: string) => {
  console.log('authNonce:', walletAddress);
  try {
    const response = await fetch(`${baseURL}/auth/nonce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address: walletAddress })
    });
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    const { message } = await response.json();
    if (!message) {
      throw new Error('Failed to get nonce');
    }
    return { message };
    // const authResponse = await authLogin(address, nonce);
    // return authResponse;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

interface AuthLoginParams {
  address: string;
  signature: string;
}

export const authLogin = async ({
  address: walletAddress,
  signature
}: AuthLoginParams) => {
  console.log('authLogin:', { walletAddress, signature });
  console.log('what the hell');
  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address: walletAddress, signature })
    });
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    const parsedResponse = await response.json();

    const { token, address } = parsedResponse;
    console.log('token:', token);
    console.log('returnedAddress:', address);

    return { token, address };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
