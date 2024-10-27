const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

/*
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
*/

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8
      },
      message: props => `${props.value} is not a valid phone number! It should be in the format XX-XXXXXXX or XXX-XXXXXXXX`
    }
  }
})

// Configura el esquema para que la conversión a JSON elimine '_id' y '__v' 
// En Mongoose, la propiedad _id de cada documento es un objeto. El método toJSON  lo transforma en un string 
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)