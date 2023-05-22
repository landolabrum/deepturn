
server {
        server_name deepturn.com www.deepturn.com;
        listen [::]:443 ssl ipv6only=on; # managed by Certbot
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/deepturn.com/fullchain.pem; # managed by Cert>
        ssl_certificate_key /etc/letsencrypt/live/deepturn.com/privkey.pem; # managed by Ce>
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot

        gzip on;
        gzip_proxied any;
        gzip_types application/javascript application/x-javascript text/css text/javascript;
        gzip_comp_level 6;
        gzip_buffers 16 8k;
        gzip_min_length 256;

        root /home/fastapi-user/deepturn/.next/server/pages;

        location = / {
                rewrite ^ /en.html last;
                alias /home/fastapi-user/deepturn/.next/server/pages/en/;
        }
        location / {
                try_files $uri $uri/ =404;
        }
        location /_next/static/ {
                alias /home/fastapi-user/deepturn/.next/static/;
                expires 365d;
        }
        location /_next/server/pages/ {
                alias /home/fastapi-user/deepturn/.next/server/pages/;
                expires 365d;
                access_log off;
        }

# DEV
#        location / {
#                proxy_pass http://0.0.0.0:3000;
#                proxy_http_version 1.1;
#                proxy_set_header Upgrade $http_upgrade;
#                proxy_set_header Connection 'upgrade';
#                proxy_set_header Host $host;
#                proxy_cache_bypass $http_upgrade;
#        }
#        error_page 404 /404.html;
#        location = /en/404.html {
#        internal;
#        }
    # CORS configuration
#    add_header 'Access-Control-Allow-Origin' '*';
#    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
#    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified>
#    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
}

server {
        if ($host = deepturn.com) {
                return 301 https://$host$request_uri;
        } # managed by Certbot
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name deepturn.com www.deepturn.com;
        return 404; # managed by Certbot
}
# deepturn-server1
# deepturn-server1
# deepturn
# deepturn
