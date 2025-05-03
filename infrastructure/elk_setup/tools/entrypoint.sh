#!/bin/bash

echo "Setting up certificates ..."
if [ ! -f config/certs/ca/ca.crt ]; then
    echo "Creating Authority Certificate"
    bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip
    unzip -o -q config/certs/ca.zip -d config/certs
    rm config/certs/ca.zip
fi

if [ ! -f config/certs/elasticsearch/elasticsearch.crt ]; then
    echo "Creating elasticsearch certificate"
    echo '{
      "instances": [
        {
          "name": "elasticsearch",
          "dns": ["elasticsearch", "localhost"],
          "ip": ["127.0.0.1"]
        }
      ]
    }' > config/certs/ins.yml
    bin/elasticsearch-certutil cert --silent --pem -out config/certs/certs.zip --in config/certs/ins.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key
    unzip -o -q config/certs/certs.zip -d config/certs
    rm config/certs/certs.zip config/certs/ins.yml
fi

chown -R root:root config/certs
find . -type d -exec chmod 750 {} \;
find . -type f -exec chmod 640 {} \;

echo "Waiting for Elasticsearch ..."
until curl -s --cacert config/certs/ca/ca.crt https://elasticsearch:9200 | grep -q "missing authentication credentials"; do sleep 10; done

echo "Setting kibana_system password"
curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" https://elasticsearch:9200/_security/user/kibana_system/_password -d "{\"password\":\"${KIBANA_PASSWORD}\"}" > /dev/null 2>&1

echo "Setting ILM policy ..."
curl -s -X PUT --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" https://elasticsearch:9200/_ilm/policy/astro_policy -d '
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_age": "2d",
            "max_size": "5gb"
          }
        }
      },
      "cold": {
        "min_age": "3d",
        "actions": {
          "readonly": {}
        }
      },
      "delete": {
        "min_age": "5d",
        "actions": {
          "delete": {
            "delete_searchable_snapshot": true
          }
        }
      }
    }
  }
}' > /dev/null 2>&1

echo "Creating index template for all indexes ..."
curl -s -X PUT --cacert config/certs/ca/ca.crt -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" https://elasticsearch:9200/_index_template/logs_template -d '{
  "index_patterns": ["log-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "astro_policy"
    }
  }
}' > /dev/null 2>&1

echo "Done!"

echo "Deleting the setup container ..."
curl --unix-socket /var/run/docker.sock -X DELETE "http://localhost/containers/elk_setup?force=true" > /dev/null 2>&1