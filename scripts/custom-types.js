require('dotenv').config()
const { CB_USER, CB_PASS, BUCKET } = process.env
const ottoman = require('ottoman')

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: BUCKET,
  username: CB_USER,
  password: CB_PASS
});

// define validator
ottoman.addValidators({
  phone: (value) => {
    const phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(value && !value.match(phone)) {
    throw new Error('Phone number invalid')
    }
  }
})

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
  phone: { type: String, validator: 'phone'},
  link: LinkType
})

const united = new Airline({
  callsign: 'UNITED',
  country: 'United States',
  name: 'United Airline',
  phone: '555-321-0123',
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
  process.exit(0)
}

ottoman.ensureIndexes()
  .then(() => {
    runAsync()
      .catch((e) => console.log(e))
  })
