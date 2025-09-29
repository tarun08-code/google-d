import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL || 'https://eventhub.tigerjeshy.live';

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174', 
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:5177',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://127.0.0.1:5176',
        'http://127.0.0.1:5177',
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/
      ],
      credentials: true,
      optionsSuccessStatus: 200
    },
    proxy: {
      '/api': {
        target: apiBaseUrl,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error for', req.url, ':', err.message);
            res.writeHead(500, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': '*'
            });
            res.end(JSON.stringify({ error: 'Proxy connection failed', details: err.message }));
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            // Add CORS headers to outgoing requests
            proxyReq.setHeader('Access-Control-Allow-Origin', '*');
            proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            // Add CORS headers to incoming responses
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-credentials'] = 'true';
            proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['access-control-allow-headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control';
          });
        }
      }
    }
    }
  };
});
