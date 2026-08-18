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

const ordersRef = collection(db, "orders");

export async function createOrder(order) {
  return addDoc(ordersRef, {
    ...order,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function getAllOrders() {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(id, status) {
  const ref = doc(db, "orders", id);
  return updateDoc(ref, { status });
}

export async function deleteOrder(id) {
  const ref = doc(db, "orders", id);
  return deleteDoc(ref);
}