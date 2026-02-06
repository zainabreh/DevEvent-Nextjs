/**
 * lib/mongodb.ts
 *
 * Mongoose connection helper for Next.js (TypeScript).
 * - Uses a global cache to avoid creating multiple connections during development
 * - Exports `connectToDatabase` which resolves to a `mongoose.Connection`
 */

import mongoose from 'mongoose';

// Read MongoDB URI from environment variables.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Define a cache shape for TypeScript (no `any`).
type MongooseCache = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

// Extend globalThis to hold our cache across module reloads (Next.js HMR).
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Initialize or reuse the global cache object.
const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
if (!global._mongooseCache) global._mongooseCache = cache;

/**
 * Connect to MongoDB using Mongoose and cache the connection.
 * Returns the active `mongoose.Connection`.
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  // If a connection is already established, reuse it.
  if (cache.conn) {
    return cache.conn;
  }

  // If a connection is in progress, wait for it.
  if (!cache.promise) {
    // `mongoose.connect` resolves with a `mongoose.Mongoose` instance.
    cache.promise = mongoose
      .connect(MONGODB_URI as string)
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export default connectToDatabase;
