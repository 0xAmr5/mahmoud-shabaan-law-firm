import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const authService = {
  // تسجيل الدخول
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      let errorMsg = 'تعذر تسجيل الدخول، تأكد من صحة البريد وكلمة المرور.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'بيانات الدخول غير صحيحة، يرجى المحاولة مجدداً.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة، يرجى الانتظار قليلاً.';
      }
      return { user: null, error: errorMsg };
    }
  },

  // إنشاء حساب جديد
  register: async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      const userProfile = {
        uid: user.uid,
        email: user.email,
        name: additionalData.name || 'مستخدم جديد',
        phone: additionalData.phone || '',
        role: additionalData.role || 'CLIENT',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return { user, error: null };
    } catch (error) {
      console.error('Register error:', error);
      let errorMsg = 'حدث خطأ أثناء إنشاء الحساب.';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'البريد الإلكتروني مسجل بالفعل.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'كلمة المرور ضعيفة، يرجى استخدام 6 أحرف على الأقل.';
      }
      return { user: null, error: errorMsg };
    }
  },

  // استعادة كلمة المرور
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMsg = 'حدث خطأ أثناء إرسال رابط الاستعادة.';
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'البريد الإلكتروني غير مسجل بالمنظومة.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'صيغة البريد الإلكتروني غير صحيحة.';
      }
      return { success: false, error: errorMsg };
    }
  },

  // تسجيل الخروج
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default authService;