import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const backendUrl = (process.env.VITE_ATHENA_BACKEND_URL || 'http://athena-prod.eba-3e8puxfn.ap-south-1.elasticbeanstalk.com').replace(/\/$/, '');

  return {
    base: '/app/',
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // Keep the /api path as is
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxying:', req.method, req.url, '->', options.target + proxyReq.path);
            });
          }
        },
        '/firebase-storage': {
          target: 'https://storage.googleapis.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/firebase-storage/, ''),
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
      {
        name: 'generate-redirects',
        closeBundle() {
          const redirectsPath = path.resolve(__dirname, './public/_redirects');
          const distRedirectsPath = path.resolve(__dirname, './dist/_redirects');

          let redirectsContent = '';
          try {
            // Read existing _redirects if it exists
            if (fs.existsSync(redirectsPath)) {
              redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
            } else {
              console.warn('Warning: Could not read public/_redirects at ' + redirectsPath);
            }

            const apiRule = `/api/*  ${backendUrl}/api/:splat  200\n\n`;
            const finalContent = apiRule + redirectsContent;

            fs.writeFileSync(distRedirectsPath, finalContent);
            console.log(`Generated _redirects with backend: ${backendUrl}`);
          } catch (error) {
            console.error('Error generating _redirects:', error);
          }
        }
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Firebase — large SDK, changes infrequently → long-lived cache
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            // Core React runtime — never changes between deploys
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // TanStack — data-fetching layer, separate from UI
            tanstack: ['@tanstack/react-query'],
            // Radix UI — large UI primitive library, changes rarely
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs',
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-popover',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-toast',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-slider',
              '@radix-ui/react-switch',
              '@radix-ui/react-avatar',
              '@radix-ui/react-separator',
              '@radix-ui/react-progress',
              '@radix-ui/react-label',
              '@radix-ui/react-slot',
            ],
          },
        },
      },
    },
  };
});
