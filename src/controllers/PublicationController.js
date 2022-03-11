const Publication = require('../models/Publication');
const Institution = require('../models/Institution');

module.exports = {
  async add(req, res) {
    const { title, description, idInstitution } = req.body;
    const { files } = req;

    if (!title) {
      return res.status(422).json({ msg: 'Título é obrigatório!' });
    }

    if (!description) {
      return res.status(422).json({ msg: 'Descrição é obrigatória!' });
    }

    if (!files) {
      return res.status(422).json({ msg: 'Imagem é obrigatória!' });
    }

    if (!idInstitution) {
      return res.status(422).json({ msg: 'Id da instituição é obrigatório!' });
    }

    try {
      const institution = await Institution.findById(idInstitution);

      if (!institution) {
        return res.status(404).json({ msg: 'Instituição não encontrada!' });
      }

      const newImages = files.map((file) => file.location);
      console.log(newImages);

      const publication = await Publication.create({
        title,
        description,
        images: newImages,
        idInstitution,
        nameInstitution: institution.name,
        typeInstitution: institution.type,
      });

      return res.status(200).json(publication);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  async getPublication(req, res) {
    try {
      const publications = await Publication.find();
      return res.json(publications);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  async getPublicationById(req, res) {
    try {
      const { id } = req.params;
      const publication = await Publication.findById(id);

      if (!publication) {
        return res.status(404).json({ msg: 'Publicação não encontrada!' });
      }

      return res.json(publication);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  async updatePublication(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        return res.status(422).json({ msg: 'Título é obrigatório!' });
      }

      if (!description) {
        return res.status(422).json({ msg: 'Descrição é obrigatória!' });
      }

      const update = { title, description };

      const updatedPublication = await Publication.findOneAndUpdate(
        { _id: id },
        update,
        {
          new: true,
        }
      );

      if (!updatedPublication) {
        return res.status(404).json({ msg: 'Publicação não encontrada!' });
      }

      await updatedPublication.save();

      return res.json(updatedPublication);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },

  async deletePublication(req, res) {
    try {
      const { id } = req.params;

      await Publication.findOneAndDelete({ _id: id });

      return res.status(200).json({ msg: 'Publicação removida com sucesso!' });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};
