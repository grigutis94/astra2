
# ⚙️ Astra Tank Configurator

An interactive 3D stainless steel tank configurator for [Astra.lt](https://www.astra.lt), inspired by [gpi-tanks.com](https://gpi-tanks.com/). Built with React, TypeScript, Vite and React Three Fiber.

---

## 🎯 Project Goals

- Allow clients to configure custom metal tanks via form
- Show real-time 3D preview
- Match Astra brand design
- Export config or send to sales team

---

## 🧱 Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (customized for Astra branding)
- React Hook Form (multi-step wizard)
- React Three Fiber (3D tank preview)
- ESLint + TypeScript strict mode

---

## ⚠️ ESLint Configuration

Using recommended type-aware lint rules and React plugins:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

Plugins:
- eslint-plugin-react-x
- eslint-plugin-react-dom

---

## 🖌️ Design Rules
Follow Astra.lt branding:

- Primary color: #003399
- Light gray: #e5e5e5
- Clean, minimal industrial feel
- Mobile-first, responsive layouts
- UI in Lithuanian, code in English

---

## 🧩 Main Components
- **TankConfigForm** – multi-step wizard to collect inputs
- **Tank3DPreview** – 3D preview via React Three Fiber
- **FormStepper** – Visualization of form progress
- **Step Components** – Individual form steps with validation

---

## 🛠️ Development Notes
- Use TypeScript + React everywhere
- Tailwind for styling only
- Form must be validated and wizard-style (React Hook Form)
- Use metric units (litrai, mm)
- Components must be modular and descriptive
- 3D preview should reflect form inputs in real-time

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5176
```

---

## 📝 Form Configuration

The form collects the following information:

- Tank type (cylindrical/rectangular)
- Volume in liters
- Material (304/316 stainless steel)
- Orientation (vertical/horizontal)
- Number of legs/supports
- Top/bottom type (flat, dome, cone)
- Flange options
- Purpose (water/chemical/food)

