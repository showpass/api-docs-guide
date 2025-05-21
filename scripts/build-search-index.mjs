import fs from "fs/promises";
import path from "path";

// Function to recursively find all files with a given extension
async function findFilesByExt(startPath, filter, fileList = []) {
  const files = await fs.readdir(startPath);
  for (const file of files) {
    const filename = path.join(startPath, file);
    const stat = await fs.lstat(filename);
    if (stat.isDirectory()) {
      await findFilesByExt(filename, filter, fileList); // Recurse
    } else if (filename.endsWith(filter)) {
      fileList.push(filename);
    }
  }
  return fileList;
}

// Function to extract the first H1 title from Markdown content
function extractTitle(markdownContent) {
  const match = markdownContent.match(/^#\s+(.*)/m);
  return match ? match[1] : "Untitled"; // Default title if no H1 found
}

// Function to strip Markdown to plain text (basic version)
function stripMarkdown(markdownContent) {
  return markdownContent
    .replace(/^#+\s+.*/gm, "") // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1") // Italics
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/\!\[[^\]]*\]\([^)]*\)/g, "") // Images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // CORRECTED: Links (keep text, remove markdown)
    .replace(/\n{2,}/g, "\n") // Remove multiple newlines
    .trim();
}

async function buildSearchIndex() {
  const docsBasePath = path.resolve(process.cwd(), "src", "docs-app", "data");
  const publicPath = path.resolve(process.cwd(), "public");
  const outputFile = path.join(publicPath, "search-index.json");

  console.log(`Starting search index build...`);
  console.log(`Markdown source directory: ${docsBasePath}`);
  console.log(`Output file: ${outputFile}`);

  try {
    const markdownFiles = await findFilesByExt(docsBasePath, ".md");
    console.log(`Found ${markdownFiles.length} markdown files.`);

    const searchIndex = [];

    for (const filePath of markdownFiles) {
      const content = await fs.readFile(filePath, "utf-8");
      const title = extractTitle(content);

      // Construct the path relative to the 'data' directory
      // e.g., src/docs-app/data/wordpress/getting-started.md -> /wordpress/getting-started
      const relativePath = path.relative(docsBasePath, filePath);
      const urlPath =
        "/" + relativePath.replace(/\\/g, "/").replace(/\.md$/, "");

      const plainTextContent = stripMarkdown(content);

      searchIndex.push({
        id: urlPath, // Using path as a unique ID
        title: title,
        path: urlPath,
        content: plainTextContent.substring(0, 2000), // Truncate content to save space/improve performance
      });
      console.log(`Processed: ${filePath} -> ${urlPath}`);
    }

    await fs.mkdir(publicPath, { recursive: true }); // Ensure public directory exists
    await fs.writeFile(outputFile, JSON.stringify(searchIndex, null, 2));
    console.log(`Search index built successfully at ${outputFile}`);
  } catch (error) {
    console.error("Error building search index:", error);
    process.exit(1);
  }
}

buildSearchIndex();
