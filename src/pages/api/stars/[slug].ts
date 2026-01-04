export const prerender = false; // Run as serverless function
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: import.meta.env.UPSTASH_REDIS_REST_URL,
  token: import.meta.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET({ params }) {
  // Return the count, default to 0
  const count = (await redis.get(`stars:${params.slug}`)) || 0;
  return new Response(JSON.stringify({ count }));
}

export async function POST({ params }) {
  // Increment the count
  const newCount = await redis.incr(`stars:${params.slug}`);
  return new Response(JSON.stringify({ count: newCount }));
}
