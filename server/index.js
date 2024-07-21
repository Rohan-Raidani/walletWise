const express = require('express');
const cors = require('cors');
const port = process.env.port || 8000;

const dotenv = require('dotenv')
dotenv.config()


const db = require('./config/mongoose')
const Wallet = require('./models/wallet')


const app =  express();

app.use(cors());
app.use(express.json());

// get all transactions
app.get('/', async (req, res) => {
    try {
      const wallet = await Wallet.find();
      res.json(wallet);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Add a new one
  app.post('/', async (req, res) => {
    const wallet = new Wallet({
      money: req.body.money,
      type: req.body.type,
    });
  
    try {
      const newWallet = await wallet.save();
      res.status(201).json(newWallet);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// Delete a transaction
app.delete('/:id', async (req, res) => {
  try {
    const result = await Wallet.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
})
