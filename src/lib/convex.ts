// create convex client fro browswer

import { ConvexHttpClient } from "convex/browser"

// Create a Singleton instance of the Convex HTTP client
export const getConvexClient = () => {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
}
