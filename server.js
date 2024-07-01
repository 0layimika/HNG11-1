const express = require('express')
const app = express()
const axios = require('axios')
const PORT = process.env.PORT || 3000
const config = require('config')



app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})

app.get('/api/hello', async (req,res)=>{

    const visitor = req.query.visitor_name
    let client_ip = req.ip||req.headers['x-forwarded-for']
    console.log(client_ip)
    const api_key = config.get("api_key")
    const url = 'https://apiip.net/api/check?ip='+client_ip +'&accessKey='+ api_key
    const response = await axios.get(url)
    const result = response.data
    const location = result.city
    const openWeatherMapApiKey = '5b5e364ad73b6698554607ec8884f813';

    const weatherResponse = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: result.latitude,
        lon: result.longitude,
        appid: openWeatherMapApiKey,
      },
    });
    const weatherdata = weatherResponse.data
    const temp = (weatherdata.main.temp - 273.15).toFixed(2)

    res.json({
        "client_ip": client_ip,
        "location": location,
        "greeting":`Hello, ${visitor}!, the temperature is ${temp} degrees today in ${location}`,
    })

})