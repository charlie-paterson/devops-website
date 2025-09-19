FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY manifest.json /usr/share/nginx/html/
COPY service-worker.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
