# Ottoman 2.0

- On Slides: Arun Vijayraghavan ([Twitter](https://twitter.com/vijayragahvan), [Linkedin](https://www.linkedin.com/in/avijayraghavan))
- On Code: Eric Bishard ([Twitter](https://twitter.com/httpjunkie), [Linkedin](https://www.linkedin.com/in/eric-b))

## Talk/Demo Resources

- [Ottoman 2.0 Docs](https://ottomanjs.com)
- [Source Code](https://github.com/couchbaselabs/node-ottoman)
- [Sample Project (JavaScript)](https://github.com/couchbaselabs/try-ottoman)
- [Sample Project (Typescript)](https://github.com/couchbaselabs/try-ottoman-ts)
- [Ottoman Demo](https://github.com/httpjunkie/ottoman-demo)

## Add collections and scope manually

    docker exec -it cbs bash

    /opt/couchbase/bin/couchbase-cli enable-developer-preview --enable -c localhost:8091 -u Administrator -p password

    curl -X POST -v -u Administrator:password http://localhost:8091/pools/default/buckets/travel/collections -d scope=us

    curl -X POST -v -u Administrator:password http://localhost:8091/pools/default/buckets/travel/collections/us -d name=Airlines
    
    curl -X GET -v -u Administrator:password http://127.0.0.1:8091/pools/default/buckets/travel/collections
