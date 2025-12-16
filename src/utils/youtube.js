// src/utils/youtube.js
export function toYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;

      if (u.pathname.startsWith("/embed/")) return `https://www.youtube.com${u.pathname}`;

      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/shorts/")[1]?.split("?")[0];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
    }

    return "";
  } catch {
    return "";
  }
}
