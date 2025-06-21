// /home/web/code/frontend/deepturn/deploy.js

const { exec } = require('child_process');
const { deploy, merchants } = require('./merchants.config');

// Directory for the git repository
const merchant = merchants[deploy];
const gitDir = `${merchant.mid}.git`;

// Fixing the multi-line URL by concatenating properly
const repoUrl = `git@github.com:landolabrum/${merchant.name}.git`; // Correct URL format

const deployCommand = `
  echo "****** PUBLISHING: ${merchant.url}" &&
  npm run build &&
  touch ./out/.nojekyll &&
  echo "${merchant.url}" > out/CNAME &&
  npx gh-pages -d out --repo ${repoUrl} &&
  rm -rf ./out &&
  echo "########  [ PUBLISHED: ${merchant.url} ]  ########"
`;

exec(deployCommand, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error during deployment: ${stderr}`);
    process.exit(1);
  }
  console.log(stdout);
});
