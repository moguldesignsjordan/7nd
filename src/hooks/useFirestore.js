import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    onboardingComplete: false,
  })
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function saveCheckin(uid, date, data) {
  const id = date || new Date().toISOString().split('T')[0]
  await setDoc(doc(db, 'checkins', uid, 'daily', id), {
    ...data,
    savedAt: serverTimestamp(),
  }, { merge: true })
}
