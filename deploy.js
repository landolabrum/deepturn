const { exec } = require('child_process');
const { deploy, merchants } = require('./merchants.config');

// Directory for the git repository
const merchant = merchants[deploy];
const gitDir = `${merchant.mid}.git`;
const repoUrl = `https://github.com/landolabrum/${merchant.name}.git`; // Replace with your actual repository URL

const deployCommand = `
npm run export &&
touch ./out/.nojekyll &&
touch out/CNAME &&
echo "${merchant.url}" >> out/CNAME &&
git --git-dir=${gitDir} --work-tree=. add out/ &&
git --git-dir=${gitDir} --work-tree=. commit -m "Deploy to gh-pages" &&
gh-pages -d out -t true --repo ${repoUrl} &&
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
