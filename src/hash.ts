import argon2 from 'argon2'
// https://www.npmjs.com/package/argon2

class Hash {
  static async hashPassword(password: string) {
    return await argon2.hash(password)
  }

  static async verifyPassword(password: string, hash: string) {
    return await argon2.verify(hash, password)
  }
}

export default Hash