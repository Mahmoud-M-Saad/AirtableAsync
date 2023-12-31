const axios = require('axios');
const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
// const sequelizeConfig = require('./sequelize.config'); // Adjust the path as needed
const sequelize = require('./configuration');

const { fields } = require('./matchFields');

// console.log(fields);

// // Initialize Sequelize
// const sequelize = new Sequelize(sequelizeConfig.development);

// Import models
// const User = require('./models/user')(sequelize, Sequelize);

require('dotenv').config();
const baseId = process.env.baseId;
const tableIdOrName = process.env.tableIdOrName;
// const viewIdOrName = process.env.viewIdOrName;
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
    returnFieldsByFieldId: true,
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

//           // const map = [];
//           // //Transform fields array into a new object with name as key and id as value
//           // fieldsArray.forEach(field => {
//           //   map.push({ name: field.name, id: field.id })
//           // });
//           // Send the mappedFields as JSON response
//           const map = {};
//           //Transform fields array into a new object with name as key and id as value
//           fieldsArray.forEach(field => {
//             map[field.id] = field.name;
//           });
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
  // const results = [];
  // axiosReq.get('/')
  //   .then(response => {
  //     console.log(response.data.offset);
  //     // for (let i = 0; i < response.data.records.length; i++) {
  //     //   findAndDeleteRecordById(response.data.records[i].id);
  //     //   results.push(response.data.records[i].id);
  //     // };
  //   })
  //   .catch(error => {
  //     console.error('Error making Airtable request:', error.message);
  //   });

  // findAndDeleteRecordById('6f7fdb36-9d9c-11ee-b760-40b03410791r').then(() => {
  //   res.send('Deleted');
  // }).catch(error => {
  //   console.error('Error making Airtable request:', error.message);
  // });

  // insertRecord(
  //   // {
  //   //   "GPS/Billing Company:": "Techtronics",
  //   //   "Customer Name:": "Tech Solutions Inc.",
  //   //   "My Notes (editable)": "Installation instructions received.",
  //   //   "Work Order:": "WO-12345",
  //   //   "PO/Case/WO:": "PO-6789",
  //   //   "Job Type:": "Maintenance",
  //   //   "Asset ID:": 9876543,
  //   //   "Asset ID Pic:": "asset_pic.jpg",
  //   //   "Asset Type:": "Vehicle",
  //   //   "Date:": "11/10/2023",
  //   //   "Time:": "10:30 AM",
  //   //   "Scheduler:": "John Doe",
  //   //   "Tech:": "Emily Smith",
  //   //   "All Notes:": "Customer requested additional information.",
  //   //   "PDF:": "maintenance_instructions.pdf",
  //   //   "Address:": "Tech Solutions Inc. - 456 Tech Lane, 90210 Techville, CA, USA",
  //   //   "Pic of VIN": "vin_pic.jpg",
  //   //   "VIN:": "ABC123XYZ456",
  //   //   "Year:": "2020",
  //   //   "Make:": "Toyota",
  //   //   "Model:": "Camry",
  //   //   "Odometer:": "30,000 miles",
  //   //   "Hours:": "120 hours",
  //   //   "GPS SN:": "T9876",
  //   //   "Camera SN:": "C5432",
  //   //   "Removed GPS SN:": "",
  //   //   "Removed Camera SN:": "",
  //   //   "Add-On Type:": "Temperature Sensor",
  //   //   "Add-On SN:": "TS7890",
  //   //   "2nd Add-On Type:": "",
  //   //   "2nd Add-On SN:": "",
  //   //   "Removed  Add-On SN:": "",
  //   //   "Removed 2nd Add-On SN:": "",
  //   //   "DE RE De Asset Label:": "AssetLabel-123",
  //   //   "DE RE De Asset VIN:": "DE-XYZ-789",
  //   //   "GPS Model:": "Model-X",
  //   //   "GPS Wiring:": "Connected",
  //   //   "Camera Wiring:": "Not Applicable",
  //   //   "Add-On Wiring:": "Connected",
  //   //   "2nd Add-On Wiring:": "",
  //   //   "Removals w/ Install": "No",
  //   //   "Removed Company:": "",
  //   //   "GPS Verification:": "Verified",
  //   //   "Camera Verification": "Not Applicable",
  //   //   "Add On Verification": "Verified",
  //   //   "2nd Add On Verification": "",
  //   //   "Reason for Service": "Routine Maintenance",
  //   //   "Tampering Pic:": "tampering_pic.jpg",
  //   //   "Job Report?": "Yes",
  //   //   "Job Report Reason:": "Completed successfully",
  //   //   "Job Report Fault:": "",
  //   //   "Time Lost:": "0 hours",
  //   //   "Explanation:": "Routine maintenance performed as scheduled.",
  //   //   "State:": "CA",
  //   //   "Site Contact:": "Mr. Tech Manager",
  //   //   "Not Dispatched Screenshot:": "",
  //   //   "Asset Damage?": "No",
  //   //   "GPS Location:": "34.0522° N, 118.2437° W",
  //   //   "ID": "",
  //   //   "Submission No.": "",
  //   //   "App Name": "TechTrack",
  //   //   "Record Time": "11/11/2023 14:45",
  //   //   "Customer Email": "customer@example.com",
  //   //   "Tech Email": "tech@example.com",
  //   //   "Emailyesno": "Yes",
  //   //   "Jobsheet": "maintenance_jobsheet.pdf",
  //   //   "SubmissionID": "193508056",
  //   //   "EditDetect": "",
  //   //   "JSON Full Record": "",
  //   //   "Comparison": "",
  //   //   "Removed Add-On": "",
  //   //   "Removed 2nd Add-On": "",
  //   //   "Pin/Password": "1234",
  //   //   "Files/Attachments": "maintenance_report.doc",
  //   //   "WO Notes:": "No additional notes.",
  //   //   "License Plate": "TECH-123",
  //   //   "Check": "",
  //   //   "Sked Email": "scheduled@example.com",
  //   //   "Replaced Harness": "Yes",
  //   //   "Pic of GPS Serial": "gps_serial_pic.jpg",
  //   //   "Pic of Camera Serial": "",
  //   //   "Last Modified": "11/11/2023 16:30",
  //   //   "Trip Fee": "$50",
  //   //   "Additional Serial Numbers": "Serial-1: 12345, Serial-2: 67890",
  //   //   "Share Files": "https://web.techsolutions.com/file123",
  //   //   "Asset ID": "",
  //   //   "Day Rate": "$150",
  //   //   "Billing Category": "Maintenance",
  //   //   "Field 89": "",
  //   //   "Billing Customer Record": "Tech Solutions Inc. - 987",
  //   //   "Billing Type": "Credit Card",
  //   //   "Billing Info": "**** **** **** 1234",
  //   //   "Billing Customer Name": "Tech Solutions Inc.",
  //   //   "airtableId": "7a1a2c10-9d9c-11ee-b760-40b03410791s"
  //   // }
  //   {
  //     airtableId: 'rec00zAxGmxHNvlyU',
  //     // createdTime: '2023-12-15T14:44:01.000Z',
  //     'GPS/Billing Company:': 'DarPro',
  //     'Customer Name:': '8632567 - FAT SHACK LAS VEGAS',
  //     'Job Type:': 'Service',
  //     'Asset ID:': '8632567',
  //     'Date:': '12/5/2023',
  //     'Scheduler:': 'Sara Scharnowske',
  //     'Tech:': 'Joe Cromer',
  //     'State:': 'FAT SHACK LAS VEGAS - 9635 BERMUDA RD STE 190,89123 LAS VEGAS, NV,CLARK',
  //     'Record Time': '12/6/2023 22:18',
  //     SubmissionID: 195517877,
  //     'Last Modified': '6/12/2023 10:20pm',
  //     'Share Files': 'https://web.miniextensions.com/sLXCh5AO5xiYKUuNA6xl/rechTgcSonOu92WWT'
  //   }
  // ).then(() => {
  //   res.send('Inserted');
  // }).catch(error => {
  //   // console.error('Error making Airtable request:', error.message);
  // });

  // changeRecordsFormat([
  //   {
  //     id: 'rec00zAxGmxHNvlyU',
  //     createdTime: '2023-12-15T14:44:01.000Z',
  //     fields: {
  //       fldTOM5pVXS3CoGVd: 'DarPro',
  //       fldJh8GqEP05t4Xim: '8632567 - FAT SHACK LAS VEGAS',
  //       fld7nBVeaBqlA2onZ: 'Service',
  //       fldGK0QCJM3jFOJSK: '8632567',
  //       fldGXHrC3dOGIX84u: '12/5/2023',
  //       fld8uIqeeMVcnwBkr: 'Sara Scharnowske',
  //       fldOerqstd7RK6z82: 'Joe Cromer',
  //       fld27K6uhHMs2wGWi: 'FAT SHACK LAS VEGAS - 9635 BERMUDA RD STE 190,89123 LAS VEGAS, NV,CLARK',
  //       fld5WIdWZwMgyMJuG: '12/6/2023 22:18',
  //       fld5bDLTIZ8gGpntz: 195517877,
  //       fldtcVxkwe8skrVMc: '6/12/2023 10:20pm',
  //       fldXwOiKfHvwzKksv: 'https://web.miniextensions.com/sLXCh5AO5xiYKUuNA6xl/rechTgcSonOu92WWT'
  //     }
  //   }    
  // ]);
})

const findAndDeleteRecordById = async (id) => {
  try {
    const [results, metadata] = await sequelize.query(`SELECT * FROM masterdata WHERE airtableId = :id`, {
      replacements: { id: id },
      type: Sequelize.QueryTypes.SELECT,
    });
    if (results) {
      await sequelize.query(`DELETE FROM masterdata WHERE airtableId = :id`, {
        replacements: { id: id },
        type: Sequelize.QueryTypes.DELETE,
      });
    } else {
      console.log('Record not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const insertRecord = async (record) => {
  try {
    // Insert a record to the masterdata table, take the column names from the record object keys and values from the record object values
    const fields = Object.keys(record).map(key => `\`${key}\``).join(',');
    const values = Object.values(record).map(value => `'${value}'`).join(',');
    // console.log(values);
    const [results, metadata] = await sequelize.query(`INSERT INTO masterdata (${fields}) VALUES (${values})`, {
      replacements: record,
      type: Sequelize.QueryTypes.INSERT,
    });
    if (results) {
      console.log('Record inserted successfully');
      // console.log(results);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const changeRecordsFormat = (records) => {
  try {
    const newRecords = [];
    for (let i = 0; i < records.length; i++) {
      const newRecord = {};
      newRecord['airtableId'] = records[i].id;
      newRecord['createdTime'] = records[i].createdTime;
      for (const [key, value] of Object.entries(records[i].fields)) {
        newRecord[fields[key]] = value;
      }
      newRecords.push(newRecord);
    }
    console.log(newRecords);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function fetchAllRecords() {
  let allRecords = [];
  let offset = undefined;
  let apiUrl = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

  // Function to recursively fetch records
  function fetchRecords() {
    // Build the request URL with the offset parameter
    const urlWithOffset = offset ? `${apiUrl}?offset=${offset}` : apiUrl;

    // Make the API request
    return axios.get(urlWithOffset, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        view: '',
        returnFieldsByFieldId: true,
      }
    })
      .then(response => {
        if (response.status === 200) {
          // // Concatenate records to the result array
          // allRecords = allRecords.concat(response.data.records);
          console.log(response.data.records.length);
          // console.log(response.data.records);
          // Update the offset for the next request
          offset = response.data.offset;

          // Continue fetching if there are more records
          if (offset) {
            return fetchRecords();
          }
        } else {
          throw new Error(`Failed to fetch records: ${response.status} ${response.statusText}`);
        }
      });
  }

  // Start fetching records and handle errors
  fetchRecords()
    .then(() => {
      // Output all records when done
      // console.log(allRecords);
    })
    .catch(error => {
      console.error('Error fetching records:', error.message);
    });
}
fetchAllRecords();

// async function createUser(username, email) {
//   try {
//     const newUser = await User.create({
//       username: username,
//       number: email,
//     });
//     return newUser;
//   } catch (error) {
//     console.error('Error creating user:', error);
//     throw error;
//   }
// }

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`App Running!`);
  });
});