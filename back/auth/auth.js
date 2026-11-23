import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT
const COOKIE_NAME = process.env.COOKIE

function getUserFromCookie(req) {
  const token = req.cookies && req.cookies[COOKIE_NAME]
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

export function auth(req, res, next) {
  const user = getUserFromCookie(req)

  if (!user) {
    return res.status(401).json({ message: "Não autenticado." })
  }

  req.user = user
  next();
}

export function inverseAuth(req, res, next) {
  const user = getUserFromCookie(req);

  if (user) {
    return res.status(403).json({ message: "Você já está autenticado." })
  }

  next()
}
