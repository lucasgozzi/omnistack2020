
const Dev = require('../models/Dev');
const parseStringAsArray = require('../Utils/parseStringAsArray');

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();
        return res.json(devs);
    },
    async destroy(req, res) {
        const { id } = req.params;
        let dev = null;
        try {
            dev = await Dev.findOne({ _id: id });
        }
        catch (e) {
            return res.status(404).json({ message: 'Dev not Found' });
        }
        try {
            await Dev.deleteOne({ _id: id });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'An unexpected error has occurred' });
        }

        return res.status(200).json({ message: "Success! =)" });
    },
    async update(req, res) {
        const { id } = req.params;
        let dev = null;
        try {
            dev = await Dev.findOne({ _id: id });
            if (!dev) {
                return res.status(404).json({ message: 'Dev not Found' });
            }
        }
        catch (e) {
            return res.status(404).json({ message: 'Dev not Found' });
        }
        const { techs, name, avatar_url, latitude, longitude } = req.body;

        const techsArray = parseStringAsArray(techs);// techs.split(',').map(tech => tech.trim());
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }

        dev.name = name;
        dev.techs = techsArray;
        dev.location = location;
        dev.avatar_url = avatar_url;
        try {
            await Dev.update(dev);
        }
        catch (e) {
            return res.status(500).json({ message: 'An unexpected error has occurred' });
        }
        return res.json(dev);
    },
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;

        const dev = await Dev.findOne({ github_username });

        if (!dev) {
            const githubResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            let { name = login, avatar_url, bio } = githubResponse.data;
            if (!name) {
                name = githubResponse.data.login;
            }

            const techsArray = parseStringAsArray(techs);// techs.split(',').map(tech => tech.trim());
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }

        return res.json(dev);
    }
}