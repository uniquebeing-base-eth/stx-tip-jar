import { supabase } from '@/integrations/supabase/client';

export interface SignalifyUser {
  username: string;
  walletAddress: string;
  session?: {
    access_token: string;
  };
}

export async function signalifyLogin(): Promise<SignalifyUser | null> {
  try {
    // Open Signalify login popup
    const width = 450;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      'https://www.signalify.xyz/developer?auth=true',
      'signalify-login',
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    );

    if (!popup) {
      throw new Error('Popup blocked. Please allow popups for Signalify login.');
    }

    return new Promise((resolve) => {
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin === 'https://www.signalify.xyz' && event.data?.type === 'signalify-auth') {
          window.removeEventListener('message', handleMessage);
          
          const { address, signature, message } = event.data;
          
          // Verify with our edge function (which has the API key)
          const { data, error } = await supabase.functions.invoke('signalify-auth', {
            body: { action: 'login', address, signature, message },
          });

          if (error || !data) {
            console.error('Signalify verification failed:', error);
            resolve(null);
            return;
          }

          resolve(data.user as SignalifyUser);
        }
      };

      window.addEventListener('message', handleMessage);

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          resolve(null);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        if (!popup.closed) popup.close();
        resolve(null);
      }, 300000);
    });
  } catch (error) {
    console.error('Signalify login failed:', error);
    return null;
  }
}

export async function signalifyNotify(params: { to: string; title: string; message: string }): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('signalify-auth', {
      body: {
        action: 'notify',
        to: params.to,
        title: params.title,
        notifyMessage: params.message,
      },
    });
    return !error;
  } catch {
    return false;
  }
}
