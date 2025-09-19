caches.open("v1").then(cache => {
  return cache.addAll([
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/images/car1.png",
    "/images/car2.png"
  ]);
});
