import { createClient } from "redis";

const client = createClient({
  url: `redis://${process.env.REDDIT_USERNAME}:${process.env.REDDIT_PASSWORD}@${process.env.REDDIT_HOST}:${process.env.REDDIT_PORT}`,
});

client.on('error', (err: Error) => {
    console.error('Error connecting to Redis:', err);
  });
  
  client.on('connect', () => {
    console.log('Connected to Redis');
  });

export const connectToRedis = async () => {
  await client.connect();
};

export const saveRefreshToken = async (
  token: string,
  userId: number,
  expiryInSeconds: number
): Promise<void> => {
  try {
    await client.set(token, userId.toString(), {
      EX: expiryInSeconds,
    });
    console.log("Token saved to Redis");
  } catch (err) {
    console.error("Error saving token to Redis:", err);
  }
};

export const verifyRefreshToken = async (token: string): Promise<string | null> => {
    try {
      const userId = await client.get(token);
      if (userId) {
        console.log('Token is valid');
        return userId;
      } else {
        console.log('Token is invalid');
        return null;
      }
    } catch (err) {
      console.error('Error verifying token in Redis:', err);
      return null;
    }
  };
  
