(this.webpackJsonpwarlords_copy_cat=this.webpackJsonpwarlords_copy_cat||[]).push([[0],{1479:function(e,t,a){"use strict";a.r(t);var s=a(119),o=a.n(s),n=a(552),i=a.n(n),r=(a(558),a(559),a(560),a(267)),c=a.n(r),d={type:c.a.AUTO,width:800,height:600,physics:{default:"arcade",arcade:{gravity:{y:200}}},scene:{preload:function(){this.load.setBaseURL("http://labs.phaser.io"),this.load.image("sky","assets/skies/space3.png"),this.load.image("logo","assets/sprites/phaser3-logo.png"),this.load.image("red","assets/particles/red.png")},create:function(){this.add.image(400,300,"sky");var e=this.add.particles("red").createEmitter({speed:100,scale:{start:1,end:0},blendMode:"ADD"}),t=this.physics.add.image(400,100,"logo");t.setVelocity(100,200),t.setBounce(1,1),t.setCollideWorldBounds(!0),e.startFollow(t)}}};new c.a.Game(d);var l=function(){return o.a.createElement("div",{className:"App"})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(l,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},553:function(e,t,a){e.exports=a(1479)},558:function(e,t,a){},559:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},560:function(e,t,a){}},[[553,1,2]]]);
//# sourceMappingURL=main.8252a7cd.chunk.js.map