
const bodyParser = require("body-parser");
const express = require('express');
const port = 3000;
const { data } = require('./data')
const cors = require('cors');


const app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


console.log(data);
app.get('/api/domains', (req, res) => {
    res.status(200).json(data);
});

app.post('/api/domains', (req, res) => {
    const { publisher, domain, desktopAds, mobileAds } = req.body;
    const newDomain = {
        domain,
        desktopAds,
        mobileAds
    };

    let currentPublisher = data.find((publisherData) => {
        return publisherData.publisher === publisher;
    })
    if (currentPublisher) {
        currentPublisher.domains.push(newDomain);
        res.status(201).json({ message: "data added" })
    } else {
        res.status(404).json({ message: "Unable to add domain" })
    }



});

app.put('/api/:publisher/domains/:oldDomain', (req, res) => {
    const { oldDomain, publisher } = req.params;
    let foundPublisher = data.find((domain) => {
        return domain.publisher === publisher;
    });
    if (foundPublisher) {
        const { desktopAds, mobileAds, domain } = req.body;
        let updateDomainData = {
            domain,
            desktopAds,
            mobileAds
        };
        let targetDomainIndex = foundPublisher.domains.findIndex((domainsData) => {
            return domainsData.domain === oldDomain;
        });
        foundPublisher.domains[targetDomainIndex] = { ...updateDomainData }
        res.status(201).json({ 'message': "data updated" });
    } else {
        res.status(404).json({
            'message': 'Unable to add domain'
        });
    }


});

app.delete('/api/:publisher/domains/:domain', (req, res) => {
    const { domain, publisher } = req.params;
    let foundPublisher = data.find((domain) => {
        return domain.publisher === publisher;
    });
    if (foundPublisher) {
        let targetDomainIndex = foundPublisher.domains.findIndex((domainsData) => {
            return domainsData.domain === domain;
        });
        foundPublisher.domains.splice(targetDomainIndex, 1)
        res.status(201).json({ 'message': "domain was delete" });
    } else {
        res.status(404).json({
            'message': 'unable to delete domain'
        });
    }

});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});


