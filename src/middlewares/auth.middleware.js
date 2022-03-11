const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');
const Institution = require('../models/Institution');
const { JWT_SECRET } = process.env;

exports.authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: 'Token obrigatório!' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ msg: 'Erro de token!' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ msg: 'Token mal formatado' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: 'Token inválido!' });
    }

    const { email } = decoded;

    const donor = await Donor.findOne({ email });
    const institution = await Institution.findOne({ email });

    const user = donor || institution;

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não existe!' });
    }

    const tokens = user.tokens;

    if (!tokens.includes(token)) {
      return res.status(401).json({ msg: 'Token inválido!' });
    }

    req.id = decoded.sub;
    req.user = user;
    return next();
  });
};
