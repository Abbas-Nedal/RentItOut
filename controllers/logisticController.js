const Logistic = require('../models/Logistic');
const Rental = require('../models/Rental');

exports.createLogistic = async (req, res) => {
    // From abbas
    /* This code is responsible for the delivery information.
     Make sure here that it will not be able to add more
      than one delivery for the same order (it doesn't make sense at all)
     */
    try {
        const { rental_id, pickup_location, delivery_option, delivery_fee } = req.body;//data form Req(in body)

        const rental = await Rental.findByPk(rental_id);

        if (!rental) {  // if not exist any  rental has  a rental_id
            return res.status(404).json({ error: 'Rental not found.' });
        }

        const existingLogistic = await Logistic.findOne({
            where: { rental_id }
        });

        if (existingLogistic) {
            return res.status(400).json({ error: 'Logistic information already exists for this rental.' });
        }

        const logistic = await Logistic.create({
            rental_id,
            pickup_location,
            delivery_option,
            delivery_fee
        });

        res.status(201).json(logistic);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create logistic information.' });
    }
};

exports.updateLogistic = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const { pickup_location, delivery_option, delivery_fee } = req.body;

        const logistic = await Logistic.findOne({ where: { rental_id } });

        if (!logistic) {
            return res.status(404).json({ error: 'Logistic not found for this rental.' });
        }

        logistic.pickup_location = pickup_location || logistic.pickup_location;
        logistic.delivery_option = delivery_option || logistic.delivery_option;
        logistic.delivery_fee = delivery_fee || logistic.delivery_fee;

        await logistic.save();

        res.status(200).json(logistic);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update logistic information.' });
    }
};

exports.deleteLogistic = async (req, res) => {
    try {
        const { rental_id } = req.params;

        const logistic = await Logistic.findOne({ where: { rental_id } });

        if (!logistic) {
            return res.status(404).json({ error: 'Logistic not found for this rental.' });
        }

        await logistic.destroy();
        res.status(200).json({ message: 'Logistic deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete logistic information.' });
    }
};

exports.getLogisticsByRental = async (req, res) => {
    try {
        const { rental_id } = req.params;

        const logistics = await Logistic.findAll({
            where: { rental_id }
        });

        res.status(200).json(logistics);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch logistics.' });
    }
};
