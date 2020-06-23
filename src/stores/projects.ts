import { setGlobalState } from "react-global-state-hook";
import { getGlobalState } from "react-global-state-hook";
import { request } from "../utils/request";

export const PROJECTS = "PROJECTS";
export const ACTIVE_PROJECT = "ACTIVE_PROJECT";
export const SEQUENCER_VIDEOS = "SEQUENCER_VIDEOS";

setGlobalState(PROJECTS, []);
setGlobalState(SEQUENCER_VIDEOS, []);

export const getProjects = async () => {
  try {
    const res = await request("project");
    const data = await res.json();
    setGlobalState(PROJECTS, data);
  } catch (error) {
    console.log(error);
  }
};

export const getProject = async (id) => {
  try {
    const res = await request("project", "/" + id);
    const data = await res.json();
    const projects = getGlobalState(PROJECTS);
    const exists = projects.find((p) => p.id === id);
    if (exists) {
      setGlobalState(
        PROJECTS,
        projects.map((p) => (p.id === id ? data : p))
      );
    } else {
      setGlobalState(PROJECTS, [...projects, data]);
    }
  } catch (error) {
    console.log(error);
  }
};

export const postProject = async (body) => {
  try {
    const res = await request("projects", "", {
      method: "POST",
      body: JSON.stringify(body)
    });
    const id = res.text();
    const projects = getGlobalState(PROJECTS);
    setGlobalState(PROJECTS, [...projects, { ...body, id }]);
  } catch (error) {
    console.log(error);
  }
};

export const patchProject = async ({ id, ...body }) => {
  try {
    await request("projects", "/" + id, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
    const folders = getGlobalState(PROJECTS);
    setGlobalState(
      PROJECTS,
      folders.map((f) => (f.id === id ? { ...body, id } : f))
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteProject = async (id) => {
  try {
    await request("projects", "/" + id, { method: "DELETE" });
    const folders = getGlobalState(PROJECTS);
    setGlobalState(
      PROJECTS,
      folders.filter((f) => f.id !== id)
    );
  } catch (error) {
    console.log(error);
  }
};
