import{r,q as ie,s as se,l as h,m as l,e as m,d as P,f as t,v as H,h as x,x as le,T as re,y as C,A as ce,B as de,C as ue,S as we,D as ve,L as me,I as pe,O as ge,o as g,F as fe,G as he,H as V,t as M,u as Me,J as _e,c as ke}from"./vendor.Bd9vWuj8.js";import{_ as Ae}from"./index.DZRJBIJ_.js";const Le={class:"map-search"},ye={class:"search-box"},Se={key:0,class:"distance-info"},Pe={class:"address-list"},xe={key:0,class:"travel-info"},Ce={class:"travel-cards"},Te={class:"info"},ze={class:"distance"},be={class:"time"},Re={class:"info"},Ie={class:"distance"},Be={class:"time"},$e={class:"info"},De={class:"distance"},Ve={class:"time"},Ee={__name:"index",setup(Fe){const p=r(""),A=r(!1),E=r(!1),_=r([]),T=r(!0),N=Me(),c=r(null),z=r(""),w=r({driving:{distance:"等待搜索...",time:"等待搜索..."},riding:{distance:"等待搜索...",time:"等待搜索..."},walking:{distance:"等待搜索...",time:"等待搜索..."}}),v=r(""),f=r(!1),b=r(!1),L=r({top:"120px",right:"15px"}),y=r(!1),F=r(0),q=r(0),U=r(0),X=r(0),W=e=>{y.value=!0,F.value=e.touches[0].clientY,q.value=e.touches[0].clientX,U.value=parseInt(L.value.top),X.value=parseInt(L.value.right)},G=e=>{if(!y.value)return;const n=e.touches[0].clientY-F.value,o=e.touches[0].clientX-q.value;let i=U.value+n,a=X.value-o;const s=window.innerHeight-50;i=Math.max(60,Math.min(i,s)),a=Math.max(0,Math.min(a,window.innerWidth-50)),L.value={top:`${i}px`,right:`${a}px`},e.cancelable&&requestAnimationFrame(()=>{e.preventDefault()})},J=()=>{y.value=!1},d=r(!0),O=e=>{if(y.value){e.stopPropagation();return}f.value=!f.value},R=e=>{e===v.value&&d.value||(S(),v.value=e,d.value=!0,I(e))},Z=()=>{d.value=!d.value,d.value?I(v.value):S()},S=()=>{window.driving&&window.driving.clear(),window.riding&&window.riding.clear(),window.walking&&window.walking.clear()},I=e=>{if(S(),!d.value)return;const n=window[e];if(n&&c.value&&window.marker){const o=window.marker.getPosition(),i=new AMap.LngLat(c.value[0],c.value[1]),a=new AMap.LngLat(o.getLng(),o.getLat());n.search(i,a,(s,k)=>{s==="complete"&&k.routes&&k.routes[0]?(n.clear(),n.search(i,a,{showMarker:!1,waypoints:[],autoFitView:!1})):console.error(`${e} 路线规划失败:`,s,k)})}},j=e=>{S(),window.marker&&window.marker.setMap(null);const n=new AMap.LngLat(e[0],e[1]);if(window.marker=new AMap.Marker({position:n,icon:new AMap.Icon({size:new AMap.Size(25,34),imageSize:new AMap.Size(25,34),image:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"}),offset:new AMap.Pixel(-12,-34),zIndex:2}),window.marker.setMap(window.map),window.map.setCenter(n),c.value){const o=e[0]===c.value[0]&&e[1]===c.value[1];b.value=!o,o||(ee(e),d.value&&I(v.value))}},B=e=>e<1e3?`${Math.round(e)}米`:`${(e/1e3).toFixed(1)}公里`,$=e=>{const n=Math.floor(e/3600),o=Math.ceil(e%3600/60);return n>0?`约${n}小时${o}分钟`:`约${o}分钟`},D=()=>new Promise((e,n)=>{if(!p.value){C("请输入搜索地址"),n(new Error("空地址"));return}window.placeSearch.search(p.value,(o,i)=>{o==="complete"&&i.poiList&&i.poiList.pois&&i.poiList.pois.length>0?(_.value=i.poiList.pois.map(a=>({id:a.id||Math.random().toString(36).substr(2,9),name:a.name||"未知地点",address:a.address||"暂无地址",location:a.location?[a.location.lng,a.location.lat]:c.value})),_.value.length>0&&(f.value=!0,Y(_.value[0],!0)),e()):(C("未找到相关地址"),n(new Error("搜索失败")))})}),K=e=>{e||(_.value=[],document.activeElement===document.querySelector(".van-search__field input")&&(z.value=""))},Q=()=>{A.value=!1,E.value=!0},ee=e=>{if(!c.value)return;const n=new AMap.LngLat(c.value[0],c.value[1]),o=new AMap.LngLat(e[0],e[1]);window.driving.search(n,o,(i,a)=>{if(i==="complete"&&a.routes&&a.routes[0]){const s=a.routes[0];w.value.driving={distance:B(s.distance),time:$(s.time)}}}),window.riding.search(n,o,(i,a)=>{if(i==="complete"&&a.routes&&a.routes[0]){const s=a.routes[0];w.value.riding={distance:B(s.distance),time:$(s.time)}}}),window.walking.search(n,o,(i,a)=>{if(i==="complete"&&a.routes&&a.routes[0]){const s=a.routes[0];w.value.walking={distance:B(s.distance),time:$(s.time)}}})},ne=async()=>{ce({message:"加载中...",forbidClick:!0,duration:0});try{const{address:e}=N.query,n=[117.26673,39.069586];let o=n;if(!e&&navigator.geolocation)try{const s=await ae();o=[s.coords.longitude,s.coords.latitude]}catch(s){console.error("获取位置失败：",s),C("定位失败，使用默认位置"),o=n}c.value=o,window._AMapSecurityConfig={securityJsCode:"d71d134ad30466716eba94c299f43ee8"},await de.load({key:"d61c96ab9e393a548ca4d1e14272ce64",version:"2.0",plugins:["AMap.PlaceSearch","AMap.Scale","AMap.ToolBar","AMap.GeometryUtil","AMap.Driving","AMap.Walking","AMap.Riding"]}),window.map=new AMap.Map("container",{viewMode:"3D",zoom:16,center:o});const i=new AMap.Scale({position:"LB"});window.map.addControl(i);const a=new AMap.ToolBar({position:"RB",offset:new AMap.Pixel(10,40),showZoomBar:!0,showControlButton:!1,theme:"light"});window.map.addControl(a),window.placeSearch=new AMap.PlaceSearch({city:"天津",pageSize:10,pageIndex:1}),window.driving=new AMap.Driving({policy:AMap.DrivingPolicy.LEAST_TIME,map:window.map}),window.riding=new AMap.Riding({map:window.map}),window.walking=new AMap.Walking({map:window.map}),oe(c.value),e&&(p.value=e,f.value=!0,await D()),ue(),T.value=!1}catch(e){console.error("地图初始化失败：",e),C("地图加载失败"),T.value=!1}},ae=()=>new Promise((e,n)=>{navigator.geolocation.getCurrentPosition(o=>e(o),o=>n(o),{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})}),oe=e=>{window.currentLocationMarker&&window.currentLocationMarker.setMap(null);const n=new AMap.LngLat(e[0],e[1]);window.currentLocationMarker=new AMap.Marker({position:n,icon:new AMap.Icon({size:new AMap.Size(25,34),imageSize:new AMap.Size(25,34),image:"//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png"}),offset:new AMap.Pixel(-12,-34),zIndex:1}),window.currentLocationMarker.setMap(window.map)},Y=(e,n=!1)=>{n||(p.value=e.name),j(e.location),window.map.setZoom(17),f.value=!0,v.value=""};return ie(()=>{ne()}),se(()=>{window.map&&(window.map.destroy(),window.map=null,window.marker=null,window.currentLocationMarker=null,window.placeSearch=null,window.driving=null,window.riding=null,window.walking=null)}),(e,n)=>{const o=we,i=ve,a=me,s=pe,k=_e,te=ge;return g(),h("div",Le,[l("div",ye,[m(o,{modelValue:t(p),"onUpdate:modelValue":[n[0]||(n[0]=u=>H(p)?p.value=u:null),K],placeholder:"请输入地址","show-action":"",onSearch:D},{action:P(()=>[l("span",{onClick:D},"搜索")]),_:1},8,["modelValue"])]),n[8]||(n[8]=l("div",{id:"container"},null,-1)),t(z)?(g(),h("div",Se,[m(i,{title:t(z)},null,8,["title"])])):x("",!0),l("div",Pe,[m(a,{loading:t(A),"onUpdate:loading":n[1]||(n[1]=u=>H(A)?A.value=u:null),finished:t(E),"finished-text":"没有更多了",onLoad:Q},{default:P(()=>[(g(!0),h(fe,null,he(t(_),u=>(g(),ke(i,{key:u.id,title:u.name,label:u.address,onClick:qe=>Y(u)},null,8,["title","label","onClick"]))),128))]),_:1},8,["loading","finished"])]),t(b)?(g(),h("div",{key:1,class:"route-btn",onClick:O,onTouchstartPassive:W,onTouchmovePassive:G,onTouchendPassive:J,style:le(t(L))},[m(s,{name:"guide-o",size:"24"})],36)):x("",!0),t(b)?(g(),h("div",{key:2,class:"route-toggle-btn",onClick:Z},[m(s,{name:t(d)?"eye-o":"closed-eye",size:"24"},null,8,["name"])])):x("",!0),m(re,{name:"slide"},{default:P(()=>[t(f)&&t(w).driving?(g(),h("div",xe,[l("div",Ce,[l("div",{class:V(["travel-card",{active:t(v)==="driving"&&t(d)}]),onClick:n[2]||(n[2]=u=>R("driving"))},[n[5]||(n[5]=l("div",{class:"mode-icon"},"🚗",-1)),l("div",Te,[l("div",ze,M(t(w).driving.distance),1),l("div",be,M(t(w).driving.time),1)])],2),l("div",{class:V(["travel-card",{active:t(v)==="riding"&&t(d)}]),onClick:n[3]||(n[3]=u=>R("riding"))},[n[6]||(n[6]=l("div",{class:"mode-icon"},"🚲",-1)),l("div",Re,[l("div",Ie,M(t(w).riding.distance),1),l("div",Be,M(t(w).riding.time),1)])],2),l("div",{class:V(["travel-card",{active:t(v)==="walking"&&t(d)}]),onClick:n[4]||(n[4]=u=>R("walking"))},[n[7]||(n[7]=l("div",{class:"mode-icon"},"🚶",-1)),l("div",$e,[l("div",De,M(t(w).walking.distance),1),l("div",Ve,M(t(w).walking.time),1)])],2)])])):x("",!0)]),_:1}),m(te,{show:t(T),class:"loading-overlay"},{default:P(()=>[m(k,{type:"spinner",color:"#1989fa"})]),_:1},8,["show"])])}}},Ye=Ae(Ee,[["__scopeId","data-v-5fdd37a3"]]);export{Ye as default};