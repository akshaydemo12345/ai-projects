const fs = require('fs');
const content = fs.readFileSync('/var/www/html/ai-projects-main-monday-12pm-working-new/ai-projects-main-monday-12pm-working/ai-projects-main/frontend/src/templates/healthcare/templates05.ts', 'utf8');
const htmlStart = content.indexOf('export const healthcare05Html = `');
if (htmlStart > -1) {
  const html = content.substring(htmlStart);
  let divCount = (html.match(/<div/g) || []).length;
  let endDivCount = (html.match(/<\/div>/g) || []).length;
  let sectionCount = (html.match(/<section/g) || []).length;
  let endSectionCount = (html.match(/<\/section>/g) || []).length;
  console.log('div tags:', divCount, endDivCount);
  console.log('section tags:', sectionCount, endSectionCount);
}
