const ottoman = require('ottoman')
const { model, Schema } = require('ottoman')

// create connection to database/bucket
ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

// Step 1 : Define Custom Type extend from IOttomanType
// define, register and use
// you would extend IOttoman type instead of using a validator to provide 
// your application with custom data type not simply to provide validation
// a validator is just one constraint for this type but it could also be some other costraint
class LinkType extends ottoman.IOttomanType {
  constructor(name) {
    super(name, '')
  }
  cast(value) {
    if(!isLink(String(value))) {
      throw new ottoman.ValidationError(`Field ${this.name} only allows Link`)
    }
    return String(value)
  }
}

function isLink(value) {
  const regExp = new RegExp(
    /(^|\s)((https?:\/\/)?[\w-]+(\.[a-z-]+)+\.?(:\d+)?(\/\S*)?)/gi
  )
  return regExp.test(value)
}

// Step 2 Register Custom Type
var LinkTypeFactory = (name) => new LinkType(name)
ottoman.registerType(LinkType.name, LinkTypeFactory)

const schema = new Schema({
  callsign: String,
  country: String,
  name: String,
  link: LinkType
})

const Airline = model('Airline', schema)

const united = new Airline({
  callsign: 'United',
  country: 'United States',
  name: 'United Airline',
  link: 'http://www.united.com'
})

// run the query
const saveAirline = async() => {
  try {
    await united.save()
    console.log('success: airline added')
  } catch (error) {
    throw error
  }
}

const findAirline = async() => {
  try {
    const filter = { callsign: "United"}
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