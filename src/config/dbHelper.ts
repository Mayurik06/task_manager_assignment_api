import { Pool } from "pg";
import pool from "./dbConfig";
import dotenv from 'dotenv';

dotenv.config();

// Define an in-memory cache

interface CacheEntry {
  name: string;
  db_host: string;
  db_user: string;
  db_password: string;
  db_name: string;
  db_schema: string;
  pool: Pool;
  isWritePool?: boolean;
}

// Simulating a global cache and a round-robin index for read replicas.
const cache: CacheEntry[] = [];
let readReplicaIndex = 0;

export const getClientsInfo = async (name: string): Promise<any> => {
  const cachedEntry = cache.find(entry => entry.name === name && entry.isWritePool === undefined);
  if (cachedEntry) {
    try {
      // Test the cached connection
      await cachedEntry.pool.query('SELECT 1');
      console.log('Reconnected successfully to PostgreSQL', cachedEntry.db_name);
      return { pool: cachedEntry.pool, schemas: cachedEntry.db_schema };
    } catch (error) {
      console.warn('Error with cached connection, retrieving fresh credentials:', error);
      const index = cache.indexOf(cachedEntry);
      cache.splice(index, 1);
    }
  }
  try {
    // Retrieve data from PostgreSQL using the given name
    const query = `SELECT * FROM "shaktiman".get_domain_by_url($1)`;
    const result = await pool.query(query, [name]);
    if (result.rows.length === 0) {
      return null;
    }
    const {
      db_host,
      db_user,
      db_password,
      db_name,
      db_schema,
      usepgreplica,
      replica_hosts, // Assuming this is an array of hosts
      read1_db_user,
      read1_db_password,
      read1_db_name
    } = result.rows[0];

    if (usepgreplica) {
      const readPools = replica_hosts.map((replica_host: string, index: number) => {
        return {
          pool: new Pool({
            host: replica_host,
            user: read1_db_user[index],
            password: read1_db_password[index],
            database: read1_db_name[index],
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
          }),
          db_schema,
          db_name: read1_db_name[index],
          db_host: replica_host,
          db_user: read1_db_user[index],
          db_password: read1_db_password[index],
        };
      });

      // Adding read pools to the cache
      readPools.forEach((entry: any) => cache.push({ ...entry, name, isWritePool: false }));

      // Implementing round-robin for selecting read replica
      const selectedReadPool = readPools[readReplicaIndex % readPools.length];
      readReplicaIndex++;

      await selectedReadPool.pool.query('SELECT 1');
      console.log('Connected successfully to PostgreSQL Replica', selectedReadPool.db_name);
      return selectedReadPool;
    } else {
      const pool = new Pool({
        host: db_host,
        user: db_user,
        password: db_password,
        database: db_name,
      });
      await pool.query('SELECT 1');
      console.log('Connected successfully to PostgreSQL Primary', db_name);
      const data = { pool, schemas: db_schema };
      cache.push({ name, db_host, db_user, db_password, db_name, db_schema, pool });
      return data;
    }
  } catch (error) {
    console.error('Error retrieving client information:', error);
     throw error;
  }
};
