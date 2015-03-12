

function CanvasTentaclesDraw(aCanvas)
{
  this.canvas = aCanvas
  this.ctx = this.canvas.getContext('2d');
  this.lines = [];
  // for(var i = 0; i < 200; i++)
  // {
  //   this.lines.push({x:0., y:0.});
  // }

  this.timer = 0.;
  this.lastUpdate = new Date().getTime() / 1000;
  this.canvas.width = $(document).width();
  this.canvas.height = $(document).height();
}

CanvasTentaclesDraw.prototype.update = function()
{
  var lTimer = new Date().getTime() / 1000;
  var lDelta = lTimer - this.lastUpdate;
  this.lastUpdate = lTimer;
  this.timer += Math.min(lDelta, 0.05);

  var lNewHead = {};
  var movSpeed = 0.5;
  lNewHead.x = Math.cos(this.timer * movSpeed) * Math.sin(this.timer * 0.8 * movSpeed);
  lNewHead.y = Math.cos(this.timer * 0.5 * movSpeed) * Math.sin(this.timer * 0.7 * movSpeed);
  lNewHead.x = (0.5 + 0.9 * lNewHead.x) * this.canvas.width;
  lNewHead.y = (0.5 + 0.9 * lNewHead.y) * this.canvas.height;

  if(this.lines.length > 200)
  {
    this.lines.pop();
  }
  this.lines.unshift(lNewHead);

  this.draw();
};

CanvasTentaclesDraw.prototype.draw = function()
{
  // erase canvas
  this.canvas.width = $(document).width();
  this.canvas.height = $(document).height();

  this.ctx.lineWidth = 2;
  this.ctx.beginPath();
  this.ctx.moveTo(this.lines[0].x, this.lines[0].y);
  for(var i = 1; i < this.lines.length; i++)
  {
    var spaceCoeff = 10 / this.canvas.width;
    var xMod =  (i / this.lines.length) * Math.cos(this.timer * 0.4 + this.lines[i].y * spaceCoeff) * this.canvas.width * 0.1;
    var yMod =  (i / this.lines.length) * Math.cos(this.timer * 0.9 + this.lines[i].x * spaceCoeff) * this.canvas.width * 0.1;
    this.ctx.lineTo(this.lines[i].x +xMod, this.lines[i].y + yMod);
  }
  // linear gradient from start to end of line
  var grad= this.ctx.createLinearGradient(this.lines[0].x, this.lines[0].y, 0, 0);
  grad.addColorStop(0, '#ddbbbb');
  grad.addColorStop(1, '#eee');

this.ctx.strokeStyle = grad;
  // this.ctx.strokeStyle = '#ddbbbb';
  this.ctx.stroke();
}

$(function(){
  var sCanvasDraw = new CanvasTentaclesDraw(document.getElementById('drawCanvas'));
  setInterval(function(){sCanvasDraw.update();}, 30);
});