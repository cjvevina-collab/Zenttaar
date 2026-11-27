import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_UID = 'bAIfHmB4M6NiIXSR1GnG3iu0wqg1';
const FIREBASE_PROJECT_ID = 'zenttaarenterprises';

let cachedCerts: Record<string, string> = {};
let certsFetchedAt = 0;

async function getFirebaseCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (Object.keys(cachedCerts).length > 0 && now - certsFetchedAt < 3600_000) {
    return cachedCerts;
  }
  const resp = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  if (!resp.ok) {
    throw new Error('Failed to fetch Firebase public certificates.');
  }
  cachedCerts = (await resp.json()) as Record<string, string>;
  certsFetchedAt = now;
  return cachedCerts;
}

function decodeBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64');
}

async function verifyAdminIdToken(idToken: string): Promise<boolean> {
  if (!idToken || idToken.length > 4096) return false;
  const parts = idToken.split('.');
  if (parts.length !== 3) return false;

  try {
    const header = JSON.parse(decodeBase64Url(parts[0]).toString('utf8')) as {
      alg?: string;
      kid?: string;
    };
    const payload = JSON.parse(decodeBase64Url(parts[1]).toString('utf8')) as {
      aud?: string;
      iss?: string;
      sub?: string;
      exp?: number;
      iat?: number;
    };

    if (header.alg !== 'RS256' || !header.kid) return false;
    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp <= nowSec) return false;
    if (payload.aud !== FIREBASE_PROJECT_ID) return false;
    if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return false;
    if (payload.sub !== ADMIN_UID) return false;

    const certs = await getFirebaseCerts();
    const cert = certs[header.kid];
    if (!cert) return false;

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    const signature = decodeBase64Url(parts[2]);
    return verifier.verify(cert, signature);
  } catch {
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  app.post('/api/upload-image', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const isAuthorized = await verifyAdminIdToken(idToken);

      if (!isAuthorized) {
        return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
      }

      const apiKey = process.env.IMGBB_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error:
            'IMGBB_API_KEY is not configured in server Secrets. Add it in Settings -> Secrets or paste a direct image URL.',
        });
      }

      const { imageBase64, name } = (req.body || {}) as { imageBase64?: string; name?: string };
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Missing image payload.' });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      if (cleanBase64.length > 10 * 1024 * 1024) {
        return res.status(413).json({ error: 'Image exceeds 7MB limit.' });
      }

      const formBody = new URLSearchParams();
      formBody.append('key', apiKey);
      formBody.append('image', cleanBase64);
      if (name && typeof name === 'string') {
        formBody.append('name', name.slice(0, 80));
      }

      const uploadResp = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      });

      const result = (await uploadResp.json()) as {
        success?: boolean;
        data?: { url?: string; display_url?: string; delete_url?: string };
        error?: { message?: string };
      };

      if (!uploadResp.ok || !result.success || !result.data?.url) {
        return res.status(502).json({
          error: result.error?.message || 'ImgBB upload failed.',
        });
      }

      return res.json({
        url: result.data.display_url || result.data.url,
        deleteUrl: result.data.delete_url || null,
      });
    } catch (err) {
      return res.status(500).json({
        error: err instanceof Error ? err.message : 'Unexpected upload error.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
