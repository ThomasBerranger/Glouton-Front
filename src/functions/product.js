import {doc, getFirestore, deleteDoc, updateDoc} from "firebase/firestore";
import {getApp} from "firebase/app";

const db = getFirestore(getApp());

async function refill(productRef) {
    await updateDoc(productRef, {
        finishedAt: '',
        toPurchase: false,
    });
}

async function remove(product) {
    await deleteDoc(doc(db, 'products',product.id));
}

export {refill, remove};