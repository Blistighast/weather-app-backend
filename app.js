import 'dotenv/config.js'
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

// creates server app
const app = express();
const port = 4000;

//enable if behind reverse proxy (ie Heroku, AWS, Nginx) may do later
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

//allows CORS from any origin
app.use(cors());

//routes

//test route
app.get("/", (req, res) => res.send("hello world!"));

//geocoding route
app.get("/geo", async (req, res) => {
  try {
    //makes search query string
    const zipcode = `${req.query.zipcode}`;
    const countrycode = `${req.query.countrycode}` || 'US';
    console.log(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countrycode}&appid=${process.env.OPENWEATHER_API_KEY}`);
    //use node-fetch to call geocoding api
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countrycode}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const json = await response.json();

    const geoRes = res.json({
      success: true,
      json,
    })
    
    async (req, resp) => {
      console.log(geoRes)
      try {
        //makes search query string
        const lat = `${geoRes.json.lat}`;
        const lon = `${geoRes.json.lon}`;
        console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`);
        //use node-fetch to call open weather api and reads keys from .env
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`
          
        );
        const json = await response.json();

        return resp.json({
          success: true,
          json,
        });
      } catch (err) {
        return resp.status(500).json({
          success: false,
          message: err.message
        });
      }
    }
    // return (
    //   //return geo api results and call weather api with those results and return those results as well
    // );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// //geocoding route
// app.get("/geo", async (req, res) => {
//   try {
//     //makes search query string
//     const zipcode = `${req.query.zipcode}`;
//     const countrycode = `${req.query.countrycode}` || 'US';
//     console.log(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countrycode}&appid=${process.env.OPENWEATHER_API_KEY}`);
//     //use node-fetch to call geocoding api
//     const response = await fetch(
//       `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countrycode}&appid=${process.env.OPENWEATHER_API_KEY}`
//     );
//     const json = await response.json();

//     return res.json({
//       success: true,
//       json,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message
//     })
//   }
// })

// //Open Weather Map relay route
// app.get("/onecall", async (req, res) => {
//   try {
//     //makes search query string
//     const lat = `${req.query.lat}`;
//     const lon = `${req.query.lon}`;
//     console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`);
//     //use node-fetch to call open weather api and reads keys from .env
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`
      
//     );
//     const json = await response.json();

//     return res.json({
//       success: true,
//       json,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// });

// this spins up server and generates logs ro use
//these console.logs show up in terminal, not browser console fyi
app.listen(port, () => console.log(`app listening on port ${port}!`))