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

var LocationsAreCloseToEachOther=exports.LocationsAreCloseToEachOther=function LocationsAreCloseToEachOther(a,b){

var tolerance=50;
var metersBetweenPoints=HaversineFormula(a,b)*1000;
return tolerance>metersBetweenPoints;
};


var HaversineFormula=function HaversineFormula(a,b){
var R=6371;
var deg2rad=function deg2rad(deg){return deg*(Math.PI/180);};
var dLat=deg2rad(b.latitude-a.latitude);
var dLong=deg2rad(b.longitude-a.longitude);
var x=Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(deg2rad(a.latitude))*Math.cos(deg2rad(b.latitude))*
Math.sin(dLong/2)*Math.sin(dLong/2);
var z=2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
return R*z;
};
var Pluralize=exports.Pluralize=function Pluralize(input){var suffix=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"s";
return input!==1?suffix:"";
};
var PrettyFormatAddress=exports.PrettyFormatAddress=function PrettyFormatAddress(name,address){
var splitAddress=address.split(",");
return[name,splitAddress[0],splitAddress[1]].join("\n");
};