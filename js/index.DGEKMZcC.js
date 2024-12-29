import{r,q as ue,s as ve,l as w,m as n,v as me,x as we,f as o,y as pe,A as ge,F as H,B as O,h as L,e as V,t as u,C as he,d as fe,T as ye,D as Me,G as _e,o as p,H as W,u as ke,I as Ae}from"./vendor.DhklBvcj.js";import{_ as Ce}from"./index.BqoC2cbQ.js";function Le(){const $=r(!1),M=r(""),_=r(!1);let T=null;return{showToast:v=>{if(T){clearTimeout(T);const l=document.querySelector(".custom-toast");l&&document.body.removeChild(l)}typeof v=="string"?(M.value=v,_.value=!1):(M.value=v.message,_.value=v.forbidClick||!1);const c=document.createElement("div");if(c.className="custom-toast",c.textContent=M.value,_.value){const l=document.createElement("div");l.className="toast-overlay",document.body.appendChild(l)}document.body.appendChild(c),$.value=!0,c.offsetHeight,c.style.opacity="1";const g=typeof v=="object"&&v.duration||2500;T=window.setTimeout(()=>{c.classList.add("fade-out"),setTimeout(()=>{if(document.body.removeChild(c),_.value){const l=document.querySelector(".toast-overlay");l&&document.body.removeChild(l)}$.value=!1,_.value=!1},200)},g)},showLoadingToast:v=>{console.log("显示 loading:",v);const c=typeof v=="string"?{message:v,forbidClick:!0}:{...v,forbidClick:!0},g=document.createElement("div");g.className="custom-toast loading-toast";const l=document.createElement("div");if(l.className="loading-spinner",g.appendChild(l),c.message){const h=document.createElement("div");h.className="loading-message",h.textContent=c.message,g.appendChild(h)}if(c.forbidClick){const h=document.createElement("div");h.className="toast-overlay",document.body.appendChild(h)}return document.body.appendChild(g),g.offsetHeight,g.style.opacity="1",()=>{g.classList.add("fade-out"),setTimeout(()=>{document.body.removeChild(g);const h=document.querySelector(".toast-overlay");h&&document.body.removeChild(h)},200)}}}}const be={class:"map-search"},xe={class:"search-box"},Te={class:"search-input-wrapper"},Se={class:"input-container"},Pe={key:0,class:"search-tips"},ze=["onClick"],De=["innerHTML"],Ie={class:"district"},Re={key:0,class:"distance-info"},$e={class:"view-text"},Ee={class:"address-list"},Be=["onClick"],Ne={class:"title"},qe={class:"label"},He={key:1,class:"empty-status"},Ve={key:0,class:"travel-info"},We={class:"travel-cards"},Fe={class:"info"},je={class:"distance"},Xe={class:"time"},Ye={class:"info"},Ke={class:"distance"},Ue={class:"time"},Ge={class:"info"},Je={class:"distance"},Oe={class:"time"},Ze={key:3,class:"weather-info"},Qe={class:"weather-content"},et={class:"current-weather"},tt={class:"temperature"},at={class:"weather"},nt={class:"weather-detail"},ot={__name:"index",setup($){const{showToast:M,showLoadingToast:_}=Le();function T(t,e){let i=null;return function(...s){i&&clearTimeout(i),i=setTimeout(()=>{t.apply(this,s)},e)}}const m=r(""),y=r([]);let v=null;const c=r([]),g=ke(),l=r(null),h=r(""),f=r({driving:{distance:"等待搜索...",time:"等待搜索..."},riding:{distance:"等待搜索...",time:"等待搜索..."},walking:{distance:"等待搜索...",time:"等待搜索..."}}),k=r(""),b=r(!1),F=r(!1),S=r(!0),P=r({top:"245px",right:"24px"}),z=r(!1),j=r(0),X=r(0),Y=r(0),K=r(0),Z=t=>{z.value=!0,j.value=t.touches[0].clientY,X.value=t.touches[0].clientX,Y.value=parseInt(P.value.top),K.value=parseInt(P.value.right)},Q=t=>{if(!z.value)return;const e=t.touches[0].clientY-j.value,i=t.touches[0].clientX-X.value;let s=Y.value+e,a=K.value-i;const d=window.innerHeight-50;s=Math.max(60,Math.min(s,d)),a=Math.max(0,Math.min(a,window.innerWidth-50)),P.value={top:`${s}px`,right:`${a}px`},t.cancelable&&requestAnimationFrame(()=>{t.preventDefault()})},ee=()=>{z.value=!1},A=r(!0),te=t=>{if(z.value){t.stopPropagation();return}b.value=!b.value},E=t=>{t===k.value&&A.value||(B(),k.value=t,A.value=!0,U(t))},B=()=>{window.driving&&window.driving.clear(),window.riding&&window.riding.clear(),window.walking&&window.walking.clear()},U=t=>{if(B(),!A.value)return;const e=window[t];if(e&&l.value&&window.marker){const i=window.marker.getPosition(),s=new AMap.LngLat(l.value[0],l.value[1]),a=new AMap.LngLat(i.getLng(),i.getLat());e.search(s,a,(d,x)=>{d==="complete"&&x.routes&&x.routes[0]?(e.clear(),e.search(s,a,{showMarker:!1,waypoints:[],autoFitView:!1})):console.error(`${t} 路线规划失败:`,d,x)})}},ae=t=>{B(),window.marker&&window.marker.setMap(null);const e=new AMap.LngLat(t[0],t[1]);if(window.marker=new AMap.Marker({position:e,icon:new AMap.Icon({size:new AMap.Size(25,34),imageSize:new AMap.Size(25,34),image:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"}),offset:new AMap.Pixel(-12,-34),zIndex:2}),window.marker.setMap(window.map),window.map.setCenter(e),l.value){const i=t[0]===l.value[0]&&t[1]===l.value[1];F.value=!i,i||(ne(t),A.value&&U(k.value))}},N=t=>t<1e3?`${Math.round(t)}米`:`${(t/1e3).toFixed(1)}公里`,q=t=>{const e=Math.floor(t/3600),i=Math.ceil(t%3600/60);return e>0?`约${e}小时${i}分钟`:`约${i}分钟`},D=()=>new Promise((t,e)=>{if(!m.value.trim())return M("请输入搜索地址"),Promise.reject("empty input");y.value=[],window.placeSearch.search(m.value,(i,s)=>{i==="complete"&&s.poiList&&s.poiList.pois&&s.poiList.pois.length>0?(c.value=s.poiList.pois.map(a=>({id:a.id||Math.random().toString(36).substr(2,9),name:a.name||"未知地点",address:a.address||"暂无地址",location:a.location?[a.location.lng,a.location.lat]:l.value})),c.value.length>0&&(b.value=!0,G(c.value[0],!0)),t()):(M("未找到相关地址"),c.value=[],e(new Error("搜索失败")))})}),ne=t=>{if(!l.value)return;const e=new AMap.LngLat(l.value[0],l.value[1]),i=new AMap.LngLat(t[0],t[1]);window.driving.search(e,i,(s,a)=>{if(s==="complete"&&a.routes&&a.routes[0]){const d=a.routes[0];f.value.driving={distance:N(d.distance),time:q(d.time)}}}),window.riding.search(e,i,(s,a)=>{if(s==="complete"&&a.routes&&a.routes[0]){const d=a.routes[0];f.value.riding={distance:N(d.distance),time:q(d.time)}}}),window.walking.search(e,i,(s,a)=>{if(s==="complete"&&a.routes&&a.routes[0]){const d=a.routes[0];f.value.walking={distance:N(d.distance),time:q(d.time)}}})},oe=()=>{if(S.value=!S.value,window.map){const t=S.value?45:0;window.map.setPitch(t)}},C=r(null),ie=()=>{if(!window.AMap)return;new AMap.Weather().getLive("天津",(e,i)=>{e?console.error("获取天气信息失败：",e):C.value=i})},se=async()=>{const t=_({message:"加载中...",forbidClick:!0});try{const{address:e}=g.query,i=[117.26673,39.069586];let s=i;if(!e&&navigator.geolocation)try{const R=await le();s=[R.coords.longitude,R.coords.latitude]}catch(R){console.error("获取位置失败：",R),M("定位失败，使用默认位置"),s=i}l.value=s,window._AMapSecurityConfig={securityJsCode:"d71d134ad30466716eba94c299f43ee8"},await Me.load({key:"d61c96ab9e393a548ca4d1e14272ce64",version:"2.0",plugins:["AMap.PlaceSearch","AMap.Scale","AMap.ToolBar","AMap.ControlBar","AMap.GeometryUtil","AMap.Driving","AMap.Walking","AMap.Riding","AMap.Weather","AMap.AutoComplete"]}),window.map=new AMap.Map("container",{viewMode:"3D",zoom:14,center:s,pitch:45});const a=new AMap.Scale({position:{left:"5px",bottom:"5px"}});window.map.addControl(a);const d=new AMap.ToolBar({position:{right:"28px",top:"100px"}});window.map.addControl(d);const x=new AMap.ControlBar({position:{right:"0px",top:"0px"}});window.map.addControl(x),window.placeSearch=new AMap.PlaceSearch({city:"天津",pageSize:10,pageIndex:1}),window.driving=new AMap.Driving({policy:AMap.DrivingPolicy.LEAST_TIME,map:window.map}),window.riding=new AMap.Riding({map:window.map}),window.walking=new AMap.Walking({map:window.map}),re(l.value),e&&(m.value=e,b.value=!0,await D()),ie(),v=new AMap.AutoComplete({city:"天津",citylimit:!0,input:""}),t(),I.value=!1}catch(e){console.error("地图初始化失败：",e),M("地图加载失败"),t(),I.value=!1}},le=()=>new Promise((t,e)=>{navigator.geolocation.getCurrentPosition(i=>t(i),i=>e(i),{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})}),re=t=>{window.currentLocationMarker&&window.currentLocationMarker.setMap(null);const e=new AMap.LngLat(t[0],t[1]);window.currentLocationMarker=new AMap.Marker({position:e,icon:new AMap.Icon({size:new AMap.Size(25,34),imageSize:new AMap.Size(25,34),image:"//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png"}),offset:new AMap.Pixel(-12,-34),zIndex:1}),window.currentLocationMarker.setMap(window.map)},G=(t,e=!1)=>{e||(m.value=t.name),ae(t.location),window.map.setZoom(14),b.value=!0,k.value=""},J=T(async()=>{if(!m.value.trim()){y.value=[];return}v.search(m.value,(t,e)=>{t==="complete"&&e.tips?y.value=e.tips:y.value=[]})},300),ce=t=>{if(!m.value.trim())return t;const e=m.value.trim(),i=new RegExp(e,"gi");return t.replace(i,s=>`<span class="highlight">${s}</span>`)},de=t=>{m.value=t.name,y.value=[],D()};ue(()=>{se(),document.addEventListener("click",t=>{const e=document.querySelector(".search-box");e!=null&&e.contains(t.target)||(y.value=[])})}),ve(()=>{window.map&&(window.map.destroy(),window.map=null,window.marker=null,window.currentLocationMarker=null,window.placeSearch=null,window.driving=null,window.riding=null,window.walking=null)});const I=r(!0);return(t,e)=>{const i=_e,s=Ae;return p(),w("div",be,[n("div",xe,[n("div",Te,[n("div",Se,[me(n("input",{type:"text","onUpdate:modelValue":e[0]||(e[0]=a=>pe(m)?m.value=a:null),placeholder:"请输入地址",class:"search-input",onKeyup:ge(D,["enter"]),onInput:e[1]||(e[1]=(...a)=>o(J)&&o(J)(...a))},null,544),[[we,o(m)]]),o(y).length?(p(),w("div",Pe,[(p(!0),w(H,null,O(o(y),(a,d)=>(p(),w("div",{key:d,class:"tip-item",onClick:x=>de(a)},[n("div",{class:"name",innerHTML:ce(a.name)},null,8,De),n("div",Ie,u(a.district),1)],8,ze))),128))])):L("",!0)]),n("button",{class:"search-btn",onClick:D},"搜索")])]),e[9]||(e[9]=n("div",{id:"container"},null,-1)),o(h)?(p(),w("div",Re,[V(i,{title:o(h)},null,8,["title"])])):L("",!0),o(I)?L("",!0):(p(),w("div",{key:1,class:"view-toggle-btn",onClick:oe},[n("span",$e,u(o(S)?"3D":"2D"),1)])),n("div",Ee,[o(I)?L("",!0):(p(),w(H,{key:0},[o(c).length?(p(!0),w(H,{key:0},O(o(c),a=>(p(),w("div",{key:a.id,class:"address-item",onClick:d=>G(a)},[n("div",Ne,u(a.name),1),n("div",qe,u(a.address),1)],8,Be))),128)):(p(),w("div",He,e[5]||(e[5]=[n("img",{src:"https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png",class:"empty-image"},null,-1),n("p",{class:"empty-text"},"暂无地址数据",-1)])))],64))]),o(F)?(p(),w("div",{key:2,class:"route-btn",onClick:te,onTouchstartPassive:Z,onTouchmovePassive:Q,onTouchendPassive:ee,style:he(o(P))},[V(s,{name:"guide-o",size:"24"})],36)):L("",!0),V(ye,{name:"slide"},{default:fe(()=>[o(b)&&o(f).driving?(p(),w("div",Ve,[n("div",We,[n("div",{class:W(["travel-card",{active:o(k)==="driving"&&o(A)}]),onClick:e[2]||(e[2]=a=>E("driving"))},[e[6]||(e[6]=n("div",{class:"mode-icon"},"🚗",-1)),n("div",Fe,[n("div",je,u(o(f).driving.distance),1),n("div",Xe,u(o(f).driving.time),1)])],2),n("div",{class:W(["travel-card",{active:o(k)==="riding"&&o(A)}]),onClick:e[3]||(e[3]=a=>E("riding"))},[e[7]||(e[7]=n("div",{class:"mode-icon"},"🚲",-1)),n("div",Ye,[n("div",Ke,u(o(f).riding.distance),1),n("div",Ue,u(o(f).riding.time),1)])],2),n("div",{class:W(["travel-card",{active:o(k)==="walking"&&o(A)}]),onClick:e[4]||(e[4]=a=>E("walking"))},[e[8]||(e[8]=n("div",{class:"mode-icon"},"🚶",-1)),n("div",Ge,[n("div",Je,u(o(f).walking.distance),1),n("div",Oe,u(o(f).walking.time),1)])],2)])])):L("",!0)]),_:1}),o(C)?(p(),w("div",Ze,[n("div",Qe,[n("div",et,[n("span",tt,u(o(C).temperature)+"°",1),n("span",at,u(o(C).weather),1)]),n("div",nt,[n("span",null,"湿度 "+u(o(C).humidity)+"%",1),n("span",null,u(o(C).windDirection)+"风 "+u(o(C).windPower)+"级",1)])])])):L("",!0)])}}},lt=Ce(ot,[["__scopeId","data-v-2e0e63f9"]]);export{lt as default};