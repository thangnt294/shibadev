### README for deployment process

1.  SSH into server
2.  Install NodeJS 16:

        curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
        sudo bash nodesource_setup.sh
        sudo apt install nodejs

3.  Install npm:

        sudo apt install npm

4.  Install pm2:

        npm install -g pm2

5.  Install nginx:

        sudo apt install nginx

6.  Generate SSH key for accessing github:

        ssh-keygen -t rsa -b 4096 -f .ssh/<file_name>

7.  Add public key to github settings
8.  Clone the repository using SSH
9.  Run "npm i" in both client and server to install the npm packages
10. Setup .env.local files in both client and server directories
11. Test by running "npm run dev" in client and "npm run start" in server to see if the code is working
12. Run "pm2 start server.js" in both client and server directories to start the application
13. Config nginx:

        sudo vim /etc/nginx/sites-available/default

- add these lines:

        client_max_body_size 100M;
        location /api {
              proxy_pass http://localhost:8000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
        }

        location / {
              proxy_pass http://localhost:3000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
        }

        location /socket.io {
              proxy_pass http://localhost:8000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
        }

14. Restart nginx: sudo systemctl restart nginx
15. Pray that everything is working as expected
16. Setup SSL using Certbot by following the instruction at "https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal"
