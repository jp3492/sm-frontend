import { request } from "./../utils/request";

export const getClientToken = async () => {
  try {
    const res = await request("payments", "/token");
    const { clientToken } = await res.json();
    return clientToken;
  } catch (error) {
    console.log(error);
  }
};
