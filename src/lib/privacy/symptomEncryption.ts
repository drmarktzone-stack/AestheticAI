import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { encode, decode } from "base64-arraybuffer";
import aesjs from "aes-js";

const KEY_STORAGE = "protokol.symptom_encryption_key_v1";

function bytesToBase64(bytes: Uint8Array): string {
  return encode(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer);
}

function base64ToBytes(base64: string): Uint8Array {
  return new Uint8Array(decode(base64));
}

async function randomBytes(length: number): Promise<Uint8Array> {
  return Crypto.getRandomBytesAsync(length);
}

async function getOrCreateKey(): Promise<Uint8Array> {
  const existing = await SecureStore.getItemAsync(KEY_STORAGE);
  if (existing) {
    return base64ToBytes(existing);
  }

  const key = await randomBytes(32);
  await SecureStore.setItemAsync(KEY_STORAGE, bytesToBase64(key));
  return key;
}

/** AES-256-CBC encrypts free-text symptom notes before upload. */
export async function encryptSymptomNotes(plainText: string): Promise<string | undefined> {
  const trimmed = plainText.trim();
  if (!trimmed) return undefined;

  const key = await getOrCreateKey();
  const iv = await randomBytes(16);
  const textBytes = aesjs.utils.utf8.toBytes(trimmed);
  const padded = aesjs.padding.pkcs7.pad(textBytes);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const encrypted = aesCbc.encrypt(padded);

  const payload = new Uint8Array(iv.length + encrypted.length);
  payload.set(iv, 0);
  payload.set(encrypted, iv.length);

  return `v1:${bytesToBase64(payload)}`;
}

export async function decryptSymptomNotes(cipherText: string): Promise<string> {
  if (!cipherText.startsWith("v1:")) {
    throw new Error("Unsupported ciphertext version");
  }

  const key = await getOrCreateKey();
  const payload = base64ToBytes(cipherText.slice(3));
  const iv = payload.slice(0, 16);
  const data = payload.slice(16);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const decrypted = aesjs.padding.pkcs7.strip(aesCbc.decrypt(data));
  return aesjs.utils.utf8.fromBytes(decrypted);
}
