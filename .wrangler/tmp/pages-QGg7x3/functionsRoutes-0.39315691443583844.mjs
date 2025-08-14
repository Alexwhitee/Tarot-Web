import { onRequestPost as __api_js_onRequestPost } from "G:\\project-tarot\\tarot-web\\Tarot-Web\\functions\\api.js"

export const routes = [
    {
      routePath: "/api",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__api_js_onRequestPost],
    },
  ]