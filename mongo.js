const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:IwPiYM5fsnuQrDXr@cluster0.dvhtw.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Si se proporciona nombre y número, guarda un nuevo contacto
if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error saving person:', error)
      mongoose.connection.close()
    })
} else {
  // Si solo se proporciona la contraseña, muestra todos los contactos
  Person.find({})
    .then((persons) => {
      console.log('phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error fetching persons:', error)
      mongoose.connection.close()
    })
}