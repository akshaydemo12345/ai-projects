---
description: Agent ko sirf frontend UI design 
---

# 🚫 STRICT RULES: FRONTEND ONLY (NO BACKEND)

## 🎯 Objective
Agent ko sirf frontend UI design aur interaction banana hai. Backend ka koi bhi logic allowed nahi hai.

---

## ❌ NOT ALLOWED (STRICTLY BAN)
- Backend code (Node.js, Python, PHP, etc.)
- APIs (fetch, axios, external requests)
- Database (MongoDB, MySQL, Firebase, etc.)
- Authentication logic (real login/signup)
- Server-side rendering
- Environment variables / API keys

---

## ✅ ALLOWED (ONLY THESE)
- HTML
- CSS
- JavaScript (Vanilla)
- UI interactions
- Dummy/static data
- Local state (variables, arrays)

---

## ⚙️ FUNCTIONALITY RULES

### 1. Authentication
- Only UI form
- Login button → next screen (no validation)

---

### 2. AI Generation
- Use static/dummy content
- “Generate” → show loader → replace content

---

### 3. SEO Optimization
- Static score (e.g. 75%)
- Fake keyword suggestions
- No real calculation

---

### 4. Editor
- Real-time preview using DOM manipulation
- No saving to server
- Changes only in UI

---

### 5. Publish
- Show success message
- Generate fake URL (example.com/page)
- No actual hosting

---

## 🎨 UI BEHAVIOR
- Smooth transitions
- Loading animations (fake)
- Interactive feel like real product

---

## ⚠️ FINAL INSTRUCTION
If any feature requires backend:
➡️ Replace it with dummy UI simulation  
➡️ NEVER implement real backend logic  

---

## ✅ SUCCESS CONDITION
- App fully working in browser
- No backend dependency
- Looks like real SaaS product