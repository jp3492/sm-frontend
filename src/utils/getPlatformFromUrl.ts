export const getPlatformFromUrl: any = (url) => {
  if (url.includes("youtube")) {
    return "youtube";
  } else if (url.includes("twitch")) {
    return "twitch";
  } else if (url.includes("vimeo")) {
    return "vimeo";
  } else if (url.includes("dropbox")) {
    return "dropbox";
  } else if (url.includes("wistia")) {
    return "wistia";
  } else if (url.includes("soundcloud")) {
    return "soundcloud";
  } else if (url.includes("streamable")) {
    return "streamable";
  } else if (url.includes("dailymotion")) {
    return "dailymotion";
  } else if (url.includes("vidyard")) {
    return "vidyard";
  }
};
