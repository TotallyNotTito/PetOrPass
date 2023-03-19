/// <reference types="vite/client" />

// Typecheck our Env file! Safety (and verbosity) abound
import {Vitest} from "vitest";

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_IP_ADDR: string;
	readonly VITE_PORT: number;
	readonly VITE_LOGS_DIR: string;
	readonly VITE_DB_HOST: string;
	readonly VITE_DB_PORT: number;
	readonly VITE_DB_USER: string;
	readonly VITE_DB_PASS: string;
	readonly VITE_DB_NAME: string;
	readonly VITE_AUTH0_DOMAIN: string;
	readonly VITE_AUTH0_CLIENT_ID: string;
	readonly VITE_MINIO_MICROSERVICE_IP: string;
	readonly VITE_MINIO_MICROSERVICE_PORT: number;
	readonly VITE_FLASK_HOST: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
	readonly vitest: Vitest;
}
