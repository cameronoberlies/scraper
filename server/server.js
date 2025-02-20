const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let vehicles = []; // Temporary storage (use a database like MongoDB for production)

app.post('/api/vehicles', (req, res) => {
  const vehicleData = req.body;
  vehicles.push(vehicleData);
  console.log('Received vehicle data:', vehicleData);
  res.status(200).send('Data received');
});

app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.listen(3000, () => console.log('Server running on port 3000'));