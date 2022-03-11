const Donor = require('../models/Donor');
const Institution = require('../models/Institution');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = process.env;

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(422).json({ msg: 'Email é obrigatório!' });
    }

    if (!password) {
      return res.status(422).json({ msg: 'Senha é obrigatória!' });
    } else if (password.length < 8) {
      return res
        .status(422)
        .json({ msg: 'Senha deve ter pelo menos 8 dígitos!' });
    }

    const donor = await Donor.findOne({ email });
    const institution = await Institution.findOne({ email });

    const user = donor || institution;

    if (!user) {
      return res.status(404).json({ msg: 'Usuário não existe!' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(422).json({ msg: 'Senha inválida!' });
    }

    const token = jwt.sign({ email, password }, JWT_SECRET);

    await pushToken(user, token);

    const role = user.cnpj ? 'institution' : 'donor';

    const newUser = {
      _id: user._id,
      email: user.email,
      role,
    };

    return res.status(200).json({ user: newUser, token });
  },

  async logout(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(404).json({ msg: 'Id é obrigatório!' });
      }

      const donor = await Donor.findById(id);
      const institution = await Institution.findById(id);

      const user = donor || institution;

      if (!user) {
        return res.status(404).json({ msg: 'Usuário não existe!' });
      }

      const authHeader = req.headers.authorization;
      const parts = authHeader.split(' ');
      const token = parts[1];

      const index = user.tokens.indexOf(token);
      user.tokens.splice(index, 1);

      await user.save();

      return res.status(200).json({ msg: 'Logout concluído!' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

async function pushToken(user, token) {
  user.tokens.push(token);
  await user.save();
}
