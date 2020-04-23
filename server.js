require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');

const arrayGamesName = 'משחק לדוגמא';
const arrayGamesQuestions = {
    question: "זוהי שאלה לדוגמא. בחר באחת מהתשובות.",
    answer1: "תשובה 1",
    answer2: "תשובה 2",
    answer3: "תשובה 3",
    answer4: "תשובה 4",
    correctAns: 1
};

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/snakesAndLadders', { useNewUrlParser: true, useUnifiedTopology: true });

const questionSchema = new mongoose.Schema({
    question: String,
    answer1: String,
    answer2: String,
    answer3: String,
    answer4: String,
    correctAns: Number
});

const Question = mongoose.model('Question', questionSchema);

const subjectSchema = new mongoose.Schema({
    name: String,
    questions: [questionSchema]
});

const Subject = mongoose.model('Subject', subjectSchema);

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'public', 'loadPage.html'));
});

// app.get('/createNew', (req, res) => {
//     res.render('createNew.ejs', { gameName: "", questions: [], gameId: "" });
// });

app.get('/chooseGame', (req, res) => {
    Subject.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            //the collection is empty, add our default items!
            const exampleSubject = new Subject({
                name: arrayGamesName,
                questions: arrayGamesQuestions
            })
            exampleSubject.save();
            res.redirect('/chooseGame');
        } else {
            res.render('chooseGame.ejs', { games: foundItems });
        }
    });
});

app.get("/password", (req, res) => {
    res.render('enterPassword.ejs', { error: "" });
});

app.post("/password", (req, res) => {
    if (req.body.password === process.env.PASSWORD) {
        res.render('createNew.ejs', { gameName: "", questions: [], gameId: "" });
        // res.redirect("/createNew");
    } else {
        res.render('enterPassword.ejs', { error: "סיסמא שגויה" });
    }
});

app.get('/:game', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.get('/api/subjects/:gameId', async (req, res) => {
    let gameName = await Subject.findOne({ _id: req.params.gameId });
    return res.status(200).send(gameName);
});

app.post('/createNew', (req, res) => {
    const subjectName = req.body.gameName;

    const newQuestion = new Question({
        question: req.body.question,
        answer1: req.body.ans1,
        answer2: req.body.ans2,
        answer3: req.body.ans3,
        answer4: req.body.ans4,
        correctAns: req.body.inlineRadioOptions
    });

    Subject.findOne({ name: subjectName }, function (err, foundSubject) {
        if (foundSubject === null) { //the subject doesnt exist yet
            const newSubject = new Subject({
                name: subjectName,
                questions: newQuestion
            });
            newSubject.save();
            res.render('createNew.ejs', { gameName: subjectName, questions: newSubject.questions, gameId: newSubject.id });
        } else {
            foundSubject.questions.push(newQuestion);
            foundSubject.save();
            res.render('createNew.ejs', { gameName: subjectName, questions: foundSubject.questions, gameId: foundSubject.id });
        }
    });
});

app.post('/delete', (req, res) => {
    const game = req.body.gameName;
    const questionToDelete = req.body.deleteButton;
    Subject.findOne({ name: game }, function (err, foundSubject) {
        foundSubject.questions = foundSubject.questions.filter(x => x.id !== questionToDelete);
        console.log(foundSubject);
        foundSubject.save();
        res.render('createNew.ejs', { gameName: game, questions: foundSubject.questions, gameId: foundSubject.id });
    });
});

app.listen(port);