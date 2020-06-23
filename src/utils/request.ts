// const APIS = {
//   folders:
//     "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/folders",
//   videos:
//     "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/videos",
//   playlists:
//     "https://us-central1-streaming-manager-dc49e.cloudfunctions.net/playlists"
// };

const APIS = {
  folders: "http://localhost:4000",
  videos: "http://localhost:4001",
  playlists: "http://localhost:4002",
  projects: "http://localhost:4003",
  sequences: "http://localhost:4004"
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
