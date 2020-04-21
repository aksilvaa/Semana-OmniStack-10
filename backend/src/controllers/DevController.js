const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');


module.exports = {
    // index -- Listar Devs
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs)
    },

    // store -- Cadastrar Dev
    async store(request, response) {
        // Desestruturando Objeto do request.body:
        const { github_username, techs, latitude, longitude } = request.body;

        // Procura uma ocorrência do nome do git_hub no banco e retona uma instância.
        let dev = await Dev.findOne({ github_username });

        if (!dev) {

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            // Desestruturando Objeto do response github api:
            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })


        }

        return response.json({ dev });
    },

    async read(request, response) {
        const { github_username } = request.params;
        const dev = await Dev.findOne({ github_username });

        return response.json(dev === null ? {} : dev);
    },

    async update(request, response) {
        const { github_username } = request.params;
        const dev = await Dev.findOne({ github_username });
        const { latitude, longitude, techs, ...rest } = request.body;
        rest.github_username = github_username;
        if (latitude && longitude)
            var newLocation = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        if (techs)
            var techsArray = parseStringAsArray(techs);
        const newDev = await Dev.updateOne({ github_username }, {
            location: (latitude && longitude) ? newLocation : dev.location,
            techs: techs ? techsArray : dev.techs,
            ...rest
        });

        return response.json({
            modifiedCount: newDev.nModified,
            ok: newDev.ok
        });
    },
    async destroy(request, response) {

        const { github_username } = request.params;
        await Dev.deleteOne({ github_username });
        return response.json(`Usuário ${github_username} deletado`);

    }
}