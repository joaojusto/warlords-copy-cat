(this.webpackJsonpwarlords_copy_cat=this.webpackJsonpwarlords_copy_cat||[]).push([[0],{1486:function(e,t,a){"use strict";a.r(t);var n=a(119),o=a.n(n),r=a(554),i=a.n(r),c=(a(562),a(563),a(267)),s=a.n(c),l=a(555),d=a(268),u=a(556),p=a.n(u),h={scene:{create:function(){var e,t=this,a=this.make.tilemap({key:"map"}),n=a.tileWidth,o=a.tileHeight,r=a.addTilesetImage("tuxmon-sample-32px-extruded","tiles"),i=a.createBlankDynamicLayer("terrain",r,0,0,100,100,n,o),c=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Math.random(),n=new l.Noise;n.seed(a);var o=0,r=0,i=0,c=0,s=Object(d.range)(t).map((function(a){return Object(d.range)(e).map((function(s){var l=Math.round(100*(n.perlin2(s/(e/4),a/(t/4))+Number.EPSILON))/100;return o=l<o?l:o,r=l>r?l:r,l<0?i++:c++,l}))})),u=o-.8*o;console.log(u);var p=s.map((function(e){return e.map((function(e){return e>u?199:255}))}));return console.log("Min: ".concat(o,", Max: ").concat(r)),console.log("<0: ".concat(i,", >0: ").concat(c)),console.log("Seed: ".concat(a)),p}(100,100);c.forEach((function(t,a){return t.forEach((function(t,n){e||255===t||(e={x:n,y:a}),i.putTileAt(t,n,a)}))}));var s=i=a.convertLayerToStatic(i),u=s.width,y=s.height;this.cameras.add(h.width-m-g,g,m,f).setZoom((f-2)/y).setName(v).setBackgroundColor(w).centerOn(u/2,y/2);var x=this.physics.add.sprite(e.x,e.y,"warrior").setDisplaySize(24,24).setDisplayOrigin(-2,-4);this.cameras.main.setBounds(0,0,u,y),this.cameras.main.startFollow(x);var k=new p.a.js;k.setGrid(c),k.setAcceptableTiles([199]),k.enableDiagonals();var M=function(e){if(e){var a=e.slice(1,e.length).map((function(e){var t=e.x,a=e.y;return{targets:x,x:{value:t*n,duration:200},y:{value:a*o,duration:200}}}));t.tweens.timeline({tweens:a})}};this.input.on("pointerdown",(function(e){var t=e.worldX,a=e.worldY,r=Math.floor(t/n),i=Math.floor(a/o),c=Math.floor(x.x/n),s=Math.floor(x.y/o);try{k.findPath(c,s,r,i,M),k.calculate()}catch(l){console.log("Ups! Out of scope :S")}}))},update:function(e,t){},preload:function(){this.load.setBaseURL("".concat("/warlords-copy-cat")),this.load.image("tiles","tilesets/tuxmon-sample-32px-extruded.png"),this.load.image("warrior","warrior.png"),this.load.tilemapTiledJSON("map","/tilemaps/warlords.json")}},physics:{default:"arcade",arcade:{gravity:{y:0}}},type:s.a.AUTO,width:800,height:600,parent:"App",pixelArt:!0},m=102,f=102,g=10,w=8772,v="minimap";new c.Game(h);var y=function(){return o.a.createElement("div",{className:"App",id:"App"})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},557:function(e,t,a){e.exports=a(1486)},562:function(e,t,a){},563:function(e,t,a){}},[[557,1,2]]]);
//# sourceMappingURL=main.263e7ab6.chunk.js.map