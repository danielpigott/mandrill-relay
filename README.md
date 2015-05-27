mandrill-relay
==============

Simple forwarder for mandrill written in node js

## Install
Clone this repository and run npm install
```
git clone https://github.com/danielpigott/cloudflare-cli.git
cd cloudflare-cli
npm install
```

## Configuration
Copy config.json.example to config.json and edit it.
Replace the value for key with a mandrill api key
Under forwarders change example.com to your registered domain
Change example@gmail.com to your personal email address
```json
{
    "key": "api-key-goes-here"
    "forwarders" : [
        {
            "from": "*@example.com"
            "to": "example@gmail.com"
        }
    ]
}
```

## Run
Run bin/www to start a web server on port 3000
