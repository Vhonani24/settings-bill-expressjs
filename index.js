const express = require('express');
const app = express();
const exphbs = require('express-handlebars');


const SettingsBill = require('./settings-bill');


const settingsBill = SettingsBill();
app.engine('handlebars', exphbs({ layoutsDir: 'views/layouts/' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.get('/', function (req, res) {
    let setClassName = '';
    
    if(settingsBill.hasReachedWarningLevel()){
        setClassName = 'warning'
    }
    if(settingsBill.hasReachedCriticalLevel()){
        setClassName = 'danger'
        
    }
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        setClassNames: setClassName
        
       


    });
});
app.get('/actions', function (req, res) {
    res.render('actions', {actions: settingsBill.actions()});
});
app.get('/actions/:actionType', function (req, res) {
    const actionType = req.params.actionType;
    res.render('actions', {actions: settingsBill.actionsFor(actionType)});
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

