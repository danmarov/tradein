import SteamAuth from "node-steam-openid";

const steam = new SteamAuth({
  realm: process.env.NEXTAUTH_URL || "http://localhost:3000",
  returnUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/steam/callback`,
  apiKey: process.env.STEAM_API_KEY!,
});

export { steam };
