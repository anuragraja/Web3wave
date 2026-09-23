/**
 * Direct Google OAuth 2.0 Implicit Flow (No Firebase Auth Console dependency)
 */
export function openGoogleOAuthPopup(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Browser environment required."));
    }

    const redirectUri = window.location.origin;
    const scope = encodeURIComponent("openid email profile");
    const nonce = Math.random().toString(36).substring(2);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=id_token&scope=${scope}&nonce=${nonce}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      "Google OAuth Sign In",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      return reject(
        new Error("Pop-up window was blocked by browser. Please allow popups.")
      );
    }

    const timer = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(timer);
          window.removeEventListener("message", messageHandler);
          reject(new Error("Sign-in popup was closed before completion."));
          return;
        }

        if (popup.location.href.includes(redirectUri)) {
          const hash = popup.location.hash;
          popup.close();
          clearInterval(timer);
          window.removeEventListener("message", messageHandler);

          const match = hash.match(/id_token=([^&]+)/);
          if (match && match[1]) {
            resolve(match[1]);
          } else {
            reject(new Error("Failed to extract Google ID token from response."));
          }
        }
      } catch {
        // Cross-origin access during redirect is expected, ignore until popup hits redirectUri
      }
    }, 500);

    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === "GOOGLE_ID_TOKEN" && event.data?.idToken) {
        clearInterval(timer);
        window.removeEventListener("message", messageHandler);
        if (popup && !popup.closed) popup.close();
        resolve(event.data.idToken);
      }
    };

    window.addEventListener("message", messageHandler);
  });
}
