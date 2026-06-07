# Runtime-only image; the deploy workflow pre-builds the frontend into
# web/dist (with production Firebase config baked in via VITE_FIREBASE_*)
# before running `docker build`.
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY web/dist /usr/share/nginx/html
EXPOSE 80
