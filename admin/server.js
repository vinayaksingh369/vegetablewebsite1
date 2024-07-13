const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MySQL database
const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define a model for vegetables
const Vegetable = sequelize.define('Vegetable', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

// Synchronize the model with the database
sequelize.sync()
    .then(() => {
        console.log('Database and tables created!');
    })
    .catch(err => console.error('Error syncing database:', err));

// Routes
app.get('/vegetables', async (req, res) => {
    const vegetables = await Vegetable.findAll();
    res.json(vegetables);
});

app.post('/vegetables', async (req, res) => {
    const { name, price } = req.body;
    try {
        const vegetable = await Vegetable.create({ name, price });
        res.json(vegetable);
    } catch (err) {
        res.status(400).json({ error: 'Error creating vegetable' });
    }
});

app.put('/vegetables/:id', async (req, res) => {
    const vegetableId = req.params.id;
    const { name, price } = req.body;
    try {
        let vegetable = await Vegetable.findByPk(vegetableId);
        if (!vegetable) {
            return res.status(404).json({ error: 'Vegetable not found' });
        }
        vegetable.name = name;
        vegetable.price = price;
        await vegetable.save();
        res.json(vegetable);
    } catch (err) {
        res.status(400).json({ error: 'Error updating vegetable' });
    }
});

app.delete('/vegetables/:id', async (req, res) => {
    const vegetableId = req.params.id;
    try {
        await Vegetable.destroy({ where: { id: vegetableId } });
        res.json({ message: 'Vegetable deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting vegetable' });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
