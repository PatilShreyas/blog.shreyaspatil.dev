const FETCH_TIMEOUT_MS = 10_000;

const fontCache = new Map<string, ArrayBuffer>();

function withTimeout(ms: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return {
    signal: ctrl.signal,
    clear: () => clearTimeout(timer),
  };
}

async function loadGoogleFont(
  font: string,
  text: string,
  weight: number
): Promise<ArrayBuffer> {
  const cacheKey = `${font}:${weight}:${text}`;
  const cached = fontCache.get(cacheKey);
  if (cached) return cached;

  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;

  const cssTimer = withTimeout(FETCH_TIMEOUT_MS);
  let css: string;
  try {
    const cssRes = await fetch(API, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
      signal: cssTimer.signal,
    });
    if (!cssRes.ok) {
      throw new Error(
        `Failed to download dynamic font CSS. Status: ${cssRes.status}`
      );
    }
    css = await cssRes.text();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `Timed out fetching dynamic font CSS after ${FETCH_TIMEOUT_MS}ms`
      );
    }
    throw err;
  } finally {
    cssTimer.clear();
  }

  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );

  if (!resource) throw new Error("Failed to parse dynamic font CSS");

  const fontTimer = withTimeout(FETCH_TIMEOUT_MS);
  let buf: ArrayBuffer;
  try {
    const res = await fetch(resource[1], { signal: fontTimer.signal });
    if (!res.ok) {
      throw new Error("Failed to download dynamic font. Status: " + res.status);
    }
    buf = await res.arrayBuffer();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `Timed out fetching dynamic font binary after ${FETCH_TIMEOUT_MS}ms`
      );
    }
    throw err;
  } finally {
    fontTimer.clear();
  }

  fontCache.set(cacheKey, buf);
  return buf;
}

async function loadGoogleFonts(
  text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "IBM Plex Mono",
      font: "IBM+Plex+Mono",
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      font: "IBM+Plex+Mono",
      weight: 700,
      style: "bold",
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, font, weight, style }) => {
      const data = await loadGoogleFont(font, text, weight);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadGoogleFonts;
