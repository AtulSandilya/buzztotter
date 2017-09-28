Object.defineProperty(exports,"__esModule",{value:true});exports.sendNotification=undefined;var _regenerator=require("babel-runtime/regenerator");var _regenerator2=_interopRequireDefault(_regenerator);var _extends2=require("babel-runtime/helpers/extends");var _extends3=_interopRequireDefault(_extends2);var _this=this;var _nodeFetch=require("node-fetch");var _nodeFetch2=_interopRequireDefault(_nodeFetch);var _dotenv=require("dotenv");var _theme=require("../theme");var _theme2=_interopRequireDefault(_theme);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}function step(result){result.done?resolve(result.value):new P(function(resolve){resolve(result.value);}).then(fulfilled,rejected);}step((generator=generator.apply(thisArg,_arguments||[])).next());});};(0,_dotenv.config)();var sendNotification=exports.sendNotification=function sendNotification(notif){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee(){var fullNotif,response;return _regenerator2.default.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:fullNotif={body:notif.body,click_action:"fcm.ACTION.HELLO",color:_theme2.default.colors.bevSecondary,icon:notif.icon,title:notif.title};_context.next=3;return(0,_nodeFetch2.default)("https://fcm.googleapis.com/fcm/send",{body:JSON.stringify({data:(0,_extends3.default)({},notif.data,{action:notif.action}),notification:fullNotif,to:notif.receiverGCMId}),headers:{Accept:"application/json",Authorization:"key="+process.env.FIREBASE_GCM_KEY,"Content-Type":"application/json"},method:"POST"});case 3:response=_context.sent;_context.next=6;return response.json();case 6:return _context.abrupt("return",_context.sent);case 7:case"end":return _context.stop();}}},_callee,this);}));};