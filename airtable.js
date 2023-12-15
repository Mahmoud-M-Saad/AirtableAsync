const axios = require('axios');
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
// const sequelizeConfig = require('./sequelize.config'); // Adjust the path as needed
const sequelize = require('./configuration');


// // Initialize Sequelize
// const sequelize = new Sequelize(sequelizeConfig.development);

// Import models
// const User = require('./models/user')(sequelize, Sequelize);

require('dotenv').config();
const baseId = process.env.baseId;
const tableIdOrName = process.env.tableIdOrName;
const accessToken = process.env.accessToken;

//! MSaad: Getting All Airtable Fileds ID Function 
async function gettingFiledsID() {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // console.log(response.data.tables[0].fields);
    return response.data.tables[0].fields;
  } catch (error) {
    console.error('Error making API request:', error.message);
  }
}

const axiosReq = axios.create({
  //https://api.airtable.com/v0/meta/bases/{baseId}/tables
  // baseURL: `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`,
  // baseURL: `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
  baseURL: `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  params: {
    view: '',
    // returnFieldsByFieldId: true,
  }
});

// const IDsFormDB = ['rec1oki9kt4Kubfon', 'fgh', 'recFcNcs4Fp5ihFQ4'];

// app.get('/test', (req, res) => {
//   const results = [];
//   axiosReq.get('/')
//     .then(response => {
//       for (let i = 0; i < response.data.tables.length; i++) {
//         if (response.data.tables[i].id === tableIdOrName) {
//           const fieldsArray = response.data.tables[i].fields;

//           const map = [];
//           //Transform fields array into a new object with name as key and id as value
//           fieldsArray.forEach(field => {
//             map.push({ name: field.name, id: field.id })
//           });
//           // Send the mappedFields as JSON response
//           res.json(map);
//         }
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     });
// });

app.get('/test', (req, res) => {
  const results = [];
  axiosReq.get('/')
    .then(response => {
      for (let i = 0; i < response.data.records.length; i++) {
        findAndDeleteRecordById(response.data.records[i].id);
        results.push(response.data.records[i].id);
      };
    })
    .catch(error => {
      console.error('Error making Airtable request:', error.message);
    });
})

const findAndDeleteRecordById = async (id) => {
  try {
    const [results, metadata] = await sequelize.query(`SELECT * FROM masterdata WHERE id = :id`, {
      replacements: { id: id },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      const deletedRows = await sequelize.query(`DELETE FROM masterdata WHERE id = :id`, {
        replacements: { id: id },
        type: Sequelize.QueryTypes.DELETE,
      });

      console.log(`Deleted ${deletedRows[0]} record(s)`);
    } else {
      console.log('Record not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// const insertMultipleRecords = async (records) => {
//   try {
//     const values = records.map(record => `(${Object.values(record).map(value => sequelize.escape(value)).join(', ')})`).join(', ');

//     const [result, metadata] = await sequelize.query(`INSERT INTO masterdata (${Object.keys(records[0]).join(', ')}) VALUES ${values}`);

//     console.log(`Inserted ${result.affectedRows} record(s)`);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// };

async function createUser(username, email) {
  try {
    const newUser = await User.create({
      username: username,
      number: email,
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`App Running!`);
  });
});