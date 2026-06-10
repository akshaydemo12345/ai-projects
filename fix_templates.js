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

const coreScript = `
<script id="core-interactions">
  (function() {
    // Check if we are inside GrapesJS editor
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');
    
    // Form Validation (runs everywhere so you can see red borders in editor)
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        
        inputs.forEach(function(input) {
          if (!input.dataset.valSetup) {
            input.dataset.valSetup = 'true';
            input.addEventListener('input', function() {
              if (input.value.trim()) {
                input.style.outline = '2px solid #22c55e';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#22c55e';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'none';
                }
              } else {
                input.style.outline = '2px solid #ef4444';
                input.style.outlineOffset = '1px';
                input.style.borderColor = '#ef4444';
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('val-error')) {
                  input.nextElementSibling.style.display = 'block';
                }
              }
            });
          }

          if (!input.value.trim() && input.hasAttribute('required')) {
            isValid = false;
            input.style.outline = '2px solid #ef4444';
            input.style.outlineOffset = '1px';
            input.style.borderColor = '#ef4444';
            
            if (!input.parentElement.classList.contains('val-wrapper')) {
                var wrapper = document.createElement('div');
                wrapper.className = 'val-wrapper';
                wrapper.style.display = 'flex';
                wrapper.style.flexDirection = 'column';
                wrapper.style.width = '100%';
                
                var computed = window.getComputedStyle(input);
                if (window.getComputedStyle(input.parentElement).display === 'grid') {
                    wrapper.style.gridColumn = input.style.gridColumn || computed.gridColumn;
                    wrapper.style.gridRow = input.style.gridRow || computed.gridRow;
                }
                
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }

            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('val-error')) {
              var fieldName = input.getAttribute('placeholder') || input.getAttribute('name') || 'This field';
              var err = document.createElement('span');
              err.className = 'val-error';
              err.style.color = '#ef4444';
              err.style.fontSize = '12px';
              err.style.display = 'block';
              err.style.marginTop = '4px';
              err.style.fontWeight = '500';
              err.textContent = '*' + fieldName.replace(/\*$/, '').trim() + ' is required';
              input.parentNode.insertBefore(err, input.nextSibling);
            } else {
              input.nextElementSibling.style.display = 'block';
            }
          }
        });
        
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else if (!isInEditor) {
          e.preventDefault();
          var btn = e.target.querySelector('button[type="submit"]') || e.target.querySelector('input[type="submit"]');
          if (btn) {
            if(btn.innerText) btn.innerText = 'Sending...';
            else btn.value = 'Sending...';
          }
          setTimeout(function() {
            e.target.innerHTML = '<div style="padding: 20px; text-align: center; border: 2px dashed #22c55e; border-radius: 8px; background: rgba(34,197,94,0.1); color: #166534;"><h3 style="margin: 0 0 10px 0; font-size: 20px;">Thank You!</h3><p style="margin: 0;">Your request has been submitted successfully.</p></div>';
          }, 1000);
        }
      }
    }, true);
  })();
</script>
`;

walkDir(templatesDir, (filePath) => {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. Remove ALL inline onsubmit attributes
        content = content.replace(/\s+onsubmit="[^"]*"/g, '');
        content = content.replace(/\s+onsubmit='[^']*'/g, '');
        
        // 2. Add 'required' to all input/textarea/select elements that don't have it
        content = content.replace(/<(input|textarea|select)([^>]*?)>/gi, (match, tag, attrs) => {
            if (attrs.includes('type="submit"') || attrs.includes('type="button"') || attrs.includes('type="hidden"')) {
                return match;
            }
            if (!attrs.includes('required')) {
                return `<${tag}${attrs} required>`;
            }
            return match;
        });

        // 3. Append the core script at the end of the HTML string (before the closing backtick)
        // Find the last </footer>\n` or </main>\n` or just the end of the string
        if (!content.includes('id="core-interactions"')) {
            // Usually the file ends with </footer>\n`
            content = content.replace(/<\/footer>\n`/gi, `</footer>\n${coreScript}\n\``);
            // Fallback for files that don't have footer
            if (!content.includes('</footer>')) {
                 content = content.replace(/<\/div>\n`/gi, `</div>\n${coreScript}\n\``);
                 content = content.replace(/<\/section>\n`/gi, `</section>\n${coreScript}\n\``);
            }
        }
        
        fs.writeFileSync(filePath, content);
        console.log('Updated', filePath);
    }
});
