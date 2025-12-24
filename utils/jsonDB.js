import { readFile, writeFile } from "node:fs/promises";

const DB_FILE = "./db.json";

export const loadDB = async () => {
    try {
        const result = await readFile(DB_FILE, "utf-8");
        return JSON.parse(result);
    } catch (err) {
        if (err.code === "ENOENT") {
            await createDB({});
        }
        return {};
    }
};

export const createDB = async (data) => {
    await writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
};
