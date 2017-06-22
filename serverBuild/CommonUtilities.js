Object.defineProperty(exports,"__esModule",{value:true});exports.PrettyFormatAddress=exports.Pluralize=exports.MetersBetweenCoordinates=exports.CoordsAreInRadius=exports.CoordsAreWithinViewport=exports.PrettyFormatDistance=exports.FormatGpsCoordinates=exports.GetTimeNow=exports.StringifyDate=undefined;var _tables=require("./db/tables");
var StringifyDate=exports.StringifyDate=function StringifyDate(){
return new Date().toJSON();
};
var GetTimeNow=exports.GetTimeNow=function GetTimeNow(){

return Date.now();
};


var FormatFloat=function FormatFloat(input,places){
var degreeAsString=input.toString();
var decimalPos=degreeAsString.indexOf(".");
if(places>0){

return degreeAsString.slice(0,decimalPos+places+1);
}else
{
return degreeAsString.slice(0,decimalPos);
}
};
var FormatGpsCoordinates=exports.FormatGpsCoordinates=function FormatGpsCoordinates(x,places){
return{
latitude:FormatFloat(x.latitude,places),
longitude:FormatFloat(x.longitude,places)};

};
var MetersToFeet=function MetersToFeet(meters){
var feetPerMeter=3.28084;
return meters*feetPerMeter;
};
var PrettyFormatDistance=exports.PrettyFormatDistance=function PrettyFormatDistance(distanceInMeters,units){var squareFootage=arguments.length>2&&arguments[2]!==undefined?arguments[2]:_tables.DEFAULT_SQUARE_FOOTAGE;
var prettyDistance=void 0;
var prettyUnit=void 0;
var squareFootageRadius=SquareFootageToRadius(squareFootage);
if(distanceInMeters<squareFootageRadius){
return"You are here";
}
switch(units){
case"metric":
var metersPerKilometer=1000;
if(distanceInMeters>metersPerKilometer){
prettyUnit="km";
prettyDistance=(distanceInMeters/metersPerKilometer).toFixed(0);
}else
{
prettyUnit="m";
prettyDistance=distanceInMeters.toFixed(0);
}
break;
case"imperial":
var feet=MetersToFeet(distanceInMeters);
var feetPerMile=5280;
var feetDetailThreshold=10;
var showAsFeet=feetPerMile/feetDetailThreshold;
var showWithOneDecimal=feetPerMile*feetDetailThreshold;
if(feet<showAsFeet){
prettyDistance=feet.toFixed(0);
prettyUnit=prettyDistance==="1"?"foot":"feet";
break;
}else
if(feet<showWithOneDecimal){
prettyDistance=(feet/feetPerMile).toFixed(1);
prettyDistance=prettyDistance==="1.0"?"1":prettyDistance;
prettyUnit=prettyDistance==="1"?"mile":"miles";
break;
}else
{
prettyUnit="miles";
prettyDistance=(feet/feetPerMile).toFixed(0);
}
break;}

var postfix="away";
return prettyDistance+" "+prettyUnit+" "+postfix;
};
var CoordsAreWithinViewport=exports.CoordsAreWithinViewport=function CoordsAreWithinViewport(coords,viewport){
var withinNortheast=coords.latitude<viewport.northeast.latitude&&
coords.longitude<viewport.northeast.longitude;
var withinSouthwest=coords.latitude>viewport.southwest.latitude&&
coords.longitude>viewport.southwest.longitude;
return withinNortheast&&withinSouthwest;
};
var SquareFootageToRadius=function SquareFootageToRadius(squareFootage){
return Math.sqrt(squareFootage)/Math.PI;
};
var CoordsAreInRadius=exports.CoordsAreInRadius=function CoordsAreInRadius(a,b,squareFootage){
return MetersBetweenCoordinates(a,b)<SquareFootageToRadius(squareFootage);
};



var MetersBetweenCoordinates=exports.MetersBetweenCoordinates=function MetersBetweenCoordinates(a,b){
var RadiusOfTheEarthInMeters=6371*1000;
var deg2rad=function deg2rad(deg){return deg*(Math.PI/180);};
var dLat=deg2rad(b.latitude-a.latitude);
var dLong=deg2rad(b.longitude-a.longitude);
var x=Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(deg2rad(a.latitude))*
Math.cos(deg2rad(b.latitude))*
Math.sin(dLong/2)*
Math.sin(dLong/2);
var z=2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
return RadiusOfTheEarthInMeters*z;
};
var Pluralize=exports.Pluralize=function Pluralize(input){var suffix=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"s";
return input!==1?suffix:"";
};
var PrettyFormatAddress=exports.PrettyFormatAddress=function PrettyFormatAddress(name,address){
var splitAddress=address.split(",");
return[name,splitAddress[0],splitAddress[1]].join("\n");
};