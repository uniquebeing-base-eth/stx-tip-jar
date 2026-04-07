
const SIGNALIFY_API_BASE = 'https://ecgbkytzisotjbqwfjzd.supabase.co/functions/v1';

export interface SignalifyUser {
  username: string;
  walletAddress: string;
  session?: {
    access_token: string;
  };
}

export class Signalify {
  private apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async login(): Promise<SignalifyUser | null> {
    try {
      // Open Signalify login popup
      const width = 450;
      const height = 600;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const popup = window.open(
        `https://www.signalify.xyz/developer?auth=true&app_key=${encodeURIComponent(this.apiKey)}&redirect=${encodeURIComponent(window.location.origin)}`,
        'signalify-login',
        `width=${width},height=${height},left=${left},top=${top},popup=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for Signalify login.');
      }

      return new Promise((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin === 'https://www.signalify.xyz' && event.data?.type === 'signalify-auth') {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.user as SignalifyUser);
          }
        };

        window.addEventListener('message', handleMessage);

        // Timeout after 5 minutes
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

  async notify(params: { to: string; title: string; message: string }): Promise<boolean> {
    try {
      const response = await fetch(`${SIGNALIFY_API_BASE}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          to: params.to,
          app: 'STX Tip Jar',
          title: params.title,
          message: params.message,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Signalify notification failed:', error);
      return false;
    }
  }
}

// Singleton instance - API key stored in code since it's a publishable key
let signalifyInstance: Signalify | null = null;

export function getSignalify(apiKey: string): Signalify {
  if (!signalifyInstance) {
    signalifyInstance = new Signalify({ apiKey });
  }
  return signalifyInstance;
}
