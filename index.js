const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require("mongoose")
const User = require("./User")
const { ObjectId } = mongoose.Types

// mongoose
mongoose.connect(process.env.MONGO_URI)

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({ extended: true }))

app.route("/api/users")
  .get(async (req, res) => {
    res.json(await User.find({}, { username: 1, _id: 1 }))
  })
  .post(async (req, res) => {
    const findUser = await User.find({ username: req.body.username })
    // if there is no this user, it will add it
    if (findUser.length == 0) {
      await User.create({
        username: req.body.username,
        count: 0
      })
    }
    // send user
    res.json((await User.find({ username: req.body.username }, { username: 1, _id: 1 }))[0])
  })

app.post("/api/users/:_id/exercises", async (req, res) => {
  let findUser = await User.find({ _id: req.params["_id"] })

  if (findUser.length == 0) {
    res.send(`There is no user with this id ${req.body[":_id"]}`)
    return
  }

  // if there is no date, it will add the date of now

  let exerciseDate = req.body.date ? new Date(req.body.date) : new Date()

  findUser[0].log.push({
    description: req.body.description,
    duration: +req.body.duration, // + convert a string to number
    date: exerciseDate
  })
  findUser[0].count = findUser[0].count + 1
  await findUser[0].save()

  res.json({
    _id: req.params["_id"],
    username: findUser[0].username,
    date: exerciseDate.toDateString(),
    duration: +req.body.duration, // + convert a string to number
    description: req.body.description
  })
})

app.get("/api/users/:_id/logs", async (req, res) => {
  let from_to = []
  if (req.query.from) from_to.push({
    $gte: ["$$item.date", new Date(req.query.from)] // item is a variable, so we use $ to represent it. Also, $item.date is a variable, so we use $ to represent it. At the end, we use $$ to represent the variable.
  })

  if (req.query.to) from_to.push({
    $lt: ["$$item.date", new Date(req.query.to)]
  })

  let lim = Number(req.query.limit) || null

  // aggregate() is used to get the data from the database with conditions and limit the number of data. It is like find() but with more options. It takes an array of objects. Each object is a stage. The first stage is $match to get the user with the id. The second stage is $project to get the data that we want. The third stage is $filter to filter the data with the conditions. The fourth stage is $limit to limit the number of data. The fifth stage is $sort to sort the data. The last stage is $unwind to unwind the data. 
  let k = await User.aggregate([
    { $match: { _id: new ObjectId(req.params._id) } },
    {
      $project: {
        username: 1,
        count: 1,
        log: {
          $filter: {
            input: "$log", // the data that we want to filter. there is $ sign because 
            as: "item", // represents each item in the data
            cond: {
              $and: from_to
            },
            limit: lim
          }
        }
      }
    }
  ])

  // for test conditions 
  k[0].count = k[0].log.length
  for (let i = 0; i < k[0].log.length; i++) {
    k[0].log[i].date = new Date(k[0].log[i].date).toDateString()
  }

  res.json(k[0])
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
