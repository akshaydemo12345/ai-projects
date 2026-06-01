const { generateGetImgUrl } = require('./backend/src/services/imageGenerationService');
async function test() {
  const url = await generateGetImgUrl("modern healthcare facility, professional photography", 800, 600);
  console.log("URL:", url);
}
test();
