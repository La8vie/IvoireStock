import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const initializeAdmin = async () => {
  const adminEmail = 'Akougael3@gmail.com';
  const adminPassword = 'BJ4q4DTrDGwNGGN';
  const adminName = 'Lavie';
  
  try {
    // Vérifier si l'admin existe déjà
    const adminRef = doc(db, 'users', adminEmail);
    const adminDoc = await getDoc(adminRef);
    
    if (!adminDoc.exists()) {
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        adminEmail, 
        adminPassword
      );
      
      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: adminEmail,
        displayName: adminName,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      
      console.log('Compte administrateur créé avec succès !');
      return true;
    } else {
      console.log('Le compte administrateur existe déjà.');
      return true;
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte administrateur:', error);
    return false;
  }
};
