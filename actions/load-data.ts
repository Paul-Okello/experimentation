"use server"

import { adminDb } from "@/firebaseAdmin";
import crypto from "crypto";

export type DataType = {
    accuracy: number;
    reactionTime: number;
}


export async function addToDb(
    message: DataType
) {
    const id = crypto.randomUUID()
    await adminDb
        .collection("experiment")
        .doc(id).set(message);
}