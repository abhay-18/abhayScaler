const express = require('express');
const app = express();
const Participant = require('./models/participantModel');
const Interview = require('./models/interviewModel');
const mongoose = require('mongoose');

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://avj:mongodb18@nodetut.antqcld.mongodb.net/abhayScaler?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(3000);
        console.log("DB Connection Successful!");
    })
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/createInterview', async (req, res) => {
    const part = await Participant.find();
    res.render('createInterview', {
        isError: false,
        participants: part
    })
});

const showErrorMessage = (_isError, _errorMessage, res) => {
    const isError = _isError;
    const errorMessage = _errorMessage;
    res.render('createInterview', {
        isError, errorMessage,
        participants: part
    })
}

app.post('/createInterview', async (req, res) => {
    const part = await Participant.find();
    const start = req.body["start-time"];
    const end = req.body["end-time"];
    const participants = req.body["participants"];
    let isError = false;
    let flag = false;
    let flag1 = false;
    let flag2 = false;
    // if(participants.length < 2){
    // res.send("No. of participants is less than 2");

    // res.redirect("/createInterview")
    // errorMessage="No. of participants is less than 2";
    // isError = true;
    // res.render('createInterview', {isError, errorMessage,
    //     participants:part})
    // }
    console.log(participants.length);
    for (let i = 0; i < participants.length; i++) {
        const ele = participants[i];
        const usr = (await Participant.find({ id: ele }))[0]
        if (usr.role == "interviewer") {
            flag1 = true;
        }
        else if (usr.role == "interviewee") {
            flag2 = true;
        }
        const time = usr.time || [];
        for (let j = 0; j < time.length; j++) {
            const usrStart = time.start;
            const usrEnd = time.end;
//             console.log(ele)
// console.log(usrStart, usrEnd);
// console.log(start, end);
            //start, end,  usrStart, usrEnd
            if (!(usrStart < usrEnd && usrEnd < start)) {
                flag = true;
            }
            if (!(usrStart > end && usrEnd > usrStart)) {
                flag = true;
            }
        }
    }
    if (flag1 == false || flag2 == false) {
        const isError = true;
        const errorMessage = "Participants are less than 2";
        showErrorMessage(isError, errorMessage, res);

    }

    else if (flag == true) {
        const isError = true;
        const errorMessage = "Participants are not available at the selected time";
        showErrorMessage(isError, errorMessage, res);
    }
    else {

        const newInterview = await Interview.create({
            start: start,
            end: end,
            participants: participants
        })
        for(let i=0; i<participants.length; i++)
        {
            const ele = participants[i];
            const user = await Participant.find({id:ele});
            user.time.push({
                start:start,
                end:end
            })
        }

        res.status(200).send(newInterview)

    }

})


app.listen(4242);