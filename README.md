# cryptomath-api

> Backend for the CryptoMath project

## Build Setup

```bash
# install dependencies
$ npm install

# running in dev mode
$ npm run dev

# build for production and launch API server
$ npm run build
$ npm run start
```

## Start application
Install latest version of production process manager [PM2](http://pm2.keymetrics.io/):
``` bash
npm install pm2@latest -g
```
Next, run commands:
```bash
npm run build
pm2 start npm --name "cryptomath-api" -- start
```
After that, process will run in the background. If you want to delete the app from the PM2 process list. You just have to enter the following command: `pm2 delete cryptomath-api`.

### Restart application without downtime
```bash
git reset --hard
git pull
npm run build
pm2 delete cryptomath-api
pm2 start npm --name "cryptomath-api" -- start
```

## NGINX configuration
Your [NGINX](https://www.nginx.com/) site configuration should look similar:
```bash
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;
    server_name <YOUR_API_DOMAIN> www.<YOUR_API_DOMAIN>;

    ssl_certificate <PATH_TO_LETSENCRYPT>/<YOUR_API_DOMAIN>/fullchain.pem; # managed by Certbot
    ssl_certificate_key <PATH_TO_LETSENCRYPT>/<YOUR_API_DOMAIN>/privkey.pem; # managed by Certbot
    ssl_session_cache shared:le_nginx_SSL:1m; # managed by Certbot
    ssl_session_timeout 1440m; # managed by Certbot

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";

    location / {
        proxy_set_header Host $host;
      	proxy_set_header X-Real-IP $remote_addr;
      	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      	proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://127.0.0.1:5000; # Port set on the environment variables of your Node.js part for https (this is the most important part)
    }

    access_log <PATH_TO_NGINX_LOGS>/access.log;
    error_log  <PATH_TO_NGINX_LOGS>/error.log error;

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Redirect non-https traffic to https
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
}
```
