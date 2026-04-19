const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimize() {
  const assetsDir = 'f:/Work/GitHub/blogsite/src/assets/images';
  const publicDir = 'f:/Work/GitHub/blogsite/public/assets/videos/the-future-of-android-apps-with-appfunctions';

  // 1. Optimize the Compose Cover (7.9 MB -> ~500 KB)
  const coverPath = path.join(assetsDir, 'cover-exploring-compositionlocal-api-internals-in-jetpack-compose.png');
  const coverTemp = coverPath + '.tmp';
  if (fs.existsSync(coverPath)) {
    console.log('Optimizing Compose Cover...');
    await sharp(coverPath)
      .resize(1200) // Standard web width
      .jpeg({ quality: 80 })
      .toFile(coverTemp);
    fs.renameSync(coverTemp, coverPath.replace('.png', '.jpg'));
    fs.unlinkSync(coverPath);
    console.log('Done.');
  }

  // 2. Optimize the Video Poster (17.6 MB -> ~100 KB)
  const posterPath = path.join(publicDir, 'poster.gif');
  const posterOutput = posterPath.replace('.gif', '.jpg');
  if (fs.existsSync(posterPath)) {
    console.log('Optimizing Video Poster...');
    await sharp(posterPath)
      .flatten() // Remove transparency
      .jpeg({ quality: 75 })
      .toFile(posterOutput);
    fs.unlinkSync(posterPath);
    console.log('Done.');
  }

  // 3. Delete the orphaned gif
  const orphanGif = path.join(assetsDir, 'content/the-future-of-android-apps-with-appfunctions/img-ed9addd0.gif');
  if (fs.existsSync(orphanGif)) {
    console.log('Deleting orphaned gif...');
    fs.unlinkSync(orphanGif);
    console.log('Done.');
  }
}

optimize().catch(console.error);
