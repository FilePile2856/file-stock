const mongoose = require('mongoose');

mongoose.connect('mongodb://64.110.67.70:3000/economy', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB");
    //db.collection('test').insertOne( { 제목 : '제목', 날짜 : '날짜' } , function(){
    //  console.log('저장완료'); 
    //});
});
const user = 'filepile'
db.collection('stocks').find().toArray().then(result => {
  console.log(result)
});
