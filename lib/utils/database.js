const mongoose = require('mongoose')

mongoose.promise = global.promise

/**
 * Mongoose Connection
 */
mongoose.connect(process.env.MONGO_URL, {
  keepAlive: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})
  .then(() => {
    console.log('MongoDB is connected')
  })
  .catch((err) => {
    console.log(err)
    console.log('MongoDB connection unsuccessful.')
  })