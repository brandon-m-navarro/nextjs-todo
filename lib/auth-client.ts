import { createAuthClient } from "better-auth/client"
import { jwtClient } from "better-auth/client/plugins"
import { jwtVerify, createRemoteJWKSet } from "jose";

export const authClient = createAuthClient({
  plugins: [
    jwtClient() 
  ]
})


// JWKS endpoint from App A
const JWKS_URL = "https://app-dashboard-livid-omega.vercel.app/api/auth/jwks";

export async function getUserIdFromToken(token: string) {
  const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: "https://app-dashboard-livid-omega.vercel.app/",
    audience: "http://localhost:3000/",
  });

  return payload.sub; // or payload.id depending on your JWT payload
}

// Fetch JWT from App A if not provided (e.g., redirect-based flow)
export async function getToken() {
  const { data, error } = await authClient.token();
  console.log("Fetched token from App A:", data, error);
  if (error) throw new Error("Failed to fetch JWT from App A");
  return data?.token;
}
