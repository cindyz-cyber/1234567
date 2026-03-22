import{d as H,u as q,b as J,i as X,r as d,k as Y,l as ee,j as n,f as D,m as te,n as re,o as ae}from"./index-CdQv9ECx.js";import{D as oe}from"./dialogueAmbient-fhSxB5a0.js";function ne(){return typeof window>"u"?!1:window.location.search.includes("mode=meditation")}function L(){return ne()}const g={primary:"#0A0A0F",secondary:"#1A1A2E",golden:"#EBC862",accent:"#2A2A3E"},ie={golden_flow:{id:"golden_flow",videoUrl:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/2s48cs4awyy-1772595618844.mp4",posterUrl:new URL("/assets/0_1_640_N-DlEBrR9Z.webp",import.meta.url).href,fallbackColor:g.primary,description:"金色能量流动"},energy_field:{id:"energy_field",videoUrl:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/2s48cs4awyy-1772595618844.mp4",posterUrl:new URL("/assets/0_1_640_N-DlEBrR9Z.webp",import.meta.url).href,fallbackColor:g.secondary,description:"紫色能量场"},resonance_wave:{id:"resonance_wave",videoUrl:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/2s48cs4awyy-1772595618844.mp4",posterUrl:new URL("/assets/0_1_640_N-DlEBrR9Z.webp",import.meta.url).href,fallbackColor:g.accent,description:"蓝色共振波"},zen_vortex:{id:"zen_vortex",videoUrl:"/assets/videos/zen-vortex.mp4",posterUrl:new URL("/assets/0_1_640_N-DlEBrR9Z.webp",import.meta.url).href,fallbackColor:g.golden,description:"金色禅意漩涡"},journal:{id:"journal",videoUrl:"/assets/videos/zen-vortex.mp4",posterUrl:new URL("/assets/0_1_640_N-DlEBrR9Z.webp",import.meta.url).href,fallbackColor:g.primary,description:"觉察日记背景"}},x=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(typeof navigator<"u"?navigator.userAgent:""),B=(()=>{if(typeof navigator>"u"||!("connection"in navigator))return!1;const a=navigator.connection;return(a==null?void 0:a.saveData)||(a==null?void 0:a.effectiveType)==="slow-2g"||(a==null?void 0:a.effectiveType)==="2g"||(a==null?void 0:a.effectiveType)==="3g"})();class se{constructor(){this.injectedLinks=new Set,this.preloadQueue=[],this.activePreloadElements=[]}scanAllBackgrounds(){const e=[];return Object.entries(ie).forEach(([t,r])=>{if(!r){console.warn(`⚠️  背景资源 ${t} 未定义，跳过预加载`);return}r.posterUrl&&e.push({href:r.posterUrl,as:"image",priority:"high"}),!x&&!B&&r.videoUrl&&e.push({href:r.videoUrl,as:"video",type:"video/mp4",priority:t==="golden_flow"?"high":"medium"})}),e}isAudioFile(e){return[".mp3",".wav",".ogg",".m4a",".aac",".flac"].some(r=>e.toLowerCase().endsWith(r))}injectPreloadLink(e){if(this.isAudioFile(e.href)){console.warn(`🚫 阻断音频预加载: ${e.href.split("/").pop()} (确保冷启动)`);return}if(this.injectedLinks.has(e.href))return;const t=document.createElement("link");t.rel="preload",t.href=e.href,t.as=e.as,e.type&&(t.type=e.type),t.crossOrigin="anonymous",document.head.appendChild(t),this.injectedLinks.add(e.href),this.activePreloadElements.push(t),console.log(`📥 预加载注入: ${e.as} - ${e.href.split("/").pop()} (优先级: ${e.priority})`)}cancelAllBackgroundPreloads(){console.group("🛑 [GlobalBackgroundPreloader] 强制取消所有预加载"),console.log("📊 当前活跃预加载元素数:",this.activePreloadElements.length);let e=0;this.activePreloadElements.forEach(t=>{try{t.parentNode&&(t.parentNode.removeChild(t),e++,console.log(`   ✅ 已移除: ${t.href.split("/").pop()}`))}catch(r){console.warn("   ⚠️ 移除失败:",r)}}),this.activePreloadElements=[],this.injectedLinks.clear(),console.log(`✅ 已取消 ${e} 个预加载任务`),console.log("📊 释放带宽和 CPU 资源，全力支撑音频解码"),console.groupEnd()}async startGlobalPreload(){if(L()){console.log("🧘 [Meditation] 跳过全局 BACKGROUND_ASSETS 注入预加载");return}if(console.log(`🌐 全局预加载启动 [${x?"移动端":"桌面端"}, ${B?"慢速网络":"正常网络"}]`),this.preloadQueue=this.scanAllBackgrounds(),this.preloadQueue.length===0){console.log("⚠️  无需预加载（可能为移动端 + 慢速网络）");return}const r=this.preloadQueue.filter(f=>f.as==="image");r.forEach(f=>this.injectPreloadLink(f)),!x&&!B&&setTimeout(()=>{this.preloadQueue.filter(p=>p.as==="video").forEach(p=>this.injectPreloadLink(p))},800),console.log(`✅ 预加载队列: ${r.length} 张图片${x?"":` + ${this.preloadQueue.length-r.length} 个视频`}`)}isPreloaded(e){return this.injectedLinks.has(e)}getStats(){return{totalResources:this.preloadQueue.length,preloadedCount:this.injectedLinks.size,pending:this.preloadQueue.length-this.injectedLinks.size}}}const C=new se;async function le(){return L()?Promise.resolve():C.startGlobalPreload()}function O(){return C.cancelAllBackgroundPreloads()}const ge=Object.freeze(Object.defineProperty({__proto__:null,cancelAllBackgroundPreloads:O,globalBackgroundPreloader:C,initializeGlobalBackgroundPreload:le},Symbol.toStringTag,{value:"Module"})),ce=new URL("/assets/meditation_bg-BHWTnVAD.mp4",import.meta.url).href,de=new URL("/assets/%E9%9F%B3%E9%A2%91%E5%86%A5%E6%83%B3%E5%BC%95%E5%AF%BC2.0-DMUT_ISW.mp3",import.meta.url).href;function z(a,e){const t=a.includes("?")?"&":"?";return`${a}${t}v=${e}`}function ue({userName:a,higherSelfName:e,onComplete:t,backgroundMusicUrl:r,backgroundVideoUrl:f,globalAudio:p,isMusicVideo:$=!1,autoAdvance:R=!0,meditationMode:F=!1}){const v=H(),{flowBase:T}=q(),y=J(),s=y.state,U=a??(s==null?void 0:s.userName)??"",w=e??(s==null?void 0:s.higherSelfName)??"",l=X({search:y.search,stateMeditation:s==null?void 0:s.meditationMode,propMeditation:F}),j=l,[G,S]=d.useState(!1),[I,Q]=d.useState(!1),M=d.useRef(Date.now()),c=d.useRef(null),_=d.useRef(!1),E=d.useRef(!1),m=d.useRef(t);m.current=t;const N=d.useRef({userName:U,higherSelfName:w,routeState:s,flowBase:T,isMeditationActive:l});N.current={userName:U,higherSelfName:w,routeState:s,flowBase:T,isMeditationActive:l},d.useEffect(()=>{if(l)return;const o=document.createElement("link");return o.rel="preload",o.as="video",o.href=oe,o.crossOrigin="anonymous",document.head.appendChild(o),()=>{try{o.parentNode&&document.head.removeChild(o)}catch{}}},[l]);const V="https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4",A=r&&Y(r),Z=l?z(ce,M.current):A?r:f||V,W=()=>{var P;E.current=!0,Q(!0),S(!0);const o=N.current,u={...o.routeState,userName:o.userName,higherSelfName:o.higherSelfName,journalContent:(P=o.routeState)==null?void 0:P.journalContent,meditationMode:!0};window.setTimeout(()=>{m.current?m.current(c.current):v(D(o.flowBase,"/dialogue"),{state:u})},480)};return d.useEffect(()=>{ee(),O();let o,u;const k=1e4;return(async()=>{if(_.current)return;_.current=!0;try{if(l){const i=await te(z(de,M.current),.4);c.current=i}else if(p)await re(p),c.current=p;else if(!A){const i=r||"",h=i?`${i}?t=${Date.now()}`:"",b=await ae(h);c.current=b}}finally{_.current=!1}R&&!j&&(o=window.setTimeout(()=>S(!0),k-1e3),u=window.setTimeout(()=>{var h,b;E.current=!0;const i=N.current;m.current?m.current(c.current):v(D(i.flowBase,"/dialogue"),{state:{...i.routeState,userName:i.userName,higherSelfName:i.higherSelfName,journalContent:(h=i.routeState)==null?void 0:h.journalContent,meditationMode:i.isMeditationActive||((b=i.routeState)==null?void 0:b.meditationMode)}})},k))})(),()=>{if(typeof o<"u"&&clearTimeout(o),typeof u<"u"&&clearTimeout(u),c.current&&!E.current){try{c.current.pause(),c.current.src="",c.current.load()}catch{}c.current=null}}},[l,j,R,y.search,v,p,r,f,A]),n.jsxs("div",{className:"min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden",style:{opacity:G?0:1,transition:I?"opacity 0.45s ease":"opacity 2s ease"},children:[n.jsx("div",{className:"fixed inset-0 w-full h-full z-[-1] bg-[#020d0a]",children:n.jsx("video",{autoPlay:!0,loop:!0,muted:l?!0:!$,playsInline:!0,className:"w-full h-full object-cover opacity-60",children:n.jsx("source",{src:Z,type:"video/mp4"})})}),l&&n.jsx("div",{className:"meditation-welcome-overlay pointer-events-none",children:"进入 Cindy 的冥想空间"}),n.jsxs("div",{className:"flex flex-col items-center gap-8 z-10 w-full max-w-xl",children:[n.jsxs("div",{className:"relative flex items-center justify-center outline-none border-none bg-transparent p-0 z-10 pointer-events-none","aria-hidden":!0,children:[n.jsx("div",{className:"absolute divine-aura pointer-events-none"}),n.jsx("div",{className:"divine-golden-tree",children:[...Array(12)].map((o,u)=>n.jsx("div",{className:"golden-particle pointer-events-none",style:{animationDelay:`${u*.7}s`,animationDuration:`${6+u%3}s`}},u))})]}),!l&&n.jsxs("div",{className:"text-center",children:[n.jsx("p",{className:"text-[#F7E7CE] text-lg tracking-[0.4em] mb-4",children:"带着问题，闭上眼， 打开心。。。"}),n.jsxs("p",{className:"text-[#F7E7CE] opacity-70 tracking-[0.3em]",children:["正在连接你的 ",w]})]})]}),j&&n.jsx("div",{className:"fixed bottom-[max(1.5rem,6vh)] left-0 right-0 z-30 flex justify-center px-6 pointer-events-auto",children:n.jsx("button",{type:"button",onClick:W,className:"px-10 sm:px-14 py-3.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/30 text-[#F7E7CE] text-sm sm:text-[15px] tracking-[0.28em] sm:tracking-[0.35em] shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:bg-white/16 hover:border-white/45 active:scale-[0.98] transition-all duration-300 font-light max-w-[min(92vw,420px)] w-full sm:w-auto text-center",children:"点击留下智慧"})}),n.jsx("style",{children:`
        .meditation-welcome-overlay {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          max-width: 90vw;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          color: rgba(247, 231, 206, 0.95);
          text-shadow:
            0 0 24px rgba(247, 231, 206, 0.5),
            0 2px 12px rgba(0, 0, 0, 0.85);
          animation: meditationWelcomeFadeIn 2.2s ease-out both;
        }

        @keyframes meditationWelcomeFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -46%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .divine-golden-tree {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 1) 0%,
              rgba(255, 255, 255, 0.98) 10%,
              rgba(255, 245, 200, 0.5) 18%,
              rgba(255, 225, 120, 0.35) 35%,
              rgba(250, 210, 100, 0.2) 55%,
              rgba(240, 195, 80, 0.1) 75%,
              transparent 100%
            );
          backdrop-filter: blur(0.5px);
          border: 2.5px solid rgba(255, 230, 120, 0.8);
          animation: crystalBreathe 4s ease-in-out infinite, energyPulse 2s ease-in-out infinite;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 30px rgba(255, 240, 150, 0.9),
            0 0 50px rgba(255, 220, 100, 0.7),
            0 0 80px rgba(255, 200, 80, 0.5),
            0 0 120px rgba(240, 180, 60, 0.3),
            inset 0 0 50px rgba(255, 245, 200, 0.4),
            inset 0 0 25px rgba(255, 255, 255, 0.6);
          transition: all 0.5s ease;
          overflow: hidden;
        }

        .divine-golden-tree::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            transparent 55%,
            rgba(255, 230, 120, 0.15) 65%,
            rgba(255, 215, 100, 0.25) 75%,
            rgba(255, 200, 85, 0.2) 85%,
            rgba(255, 185, 70, 0.12) 92%,
            transparent 100%
          );
          animation: innerGlow 4s ease-in-out infinite;
        }

        .divine-golden-tree::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 240, 180, 0.9);
          box-shadow:
            0 0 10px rgba(255, 220, 100, 0.8),
            0 0 20px rgba(255, 200, 80, 0.6);
          top: 50%;
          left: 50%;
          animation: particleFloat 8s ease-in-out infinite;
        }

        .divine-golden-tree:hover {
          transform: scale(1.05);
          box-shadow:
            0 0 40px rgba(255, 245, 180, 1),
            0 0 70px rgba(255, 225, 110, 0.8),
            0 0 110px rgba(255, 205, 90, 0.6),
            0 0 150px rgba(245, 185, 70, 0.4),
            inset 0 0 60px rgba(255, 250, 220, 0.5),
            inset 0 0 35px rgba(255, 255, 255, 0.7);
          border-color: rgba(255, 235, 130, 1);
        }

        .golden-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 250, 220, 1);
          box-shadow:
            0 0 10px rgba(255, 235, 140, 1),
            0 0 20px rgba(255, 215, 100, 0.7),
            0 0 30px rgba(255, 195, 80, 0.4);
          animation: particleFloat 8s ease-in-out infinite;
          top: 50%;
          left: 50%;
        }

        .divine-aura {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 245, 200, 0.5) 0%,
            rgba(255, 230, 130, 0.4) 20%,
            rgba(255, 215, 100, 0.3) 40%,
            rgba(245, 195, 80, 0.2) 60%,
            transparent 75%
          );
          animation: auraPulse 4s ease-in-out infinite, auraRotate 20s linear infinite;
          z-index: 1;
          filter: blur(60px);
        }

        @keyframes crystalBreathe {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 30px rgba(255, 240, 150, 0.9),
              0 0 50px rgba(255, 220, 100, 0.7),
              0 0 80px rgba(255, 200, 80, 0.5),
              0 0 120px rgba(240, 180, 60, 0.3),
              inset 0 0 50px rgba(255, 245, 200, 0.4),
              inset 0 0 25px rgba(255, 255, 255, 0.6);
          }
          50% {
            transform: scale(1.08);
            box-shadow:
              0 0 45px rgba(255, 245, 180, 1),
              0 0 75px rgba(255, 230, 120, 0.85),
              0 0 110px rgba(255, 210, 95, 0.65),
              0 0 160px rgba(245, 190, 75, 0.45),
              inset 0 0 65px rgba(255, 250, 220, 0.55),
              inset 0 0 35px rgba(255, 255, 255, 0.75);
          }
        }

        @keyframes energyPulse {
          0%, 100% {
            filter: brightness(1.05);
          }
          50% {
            filter: brightness(1.3);
          }
        }

        @keyframes innerGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          25% {
            transform: translate(-50%, -50%) translate(40px, -30px);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) translate(-35px, 45px);
            opacity: 0.7;
          }
          75% {
            transform: translate(-50%, -50%) translate(50px, 35px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) translate(-40px, -40px);
            opacity: 0;
          }
        }

        @keyframes auraRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes auraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
          }
        }
      `})]})}const he=Object.freeze(Object.defineProperty({__proto__:null,default:ue},Symbol.toStringTag,{value:"Module"}));export{ie as B,ue as G,he as a,ge as g,L as i};
