
const buildTimestamp = () => new Date().toISOString();
export default buildTimestamp;
// const content: string = `export const buildTimestamp: string = '${timestamp}';\n`;

// fs.writeFileSync(path.join(__dirname, 'build-timestamp.ts'), content);
