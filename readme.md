# Ottoman JS V2 Connect Demo

- On Slides: Arun Vijay ([Twitter](https://twitter.com/vijayragahvan),[Linkedin](https://www.linkedin.com/in/avijayraghavan))
- On Code: Eric Bishard ([Twitter](twitter.com/httpjunkie),[Linkedin](https://www.linkedin.com/in/eric-b))

## Talk/Demo Resources

- [Ottoman V2 Docs](https://v2.ottomanjs.com)
- [Documentation GA](https://ottomanjs.com)
- [Source Code](https://github.com/couchbaselabs/node-ottoman)
- [Sample Project](https://github.com/couchbaselabs/try-ottoman)
- [Ottoman Connect Demo](https://github.com/httpjunkie/ottoman-demo)

## Add collections and scope manually

    docker exec -it cbs bash

    /opt/couchbase/bin/couchbase-cli enable-developer-preview --enable -c localhost:8091 -u Administrator -p password

    curl -X POST -v -u Administrator:password http://localhost:8091/pools/default/buckets/travel/collections -d scope=us

    curl -X POST -v -u Administrator:password http://localhost:8091/pools/default/buckets/travel/collections/us -d name=Airlines
    
    curl -X GET -v -u Administrator:password http://127.0.0.1:8091/pools/default/buckets/travel/collections