import {doc, getFirestore, deleteDoc} from "firebase/firestore";
import {getApp} from "firebase/app";

const db = getFirestore(getApp());

async function remove(product) {
    await deleteDoc(doc(db, 'products',product.id));
}

export {remove};