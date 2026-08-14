import { auth, db, secondaryAuth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const normalizeRole = (role) => {
  const r = String(role || '').toUpperCase().trim();
  if (r === 'ADMIN' || r === 'SUPER_ADMIN' || r === 'صاحب المكتب' || r === 'مدير') return 'ADMIN';
  if (r === 'LAWYER' || r === 'ATTORNEY' || r === 'محامي' || r === 'المحامي') return 'LAWYER';
  return 'CLIENT';
};

export const authService = {
  async registerUser({ name, email, phone, password, role = 'CLIENT', specialization = '' }) {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedRole = normalizeRole(role);
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      const profile = {
        uid: user.uid,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        role: normalizedRole,
        specialization: specialization.trim(),
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), profile);

      return {
        user,
        profile,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        profile: null,
        error: this.getErrorMessage(error.code),
      };
    }
  },

  async registerClient(data) {
    return await this.registerUser({ ...data, role: 'CLIENT' });
  },

  async loginWithEmailOrPhone(identifier, password) {
    try {
      const input = identifier.trim();
      let targetEmail = input.toLowerCase();

      const isEmail = input.includes('@');
      if (!isEmail) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', input));
        const snap = await getDocs(q);

        if (snap.empty) {
          return {
            user: null,
            profile: null,
            error: 'رقم الهاتف غير مسجل في المنظومة.',
          };
        }

        const userDoc = snap.docs[0].data();
        if (!userDoc.email) {
          return {
            user: null,
            profile: null,
            error: 'لا يوجد بريد إلكتروني مرتبط بهذا الهاتف.',
          };
        }
        targetEmail = userDoc.email.toLowerCase();
      }

      const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
      const user = userCredential.user;

      let profile = await this.getUserProfile(user.uid);

      if (!profile) {
        profile = {
          uid: user.uid,
          name: user.displayName || 'مستخدم',
          email: targetEmail,
          phone: isEmail ? '' : input,
          role: 'CLIENT',
          status: 'ACTIVE',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'users', user.uid), profile);
      }

      const normalizedProfile = {
        ...profile,
        uid: user.uid,
        role: normalizeRole(profile.role),
      };

      if (profile.status === 'INACTIVE' || profile.status === 'BLOCKED') {
        await signOut(auth);
        return {
          user: null,
          profile: null,
          error: 'هذا الحساب تم تعطيله. يرجى التواصل مع إدارة المكتب.',
        };
      }

      return {
        user,
        profile: normalizedProfile,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        profile: null,
        error: this.getErrorMessage(error.code),
      };
    }
  },

  async loginWithEmail(email, password) {
    return await this.loginWithEmailOrPhone(email, password);
  },

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let profile = await this.getUserProfile(user.uid);

      if (!profile) {
        profile = {
          uid: user.uid,
          name: user.displayName || 'مستخدم جديد',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: 'CLIENT',
          status: 'ACTIVE',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'users', user.uid), profile);
      }

      const normalizedProfile = {
        ...profile,
        uid: user.uid,
        role: normalizeRole(profile.role),
      };

      if (profile.status === 'INACTIVE' || profile.status === 'BLOCKED') {
        await signOut(auth);
        return {
          user: null,
          profile: null,
          error: 'هذا الحساب غير نشط حالياً. يرجى التواصل مع إدارة المكتب.',
        };
      }

      return {
        user,
        profile: normalizedProfile,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        profile: null,
        error: this.getErrorMessage(error.code),
      };
    }
  },

  async createAccountByAdmin({ email, password, name, phone = '', role, additionalData = {} }) {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedRole = normalizeRole(role);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        normalizedEmail,
        password
      );

      const newUid = userCredential.user.uid;

      const userProfile = {
        uid: newUid,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        role: normalizedRole,
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData,
      };

      await setDoc(doc(db, 'users', newUid), userProfile);
      await signOut(secondaryAuth);

      return {
        success: true,
        uid: newUid,
        profile: userProfile,
        error: null,
      };
    } catch (error) {
      try {
        await signOut(secondaryAuth);
      } catch {}

      return {
        success: false,
        uid: null,
        error: this.getErrorMessage(error.code),
      };
    }
  },

  async getUserProfile(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid: docSnap.id,
          ...data,
          role: normalizeRole(data.role || data.type),
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },

  getErrorMessage(code) {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'البريد الإلكتروني أو رقم الهاتف أو كلمة المرور غير صحيحة.';
      case 'auth/too-many-requests':
        return 'تم إجراء محاولات كثيرة خاطئة. يرجى الانتظار قليلاً ثم المحاولة.';
      case 'auth/email-already-in-use':
        return 'هذا البريد الإلكتروني مسجل به حساب بالفعل.';
      case 'auth/weak-password':
        return 'كلمة المرور ضعيفة، يجب ألا تقل عن 6 أحرف أو أرقام.';
      case 'auth/invalid-email':
        return 'صيغة البريد الإلكتروني غير صحيحة.';
      case 'auth/user-disabled':
        return 'هذا الحساب تم تعطيله من قبل إدارة المنظومة.';
      case 'auth/popup-closed-by-user':
        return 'تم إغلاق نافذة تسجيل الدخول قبل استكمال العملية.';
      case 'auth/unauthorized-domain':
        return 'النطاق الحالي للموقع غير مفعل في إعدادات Firebase Console.';
      case 'auth/network-request-failed':
        return 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.';
      default:
        return 'البيانات المدخلة غير صحيحة. يرجى التأكد من البريد أو الهاتف وكلمة المرور.';
    }
  },
};