
const { extractFormFields } = require('./backend/src/utils/formExtractor');

const leadGenHtml = `
  <div class="lead-gen-container">
    <form>
      <input type="text" placeholder="Full name" />
      <input type="email" placeholder="Email address" />
      <input type="tel" placeholder="Phone number" />
      <input type="text" placeholder="Address" />
      <select>
        <option disabled selected>Courses</option>
        <option>Web Development</option>
        <option>Data Science</option>
      </select>
      <textarea placeholder="Comments" rows="4"></textarea>
      <button type="submit">Register Now!</button>
    </form>
  </div>
`;

const fields = extractFormFields(leadGenHtml);
console.log('Extracted Fields:', JSON.stringify(fields, null, 2));
