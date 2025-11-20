import { createAuthClient } from "better-auth/client"
import { jwtClient } from "better-auth/client/plugins"
// import { jwtVerify, createRemoteJWKSet } from "jose";
import { oidcClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "https://login.bnav.dev",
  plugins: [
    oidcClient()
  ]
})


// JWKS endpoint from App A
// const JWKS_URL = "https://login.bnav.dev/api/auth/jwks";

// export async function getUserIdFromToken(token: string) {
//   const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

//   const { payload } = await jwtVerify(token, JWKS, {
//     issuer: "https://login.bnav.dev",
//     audience: "https://todo.bnav.dev",
//   });

//   return payload.sub; // or payload.id depending on your JWT payload
// }

// // Fetch JWT from App A if not provided (e.g., redirect-based flow)
// export async function getToken() {
//   const { data, error } = await authClient.token();
//   console.log("Fetched token from login.bnav.dev", data, error);
//   if (error) throw new Error("Failed to fetch JWT from login.bnav.dev");
//   return data?.token;
// }
