declare global {
  interface Window {
    google?: any;
  }
}

export function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.accounts?.id) {
      return resolve();
    }
    const existingScript = document.getElementById("google-gsi-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

export async function promptGoogleOneTap(
  clientId: string,
  onCredentialReceived: (idToken: string) => Promise<void>
): Promise<void> {
  await loadGoogleGsiScript();
  if (!window.google?.accounts?.id) {
    throw new Error("Google Identity Services SDK failed to load.");
  }

  return new Promise((resolve, reject) => {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        if (response.credential) {
          try {
            await onCredentialReceived(response.credential);
            resolve();
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error("No Google credential received."));
        }
      },
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.warn("Google One Tap prompt not displayed:", notification.getNotDisplayedReason());
      }
    });
  });
}
