const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Pool = require('pg').Pool


const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CO2_Emmission',
  password: 'root',
  port: 5432,
})


var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/api", (req, res) => {
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    pool.query(`SELECT * 
        FROM 
            co2_emission_analytics.shipments AS s
        INNER JOIN co2_emission_analytics.shipment_co2_emissions AS em
        ON s.id = em.shipment_id
        WHERE pickup_time >= $1 AND dropoff_time <= $2`, [startDate, endDate], (error, results) => {
            
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      })
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});