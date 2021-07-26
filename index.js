const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');


const settingsBill = SettingsBill();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals()
    });
});
app.get('/actions', function (req, res) {
    res.render('actions', {settings: settingsBill.actions()});
});
app.get('/actions/:type', function (req, res) {
   res.send('Settings Bill App')
});
app.post('/settings', function (req, res) {

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel

    });
    console.log(settingsBill.getSettings());
    res.redirect('/');

});
app.post('/action', function (req, res) {
    //capture the call type to add
    settingsBill.recordAction(req.body.actionType);
    res.redirect('/');

});
const PORT = process.env.PORT || 3011;
app.listen(PORT, function () {
    console.log('App started at port:', PORT);
});
app.locals.layout = false;
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


