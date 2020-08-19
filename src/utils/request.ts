const APIS =
  process.env.NODE_ENV === "development"
    ? {
        folders: "http://localhost:4000",
        videos: "http://localhost:4001",
        playlists: "http://localhost:4002",
        sequences: "http://localhost:4004",
        viewer: "http://localhost:4005",
        payments: "http://localhost:4006",
        users: "http://localhost:4007",
        landingPage: "http://localhost:4008"
      }
    : {
        folders:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/folder",
        videos:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/video",
        playlists:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/playlist",
        sequences:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/sequence",
        viewer:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/viewer",
        payment:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/payment",
        users:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/user",
        landingPage:
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/landingPage"
      };

export const request = (api: string, path: string = "", options: any = {}) => {
  const url = APIS[api];

  return fetch(`${url}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      authorization: localStorage.getItem("ID_TOKEN")
    }
  });
};
