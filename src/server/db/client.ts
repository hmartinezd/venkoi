import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export function getDb(): NeonQueryFunction<boolean, boolean> | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  try {
    return neon(connectionString);
  } catch {
    console.error('Failed to initialize Neon DB client: invalid database configuration.');
    return null;
  }
}
