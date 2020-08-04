const APIS =
  process.env.NODE_ENV === "development"
    ? {
        folders: "http://localhost:4000",
        videos: "http://localhost:4001",
        playlists: "http://localhost:4002",
        sequences: "http://localhost:4004",
        viewer: "http://localhost:4005",
        payments: "http://localhost:4006"
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
          "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/payment"
      };

export const request = (api: string, path: string = "", options: any = {}) => {
  const url = APIS[api];
  // use
  // const user = getUser();
  // console.log(user);

  return fetch(`${url}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      authorization: localStorage.getItem("ID_TOKEN")
    }
  });
};
