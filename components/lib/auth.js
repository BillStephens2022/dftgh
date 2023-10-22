import { hash, compare } from 'bcryptjs';

export async function hashPassword(password) {
   const hashedPassord =  await hash(password, 12);
   return hashedPassord;
}

export async function verifyPassword(password, hashedPassword) {
   const isValid = await compare(password, hashedPassword);
   return isValid;
}