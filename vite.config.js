import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      // يدعم المتصفحات التي تدعم الوحدات النمطية (Modules) ولكن تحتاج لـ polyfills
      targets: ['defaults', 'not IE 11', 'iOS >= 12'],
      // يضيف polyfills تلقائياً بناءً على الكود المستخدم
      polyfills: ['es.promise.finally', 'es/map', 'es/set'],
      // يدعم المتصفحات القديمة جداً التي لا تدعم <script type="module">
      renderLegacyChunks: true,
      modernPolyfills: true,
    }),
  ],
  build: {
    // يضمن استخدام التوافقية المناسبة لـ CSS و JS
    target: 'es2015',
    minify: 'terser', // Terser أفضل في التعامل مع polyfills والمتصفحات القديمة
  },
})
