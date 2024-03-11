const mongoose = require('mongoose');
const express = require('express');
const app = express();
const axios = require('axios');
const Stock = require('./models/stock');
const User = require('./models/user');
const user = require('./models/user');
const PORT = process.env.PORT || 8443;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://', {useNewUrlParser: true, useUnifiedTopology: true});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DB");
  //db.collection('test').insertOne( { 제목 : '제목', 날짜 : '날짜' } , function(){
  //  console.log('저장완료'); 
  //});
});

// Your API key for accessing stock prices (replace with your API key)


// Define routes

// Display the main page
app.get('/', async (req, res) => {
  const stocks = await Stock.find();
  res.render('index', { stocks });
});

// Show the purchase form
app.get('/purchase', (req, res) => {
  
  res.render('purchase');
});

// Handle stock purchase
app.post('/purchase', async (req, res) => {
  const { user ,name, amount } = req.body;
  // Use your stock price API to get the current stock price
  axios.get(`https://api.tiingo.com/tiingo/daily/${name}/prices?token=`)
  .then(response => {
    const price = response.data[0].close;
    db.collection('users').findOne({ user: user }).then(result => {
      const userBalance = result.balance;
      const totalCost = price * amount;
      const updatedBalance = userBalance - totalCost;
      console.log(name);
      if (updatedBalance >= 0) {
        db.collection('stocks').insertOne({ name, amount, totalCost, user });
        db.collection('users').updateOne({ user: user }, { $set: { balance: updatedBalance }, $push: { stocks: { name, amount, totalCost } } });
        db.collection(user).updateOne({ name: name }, { $inc: { amount: parseInt(amount), totalCost: parseInt(totalCost) }});
        console.log(amount);
        console.log(totalCost);
        res.redirect('/');
      } else {
        res.send('Insufficient funds.');
      }
    });
    //const userBalance = 1000000;

    
  })
  .catch(error => {
    console.error(error);
  });
});

app.get('/sell', (req, res) => {
  res.render('sell');
});

app.post('/sell', async (req, res) => {
  const { user, name, amount } = req.body;

  // Use your stock price API to get the current stock price
  axios.get(`https://api.tiingo.com/tiingo/daily/${name}/prices?token=`)
  .then(response => {
    var price = response.data[0].close;
    db.collection('users').findOne({ user: user }).then(result => {
      var userBalance = result.balance;
      db.collection('stocks').findOne({ user: user }).then(result => {
        var lastPrice = result.totalCost/result.amount;
      
        var earned = price - lastPrice;
        
        var totalCost = price * amount;
        var updatedBalance = userBalance + earned;
        if (updatedBalance >= 0) {
          db.collection('stocks').insertOne({ name, amount, totalCost, user });
          db.collection('users').updateOne({ user: user }, { $set: { balance: updatedBalance }, $push: { stocks: { name, amount, totalCost } } });
          db.collection(user).updateOne({ name: name }, { $inc: { amount: -1 * parseInt(amount), totalCost: totalCost }});
          res.redirect('/');
        } else {
          res.send('Insufficient funds.');
        }
    });
  });
  })
  .catch(error => {
    console.error(error);
  });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { user, pw } = req.body;
    db.collection('users').insertOne({ user, pw, balance: 1000});
    db.collection(user).insertOne({ name: 'Dow Jones', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'S&P 500', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'AAPL', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'BA', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'BRK-B', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'DIS', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'GE', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'HD', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'NKE', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'SBUX', amount: 0, totalCost: 0});
    db.collection(user).insertOne({ name: 'NVDA', amount: 0, totalCost: 0});
    res.redirect('/');

    }
);

app.get('/check', (req, res) => {
  res.render('check');
}
);

app.post('/check', async (req, res) => {
  const { user } = req.body;
  console.log(user);
  db.collection('users').findOne({ user: user }).then(result => {
    const userBalance = result.balance;
    res.render('check_result.ejs', { data: userBalance });
    console.log(userBalance);
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
