const Donor = require('../models/Donor');
const Institution = require('../models/Institution');
const bcrypt = require('bcrypt');

module.exports = {
  async getDonorById(req, res) {
    const { id } = req.params;
    try {
      const donor = await Donor.findById(id);

      if (!donor) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' });
      }

      return res.status(200).json(donor);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  async signup(req, res) {
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

    const donorExists = await Donor.findOne({ email });
    const institutionExists = await Institution.findOne({ email });

    if (donorExists || institutionExists) {
      return res
        .status(422)
        .json({ msg: 'Já existe um usuário com esse email!' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const preferences = {
      state: '',
      city: '',
      typesOfInstitution: [],
    };

    try {
      const donor = await Donor.create({
        email,
        password: passwordHash,
        preferences,
      });

      return res.json(donor);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { state, city, typesOfInstitution } = req.body;

    if (!id) {
      return res.status(422).json({ msg: 'Id é obrigatório!' });
    }

    if (!state) {
      return res.status(422).json({ msg: 'Estado é obrigatório!' });
    }

    if (!city) {
      return res.status(422).json({ msg: 'Cidade é obrigatória!' });
    }

    if (!typesOfInstitution) {
      return res
        .status(422)
        .json({ msg: 'Tipos de instituição é obrigatório!' });
    }

    const donor = await Donor.findById(id);

    if (!donor) {
      return res.status(404).json({ msg: 'Usuário não encontrado!' });
    }

    donor.preferences = { state, city, typesOfInstitution };

    try {
      await donor.save();

      return res.status(200).json(donor);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};
