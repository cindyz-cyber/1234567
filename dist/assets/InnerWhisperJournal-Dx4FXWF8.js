import{e as Z,g as K,d as Y,u as ee,b as te,r as y,j as l,G as ne,s as G,f as $}from"./index-CdQv9ECx.js";import{C as re}from"./chevron-left-cKJ7tbYs.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=Z("MicOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M18.89 13.23A7.12 7.12 0 0 0 19 12v-2",key:"80xlxr"}],["path",{d:"M5 10v2a7 7 0 0 0 12 5",key:"p2k8kg"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=Z("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]]);var H={exports:{}};(function(p,v){H.exports=v(p)})(typeof window=="object"&&window,function(p,v){if(!p){console.warn("can't use weixin-js-sdk in server side");return}var s,S,k,_,C,U,q,c,T,R,b,V,m,d,g,h,M,J,W,P,z,L;if(p.jWeixin)return p.jWeixin;return s={config:"preVerifyJSAPI",onMenuShareTimeline:"menu:share:timeline",onMenuShareAppMessage:"menu:share:appmessage",onMenuShareQQ:"menu:share:qq",onMenuShareWeibo:"menu:share:weiboApp",onMenuShareQZone:"menu:share:QZone",previewImage:"imagePreview",getLocation:"geoLocation",openProductSpecificView:"openProductViewWithPid",addCard:"batchAddCard",openCard:"batchViewCard",chooseWXPay:"getBrandWCPayRequest",openEnterpriseRedPacket:"getRecevieBizHongBaoRequest",startSearchBeacons:"startMonitoringBeacons",stopSearchBeacons:"stopMonitoringBeacons",onSearchBeacons:"onBeaconsInRange",consumeAndShareCard:"consumedShareCard",openAddress:"editAddress"},S=function(){var e,t={};for(e in s)t[s[e]]=e;return t}(),k=p.document,_=k.title,C=navigator.userAgent.toLowerCase(),V=navigator.platform.toLowerCase(),U=!(!V.match("mac")&&!V.match("win")),q=C.indexOf("wxdebugger")!=-1,c=C.indexOf("micromessenger")!=-1,T=C.indexOf("android")!=-1,R=C.indexOf("iphone")!=-1||C.indexOf("ipad")!=-1,b=(V=C.match(/micromessenger\/(\d+\.\d+\.\d+)/)||C.match(/micromessenger\/(\d+\.\d+)/))?V[1]:"",m={initStartTime:D(),initEndTime:0,preVerifyStartTime:0,preVerifyEndTime:0},d={version:1,appId:"",initTime:0,preVerifyTime:0,networkType:"",isPreVerifyOk:1,systemType:R?1:T?2:-1,clientVersion:b,url:encodeURIComponent(location.href)},g={},h={_completes:[]},M={state:0,data:{}},a(function(){m.initEndTime=D()}),J=!1,W=[],P={config:function(e){B("config",g=e);var t=g.check!==!1;a(function(){if(t)i(s.config,{verifyJsApiList:A(g.jsApiList),verifyOpenTagList:A(g.openTagList)},(h._complete=function(w){m.preVerifyEndTime=D(),M.state=1,M.data=w},h.success=function(w){d.isPreVerifyOk=0},h.fail=function(w){h._fail?h._fail(w):M.state=-1},(f=h._completes).push(function(){F()}),h.complete=function(w){for(var o=0,N=f.length;o<N;++o)f[o]();h._completes=[]},h)),m.preVerifyStartTime=D();else{M.state=1;for(var n=h._completes,r=0,u=n.length;r<u;++r)n[r]();h._completes=[]}var f}),P.invoke||(P.invoke=function(n,r,u){p.WeixinJSBridge&&WeixinJSBridge.invoke(n,x(r),u)},P.on=function(n,r){p.WeixinJSBridge&&WeixinJSBridge.on(n,r)})},ready:function(e){(M.state!=0||(h._completes.push(e),!c&&g.debug))&&e()},error:function(e){b<"6.0.2"||(M.state==-1?e(M.data):h._fail=e)},checkJsApi:function(e){i("checkJsApi",{jsApiList:A(e.jsApiList)},(e._complete=function(t){T&&(r=t.checkResult)&&(t.checkResult=JSON.parse(r));var n,r=t,u=r.checkResult;for(n in u){var f=S[n];f&&(u[f]=u[n],delete u[n])}},e))},onMenuShareTimeline:function(e){j(s.onMenuShareTimeline,{complete:function(){i("shareTimeline",{title:e.title||_,desc:e.title||_,img_url:e.imgUrl||"",link:e.link||location.href,type:e.type||"link",data_url:e.dataUrl||""},e)}},e)},onMenuShareAppMessage:function(e){j(s.onMenuShareAppMessage,{complete:function(t){t.scene==="favorite"?i("sendAppMessage",{title:e.title||_,desc:e.desc||"",link:e.link||location.href,img_url:e.imgUrl||"",type:e.type||"link",data_url:e.dataUrl||""}):i("sendAppMessage",{title:e.title||_,desc:e.desc||"",link:e.link||location.href,img_url:e.imgUrl||"",type:e.type||"link",data_url:e.dataUrl||""},e)}},e)},onMenuShareQQ:function(e){j(s.onMenuShareQQ,{complete:function(){i("shareQQ",{title:e.title||_,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},onMenuShareWeibo:function(e){j(s.onMenuShareWeibo,{complete:function(){i("shareWeiboApp",{title:e.title||_,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},onMenuShareQZone:function(e){j(s.onMenuShareQZone,{complete:function(){i("shareQZone",{title:e.title||_,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},updateTimelineShareData:function(e){i("updateTimelineShareData",{title:e.title,link:e.link,imgUrl:e.imgUrl},e)},updateAppMessageShareData:function(e){i("updateAppMessageShareData",{title:e.title,desc:e.desc,link:e.link,imgUrl:e.imgUrl},e)},startRecord:function(e){i("startRecord",{},e)},stopRecord:function(e){i("stopRecord",{},e)},onVoiceRecordEnd:function(e){j("onVoiceRecordEnd",e)},playVoice:function(e){i("playVoice",{localId:e.localId},e)},pauseVoice:function(e){i("pauseVoice",{localId:e.localId},e)},stopVoice:function(e){i("stopVoice",{localId:e.localId},e)},onVoicePlayEnd:function(e){j("onVoicePlayEnd",e)},uploadVoice:function(e){i("uploadVoice",{localId:e.localId,isShowProgressTips:e.isShowProgressTips==0?0:1},e)},downloadVoice:function(e){i("downloadVoice",{serverId:e.serverId,isShowProgressTips:e.isShowProgressTips==0?0:1},e)},translateVoice:function(e){i("translateVoice",{localId:e.localId,isShowProgressTips:e.isShowProgressTips==0?0:1},e)},chooseImage:function(e){i("chooseImage",{scene:"1|2",count:e.count||9,sizeType:e.sizeType||["original","compressed"],sourceType:e.sourceType||["album","camera"]},(e._complete=function(t){if(T){var n=t.localIds;try{n&&(t.localIds=JSON.parse(n))}catch{}}},e))},getLocation:function(e){e=e||{},i(s.getLocation,{type:e.type||"wgs84"},(e._complete=function(t){delete t.type},e))},previewImage:function(e){i(s.previewImage,{current:e.current,urls:e.urls},e)},uploadImage:function(e){i("uploadImage",{localId:e.localId,isShowProgressTips:e.isShowProgressTips==0?0:1},e)},downloadImage:function(e){i("downloadImage",{serverId:e.serverId,isShowProgressTips:e.isShowProgressTips==0?0:1},e)},getLocalImgData:function(e){J===!1?(J=!0,i("getLocalImgData",{localId:e.localId},(e._complete=function(t){var n;J=!1,0<W.length&&(n=W.shift(),wx.getLocalImgData(n))},e))):W.push(e)},getNetworkType:function(e){i("getNetworkType",{},(e._complete=function(r){var n=r,r=n.errMsg,u=(n.errMsg="getNetworkType:ok",n.subtype);if(delete n.subtype,u)n.networkType=u;else{var u=r.indexOf(":"),f=r.substring(u+1);switch(f){case"wifi":case"edge":case"wwan":n.networkType=f;break;default:n.errMsg="getNetworkType:fail"}}},e))},openLocation:function(e){i("openLocation",{latitude:e.latitude,longitude:e.longitude,name:e.name||"",address:e.address||"",scale:e.scale||28,infoUrl:e.infoUrl||""},e)},hideOptionMenu:function(e){i("hideOptionMenu",{},e)},showOptionMenu:function(e){i("showOptionMenu",{},e)},closeWindow:function(e){i("closeWindow",{},e=e||{})},hideMenuItems:function(e){i("hideMenuItems",{menuList:e.menuList},e)},showMenuItems:function(e){i("showMenuItems",{menuList:e.menuList},e)},hideAllNonBaseMenuItem:function(e){i("hideAllNonBaseMenuItem",{},e)},showAllNonBaseMenuItem:function(e){i("showAllNonBaseMenuItem",{},e)},scanQRCode:function(e){i("scanQRCode",{needResult:(e=e||{}).needResult||0,scanType:e.scanType||["qrCode","barCode"]},(e._complete=function(t){var n;R&&(n=t.resultStr)&&(n=JSON.parse(n),t.resultStr=n&&n.scan_code&&n.scan_code.scan_result)},e))},openAddress:function(e){i(s.openAddress,{},(e._complete=function(t){(t=t).postalCode=t.addressPostalCode,delete t.addressPostalCode,t.provinceName=t.proviceFirstStageName,delete t.proviceFirstStageName,t.cityName=t.addressCitySecondStageName,delete t.addressCitySecondStageName,t.countryName=t.addressCountiesThirdStageName,delete t.addressCountiesThirdStageName,t.detailInfo=t.addressDetailInfo,delete t.addressDetailInfo},e))},openProductSpecificView:function(e){i(s.openProductSpecificView,{pid:e.productId,view_type:e.viewType||0,ext_info:e.extInfo},e)},addCard:function(e){for(var t=e.cardList,n=[],r=0,u=t.length;r<u;++r){var f=t[r],f={card_id:f.cardId,card_ext:f.cardExt};n.push(f)}i(s.addCard,{card_list:n},(e._complete=function(w){if(o=w.card_list){for(var o,N=0,X=(o=JSON.parse(o)).length;N<X;++N){var E=o[N];E.cardId=E.card_id,E.cardExt=E.card_ext,E.isSuccess=!!E.is_succ,delete E.card_id,delete E.card_ext,delete E.is_succ}w.cardList=o,delete w.card_list}},e))},chooseCard:function(e){i("chooseCard",{app_id:g.appId,location_id:e.shopId||"",sign_type:e.signType||"SHA1",card_id:e.cardId||"",card_type:e.cardType||"",card_sign:e.cardSign,time_stamp:e.timestamp+"",nonce_str:e.nonceStr},(e._complete=function(t){t.cardList=t.choose_card_info,delete t.choose_card_info},e))},openCard:function(e){for(var t=e.cardList,n=[],r=0,u=t.length;r<u;++r){var f=t[r],f={card_id:f.cardId,code:f.code};n.push(f)}i(s.openCard,{card_list:n},e)},consumeAndShareCard:function(e){i(s.consumeAndShareCard,{consumedCardId:e.cardId,consumedCode:e.code},e)},chooseWXPay:function(e){i(s.chooseWXPay,Q(e),e),F({jsApiName:"chooseWXPay"})},openEnterpriseRedPacket:function(e){i(s.openEnterpriseRedPacket,Q(e),e)},startSearchBeacons:function(e){i(s.startSearchBeacons,{ticket:e.ticket},e)},stopSearchBeacons:function(e){i(s.stopSearchBeacons,{},e)},onSearchBeacons:function(e){j(s.onSearchBeacons,e)},openEnterpriseChat:function(e){i("openEnterpriseChat",{useridlist:e.userIds,chatname:e.groupName},e)},launchMiniProgram:function(e){i("launchMiniProgram",{targetAppId:e.targetAppId,path:function(t){var n;if(typeof t=="string"&&0<t.length)return n=t.split("?")[0],n+=".html",(t=t.split("?")[1])!==void 0?n+"?"+t:n}(e.path),envVersion:e.envVersion},e)},openBusinessView:function(e){i("openBusinessView",{businessType:e.businessType,queryString:e.queryString||"",envVersion:e.envVersion},(e._complete=function(t){if(T){var n=t.extraData;if(n)try{t.extraData=JSON.parse(n)}catch{t.extraData={}}}},e))},miniProgram:{navigateBack:function(e){e=e||{},a(function(){i("invokeMiniProgramAPI",{name:"navigateBack",arg:{delta:e.delta||1}},e)})},navigateTo:function(e){a(function(){i("invokeMiniProgramAPI",{name:"navigateTo",arg:{url:e.url}},e)})},redirectTo:function(e){a(function(){i("invokeMiniProgramAPI",{name:"redirectTo",arg:{url:e.url}},e)})},switchTab:function(e){a(function(){i("invokeMiniProgramAPI",{name:"switchTab",arg:{url:e.url}},e)})},reLaunch:function(e){a(function(){i("invokeMiniProgramAPI",{name:"reLaunch",arg:{url:e.url}},e)})},postMessage:function(e){a(function(){i("invokeMiniProgramAPI",{name:"postMessage",arg:e.data||{}},e)})},getEnv:function(e){a(function(){e({miniprogram:p.__wxjs_environment==="miniprogram"})})}}},z=1,L={},k.addEventListener("error",function(e){var t,n,r;T||(r=(t=e.target).tagName,n=t.src,r!="IMG"&&r!="VIDEO"&&r!="AUDIO"&&r!="SOURCE")||n.indexOf("wxlocalresource://")!=-1&&(e.preventDefault(),e.stopPropagation(),(r=t["wx-id"])||(r=z++,t["wx-id"]=r),L[r]||(L[r]=!0,wx.ready(function(){wx.getLocalImgData({localId:n,success:function(u){t.src=u.localData}})})))},!0),k.addEventListener("load",function(e){var t;T||(t=(e=e.target).tagName,e.src,t!="IMG"&&t!="VIDEO"&&t!="AUDIO"&&t!="SOURCE")||(t=e["wx-id"])&&(L[t]=!1)},!0),v&&(p.wx=p.jWeixin=P),P;function i(e,t,n){p.WeixinJSBridge?WeixinJSBridge.invoke(e,x(t),function(r){I(e,r,n)}):B(e,n)}function j(e,t,n){p.WeixinJSBridge?WeixinJSBridge.on(e,function(r){n&&n.trigger&&n.trigger(r),I(e,r,t)}):B(e,n||t)}function x(e){return(e=e||{}).appId=g.appId,e.verifyAppId=g.appId,e.verifySignType="sha1",e.verifyTimestamp=g.timestamp+"",e.verifyNonceStr=g.nonceStr,e.verifySignature=g.signature,e}function Q(e){return{timeStamp:e.timestamp+"",nonceStr:e.nonceStr,package:e.package,paySign:e.paySign,signType:e.signType||"SHA1"}}function I(u,t,n){u!="openEnterpriseChat"&&u!=="openBusinessView"||(t.errCode=t.err_code),delete t.err_code,delete t.err_desc,delete t.err_detail;var r=t.errMsg,u=(r||(r=t.err_msg,delete t.err_msg,r=function(f,w){var o=S[f];o&&(f=o),o="ok";{var N;w&&(N=w.indexOf(":"),(o=(o=(o=(o=(o=(o=(o=w.substring(N+1))=="confirm"?"ok":o)=="failed"?"fail":o).indexOf("failed_")!=-1?o.substring(7):o).indexOf("fail_")!=-1?o.substring(5):o).replace(/_/g," ")).toLowerCase())!="access denied"&&o!="no permission to execute"||(o="permission denied"),(o=f=="config"&&o=="function not exist"?"ok":o)=="")&&(o="fail")}return w=f+":"+o}(u,r),t.errMsg=r),(n=n||{})._complete&&(n._complete(t),delete n._complete),r=t.errMsg||"",g.debug&&!n.isInnerInvoke&&alert(JSON.stringify(t)),r.indexOf(":"));switch(r.substring(u+1)){case"ok":n.success&&n.success(t);break;case"cancel":n.cancel&&n.cancel(t);break;default:n.fail&&n.fail(t)}n.complete&&n.complete(t)}function A(e){if(e){for(var t=0,n=e.length;t<n;++t){var r=e[t],r=s[r];r&&(e[t]=r)}return e}}function B(e,t){var n;!g.debug||t&&t.isInnerInvoke||((n=S[e])&&(e=n),t&&t._complete&&delete t._complete,console.log('"'+e+'",',t||""))}function F(e){var t;U||q||g.debug||b<"6.0.2"||d.systemType<0||(t=new Image,d.appId=g.appId,d.initTime=m.initEndTime-m.initStartTime,d.preVerifyTime=m.preVerifyEndTime-m.preVerifyStartTime,P.getNetworkType({isInnerInvoke:!0,success:function(n){d.networkType=n.networkType,n="https://open.weixin.qq.com/sdk/report?v="+d.version+"&o="+d.isPreVerifyOk+"&s="+d.systemType+"&c="+d.clientVersion+"&a="+d.appId+"&n="+d.networkType+"&i="+d.initTime+"&p="+d.preVerifyTime+"&u="+d.url+"&jsapi_name="+(e?e.jsApiName:""),t.src=n}}))}function D(){return new Date().getTime()}function a(e){c&&(p.WeixinJSBridge?e():k.addEventListener&&k.addEventListener("WeixinJSBridgeReady",e,!1))}});var oe=H.exports;const O=K(oe),se="/api/wechat-config";function ce(){return typeof navigator>"u"?!1:/micromessenger/i.test(navigator.userAgent||"")}async function le(){const p=encodeURIComponent(window.location.href.split("#")[0]),v=await fetch(`${se}?url=${p}`,{method:"GET",headers:{Accept:"application/json"}});if(!v.ok){const s=await v.text().catch(()=>"");throw new Error(`[wechat-config] ${v.status} ${s}`)}return v.json()}function de(){return le().then(p=>new Promise((v,s)=>{O.config({debug:!1,appId:p.appId,timestamp:p.timestamp,nonceStr:p.nonceStr,signature:p.signature,jsApiList:["startRecord","stopRecord","translateVoice","onVoiceRecordEnd"]}),O.ready(()=>{v()}),O.error(S=>{s(S??new Error("wx.config error"))})}))}function fe({emotions:p=[],bodyStates:v=[],onBack:s,onNext:S,content:k={}}){const _=Y(),{isAppFlow:C,flowBase:U}=ee(),c=te().state,T=p.length>0?p:(c==null?void 0:c.emotions)??[],R=v.length>0?v:(c==null?void 0:c.bodyStates)??[],[b,V]=y.useState((c==null?void 0:c.journalContentFromWriting)??""),[m,d]=y.useState(!1),[g,h]=y.useState(!1),[M,J]=y.useState(!1),[W,P]=y.useState(0),[z,L]=y.useState(!1),[i,j]=y.useState(null),x=y.useRef(null),Q=y.useRef(null),I=y.useRef(!1),A=y.useMemo(()=>ce(),[]),B=y.useCallback(a=>{O.translateVoice({localId:a,isShowProgressTips:1,success:e=>{const t=e.translateResult||"";t&&V(n=>n+t)},fail:e=>{console.error("❌ [WeChat] translateVoice failed:",e),alert("微信语音转文字失败，请重试")},complete:()=>{d(!1),I.current=!1}})},[]);y.useEffect(()=>{if(!A)return;let a=!1;return(async()=>{try{if(await de(),a)return;L(!0),j(null),O.onVoiceRecordEnd({complete:e=>{B(e.localId)}}),console.log("✅ [InnerWhisperJournal] 微信 JSSDK 已就绪（录音）")}catch(e){console.error("❌ [InnerWhisperJournal] 微信 JSSDK 初始化失败:",e),a||(L(!1),j(e instanceof Error?e.message:String(e)))}})(),()=>{a=!0}},[A,B]),y.useEffect(()=>{if(!A){if(console.group("🎤 [InnerWhisperJournal] 语音识别初始化"),console.log("🔍 检测浏览器支持..."),"webkitSpeechRecognition"in window||"SpeechRecognition"in window){const a=window.webkitSpeechRecognition||window.SpeechRecognition;try{x.current=new a,x.current.continuous=!0,x.current.interimResults=!0,x.current.lang="zh-CN",x.current.onresult=e=>{let t="";for(let n=e.resultIndex;n<e.results.length;n++){const r=e.results[n][0].transcript;e.results[n].isFinal&&(t+=r)}t&&V(n=>n+t)},x.current.onerror=e=>{e.error!=="no-speech"&&(e.error==="not-allowed"&&alert(`麦克风权限被拒绝

请在浏览器设置中允许麦克风权限，然后刷新页面重试。`),d(!1),I.current=!1)},x.current.onend=()=>{if(I.current&&x.current)try{x.current.start()}catch{d(!1),I.current=!1}}}catch(e){console.error("❌ 创建语音识别对象失败:",e)}}else console.warn("⚠️ 浏览器不支持语音识别 API");return console.groupEnd(),()=>{if(x.current)try{x.current.stop()}catch{}}}},[A]),y.useEffect(()=>{let a;return m?a=setInterval(()=>{P(Math.random()*.5+.5)},100):P(0),()=>clearInterval(a)},[m]);const F=async()=>{if(A){if(!z){alert(i?`微信语音未就绪：${i}
请确认已配置 /api/wechat-config 并重新打开页面`:"微信语音正在初始化，请稍候再试…");return}m?O.stopRecord({success:a=>{B(a.localId)},fail:a=>{console.error("❌ [WeChat] stopRecord failed:",a),d(!1),I.current=!1,alert("停止录音失败，请重试")}}):O.startRecord({success:()=>{d(!0),I.current=!0},fail:a=>{console.error("❌ [WeChat] startRecord failed:",a),alert("开始录音失败，请检查微信录音权限")}});return}if(!x.current){alert(`您的浏览器不支持语音输入功能

建议使用:
- Chrome 浏览器
- Edge 浏览器
- Safari 浏览器`);return}if(m)try{x.current.stop(),d(!1),I.current=!1}catch(a){console.error("❌ 停止语音识别失败:",a),d(!1),I.current=!1}else try{await x.current.start(),d(!0),I.current=!0}catch(a){let e=`无法启动语音识别

`;a instanceof Error&&a.message.includes("not-allowed")?(e+=`原因：麦克风权限被拒绝

`,e+=`解决方法：
`,e+=`1. 点击地址栏左侧的锁图标
`,e+=`2. 找到"麦克风"权限
`,e+='3. 选择"允许"并刷新页面'):a instanceof Error&&a.message.includes("already-started")?(e+=`原因：语音识别已经在运行

`,e+="解决方法：请刷新页面重试"):e+="原因："+(a instanceof Error?a.message:String(a)),alert(e)}},D=async()=>{var a,e;if(b.trim()){h(!0);try{if(console.log("📝 [InnerWhisperJournal] 日记内容已完成，长度:",b.length),!S&&C&&typeof((e=(a=G)==null?void 0:a.auth)==null?void 0:e.getSession)=="function")try{const{data:t}=await G.auth.getSession();t!=null&&t.session&&(await G.from("journal_entries").insert({journal_content:b,source:"app_flow",emotions:T,body_states:R}),console.log("✅ [InnerWhisperJournal] Saved to journal_entries (app flow + session)"))}catch(t){console.warn("⚠️ [InnerWhisperJournal] DB save skipped or failed:",t)}S?S(b):_($(U,"/transition"),{state:{...c,userName:c==null?void 0:c.userName,higherSelfName:c==null?void 0:c.higherSelfName,emotions:T,bodyStates:R,journalContent:b}})}catch(t){console.error("Error saving journal:",t),S?S(b):_($(U,"/transition"),{state:{...c,userName:c==null?void 0:c.userName,higherSelfName:c==null?void 0:c.higherSelfName,emotions:T,bodyStates:R,journalContent:b}})}finally{h(!1)}}};return l.jsxs("div",{className:"min-h-screen relative overflow-hidden inner-whisper-entry",style:{backgroundColor:"#020d0a"},children:[l.jsxs("div",{className:"fixed inset-0 w-full h-full",style:{zIndex:1,backgroundColor:"#020d0a",WebkitTransform:"translate3d(0,0,0)",transform:"translate3d(0,0,0)"},children:[l.jsx("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,preload:"metadata",crossOrigin:"anonymous",poster:"/assets/79757b3cae9165b1c14088a60f3c4d94.jpg",className:"absolute inset-0 w-full h-full object-cover",style:{filter:"contrast(1.2) brightness(1.1) saturate(1.1)",WebkitTransform:"translate3d(0,0,0)",transform:"translate3d(0,0,0)",willChange:"transform",backgroundColor:"#020d0a",opacity:M?1:0,transition:"opacity 700ms ease"},onLoadedMetadata:a=>{const e=a.currentTarget;J(!0),e.play().catch(t=>console.log("Video autoplay failed:",t))},children:l.jsx("source",{src:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/fe2rqfs27y-1772615676760.mp4",type:"video/mp4"})}),l.jsx("div",{className:"absolute inset-0 w-full h-full",style:{backgroundColor:"rgba(2, 13, 10, 0.15)"}})]}),l.jsx("div",{className:"absolute top-6 left-6 z-50",children:s&&l.jsxs("button",{onClick:s,className:"flex items-center gap-2 text-amber-200/80 hover:text-amber-100 transition-colors",style:{textShadow:"0 0 10px rgba(251, 191, 36, 0.5)"},children:[l.jsx(re,{size:24}),l.jsx("span",{style:{letterSpacing:"0.2em"},children:"返回"})]})}),l.jsxs("div",{className:"relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20",children:[l.jsx("h1",{className:"journal-title mb-4",style:{color:"#F7E7CE",fontSize:"28px",fontWeight:300,letterSpacing:"0.5em",textAlign:"center",textShadow:"0 0 20px rgba(247, 231, 206, 0.6), 0 0 40px rgba(235, 200, 98, 0.3)",marginBottom:"48px"},children:k.title||"内在的低语"}),l.jsxs("div",{className:"journal-container max-w-3xl w-full relative",children:[l.jsxs("div",{className:"jade-tablet",children:[l.jsx("textarea",{ref:Q,value:b,onChange:a=>V(a.target.value),placeholder:k.placeholder||"在此记录你内心深处的声音...",className:"journal-textarea",rows:12}),l.jsx("div",{className:"inner-glow"})]}),l.jsxs("div",{className:"flex justify-center mt-8 gap-4 flex-col items-center",children:[l.jsxs("button",{onClick:F,className:`voice-button ${m?"listening":""}`,disabled:g,title:m?"点击停止语音输入":"点击开始语音输入",children:[l.jsx("div",{className:"voice-button-ring",style:{opacity:W,transform:`scale(${1+W*.3})`}}),l.jsx("div",{className:"voice-button-inner",children:m?l.jsx(ie,{size:24}):l.jsx(ae,{size:24})}),m&&l.jsx("div",{className:"listening-indicator",children:[...Array(3)].map((a,e)=>l.jsx("div",{className:"sound-wave",style:{animationDelay:`${e*.15}s`}},e))})]}),l.jsx("div",{style:{textAlign:"center",color:"rgba(247, 231, 206, 0.7)",fontSize:"14px",letterSpacing:"0.1em",marginTop:"8px",textShadow:"0 0 10px rgba(247, 231, 206, 0.3)"},children:m?k.voice_listening||"🎤 正在聆听...":k.voice_hint||"点击喇叭开始语音输入"})]}),l.jsx("div",{className:"mt-8 max-w-md mx-auto",children:l.jsx(ne,{onClick:D,disabled:!b.trim()||g,className:"w-full",children:g?"保存中...":k.submit_button||"完成书写"})})]})]}),l.jsx("style",{children:`
        .inner-whisper-entry {
          animation: journalEntryFadeIn 420ms ease-out both;
        }

        @keyframes journalEntryFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .journal-title {
          animation: titleGlow 4s ease-in-out infinite;
        }

        @keyframes titleGlow {
          0%, 100% {
            text-shadow:
              0 0 20px rgba(247, 231, 206, 0.6),
              0 0 40px rgba(235, 200, 98, 0.3);
          }
          50% {
            text-shadow:
              0 0 30px rgba(247, 231, 206, 0.8),
              0 0 60px rgba(235, 200, 98, 0.5),
              0 0 90px rgba(235, 200, 98, 0.2);
          }
        }

        .journal-container {
          animation: containerFloat 6s ease-in-out infinite;
        }

        @keyframes containerFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .jade-tablet {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(240, 240, 235, 0.12) 0%,
            rgba(230, 235, 230, 0.15) 50%,
            rgba(235, 235, 230, 0.12) 100%
          );
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(247, 231, 206, 0.15);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 0 60px rgba(255, 255, 255, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 80px rgba(247, 231, 206, 0.1);
          overflow: hidden;
        }

        .inner-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          background: radial-gradient(
            circle at center,
            rgba(247, 231, 206, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
          animation: innerPulse 5s ease-in-out infinite;
        }

        @keyframes innerPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .journal-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.95);
          font-size: 18px;
          line-height: 1.8;
          letter-spacing: 0.02em;
          resize: none;
          font-weight: 300;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }

        .journal-textarea::placeholder {
          color: rgba(247, 231, 206, 0.4);
          font-style: italic;
        }

        .journal-textarea::-webkit-scrollbar {
          width: 6px;
        }

        .journal-textarea::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .journal-textarea::-webkit-scrollbar-thumb {
          background: rgba(247, 231, 206, 0.3);
          border-radius: 3px;
        }

        .journal-textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(247, 231, 206, 0.5);
        }

        .voice-button {
          position: relative;
          width: 80px;
          height: 80px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .voice-button-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(247, 231, 206, 0.6);
          box-shadow:
            0 0 20px rgba(247, 231, 206, 0.5),
            0 0 40px rgba(235, 200, 98, 0.3),
            inset 0 0 20px rgba(247, 231, 206, 0.2);
          transition: all 0.15s ease;
        }

        .voice-button.listening .voice-button-ring {
          animation: pulseRing 1.5s ease-in-out infinite;
        }

        @keyframes pulseRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        .voice-button-inner {
          position: relative;
          z-index: 2;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.25) 0%,
            rgba(235, 200, 98, 0.15) 100%
          );
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F7E7CE;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .voice-button:hover .voice-button-inner {
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.35) 0%,
            rgba(235, 200, 98, 0.25) 100%
          );
          box-shadow:
            0 6px 25px rgba(247, 231, 206, 0.3),
            inset 0 0 25px rgba(255, 255, 255, 0.15);
        }

        .voice-button.listening .voice-button-inner {
          background: linear-gradient(
            135deg,
            rgba(247, 231, 206, 0.45) 0%,
            rgba(235, 200, 98, 0.35) 100%
          );
          animation: innerGlow 2s ease-in-out infinite;
        }

        @keyframes innerGlow {
          0%, 100% {
            box-shadow:
              0 4px 20px rgba(247, 231, 206, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 6px 30px rgba(247, 231, 206, 0.6),
              inset 0 0 30px rgba(255, 255, 255, 0.3);
          }
        }

        .listening-indicator {
          position: absolute;
          bottom: -30px;
          display: flex;
          gap: 4px;
          justify-content: center;
        }

        .sound-wave {
          width: 3px;
          height: 16px;
          background: linear-gradient(
            to top,
            rgba(247, 231, 206, 0.8),
            rgba(235, 200, 98, 0.4)
          );
          border-radius: 2px;
          animation: soundWave 0.8s ease-in-out infinite;
        }

        @keyframes soundWave {
          0%, 100% {
            height: 8px;
            opacity: 0.5;
          }
          50% {
            height: 20px;
            opacity: 1;
          }
        }
      `})]})}export{fe as default};
