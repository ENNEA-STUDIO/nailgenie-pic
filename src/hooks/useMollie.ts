import { useEffect, useState } from 'react';

declare global {
  interface Window { Mollie: any }
}

export function useMollie() {
  const [mollie, setMollie] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const already = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.mollie.com/v1/mollie.js"]',
    );
    
    const load = () => {
      try {
        if (window.Mollie) {
          setMollie(
            window.Mollie("pfl_5B9ZTaLqKf", {
              locale: navigator.language.startsWith('fr') ? 'fr_FR' : 'en_US',
              testmode: true,
            }),
          );
        } else {
          setError("Mollie library not loaded correctly");
        }
      } catch (e) {
        console.error("Error initializing Mollie", e);
        setError("Error initializing payment system");
      }
    };

    if (already?.dataset.loaded) return load();

    const script = already ?? document.createElement('script');
    script.src = 'https://js.mollie.com/v1/mollie.js';
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = '1';
      load();
    };
    script.onerror = () => {
      setError("Impossible de charger le script Mollie.");
      console.error("Failed to load Mollie script");
    };
    
    if (!already) document.head.appendChild(script);
    
    return () => {
      // No cleanup needed as we keep the script loaded
    };
  }, []);

  return { mollie, error };
}
