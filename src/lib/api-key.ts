import { customAlphabet } from "nanoid";
import { nanoid as unanoid } from "nanoid/non-secure";

const PERMISSIONS = {
  CREATE_TODO: 0x2,
  READ_TODO: 0x4,
  UPDATE_TODO: 0x8,
  DELETE_TODO: 0x10,
} as const;

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

function generateRef(userId: number): string {
  const rawRef = `${unanoid(3)}.${userId}.${unanoid(3)}`;
  return btoa(rawRef)
    ?.replace(/=|\/|\+/g, "")
    ?.slice(0, 6);
}

export function generateApiKey(prefix: "sk" | "pk", userId: number): { ref: string; key: string } {
  const ref = generateRef(userId);
  const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_", 32);
  return {
    key: `${prefix}_${ref}_${nanoid()}`,
    ref,
  };
}

export function makePermission(permissions: Permission[]): number {
  return permissions.reduce((acc, curr) => acc | curr, 0);
}
