const axios = require('axios');
const express = require('express');
const app = express();

require('dotenv').config();
const baseId = process.env.baseId;
const tableIdOrName = process.env.tableIdOrName;
const accessToken = process.env.accessToken;

const axiosReq = axios.create({
    baseURL: `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`,
    headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    },
    params: {
        view:''
    }
});

const IDsFormDB = ['rec1oki9kt4Kubfon' ,'fgh','recFcNcs4Fp5ihFQ4'];

app.get('/test', (req, res) => {
    const results = [];
    axiosReq.get('/')
        .then(response => {
            for (let i = 0; i < response.data.records.length; i++) {
                let found = false;
                for (let x = 0; x < IDsFormDB.length; x++) {
                    if (response.data.records[i].id === IDsFormDB[x]) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    console.log("This Id Already Found, SO Update it");
                } else {
                    console.log("This is new, then create it");
                }
                results.push(response.data.records[i].id); 
            };
            console.log(results);
            res.json(results)
        })
        .catch(error => {
            console.error('Error making Airtable request:', error.message);
        });
})

app.listen(3000, () => {
    console.log("Welcome From Server, Port:3000!");
})