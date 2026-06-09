const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'frontend/src/templates');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const names = [
  "Lumina Dental Excellence", "Lumina Dental", "Elite Healthcare", "Lumina Medical Center", 
  "Medlio Healthcare", "Azure Luxury Escapes", "Azure Luxury", "Savanna Safari Elite", "Savanna Safari",
  "Etheria Journeys", "Metro City Explorer", "Elite Wealth", "Finance Elite 02", "Aureum Finance Elite", "Finova Analytics", "Finova Finance", "Finova", "Justice Law Firm"
];

const emails = [
  "hello@luminadental.com", "contact@elitehealth.com", "info@luminamedical.com",
  "hello@medlio.com", "booking@azureescapes.com", "safari@savanna.com", "retreats@etheria.com",
  "hello@metrocity.com", "consult@elitewealth.com", "contact@financeelite.com", "contact@aureum.com",
  "hello@finova.com", "justice@lawfirm.com", "contact@example.com"
];

const phones = [
  "+44 20 7946 0000", "+1 (555) 123-4567", "+1 (800) 555-0199", "1-800-MED-CARE",
  "+1 (800) 555-1234", "+1 (888) 123-4567", "+1 (800) 999-8888", "+1 (800) LUX-TRVL",
  "+254 700 000 000", "+1 (800) ETHERIA", "+1 (800) 555-CITY", "+1 (800) 555-WEALTH",
  "+1 (800) FIN-ELITE", "+1 (800) AUREUM", "+1 (800) 555-DATA"
];

const addresses = [
  "123 Dental Way, London, UK", "456 Health Ave, New York, NY", "789 Medical Center Blvd, Boston, MA",
  "321 Wellness Blvd, San Francisco, CA", "100 Luxury Lane, Maldives", "Serengeti National Park, Tanzania",
  "1200 Serenity Peak, Sedona, AZ", "400 Broad St, Metropolis, NY", "100 Wall Street, Suite 500, New York, NY",
  "200 Broad St, Financial District, NY", "500 Gold Tower, London, UK", "Tech Park, San Francisco, CA", "789 Legal Ave, Washington, DC", "123 Business Avenue, Suite 100", "123 Business Avenue, Suite 100\nNew York, NY 10001"
];

walkDir(templatesDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    names.forEach(name => {
      const regex = new RegExp(name, 'g');
      content = content.replace(regex, 'PROJECT_NAME_PLACEHOLDER');
    });

    emails.forEach(email => {
      const regex = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, 'EMAIL_PLACEHOLDER');
    });

    phones.forEach(phone => {
      const regex = new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, 'PHONE_PLACEHOLDER');
    });

    addresses.forEach(address => {
      const regex = new RegExp(address.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, 'ADDRESS_PLACEHOLDER');
    });

    fs.writeFileSync(filePath, content, 'utf-8');
  }
});

console.log('Templates processed!');
