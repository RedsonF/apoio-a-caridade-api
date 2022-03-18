const Institution = require('../models/Institution');
const Donor = require('../models/Donor');
const bcrypt = require('bcrypt');
const Publication = require('../models/Publication');

module.exports = {
  async signup(req, res) {
    try {
      const { email, password, name, location, type, cnpj } = req.body;

      if (!location) {
        return res.status(422).json({ msg: 'Localização é obrigatória!' });
      }

      const { state, city, address } = location;

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

      if (!name) {
        return res.status(422).json({ msg: 'Nome é obrigatório!' });
      }

      if (!state) {
        return res.status(422).json({ msg: 'Estado é obrigatório!' });
      }

      if (!city) {
        return res.status(422).json({ msg: 'Cidade é obrigatória!' });
      }

      if (!address) {
        return res.status(422).json({ msg: 'Endereço é obrigatório!' });
      }

      if (!type) {
        return res.status(422).json({ msg: 'Tipo é obrigatório!' });
      }

      if (!cnpj) {
        return res.status(422).json({ msg: 'CNPJ é obrigatório!' });
      }

      const institutionExists = await Institution.findOne({ email });
      const donorExists = await Donor.findOne({ email });

      if (institutionExists || donorExists) {
        return res
          .status(422)
          .json({ msg: 'Já existe um usuário com esse email!' });
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const institution = await Institution.create({
        email,
        password: passwordHash,
        name,
        location,
        type,
        cnpj,
      });

      return res.status(200).json(institution);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  async getInstitution(req, res) {
    try {
      const fields = handleFields(req.query);
      const { types } = req.query;
      const newTypes = types || ['beneficente', 'instituto', 'ong'];

      const institutions = await Institution.find({
        ...fields,
        type: { $in: newTypes },
      }).select('-tokens -password');

      return res.json(institutions);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  async getInstitutionById(req, res) {
    try {
      const { id } = req.params;
      const institution = await Institution.findById(id);

      if (!institution) {
        return res.status(404).json({ msg: 'Instituição não encontrada!' });
      }

      const publications = await Publication.find({ idInstitution: id }).sort(
        '-createdAt'
      );

      return res.status(200).json({ institution, publications });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  async updateInstitution(req, res) {
    try {
      const { body, params } = req;
      const { id } = params;

      const update = updateBody(body);

      const updatedInstitution = await Institution.findOneAndUpdate(
        { _id: id },
        update,
        {
          new: true,
        }
      );

      if (!updatedInstitution) {
        return res.status(404).json({ msg: 'Instituição não encontrada!' });
      }

      updatedInstitution.save();
      return res.status(200).json(updatedInstitution);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  async updateImage(req, res) {
    try {
      const { params, file } = req;
      const { id } = params;

      if (!file) {
        return res.status(406).send({ message: 'Insira uma imagem' });
      }

      const institution = await Institution.findById(id);

      if (!institution) {
        return res.status(404).json({ msg: 'Instituição não encontrada!' });
      }

      institution.coverImage = file.location;

      await institution.save();

      return res.status(200).json(institution);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  async updateLogo(req, res) {
    try {
      const { params, file } = req;
      const { id } = params;

      if (!file) {
        return res.status(406).send({ message: 'Insira uma imagem' });
      }

      const institution = await Institution.findById(id);

      if (!institution) {
        return res.status(404).json({ msg: 'Instituição não encontrada!' });
      }

      institution.logoImage = file.location;

      await institution.save();

      return res.status(200).json(institution);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};

const handleFields = (fields) => {
  const fieldsHandle = {};
  if (fields.name != '' && fields.name) {
    fieldsHandle['name'] = new RegExp('\\b.*' + fields.name + '.*\\b', 'i');
  }

  if (fields.city != '' && fields.city) {
    fieldsHandle['location.city'] = new RegExp(
      '\\b.*' + fields.city + '.*\\b',
      'i'
    );
  }

  if (fields.state != '' && fields.state) {
    fieldsHandle['location.state'] = new RegExp(
      '\\b.*' + fields.state + '.*\\b',
      'i'
    );
  }

  return fieldsHandle;
};

const updateBody = (body) => {
  const { email, name, description, location, donationData, type, cnpj } = body;
  const update = {};

  if (email) {
    update.email = email;
  }

  if (name) {
    update.name = name;
  }

  if (description !== undefined) {
    update.description = description;
  }

  if (location) {
    const { state, city, address } = location;
    if (state && city && address) {
      update.location = location;
    }
  }

  if (donationData) {
    const { pix, bankData } = donationData;
    const newDonationData = {};

    if (pix) {
      newDonationData.pix = pix;
    }

    if (bankData) {
      const { bank, branch, account } = bankData;

      if (bank && branch && account) {
        newDonationData.bankData = bankData;
      }
    }

    update.donationData = newDonationData;
  }

  if (type) {
    update.type = type;
  }

  if (cnpj) {
    update.cnpj = cnpj;
  }

  return update;
};
