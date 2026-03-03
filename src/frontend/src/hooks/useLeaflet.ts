// Dynamically loads Leaflet from CDN to avoid needing the npm package
// This is necessary because package.json is frozen in this environment

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

let loadPromise: Promise<typeof window.L> | null = null;

declare global {
  interface Window {
    // deno-lint-ignore no-explicit-any
    L: any;
  }
}

export function loadLeaflet(): Promise<typeof window.L> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // If already loaded
    if (window.L) {
      resolve(window.L);
      return;
    }

    // Load CSS
    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS_URL;
      document.head.appendChild(link);
    }

    // Load JS
    const script = document.createElement("script");
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Failed to load Leaflet from CDN"));
    document.head.appendChild(script);
  });

  return loadPromise;
}
