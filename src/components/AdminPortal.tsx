import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import {
  Check,
  Copy,
  Edit3,
  Inbox,
  Landmark,
  Lock,
  LogOut,
  MessageSquareQuote,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { ADMIN_UID, auth } from '../firebase';
import {
  DEFAULT_BANKING_SETTINGS,
  GarmentProduct,
  InquiryRecord,
  ProductionVideo,
  SiteSettingsBanking,
  SiteSettingsPublic,
  TestimonialItem,
} from '../data/catalog';
import {
  deleteInquiry,
  getBankingSettings,
  removeProduct,
  removeTestimonial,
  removeVideo,
  saveBankingSettings,
  saveProduct,
  savePublicSettings,
  saveTestimonial,
  saveVideo,
  subscribeAdminInquiries,
  updateInquiryStatus,
  uploadImageToImgbb,
} from '../services/firestoreService';

interface AdminPortalProps {
  siteSettings: SiteSettingsPublic;
  products: GarmentProduct[];
  videos: ProductionVideo[];
  testimonials: TestimonialItem[];
}

type AdminTab =
  | 'settings'
  | 'banking'
  | 'products'
  | 'videos'
  | 'testimonials'
  | 'inquiries'
  | 'setup';

const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function isValidId(id) {
      return id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\\\-]+$');
    }
    function incoming() { return request.resource.data; }
    function existing() { return resource.data; }
    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() && (
        request.auth.uid == 'bAIfHmB4M6NiIXSR1GnG3iu0wqg1' ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }
    function isStr(val, maxLen) { return val is string && val.size() <= maxLen; }
    function isNonEmptyStr(val, maxLen) { return val is string && val.size() >= 1 && val.size() <= maxLen; }

    function isValidPublicSettings(data) {
      return data.keys().hasAll(['brandName', 'email', 'phone', 'whatsappNumber', 'address'])
        && data.keys().hasOnly([
          'brandName', 'domain', 'websiteUrl', 'logoUrl', 'backgroundUrl',
          'address', 'email', 'phone', 'whatsappNumber',
          'instagramUrl', 'facebookUrl', 'tiktokUrl', 'youtubeUrl', 'updatedAt'
        ])
        && isNonEmptyStr(data.brandName, 120)
        && isNonEmptyStr(data.email, 160)
        && isNonEmptyStr(data.phone, 40)
        && isNonEmptyStr(data.whatsappNumber, 40)
        && isNonEmptyStr(data.address, 300)
        && (!('domain' in data) || isStr(data.domain, 160))
        && (!('websiteUrl' in data) || isStr(data.websiteUrl, 300))
        && (!('logoUrl' in data) || isStr(data.logoUrl, 600))
        && (!('backgroundUrl' in data) || isStr(data.backgroundUrl, 600))
        && (!('instagramUrl' in data) || isStr(data.instagramUrl, 400))
        && (!('facebookUrl' in data) || isStr(data.facebookUrl, 400))
        && (!('tiktokUrl' in data) || isStr(data.tiktokUrl, 400))
        && (!('youtubeUrl' in data) || isStr(data.youtubeUrl, 400));
    }

    function isValidBankingSettings(data) {
      return data.keys().hasAll(['bankName', 'accountTitle', 'accountNumber'])
        && data.keys().hasOnly([
          'bankName', 'accountTitle', 'accountNumber', 'iban',
          'swiftCode', 'branchAddress', 'paymentNotes', 'updatedAt'
        ])
        && isNonEmptyStr(data.bankName, 140)
        && isNonEmptyStr(data.accountTitle, 140)
        && isNonEmptyStr(data.accountNumber, 80)
        && (!('iban' in data) || isStr(data.iban, 80))
        && (!('swiftCode' in data) || isStr(data.swiftCode, 40))
        && (!('branchAddress' in data) || isStr(data.branchAddress, 240))
        && (!('paymentNotes' in data) || isStr(data.paymentNotes, 500));
    }

    function isValidProduct(data) {
      return data.keys().hasAll(['id', 'name', 'category', 'gsm', 'moq', 'priceRange', 'image'])
        && data.keys().hasOnly([
          'id', 'name', 'category', 'gsm', 'moq', 'priceRange', 'basePrice',
          'priceTiers', 'leadTime', 'fabric', 'stitching', 'fit', 'image',
          'fallbackImage', 'gallery', 'tag', 'description', 'colorways',
          'techniques', 'sizes', 'sortOrder', 'updatedAt'
        ])
        && isNonEmptyStr(data.id, 100)
        && isNonEmptyStr(data.name, 160)
        && isNonEmptyStr(data.category, 80)
        && isNonEmptyStr(data.gsm, 40)
        && data.moq is number && data.moq >= 1 && data.moq <= 100000
        && isNonEmptyStr(data.priceRange, 40)
        && isNonEmptyStr(data.image, 600);
    }

    function isValidVideo(data) {
      return data.keys().hasAll(['id', 'step', 'title', 'videoUrl'])
        && data.keys().hasOnly([
          'id', 'step', 'title', 'duration', 'department', 'summary',
          'posterImage', 'fallbackPoster', 'videoUrl', 'specs', 'sortOrder', 'updatedAt'
        ])
        && isNonEmptyStr(data.id, 80)
        && isNonEmptyStr(data.step, 10)
        && isNonEmptyStr(data.title, 160)
        && isStr(data.videoUrl, 600);
    }

    function isValidTestimonial(data) {
      return data.keys().hasAll(['id', 'name', 'brand', 'quote'])
        && data.keys().hasOnly(['id', 'name', 'role', 'brand', 'location', 'orderMetric', 'quote', 'sortOrder', 'updatedAt'])
        && isNonEmptyStr(data.id, 80)
        && isNonEmptyStr(data.name, 120)
        && isNonEmptyStr(data.brand, 120)
        && isNonEmptyStr(data.quote, 1000);
    }

    function isValidInquiry(data) {
      return data.keys().hasAll(['refId', 'source', 'name', 'email', 'status', 'createdAt'])
        && data.keys().hasOnly([
          'refId', 'source', 'name', 'brandName', 'email', 'phone',
          'category', 'quantity', 'techPackUrl', 'message', 'itemsSummary',
          'status', 'createdAt', 'updatedAt'
        ])
        && isNonEmptyStr(data.refId, 40)
        && data.source in ['contact_form', 'inquiry_bag']
        && isNonEmptyStr(data.name, 120)
        && isNonEmptyStr(data.email, 160)
        && data.status in ['pending', 'reviewed', 'quoted', 'archived'];
    }

    match /siteSettings/public {
      allow get: if true;
      allow create, update: if isAdmin() && isValidPublicSettings(incoming());
      allow delete: if false;
    }

    match /siteSettings/banking {
      allow get: if isAdmin();
      allow create, update: if isAdmin() && isValidBankingSettings(incoming());
      allow delete: if false;
    }

    match /products/{productId} {
      allow get: if isValidId(productId);
      allow list: if true;
      allow create: if isAdmin() && isValidId(productId) && isValidProduct(incoming()) && incoming().id == productId;
      allow update: if isAdmin() && isValidId(productId) && isValidProduct(incoming()) && incoming().id == existing().id;
      allow delete: if isAdmin() && isValidId(productId);
    }

    match /videos/{videoId} {
      allow get: if isValidId(videoId);
      allow list: if true;
      allow create: if isAdmin() && isValidId(videoId) && isValidVideo(incoming()) && incoming().id == videoId;
      allow update: if isAdmin() && isValidId(videoId) && isValidVideo(incoming()) && incoming().id == existing().id;
      allow delete: if isAdmin() && isValidId(videoId);
    }

    match /testimonials/{testimonialId} {
      allow get: if isValidId(testimonialId);
      allow list: if true;
      allow create: if isAdmin() && isValidId(testimonialId) && isValidTestimonial(incoming()) && incoming().id == testimonialId;
      allow update: if isAdmin() && isValidId(testimonialId) && isValidTestimonial(incoming()) && incoming().id == existing().id;
      allow delete: if isAdmin() && isValidId(testimonialId);
    }

    match /inquiries/{inquiryId} {
      allow create: if isValidId(inquiryId)
        && isValidInquiry(incoming())
        && incoming().status == 'pending'
        && incoming().createdAt == request.time;
      allow get: if isAdmin() && isValidId(inquiryId);
      allow list: if isAdmin();
      allow update: if isAdmin() && isValidId(inquiryId)
        && isValidInquiry(incoming())
        && incoming().createdAt == existing().createdAt
        && incoming().diff(existing()).affectedKeys().hasOnly(['status', 'updatedAt']);
      allow delete: if isAdmin() && isValidId(inquiryId);
    }

    match /admins/{adminUid} {
      allow get: if isAdmin() && isValidId(adminUid);
      allow list, create, update, delete: if false;
    }

    match /test/connection {
      allow get: if true;
    }
  }
}`;

export const AdminPortal: React.FC<AdminPortalProps> = ({
  siteSettings,
  products,
  videos,
  testimonials,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('settings');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings & Banking State
  const [settingsForm, setSettingsForm] = useState<SiteSettingsPublic>(siteSettings);
  const [bankingForm, setBankingForm] = useState<SiteSettingsBanking>(DEFAULT_BANKING_SETTINGS);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  // Product Editor State
  const [editingProduct, setEditingProduct] = useState<GarmentProduct | null>(null);
  const [productTechText, setProductTechText] = useState('');

  // Video Editor State
  const [editingVideo, setEditingVideo] = useState<ProductionVideo | null>(null);
  const [videoSpecsText, setVideoSpecsText] = useState('');

  // Testimonial Editor State
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const isAuthorizedAdmin = Boolean(user && user.uid === ADMIN_UID);

  useEffect(() => {
    if (!isAuthorizedAdmin) return;
    getBankingSettings()
      .then((b) => setBankingForm(b))
      .catch(() => {});

    const unsubInq = subscribeAdminInquiries((items) => setInquiries(items));
    return () => unsubInq();
  }, [isAuthorizedAdmin]);

  const notify = (msg: string) => {
    setErrorMsg(null);
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg((prev) => (prev === msg ? null : prev)), 3000);
  };

  const notifyError = (err: unknown) => {
    const raw = err instanceof Error ? err.message : String(err);
    setErrorMsg(raw);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Invalid email or password.'
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleFileUpload = async (
    file: File | undefined,
    fieldKey: string,
    onUrl: (url: string) => void
  ) => {
    if (!file) return;
    setUploadingField(fieldKey);
    setErrorMsg(null);
    try {
      const url = await uploadImageToImgbb(file);
      onUrl(url);
      notify('Image uploaded to ImgBB.');
    } catch (err) {
      notifyError(err);
    } finally {
      setUploadingField(null);
    }
  };

  const startNewProduct = () => {
    const newProd: GarmentProduct = {
      id: `zen-item-${Date.now().toString().slice(-5)}`,
      name: '',
      category: 'Hoodies',
      gsm: '500 GSM',
      moq: 50,
      priceRange: 'Quote on Inquiry',
      basePrice: 0,
      priceTiers: [
        { range: '50 – 99 pcs', price: 0 },
        { range: '100 – 249 pcs', price: 0 },
        { range: '250+ pcs', price: 0 },
      ],
      leadTime: '18–24 Days',
      fabric: '100% Combed Ring-Spun Cotton Fleece',
      stitching: 'Double-needle coverstitch',
      fit: 'Oversized Boxy Drop-Shoulder',
      image: '',
      fallbackImage: '/src/assets/images/hoodie_heavyweight_obsidian_1795766290801.jpg',
      gallery: [],
      tag: 'Custom Drop',
      description: '',
      colorways: [{ name: 'Custom Shade', hex: '#141418' }],
      techniques: ['3D Puff Print', 'Heavy Embroidery'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      sortOrder: products.length + 1,
    };
    setEditingProduct(newProd);
    setProductTechText('3D Puff Print, Heavy Embroidery');
  };

  const startEditProduct = (p: GarmentProduct) => {
    setEditingProduct({ ...p });
    setProductTechText(p.techniques.join(', '));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const parsedTechs = productTechText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const finalProduct: GarmentProduct = {
        ...editingProduct,
        priceRange: editingProduct.priceRange?.trim() || 'Quote on Inquiry',
        gallery: editingProduct.image ? [editingProduct.image] : [],
        colorways:
          editingProduct.colorways && editingProduct.colorways.length > 0
            ? editingProduct.colorways
            : [{ name: 'Custom Shade', hex: '#141418' }],
        techniques: parsedTechs.length > 0 ? parsedTechs : editingProduct.techniques,
      };
      await saveProduct(finalProduct);
      setEditingProduct(null);
      notify(`Saved product "${finalProduct.name}" directly to Firebase.`);
    } catch (err) {
      notifyError(err);
    }
  };

  const startNewVideo = () => {
    const newVid: ProductionVideo = {
      id: `vid-${Date.now().toString().slice(-4)}`,
      step: `0${videos.length + 1}`,
      title: '',
      duration: '00:45',
      department: 'Production Floor',
      summary: '',
      posterImage: siteSettings.backgroundUrl,
      fallbackPoster: '/src/assets/images/hero_atelier_backdrop_1795766290321.jpg',
      videoUrl: '',
      specs: ['Custom Production', 'Quality Tested'],
      sortOrder: videos.length + 1,
    };
    setEditingVideo(newVid);
    setVideoSpecsText('Custom Production, Quality Tested');
  };

  const startEditVideo = (v: ProductionVideo) => {
    setEditingVideo({ ...v });
    setVideoSpecsText(v.specs.join(', '));
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    try {
      await saveVideo({
        ...editingVideo,
        specs: videoSpecsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setEditingVideo(null);
      notify(`Saved video "${editingVideo.title}".`);
    } catch (err) {
      notifyError(err);
    }
  };

  const startNewTestimonial = () => {
    setEditingTestimonial({
      id: `rev-${Date.now().toString().slice(-4)}`,
      name: '',
      role: 'Founder',
      brand: '',
      location: '',
      orderMetric: '',
      quote: '',
      sortOrder: testimonials.length + 1,
    });
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    try {
      await saveTestimonial(editingTestimonial);
      setEditingTestimonial(null);
      notify(`Saved testimonial from ${editingTestimonial.name}.`);
    } catch (err) {
      notifyError(err);
    }
  };

  if (!authReady) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-zinc-400">
        Checking admin session...
      </div>
    );
  }

  // Email & Password Login Only
  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">Admin Portal Login</h1>
              <p className="text-xs text-zinc-400">Sign in with your Firebase Admin Email & Password</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-zinc-300">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@zenttaarenterprises.store"
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-zinc-300">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {authError && (
              <p role="alert" className="text-xs text-rose-400">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loggingIn ? 'Signing In...' : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-xl border border-rose-500/30 bg-[#0d0d12] p-6 space-y-4">
          <h1 className="font-display text-xl font-bold text-white">Access Restricted</h1>
          <p className="text-xs text-zinc-400">
            Signed in as {user.email} (UID: {user.uid}). This account does not match the authorized Admin UID.
          </p>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </section>
    );
  }

  const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'settings', label: 'Site & Socials', icon: <Settings className="h-4 w-4" /> },
    { id: 'banking', label: 'Bank Details', icon: <Landmark className="h-4 w-4" /> },
    { id: 'products', label: `Products (${products.length})`, icon: <Package className="h-4 w-4" /> },
    { id: 'videos', label: `Videos (${videos.length})`, icon: <Video className="h-4 w-4" /> },
    { id: 'testimonials', label: 'Reviews', icon: <MessageSquareQuote className="h-4 w-4" /> },
    { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: <Inbox className="h-4 w-4" /> },
    { id: 'setup', label: 'Security Rules', icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Admin Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
        <div>
          <p className="text-xs font-medium text-amber-400">Zenttaar Management Console</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
            Storefront &amp; Manufacturing Admin
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            All changes save directly to Firebase · Signed in as {user.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {statusMsg && (
        <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-xs font-medium text-emerald-300">
          {statusMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-xs font-medium text-rose-300 break-words">
          {errorMsg}
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-zinc-800/80 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500 text-zinc-950 font-semibold'
                : 'border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SITE & CONTACT & SOCIAL SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await savePublicSettings(settingsForm);
              notify('Storefront contact, branding & social links updated.');
            } catch (err) {
              notifyError(err);
            }
          }}
          className="mt-6 rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-6 sm:p-8 space-y-6"
        >
          <h2 className="font-display text-xl font-bold text-white">
            Contact, Branding & Social Media Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300">Company Name</label>
              <input
                type="text"
                required
                value={settingsForm.brandName}
                onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Domain</label>
              <input
                type="text"
                value={settingsForm.domain}
                onChange={(e) => setSettingsForm({ ...settingsForm, domain: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Contact Phone</label>
              <input
                type="text"
                required
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">WhatsApp Number</label>
              <input
                type="text"
                required
                value={settingsForm.whatsappNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Email Address</label>
              <input
                type="email"
                required
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Factory / Home Address</label>
              <input
                type="text"
                required
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800 pt-5">
            <div>
              <label className="block text-xs font-medium text-zinc-300">Logo Image URL</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  value={settingsForm.logoUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
                />
                <label className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:border-amber-500 cursor-pointer shrink-0">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingField === 'logo' ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e.target.files?.[0], 'logo', (url) =>
                        setSettingsForm((s) => ({ ...s, logoUrl: url }))
                      )
                    }
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300">Theme Background URL</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  value={settingsForm.backgroundUrl}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, backgroundUrl: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
                />
                <label className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:border-amber-500 cursor-pointer shrink-0">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingField === 'bg' ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e.target.files?.[0], 'bg', (url) =>
                        setSettingsForm((s) => ({ ...s, backgroundUrl: url }))
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800 pt-5">
            <div>
              <label className="block text-xs font-medium text-zinc-300">Instagram URL</label>
              <input
                type="url"
                value={settingsForm.instagramUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Facebook URL</label>
              <input
                type="url"
                value={settingsForm.facebookUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 cursor-pointer"
          >
            Save Site Settings
          </button>
        </form>
      )}

      {/* TAB 2: BANK ACCOUNT DETAILS */}
      {activeTab === 'banking' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await saveBankingSettings(bankingForm);
              notify('Bank account details saved securely to Firestore.');
            } catch (err) {
              notifyError(err);
            }
          }}
          className="mt-6 rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-6 sm:p-8 space-y-5"
        >
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              Company Bank Account Details
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Stored privately in Firestore (Admin-only read & write) for B2B wholesale invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300">Bank Name</label>
              <input
                type="text"
                required
                value={bankingForm.bankName}
                onChange={(e) => setBankingForm({ ...bankingForm, bankName: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Account Title</label>
              <input
                type="text"
                required
                value={bankingForm.accountTitle}
                onChange={(e) => setBankingForm({ ...bankingForm, accountTitle: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Account Number</label>
              <input
                type="text"
                required
                value={bankingForm.accountNumber}
                onChange={(e) =>
                  setBankingForm({ ...bankingForm, accountNumber: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">IBAN</label>
              <input
                type="text"
                value={bankingForm.iban}
                onChange={(e) => setBankingForm({ ...bankingForm, iban: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">SWIFT / BIC Code</label>
              <input
                type="text"
                value={bankingForm.swiftCode}
                onChange={(e) => setBankingForm({ ...bankingForm, swiftCode: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300">Branch Address</label>
              <input
                type="text"
                value={bankingForm.branchAddress}
                onChange={(e) =>
                  setBankingForm({ ...bankingForm, branchAddress: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300">Wire Payment Notes</label>
            <textarea
              rows={3}
              value={bankingForm.paymentNotes}
              onChange={(e) => setBankingForm({ ...bankingForm, paymentNotes: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 cursor-pointer"
          >
            Save Bank Account Details
          </button>
        </form>
      )}

      {/* TAB 3: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Catalog Products</h2>
            <button
              type="button"
              onClick={startNewProduct}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Product</span>
            </button>
          </div>

          {editingProduct && (
            <form
              onSubmit={handleSaveProduct}
              className="rounded-xl border border-amber-500/40 bg-[#0d0d12] p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">
                  {editingProduct.name ? `Edit: ${editingProduct.name}` : 'New Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300">Product ID (slug)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.id}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, id: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as GarmentProduct['category'],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  >
                    <option>Hoodies</option>
                    <option>Sets & Outerwear</option>
                    <option>Custom Blanks</option>
                    <option>Streetwear Tees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">GSM Weight</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.gsm}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, gsm: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">MOQ (pcs)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.moq}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        moq: Number(e.target.value) || 50,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">Tag / Collection Label</label>
                  <input
                    type="text"
                    value={editingProduct.tag}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, tag: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300">Main Product Image URL</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:border-amber-500 cursor-pointer shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploadingField === 'prod' ? '...' : 'Upload ImgBB'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e.target.files?.[0], 'prod', (url) =>
                          setEditingProduct((p) => (p ? { ...p, image: url } : p))
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300">Fabric</label>
                  <input
                    type="text"
                    value={editingProduct.fabric}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, fabric: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">Lead Time</label>
                  <input
                    type="text"
                    value={editingProduct.leadTime}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, leadTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">Fit / Cut Spec</label>
                  <input
                    type="text"
                    value={editingProduct.fit}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, fit: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">
                    Techniques (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={productTechText}
                    onChange={(e) => setProductTechText(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300">Description</label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 cursor-pointer"
              >
                Save Product to Firestore
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="text-xs text-amber-400">
                    {p.category} · {p.gsm}
                  </div>
                  <div className="font-display text-sm font-bold text-white truncate">{p.name}</div>
                  <div className="text-xs text-zinc-400 tabular-nums">
                    MOQ {p.moq} pcs · {p.leadTime}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditProduct(p)}
                    aria-label={`Edit ${p.name}`}
                    className="p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-amber-500 hover:text-white cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await removeProduct(p.id);
                        notify(`Deleted product "${p.name}".`);
                      } catch (err) {
                        notifyError(err);
                      }
                    }}
                    aria-label={`Delete ${p.name}`}
                    className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:border-rose-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VIDEOS MANAGER */}
      {activeTab === 'videos' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Factory Video Reels</h2>
            <button
              type="button"
              onClick={startNewVideo}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Video</span>
            </button>
          </div>

          {editingVideo && (
            <form
              onSubmit={handleSaveVideo}
              className="rounded-xl border border-amber-500/40 bg-[#0d0d12] p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300">Video ID</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.id}
                    onChange={(e) => setEditingVideo({ ...editingVideo, id: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">Stage Number</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.step}
                    onChange={(e) => setEditingVideo({ ...editingVideo, step: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">Department</label>
                  <input
                    type="text"
                    value={editingVideo.department}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, department: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300">Title</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300">MP4 Video URL</label>
                  <input
                    type="url"
                    required
                    value={editingVideo.videoUrl}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, videoUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300">Summary</label>
                <textarea
                  rows={2}
                  value={editingVideo.summary}
                  onChange={(e) => setEditingVideo({ ...editingVideo, summary: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 cursor-pointer"
                >
                  Save Video
                </button>
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((v) => (
              <div
                key={v.id}
                className="rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="text-xs text-amber-400">
                    Stage {v.step} · {v.department}
                  </div>
                  <div className="font-display text-sm font-bold text-white truncate">{v.title}</div>
                  <div className="text-xs text-zinc-500 truncate">{v.videoUrl}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditVideo(v)}
                    className="p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-amber-500 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await removeVideo(v.id);
                        notify(`Removed video "${v.title}".`);
                      } catch (err) {
                        notifyError(err);
                      }
                    }}
                    className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:border-rose-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Client Reviews</h2>
            <button
              type="button"
              onClick={startNewTestimonial}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Review</span>
            </button>
          </div>

          {editingTestimonial && (
            <form
              onSubmit={handleSaveTestimonial}
              className="rounded-xl border border-amber-500/40 bg-[#0d0d12] p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Client Name"
                  value={editingTestimonial.name}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Brand Name"
                  value={editingTestimonial.brand}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, brand: e.target.value })
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Order Metric (e.g. 1,000 Hoodies)"
                  value={editingTestimonial.orderMetric}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, orderMetric: e.target.value })
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
                />
              </div>
              <textarea
                rows={3}
                required
                placeholder="Client quote..."
                value={editingTestimonial.quote}
                onChange={(e) =>
                  setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-zinc-950 cursor-pointer"
                >
                  Save Review
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-display text-sm font-bold text-white">
                    {t.name} · {t.brand}
                  </div>
                  <div className="text-xs text-amber-400">{t.orderMetric}</div>
                  <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2">{t.quote}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial({ ...t })}
                    className="p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-amber-500 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await removeTestimonial(t.id);
                        notify('Review removed.');
                      } catch (err) {
                        notifyError(err);
                      }
                    }}
                    className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:border-rose-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="mt-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Customer Bulk Inquiries</h2>
          {inquiries.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-8 text-center text-sm text-zinc-400">
              No inquiries received in Firestore yet. Submissions from Contact & Inquiry Bag will appear here live.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.docId}
                  className="rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-5 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-display text-sm font-bold text-white">{inq.name}</span>
                      {inq.brandName && (
                        <span className="text-xs text-zinc-400"> · {inq.brandName}</span>
                      )}
                      <span className="ml-2 text-xs text-amber-400">[{inq.refId}]</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={async (e) => {
                          try {
                            await updateInquiryStatus(
                              inq.docId,
                              e.target.value as InquiryRecord['status']
                            );
                            notify('Inquiry status updated.');
                          } catch (err) {
                            notifyError(err);
                          }
                        }}
                        className="rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="quoted">Quoted</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await deleteInquiry(inq.docId);
                            notify('Inquiry deleted.');
                          } catch (err) {
                            notifyError(err);
                          }
                        }}
                        className="p-1.5 rounded-md border border-zinc-800 text-zinc-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400">
                    {inq.email} {inq.phone ? `· ${inq.phone}` : ''} · {inq.category || inq.source}
                  </div>
                  {(inq.itemsSummary || inq.message) && (
                    <p className="text-xs text-zinc-300 whitespace-pre-line">
                      {inq.itemsSummary || inq.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: FIRESTORE RULES */}
      {activeTab === 'setup' && (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-[#0d0d12]/95 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Firestore Security Rules
              </h2>
              <p className="text-xs text-zinc-400">
                Paste these rules into Firebase Console → Firestore Database → Rules.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(FIRESTORE_RULES_SNIPPET);
                setCopiedRules(true);
                setTimeout(() => setCopiedRules(false), 1800);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 cursor-pointer"
            >
              {copiedRules ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedRules ? 'Copied Rules' : 'Copy Rules'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300">
            {FIRESTORE_RULES_SNIPPET}
          </pre>
        </div>
      )}
    </section>
  );
};
