import { readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const distLevels = path.resolve("dist", "levels");
const legacyLevelDirs = ["Animals", "Art", "Cities", "Fantasy", "Food", "Nature", "Space"];
const legacyImagePattern = /\.(png|jpe?g)$/i;

async function removeLegacyImages(dir) {
  if (!existsSync(dir)) return;

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeLegacyImages(entryPath);
      continue;
    }

    if (legacyImagePattern.test(entry.name)) {
      await rm(entryPath, { force: true });
    }
  }
}

async function isEmptyDirectory(dir) {
  try {
    const entries = await readdir(dir);
    return entries.length === 0;
  } catch {
    return false;
  }
}

async function removeEmptyDirectories(dir) {
  if (!existsSync(dir)) return;

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      await removeEmptyDirectories(path.join(dir, entry.name));
    }
  }

  if (await isEmptyDirectory(dir)) {
    await rm(dir, { recursive: true, force: true });
  }
}

for (const dirName of legacyLevelDirs) {
  const dir = path.join(distLevels, dirName);
  if (!existsSync(dir)) continue;

  await removeLegacyImages(dir);

  const hasAstroPage = existsSync(path.join(dir, "index.html"));
  if (!hasAstroPage) {
    await rm(dir, { recursive: true, force: true });
    continue;
  }

  await removeEmptyDirectories(dir);
}

if (existsSync(distLevels)) {
  const levelRoot = await stat(distLevels);
  if (!levelRoot.isDirectory()) {
    throw new Error(`${distLevels} is not a directory`);
  }
}
