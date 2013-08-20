function drawClock()
{
	
	var cx,cy;
	var i,j;
	
	var minHash = true;
	var secondHand = true;
	var minorHashLength = 1;
	var majorHashLength = 2;
	
	handLength = {
			minHand : 5,
			hourHand : 3,
			secondHand : 5
	}
	
	var minHandLength = handLength.minHand;
	var hourHandLength = handLength.hourHand;
	var secondHandLength = minHandLength;
	
	cx = Math.max(minHandLength, hourHandLength);
	cy = cx;
	r = cx;
	
	$("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 "+ 2*(r + 0.25) +" "+ 2*(r+0.25) +"' id='analogContainer'>").appendTo("#analog");
	
	
	d3.select("svg")
		.append("circle")
		.attr("id","analogFace")
		.attr("cx",(cx + .25))
		.attr("cy",(cy + .25))
		.attr("r",r);	
	
	r+=.25;
	
	j=minHash?6:30;
	
	
	for(i=0;i<360;i+=j)
	{
		//choose class
		var classStr = i%30==0?"majorHash":"minorHash";		
		var length = i%30==0?majorHashLength:minorHashLength;
		
		console.log("I=" +i + ", Minute Hand = " + minHandLength + ", Length =" +length);
		
		var str ="";
			str += Math.sin(i/180*Math.PI) * (minHandLength) + r + ""; //x1
			str += ",";
			str += Math.cos(i/180*Math.PI) * (minHandLength) + r; //y1
			str += " ";
			str+= "" +(r+Math.sin(i/180*Math.PI) * (r-length))+","+ (r + Math.cos(i/180*Math.PI) * (r-length)) +"";
			//str += "" + Math.sin(i/180*Math.PI) * (length) + r + ""; //x2
			//str += ",";
			//str += "" + Math.cos(i/180*Math.PI) * (length) + r+ ""; //y2
		
		//draw SVG hash
		d3.select("#analogContainer")
			.append("polyline")
			.attr("points", str)
			.attr("class",classStr)
		
	}
	
	//initialize hands
	sp = new timeCoord();
	mp = new timeCoord();
	hp = new timeCoord();
	var l;
	
	for(key in handLength)
	{
		l=handLength[key];
		d3.select("#analogContainer")
			.append("polyline")
			.attr("points",""+r+"," +r +" " + r+"," +(r - l))
			.attr("stroke-width",key == "secondHand"?0.15:0.3)
			.attr("class",key);
	}
	
	var $toggle = $("<input id='analogColorToggle' type='checkbox' />").click(function(){updateClock()})
	
	$("#analog").append($toggle);
	
	
	str=null;
	return null;
	
}

function updateClock()
{
	//get time
	var date = new Date();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	
	
	var rgb = makeColor(h,m,s);
	var iRGB = makeInvertedColor(h,m,s);
	
	//move hands
	
	var pos = {
		hour : {
			theta : h<13?180 - h*30:180 - (h-12)*30,
			x: 0,
			y: 0,
			l : handLength.hourHand
		},
		min : {
			theta : 180 - 6 * m,
			x: 0,
			y:0,
			l : handLength.minHand
		},
		second : {
			theta : 180 - s * 6,
			x:0,
			y:0,
			l : handLength.secondHand
		}
	}
	
	for(key in pos)
	{
		pos[key].x = Math.sin(pos[key].theta/180*Math.PI) * pos[key].l + r
		pos[key].y = Math.cos(pos[key].theta/180*Math.PI) * pos[key].l + r
	}
	
	var rStr = r + "," +  r + " ";
	
	d3.select(".hourHand").attr("points",rStr + pos.hour.x + "," + pos.hour.y);
	d3.select(".minHand").attr("points",rStr + pos.min.x + "," + pos.min.y);
	d3.select(".secondHand").attr("points",rStr + pos.second.x + "," + pos.second.y);
	
	//set colors
	var tVal = $("#analogColorToggle").is(":checked");
	console.log(tVal)
	if(tVal)
	{
		d3.select("#analogFace").attr("fill",rgb)
		d3.select("#analogFace").attr("stroke",makeMajorHandColor(h,m,s));
		d3.selectAll(".majorHash").attr("stroke",makeMajorHandColor(h,m,s));
		d3.selectAll(".minorHash").attr("stroke", makeMinorHandColor(h,m,s));
		d3.select(".hourHand").attr("stroke",makeColor(h,0,0));
		d3.select(".minHand").attr("stroke",makeColor(0,m,0));
		d3.select(".secondHand").attr("stroke",makeColor(0,0,s));
	}
	else
	{
		d3.select("#analogFace").attr("fill","#FFF")
		d3.select("#analogFace").attr("stroke","#000");
		d3.selectAll(".majorHash").attr("stroke","#000");
		d3.selectAll(".minorHash").attr("stroke", "#AAA");
		d3.select(".hourHand").attr("stroke","#000");
		d3.select(".minHand").attr("stroke","#000");
		d3.select(".secondHand").attr("stroke","#F00");
	}
	
	date=h=m=s=rgb=iRGB=pos=null;
	return null;

}



function hslToRGB(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    var str = "rgba(" + Math.floor(r * 255) + "," + Math.floor(g * 255) + "," + Math.floor(b * 255) + ",1)";
    r=g=b=null; 

    return str;
}

function makeColor(h,m,s)
{
	var r = Math.floor(255 * h/23);
	var g = Math.floor(255 * m/60);
	var b = Math.floor(255 * s/60);
	
	return "rgba(" + r+"," + g + ","+b+",1)";
}

function makeInvertedColor(h,m,s)
{
	var r = 255 - Math.ceil(255 * h/23);
	var g = 255 - Math.ceil(255 * m/60);
	var b = 255 - Math.ceil(255 * s/60);
	
	return "rgba(" + r+"," + g + ","+b+",1)";
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.floor(h * 360), Math.floor(s * 100)/100, Math.floor(l * 100)/100];
}

function makeMajorHandColor(h,m,s)
{
	var r = Math.floor(255 * h/23);
	var g = Math.floor(255 * m/60);
	var b = Math.floor(255 * s/60);
	
	var HSL = rgbToHsl(r,g,b);
	h = HSL[0];
	h +=30;
	h=h>360?h-360:h;
	
	HSL[0]=h;
	var str = hslToRGB(HSL[0],HSL[1], HSL[2]); 
	HSL = null;
	return str;
}
function makeMinorHandColor(h,m,s)
{
	var r = Math.floor(255 * h/23);
	var g = Math.floor(255 * m/60);
	var b = Math.floor(255 * s/60);
	
	var HSL = rgbToHsl(r,g,b);
	h = HSL[0];
	h -=30;
	h=h<0?h+360:h;
	
	HSL[0]=h;
	
	var str = hslToRGB(HSL[0],HSL[1], HSL[2]);
	HSL = null;
	return str;
}

function timeCoord(x1,y1)
{
	if(!x1 && !y1)
		this.start = {x:0,y:0}
	this.finish ={x:0,y:0}
}

drawClock();
var t=setInterval(updateClock,1000);
