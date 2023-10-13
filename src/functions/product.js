import {doc, getFirestore, deleteDoc, updateDoc} from "firebase/firestore";
import {getApp} from "firebase/app";

const db = getFirestore(getApp());
let productRef = null;

async function update(product) {
    productRef = doc(db, "products", product.id);

    await updateDoc(productRef, product);
}

async function updateExpirationDate(productRef, newDate) {
    await updateDoc(productRef, {
        expirationDate: newDate,
    });
}

async function remove(product) {
    await deleteDoc(doc(db, 'products', product.id));
}

export {remove, updateExpirationDate, update};