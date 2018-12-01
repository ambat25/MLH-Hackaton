const express = require("express");
const bodyParser = require("body-parser");
const PouchDB = require('pouchdb')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
const db = new PouchDB(process.env.DB_URL)

app.get('/api/schools', async (req, res) => {
  const schools = await db.allDocs({
    include_docs: true
  })
  res.send(schools.rows)
})
app.post('/api/schools', async (req, res) => {
  try {
    const school = req.body
    console.log({
      school
    })
    const newSchool = await db.post(school)
    res.send({ ...school,
      ...newSchool
    });
  } catch (error) {
    res.end(error)
  }
})

app.get('/api/schools/:id', async (req, res) => {
  const school = await db.get(req.params.id)
  res.send(school)
})
app.put('/api/schools/:id', async (req, res) => {
  let school = await db.get(req.params.id)
  school = { ...school,
    ...req.body
  }
  const newSchool = await db.put(school)
  res.send({ ...school,
    ...newSchool
  })
})
app.delete('/api/schools/:id', async (req, res) => {
  try {
    let school = await db.get(req.params.id)
    school._deleted = true;
    await db.put(school);
    res.send("deleted")
  } catch (error) {
    console.error(error)
  }
})

app.listen(8080, () => {
  console.log('here')
})
