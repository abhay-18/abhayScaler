const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
    start: {
        type: Date,
        required :true 
    },
    end: {
        type: Date,
        required : true 
    },
    participants: [{
        type:String
    }]
})

const Interview = mongoose.model('Interview', interviewSchema)
module.exports = Interview