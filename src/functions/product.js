import {doc, getFirestore, deleteDoc, updateDoc, addDoc, collection} from "firebase/firestore";
import {getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import router from "@/router";

const db = getFirestore(getApp());
let productRef = null;

async function add(product) {
    await addDoc(collection(db, 'products'), product)
}

async function update(product) {
    productRef = doc(db, "products", product.id);

    await updateDoc(productRef, product);
}

async function remove(product) {
    await deleteDoc(doc(db, 'products', product.id));
}

export {add, update, remove};