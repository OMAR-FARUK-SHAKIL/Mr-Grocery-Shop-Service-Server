const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 4000;




const uri = "mongodb+srv://emaWatson:emawatson81@cluster0.wj6rs.mongodb.net/emaJohnStore?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//  console.log(process.env.DB_USER,process.env.DB_USER,process.env.DB_NAME,process.env.DB_COLLECTION_NAME);

client.connect(err => {
  const productsCollection = client.db('emaJohnStore').collection('products');
  const ordersCollection = client.db('emaJohnStore').collection('orders');
  const records = client.db('emaJohnStore').collection('records');
  console.log('DB connected');


  app.post('/addProduct',(req, res) => {
      const product = req.body;
      // console.log("new product in server",product);
      res.send('addProduct active');
      ordersCollection.insertOne(product)
      .then(result =>{
          // console.log('adding = ',result);
          res.send(result.insertedCount>0);
      })
      .catch(err =>{console.log(err)})
  })


  app.post("/placeOrder", (req, res) => {
    const newRecord = req.body;
    // console.log(newBooking);
    records.insertOne(newRecord).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });


  app.get('/products',(req, res) => {
    ordersCollection.find({})
    .toArray((err,documents) =>{
      res.send(documents);
    })
  })



  app.get('/product/:key',(req, res) => {
      // console.log("key in server",req.params.key);
      // const key = req.params.key;      
      ordersCollection.find({_id:ObjectId(req.params.key)})          
      .toArray((err,documents) =>{
        // console.log("find",documents);
        res.send(documents[0]);
      })
  })
    // res.send('The back end is running...')


app.post('/productByKeys',(req, res)=>{
  const productKeys = req.body;
  productCollection.find({key:{$in: productKeys}})
  .toArray((err,documents) =>{
    res.send(documents);
  })
})


  app.get('/',(req, res) => {
      res.send('The back end is running...')
  })


  app.get("/bookings", (req, res) => {
        
            records.find({ email: req.query.email })
            .toArray((err, documents) => {
              res.send(documents);
              // console.log(documents);
            });

  });




  app.post('/addOrder',(req, res) => {
    const order = req.body;
    // console.log(order);
    ordersCollection.insertOne(order)
    .then(result =>{
        res.send(result.insertedCount > 0 );
    })
    .catch(err =>{console.log(err)})
})

});


app.delete('/delete/:id',(req, res) => {
  console.log(req.params.id);
  ordersCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result) =>{
      // console.log(result);
     res.send(result.deletedCount>0) ;
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})