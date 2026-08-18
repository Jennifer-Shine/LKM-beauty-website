// CRUD helpers for the "products" collection in Firestore.
// A "product" here doubles as a "service" entry — both use the same
// shape (name, category, price, description, image, createdAt).

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const productsRef = collection(db, "products");

export async function getAllProducts() {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProduct(product) {
  return addDoc(productsRef, {
    ...product,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, updates) {
  const ref = doc(db, "products", id);
  return updateDoc(ref, updates);
}

export async function deleteProduct(id) {
  const ref = doc(db, "products", id);
  return deleteDoc(ref);
}