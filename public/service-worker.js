// Not sure if we need this file

if (workbox) {
  console.log(`Workbox is loaded`);

  workbox.precaching.precacheAndRoute(self.__precacheManifest);
  workbox.routing.registerNavigationRoute('/index.html')
} 
else {
  console.log(`Workbox didn't load`);
}