/// <reference types="vitest/config" />
/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const COURSES_ROOT = '/Volumes/SSD/GFX/Chase Hughes - The Operative Kit';
function serveLocalMedia(): Plugin {
  return {
    name: 'serve-local-media',
    configureServer(server) {
      server.middlewares.use('/media', (req, res, next) => {
        const decodedPath = decodeURIComponent(req.url || '');
        const filePath = path.join(COURSES_ROOT, decodedPath);
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          next();
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
          '.mkv': 'video/x-matroska',
          '.mov': 'video/quicktime',
          '.mp3': 'audio/mpeg',
          '.pdf': 'application/pdf',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.md': 'text/markdown',
          '.txt': 'text/plain'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        const range = req.headers.range;
        if (range && contentType.startsWith('video/')) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
          const chunkSize = end - start + 1;
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType
          });
          fs.createReadStream(filePath, {
            start,
            end
          }).pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Length': stat.size,
            'Content-Type': contentType
          });
          fs.createReadStream(filePath).pipe(res);
        }
      });
    }
  };
}
export default defineConfig({
  plugins: [
  // The React and Tailwind plugins are both required for Make, even if
  // Tailwind is not being actively used – do not remove them
  react({
    babel: {
      plugins: [
        ['babel-plugin-react-compiler', {}],
      ],
    },
  }), tailwindcss(), serveLocalMedia()],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          // React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run/')) {
            return 'vendor-router'
          }
          // Radix UI + shadcn primitives
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix'
          }
          // Recharts + D3 (large — keep isolated)
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-vendor')) {
            return 'vendor-charts'
          }
          // pdfjs-dist (large — keep isolated)
          if (id.includes('node_modules/pdfjs-dist') || id.includes('node_modules/react-pdf')) {
            return 'vendor-pdf'
          }
          // Framer Motion (large animation lib)
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
          // AI SDK
          if (id.includes('node_modules/ai') || id.includes('node_modules/@ai-sdk/')) {
            return 'vendor-ai'
          }
          // Data layer: Dexie + Zustand
          if (id.includes('node_modules/dexie') || id.includes('node_modules/zustand')) {
            return 'vendor-data'
          }
          // Markdown rendering
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/rehype') || id.includes('node_modules/micromark') || id.includes('node_modules/mdast') || id.includes('node_modules/unist')) {
            return 'vendor-markdown'
          }
          // Remaining node_modules → shared vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor-misc'
          }
        }
      }
    }
  },
  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    projects: [{
      extends: true,
      test: {
        name: 'unit',
        include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['src/**/*.stories.*'],
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});