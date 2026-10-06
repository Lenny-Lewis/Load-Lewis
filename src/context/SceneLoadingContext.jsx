import { createContext, useContext } from "react";

const SceneLoadingContext = createContext({
  phase: "done",
  scene1Ready: true,
  markScene1Ready: () => {},
  markScene2Ready: () => {},
});

export const SceneLoadingProvider = SceneLoadingContext.Provider;
export const useSceneLoading = () => useContext(SceneLoadingContext);
