const express = require('express')
const hbs = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY
const url = 'https://api.openweathermap.org/data/2.5/weather'



const app = express()

app.engine('hbs', hbs({
  defaultLayout: 'main.hbs'
}))
app.set('view engine', 'hbs')

// configure app

app.get('/', (req, res) => {
  res.status(200).type('text/html')
  res.render('search')

})

app.get('/search', (req, res) => {
  const query = withQuery(url, {
    q: req.query.city,
    appid: API_KEY
  })
  const result = fetch(query).then(data => data.json()).then(data => {
      if (data.cod == 200) {
        return data
      } else {
        throw data.message
      }
    })
    .then(data => {
      console.log('result', data)
      res.status(200).type('text/html')
      res.render('result', {
        weather: data.weather[0].description,
        city: (req.query.city).toUpperCase(),
        tempHigh: (data.main.temp_max - 273.15).toFixed(1),
        tempLow: (data.main.temp_min - 273.15).toFixed(1),
      })
    })
    .catch(err => {
      console.error('error', err)
      res.status(404).type('text/html')
      res.send(err)
    })

})

app.use((req,res)=>{
  res.redirect('/')
})


app.listen(PORT, () => {
  console.log(`port listening on ${PORT}`)
})
