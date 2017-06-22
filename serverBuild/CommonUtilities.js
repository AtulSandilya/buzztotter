Object.defineProperty(exports,"__esModule",{value:true});var StringifyDate=exports.StringifyDate=function StringifyDate(){
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
var PrettyFormatDistance=exports.PrettyFormatDistance=function PrettyFormatDistance(distanceInMeters,units){
switch(units){
case"metric":
var metersPerKilometer=1000;
if(distanceInMeters>metersPerKilometer){
return(distanceInMeters/metersPerKilometer).toFixed(0)+" km";
}else
{
return distanceInMeters.toFixed(0)+" m";
}
case"imperial":
var feet=MetersToFeet(distanceInMeters);
var feetPerMile=5280;
if(feet<feetPerMile){

return"0."+(feet/feetPerMile).toFixed(1)+" miles";
}else
{
return(feet/feetPerMile).toFixed(1)+" miles";
}}

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