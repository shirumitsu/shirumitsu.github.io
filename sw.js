/* Valburg Online: guarda o jogo no aparelho para abrir sem internet */
var CACHE="valburg-v287";
var CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/phaser/3.80.1/phaser.min.js"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;
  /* servidor online (Firebase): nunca guardar, sempre direto na internet */
  if(r.url.indexOf(self.location.origin)!==0&&!/cdnjs\.cloudflare\.com|gstatic\.com\/firebasejs|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(r.url))return;
  /* a página do jogo: tenta a versão nova pela internet; sem internet, usa a guardada */
  if(r.mode==="navigate"){e.respondWith(fetch(r,{cache:"no-store"}).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put("./index.html",cp)});return res}).catch(function(){return caches.match("./index.html")}));return}
  /* o resto (Phaser, fontes, ícones): usa o guardado e guarda o que vier novo */
  e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res&&(res.ok||res.type==="opaque")){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res})}))});
