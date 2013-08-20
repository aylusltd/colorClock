(function($){
	if($ == undefined)
	{
		window.$=function(selector)
		{
			if(selector.charAt(0) == "#")
			{
				var target = document.getElementById(selector.slice(1,selector.length));
				return target;
			}
		}
		HTMLElement.prototype.html = function(str)
		{
			this.innerHTML = str;
			return this;
		}
		
		HTMLElement.prototype.attr = function(attr, value)
		{
			
			if(value)
			{
				this.setAttribute(attr,value);
				return this;
			}
			else
				return this.getAttribute(attr);
		}
		
		HTMLElement.prototype.colorClock = colorClock;
		
		HTMLElement.prototype.css = function(attr, value)
		{
			
			var css=this.getAttribute("style")||"";
				
			var str = attr +":";
			var regex = new RegExp(str);
			var pos = css.search(regex);
			pos=pos<0?css.length-1:pos;
			pos=pos<0?0:pos;
			var pos2 = css.indexOf(";",pos);
			pos2 = pos2<0?css.length-1:pos2;
			var val = css.slice(attr.length + 2,pos2);
			
			if(value === undefined )
			{
				return val;
			}
			else
			{
				val = value;
				var prefix =pos>0? css.slice(0,pos):"";
				if(prefix.search(";")<0 && prefix.length>0)
				{
					prefix+=";"
				}
				prefix = prefix.trim();
				
				
				var suffix = css.length > pos2+1 ? css.slice(pos2+1,css.length):"";
				suffix = suffix.trim();

				css = prefix + " " + attr + ":" + val + "; " + suffix;
				
				css=css.trim();
				
				this.setAttribute("style",css);  
				
				return this;
			}
			HTMLElement.prototype.click = function(fn)
			{
				this.onClick = fn;
				return this;
			}
			
		}
	}
	else
	{
		$.fn.colorClock = colorClock;
	}
})("jQuery" in window?jQuery:null)

function colorClock()
{
	this.html('<div id="hours"></div><div id="minutes"></div><div id="seconds"></div><div id="am">AM</div><div id="pm">PM</div><div id="h12" class="filled">12H</div><div id="h24" class="empty">24H</div>');
	this.attr("class","colorClock");
	
	window.colorClock.mil = false;
	window.colorClock.makeColor = function(h,m,s)
	{
		var r = Math.floor(255 * h/23);
		var g = Math.floor(255 * m/60);
		var b = Math.floor(255 * s/60);
		
		return r+"," + g + ","+b;
	}
	window.colorClock.updateClock = function(target)
	{
		var mil = window.colorClock.mil;
		var date = new Date();
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var rgb = colorClock.makeColor(h,m,s);
		
		var am = h<12?true:false;
		
		if(!mil)
		{
			h=h>12?h-12:h;
			$("#h12").css("color","rgba("+ rgb + ",1)");
			$("#h24").attr("style", " ");
		}
		else
		{
			$("#h24").css("color","rgba("+ rgb + ",1)");
			$("#h12").attr("style", " ");
		}	
		s=s<10?"0"+s:s;
		m=m<10?"0"+m:m;
		
		
		var ht = document.getElementById("hours").clientHeight;
		var wd = document.getElementById("hours").clientWidth;
		
		var height = Math.min(ht,wd/2);
		var hStr = height - 5 + "px"
						
		$("#hours").html("<span>"+h+":</span>");
		$("#hours").css("font-size", hStr);
		$("#minutes").html(m+":");
		$("#minutes").css("font-size",hStr);
		$("#seconds").html(s);
		$("#seconds").css("font-size",hStr);
		
		
		
		if(am)
		{
			$("#pm").attr("class","empty");
			$("#am").attr("class","filled");
			$("#am").css("color","rgba("+ rgb + ",1)");
		}
		else
		{
			$("#pm").attr("class","filled");
			$("#am").attr("class","empty");
			$("#pm").css("color","rgba("+ rgb + ",1)");
		}
		
		
		
		target.attr("style","background-color:rgba("+ rgb + ",1)");
		
		ht = document.getElementById("am").clientHeight;
		wd = document.getElementById("am").clientWidth;
		
		var height = Math.min(ht,wd/2);
		var hStr = height - 5 + "px"
		
		
		$("#am").css("font-size",hStr);
		
		$("#pm").css("font-size",hStr);
		
		
		//t = window.setTimeout(window.colorClock.updateClock(target),1000)
	}
	window.colorClock.updateClock(this);
	var t2 = this;
	
	
	$("#h12").click(function(){
		window.colorClock.mil = false;
		$("#h12").attr("class","filled");
		$("#h24").attr("class","empty");
		$("#h24").attr("style"," ");
		t2.colorClock()
	});
	
	$("#h24").click(function(){
		window.colorClock.mil = true;
		$("#h24").attr("class","filled");
		$("#h12").attr("class","empty");
		$("#h12").attr("style"," ");
		t2.colorClock();
	});
	
	
	//var t=window.setTimeout(function(){t2.colorClock()}, 1000);
}


