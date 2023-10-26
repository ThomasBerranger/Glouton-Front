import {doc, getFirestore, deleteDoc, updateDoc, addDoc, collection} from "firebase/firestore";
import {getApp} from "firebase/app";
import moment from "moment/moment";

async function add(product) {
    const db = getFirestore(getApp());

    await addDoc(collection(db, 'products'), product)
}

async function update(product) {
    const db = getFirestore(getApp());
    const productRef = doc(db, "products", product.id);

    await updateDoc(productRef, product);
}

async function remove(product) {
    const db = getFirestore(getApp());

    await deleteDoc(doc(db, 'products', product.id));
}

function getNearestExpirationTimestampDate(product) {
    return Math.min(...product.expirationDates.map(date => moment(date, 'DD/MM/YYYY').valueOf()));
}

export {add, update, remove, getNearestExpirationTimestampDate};