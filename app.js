const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is Running')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

const createObject = eachMovie => {
  return {
    movieName: eachMovie.movie_name
    
  }
}
//API 1

app.get('/movies/', async (request, response) => {
  const moviesQuery = `SELECT * FROM movie`
  const movieArray = await db.all(moviesQuery)
  response.send(movieArray.map(eachMovie => createObject(eachMovie)))
})

//API 2

app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addQuery = `INSERT INTO movie (director_id,movie_name,lead_actor)
  VALUES("${directorId}","${movieName}","${leadActor}");`
  const dbResponse = await db.run(addQuery)
  const movieId = dbResponse.lastID
  response.send('Movie Successfully Added')
})
