
const Dev = require('../models/Dev');
const parseStringAsArray = require('../Utils/parseStringAsArray');

module.exports = {
  async index(req, res) {

    const { latitude, longitude, techs, max_distance } = req.query;
    const techsArray = parseStringAsArray(techs);
    console.log(techsArray);
    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          // in meters
          $maxDistance: max_distance * 1000,
        }
      }
    });

    return res.json(devs);
  }
}
