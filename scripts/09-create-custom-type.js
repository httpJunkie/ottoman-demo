/* Create a custom type and constraints */
const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

// Steps to createcustom type: 1. Define 2. Register 3. And use it!

// Step 1 : Define Custom Type extending IOttomanType
class LinkType extends ottoman.IOttomanType {
  constructor(name) {
    super(name, 'Link')
  }
  cast(value) {
    if(!isLink(String(value))) {
      throw new ottoman.ValidationError(`Field ${this.name} only allows Link`)
    }
    return String(value)
  }
}

/* NOTE: You would extend IOttoman type instead of using a validator to provide 
  your appl with a custom data type, not simply to provide validation.
  A validator is just a constraint for this type */

function isLink(value) {
  const regExp = new RegExp(
    /(^|\s)((https?:\/\/)?[\w-]+(\.[a-z-]+)+\.?(:\d+)?(\/\S*)?)/gi
  )
  return regExp.test(value)
}

// Step 2 Register Custom Type
var LinkTypeFactory = (name) => new LinkType(name)
ottoman.registerType(LinkType.name, LinkTypeFactory)

// Step 3 Use it
const airlineSchema = new Schema({
  callsign: String,
  country: String,
  name: String,
  link: LinkType
})

const Airline = model('Airline', airlineSchema)

const unitedAirlines = new Airline({
  callsign: 'United',
  country: 'United States',
  name: 'United Airline',
  link: 'http://www.united.com'
})

const saveAirline = async() => {
  try {
    await unitedAirlines.save()
    console.log('success: airline added')
  } catch (error) {
    throw error
  }
}

const findAirline = async() => {
  try {
    const filter = { callsign: 'United'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const result = await Airline.findOne(filter, options)
    console.log('Airline Retrieved: ', result)
  }
  catch (error) {
    throw error
  }
}

saveAirline()
  .then(() => {
    findAirline()
      .then(() => process.exit(0))
  })
  .catch((error) => console.log(error))