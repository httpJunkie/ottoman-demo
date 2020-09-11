# Add collections and scope manually

    docker exec -it cbs bash

    /opt/couchbase/bin/couchbase-cli enable-developer-preview --enable -c localhost:8091 -u Administrator -p password

    curl -X POST -v -u Administrator:password http://localhost:8091/pools/default/buckets/travel/collections -d scope=us

    curl -X POST -v -u Administrator:password http://localhost:8091/pools/default/buckets/travel/collections/us -d name=Airlines
    
    curl -X GET -v -u Administrator:password http://127.0.0.1:8091/pools/default/buckets/travel/collections

 ## Order to  walk through each file

 - insert.js
 - retrieve.js
 - validator.js
 - update.js
 - queryBuilder.js
 - custom-types.js