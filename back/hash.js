import bcrypt from 'bcrypt'

const senha = await bcrypt.hash('654321', 10)
console.log(senha)