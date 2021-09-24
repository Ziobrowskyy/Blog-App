declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string | undefined;
            DB_USER: string | undefined;
            DB_PASSWORD: string | undefined;
            FILE_SAVE: "LOCAL" | "DATABASE" | undefined
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}