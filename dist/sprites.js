// Original, code-drawn pixel sprites shared by the game and arena archive.
export function drawAgent(ctx,x,y,time=0,color='#dd7668',variant=0,scale=1){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const float=Math.round(Math.sin(time*.0018)*2);ctx.translate(0,float);
 r(-15,-10,30,5,'#302c26');r(-19,-5,38,20,'#3d3029');r(-16,-8,32,27,'#5e3a30');
 r(-13,-11,26,28,color);r(-17,-4,34,15,color);r(-10,-14,20,6,color);
 r(-12,-8,24,22,'#57392e');r(-14,-3,28,12,'#a65844');r(-10,-4,20,12,'#f2d39b');
 r(-5,-4,10,12,'#292c22');r(-2,-3,4,10,'#e6996d');r(-1,-4,2,12,'#f5c186');
 r(-17,11,5,11,color);r(12,11,5,11,color);r(-23,6,6,5,color);r(17,6,6,5,color);
 r(-26,10,4,9,color);r(22,10,4,9,color);r(-20,19,7,4,color);r(13,19,7,4,color);
 r(-10,16,5,10,'#9e5d45');r(5,16,5,10,'#9e5d45');r(-12,24,7,3,color);r(5,24,7,3,color);
 if(variant%3===1){r(-18,-15,4,10,color);r(14,-15,4,10,color);}if(variant%3===2){r(-5,-20,10,5,color);r(-2,-24,4,5,'#efc887');}
 r(-10,-11,5,2,'#f0b18a');ctx.restore();
}
export function drawHero(ctx,x,y,time=0,moving=false,scale=1){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);
 const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
 const step=moving?Math.round(Math.sin(time*.015)*1.5):0;
 r(-7,10,14,3,'#0c1510');r(-5,-10,10,5,'#b7e5c8');r(-7,-7,14,10,'#86bfa5');r(-5,-5,10,7,'#294f42');
 r(-4,-3,2,2,'#e3f5c8');r(2,-3,2,2,'#e3f5c8');r(-5,2,10,7,'#92cab0');r(-7,6,14,5,'#608f75');
 r(-5,10,4,3+step,'#b8ceb0');r(1,10,4,3-step,'#b8ceb0');r(-8,2,3,6,'#bad8bd');r(5,2,3,6,'#bad8bd');
 r(-2,3,4,5,'#cde6c0');r(-3,-11,6,2,'#d6e6bd');ctx.restore();
}
