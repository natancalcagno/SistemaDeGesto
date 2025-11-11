import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // Polyfills para módulos do Node.js, necessários para a biblioteca html-to-docx
      events: 'events',
      stream: 'stream-browserify',
    },
  },
  define: {
    // Previne erros em bibliotecas que acessam 'process.env' no navegador
    'process.env': {},
    // Define 'global' como 'window' para bibliotecas Node.js que o utilizam no navegador
    global: 'window',
  }
});
