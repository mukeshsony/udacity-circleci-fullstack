import * as bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;
export async function hashPassword(pw: string): Promise<string> {
  try {
    return await bcrypt.hash(pw, SALT_ROUNDS);
  } catch (error) {
    throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
export async function comparePassword(pw: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(pw, hash);
  } catch (error) {
    throw new Error(`Failed to compare password: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
