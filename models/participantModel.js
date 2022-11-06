const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participant = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    time: [{
        start: {
            type: Date,
            required: true,

        },
        end: {
            type: Date,
            required: true,
        }
    }]
})

const Participant = mongoose.model('Participant', participant);

module.exports = Participant;