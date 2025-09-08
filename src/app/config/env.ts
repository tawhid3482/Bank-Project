import dotenv from "dotenv";

dotenv.config();

interface EnvVars {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
}

const loadEnvVariables = (): EnvVars => {
  const requiredVars = ["PORT", "NODE_ENV", "DATABASE_URL"];
  requiredVars.forEach((key) => {
    if (!process.env[key]) {
      {
        throw new Error(`Environment variable ${key}is not set`);
      }
    }
  });
  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
  };
};

export const envVars = loadEnvVariables();
