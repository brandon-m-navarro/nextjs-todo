import { createAuthClient } from "better-auth/client"
import { oidcClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "https://todo.bnav.dev",
  plugins: [
    oidcClient()
  ]
})


