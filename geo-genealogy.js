let myMap = L.map('mapid', {
  touchZoom: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  zoomControl: false,
  boxZoom: false,
  dragging: false
}).setView([44.4887138,-88.3498731], 10);

L.tileLayer('https://api.mapbox.com/styles/v1/esjewett/cizbrigx9007m2sqih065oq24/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXNqZXdldHQiLCJhIjoiNW9MZFRDayJ9.UR9WenBsjm1ovc3HevPGdg', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18
}).addTo(myMap);

let points = [
  {
    coordinates: [44.4887138,-88.2],
    label: "Oneida"
  },{
    coordinates: [44.3,-88.1]
  },{
    coordinates: [44.7,-88.5]
  },{
    coordinates: [44.4,-87.9]
  }
]

let connections = [
  {
    origin: points[0],
    destination: points[1],
    label: "Test 1"
  },{
    origin: points[0],
    destination: points[2],
    label: "Test 1"
  },{
    origin: points[0],
    destination: points[3],
    label: "Test 1"
  }
]

let svg = d3.select(myMap.getPanes().overlayPane).select('svg')
if(svg.empty()) {
  svg = d3.select(myMap.getPanes().overlayPane)
    .append('svg')
}
resize()

function resize() {
  svg
    .style('width', document.getElementById('mapid').clientWidth)
    .style('height', document.getElementById('mapid').clientHeight)
}

let radius = 10

let places = svg.selectAll('circle').data(points)
places
  .enter()
    .append('circle')
      .attr('r', radius)
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('transform', (d) => { return 'translate(' + myMap.latLngToLayerPoint(d.coordinates).x + ',' + myMap.latLngToLayerPoint(d.coordinates).y +')' })
    .merge(places)

let paths = svg.selectAll('path').data(connections)
paths
  .enter()
    .append('path')
      .attr('fill', 'black')
      .attr('d', (d) => {
        let path = d3.path()
        drawPath(path, d)
        return path.toString()
      })
      .attr('stroke', 'black')
    .merge(paths)

function drawPath(context, d) {
  let start = myMap.latLngToLayerPoint(d.origin.coordinates)
  let end = myMap.latLngToLayerPoint(d.destination.coordinates)
  let startAngle1 = Math.atan2(end.y - start.y, end.x - start.x) - 0.2
  let startAngle2 = Math.atan2(end.y - start.y, end.x - start.x) + 0.2
  let startx1 = start.x + radius * Math.cos(startAngle1)
  let starty1 = start.y + radius * Math.sin(startAngle1)
  let startx2 = start.x + radius * Math.cos(startAngle2)
  let starty2 = start.y + radius * Math.sin(startAngle2)
  let endAngle1 = Math.atan2(start.y - end.y, start.x - end.x) - 0.2
  let endAngle2 = Math.atan2(start.y - end.y, start.x - end.x) + 0.2
  let endx1 = end.x + radius * Math.cos(endAngle1)
  let endy1 = end.y + radius * Math.sin(endAngle1)
  let endx2 = end.x + radius * Math.cos(endAngle2)
  let endy2 = end.y + radius * Math.sin(endAngle2)
  let controlx = (end.x + start.x) / 2 + 20
  let controly = ((end.y + start.y) / 2) - 20
  context.moveTo(startx1, starty1)
  context.quadraticCurveTo(controlx, controly, endx2, endy2)
  context.arc(end.x, end.y, radius, endAngle2, endAngle1, true)
  context.quadraticCurveTo(controlx, controly, startx2, starty2)
  context.arc(start.x, start.y, radius, startAngle2, startAngle1, true)
  context.closePath()
}