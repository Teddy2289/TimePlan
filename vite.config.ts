import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/storage': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => {
                    // Enlever le préfixe /storage pour le backend
                    return path.replace(/^\/storage/, '/storage');
                },
                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // Ajouter les headers pour toutes les requêtes
                        proxyReq.setHeader('Origin', 'http://localhost:5174');
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        // Ajouter les headers CORS
                        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5174';
                        proxyRes.headers['Access-Control-Allow-Methods'] =
                            'GET, POST, PUT, DELETE, OPTIONS';
                        proxyRes.headers['Access-Control-Allow-Headers'] =
                            'Origin, Content-Type, Accept, Authorization';
                        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';

                        // Réparer le Content-Type si nécessaire
                        if (req.url?.includes('.jpg') || req.url?.includes('.jpeg')) {
                            proxyRes.headers['content-type'] = 'image/jpeg';
                        } else if (req.url?.includes('.png')) {
                            proxyRes.headers['content-type'] = 'image/png';
                        }
                    });
                },
            },
        },
    },
});
