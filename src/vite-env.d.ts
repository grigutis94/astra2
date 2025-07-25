/// <reference types="vite/client" />

// CSS Modules type declarations
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

// React DOM client types
declare module 'react-dom/client' {
  export * from 'react-dom';
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment): Root;
}
