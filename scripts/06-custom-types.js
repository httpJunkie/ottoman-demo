const ottoman = require('ottoman')

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

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

const LinkTypeFactory = (name) => new LinkType(name)

ottoman.registerType(LinkType.name, LinkTypeFactory)

function isLink(value) {
  const regExp = new RegExp(
    /(^|\s)((https?:\/\/)?[\w-]+(\.[a-z-]+)+\.?(:\d+)?(\/\S*)?)/gi
  )
  return regExp.test(value)
}

module.exports = {
  LinkType
}

const Airline = connection.model('Airline', {
  callsign: String,
  country: String,
  name: String,
  link: LinkType
})

const united = new Airline({
  callsign: 'United',
  country: 'United States',
  name: 'United Airline',
  link: 'http://www.united.com'
})

// run the query
const runAsync = async() => {
  try {
    await united.save()
    console.log(`Sucess: Airline ${united.name} (${united.callsign})`)
  } catch (error) {
    throw error
  }

  try {
    // find an Airline by callsign
    const filter = { callsign: 'United'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const result = await Airline.findOne(filter, options)
    console.log('Airline Retrieved: ', result)
  } 
  catch (error) { 
    throw error 
  }

  process.exit(0)
}

ottoman.ensureIndexes()
  .then(() => {
    runAsync()
      .catch((e) => console.log(e))
  })
