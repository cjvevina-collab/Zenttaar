import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import {
  DEFAULT_BANKING_SETTINGS,
  DEFAULT_SITE_SETTINGS,
  GARMENTS,
  GarmentProduct,
  InquiryRecord,
  PRODUCTION_VIDEOS,
  ProductionVideo,
  SiteSettingsBanking,
  SiteSettingsPublic,
  TESTIMONIALS,
  TestimonialItem,
} from '../data/catalog';

export function subscribePublicSettings(
  onData: (settings: SiteSettingsPublic) => void
) {
  const path = 'siteSettings/public';
  return onSnapshot(
    doc(db, 'siteSettings', 'public'),
    (snap) => {
      if (snap.exists()) {
        onData({ ...DEFAULT_SITE_SETTINGS, ...(snap.data() as Partial<SiteSettingsPublic>) });
      }
    },
    (error) => {
      console.warn('Public settings listener fallback:', error.message);
    }
  );
}

export function subscribeProducts(onData: (items: GarmentProduct[]) => void) {
  const q = query(collection(db, 'products'), orderBy('sortOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as GarmentProduct);
        onData(list);
      }
    },
    (error) => {
      console.warn('Products listener fallback:', error.message);
    }
  );
}

export function subscribeVideos(onData: (items: ProductionVideo[]) => void) {
  const q = query(collection(db, 'videos'), orderBy('sortOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as ProductionVideo);
        onData(list);
      }
    },
    (error) => {
      console.warn('Videos listener fallback:', error.message);
    }
  );
}

export function subscribeTestimonials(onData: (items: TestimonialItem[]) => void) {
  const q = query(collection(db, 'testimonials'), orderBy('sortOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as TestimonialItem);
        onData(list);
      }
    },
    (error) => {
      console.warn('Testimonials listener fallback:', error.message);
    }
  );
}

export async function submitPublicInquiry(payload: {
  refId: string;
  source: 'contact_form' | 'inquiry_bag';
  name: string;
  brandName?: string;
  email: string;
  phone?: string;
  category?: string;
  quantity?: string;
  techPackUrl?: string;
  message?: string;
  itemsSummary?: string;
}): Promise<void> {
  const docId = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const path = `inquiries/${docId}`;
  try {
    await setDoc(doc(db, 'inquiries', docId), {
      refId: payload.refId.slice(0, 40),
      source: payload.source,
      name: payload.name.trim().slice(0, 120),
      brandName: (payload.brandName || '').trim().slice(0, 120),
      email: payload.email.trim().slice(0, 160),
      phone: (payload.phone || '').trim().slice(0, 50),
      category: (payload.category || '').trim().slice(0, 120),
      quantity: (payload.quantity || '').trim().slice(0, 100),
      techPackUrl: (payload.techPackUrl || '').trim().slice(0, 600),
      message: (payload.message || '').trim().slice(0, 2500),
      itemsSummary: (payload.itemsSummary || '').trim().slice(0, 4000),
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getBankingSettings(): Promise<SiteSettingsBanking> {
  const path = 'siteSettings/banking';
  try {
    const snap = await getDoc(doc(db, 'siteSettings', 'banking'));
    if (snap.exists()) {
      return { ...DEFAULT_BANKING_SETTINGS, ...(snap.data() as Partial<SiteSettingsBanking>) };
    }
    return DEFAULT_BANKING_SETTINGS;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function savePublicSettings(settings: SiteSettingsPublic): Promise<void> {
  const path = 'siteSettings/public';
  try {
    await setDoc(doc(db, 'siteSettings', 'public'), {
      ...settings,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveBankingSettings(banking: SiteSettingsBanking): Promise<void> {
  const path = 'siteSettings/banking';
  try {
    await setDoc(doc(db, 'siteSettings', 'banking'), {
      ...banking,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveProduct(product: GarmentProduct): Promise<void> {
  const cleanId = product.id.replace(/[^a-zA-Z0-9_-]/g, '-');
  const path = `products/${cleanId}`;
  try {
    await setDoc(doc(db, 'products', cleanId), {
      ...product,
      id: cleanId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveVideo(video: ProductionVideo): Promise<void> {
  const cleanId = video.id.replace(/[^a-zA-Z0-9_-]/g, '-');
  const path = `videos/${cleanId}`;
  try {
    await setDoc(doc(db, 'videos', cleanId), {
      ...video,
      id: cleanId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeVideo(videoId: string): Promise<void> {
  const path = `videos/${videoId}`;
  try {
    await deleteDoc(doc(db, 'videos', videoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveTestimonial(item: TestimonialItem): Promise<void> {
  const cleanId = item.id.replace(/[^a-zA-Z0-9_-]/g, '-');
  const path = `testimonials/${cleanId}`;
  try {
    await setDoc(doc(db, 'testimonials', cleanId), {
      ...item,
      id: cleanId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeTestimonial(id: string): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeAdminInquiries(onData: (items: InquiryRecord[]) => void) {
  const path = 'inquiries';
  const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({
        docId: d.id,
        ...(d.data() as Omit<InquiryRecord, 'docId'>),
      }));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function updateInquiryStatus(
  docId: string,
  status: InquiryRecord['status']
): Promise<void> {
  const path = `inquiries/${docId}`;
  try {
    await updateDoc(doc(db, 'inquiries', docId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteInquiry(docId: string): Promise<void> {
  const path = `inquiries/${docId}`;
  try {
    await deleteDoc(doc(db, 'inquiries', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedDefaultsToFirestore(): Promise<void> {
  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'siteSettings', 'public'), {
      ...DEFAULT_SITE_SETTINGS,
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'siteSettings', 'banking'), {
      ...DEFAULT_BANKING_SETTINGS,
      updatedAt: serverTimestamp(),
    });
    for (const p of GARMENTS) {
      batch.set(doc(db, 'products', p.id), { ...p, updatedAt: serverTimestamp() });
    }
    for (const v of PRODUCTION_VIDEOS) {
      batch.set(doc(db, 'videos', v.id), { ...v, updatedAt: serverTimestamp() });
    }
    for (const t of TESTIMONIALS) {
      batch.set(doc(db, 'testimonials', t.id), { ...t, updatedAt: serverTimestamp() });
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batchSeed');
  }
}

export async function uploadImageToImgbb(file: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in as Admin before uploading images.');
  }
  const idToken = await user.getIdToken();
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  const resp = await fetch('/api/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ imageBase64: base64, name: file.name }),
  });

  const data = (await resp.json()) as { url?: string; error?: string };
  if (!resp.ok || !data.url) {
    throw new Error(data.error || 'Image upload failed.');
  }
  return data.url;
}
