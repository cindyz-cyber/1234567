import{d as G,u as L,b as W,i as Z,r as s,k as H,l as q,j as t,f as B,m as J,n as K,o as Q}from"./index-GBfQbJWy.js";import{c as X}from"./globalBackgroundPreloader-BQr9uIII.js";import{D as Y}from"./dialogueAmbient-fhSxB5a0.js";const ee=new URL("/assets/meditation_bg-BHWTnVAD.mp4",import.meta.url).href,te=new URL("/assets/%E9%9F%B3%E9%A2%91%E5%86%A5%E6%83%B3%E5%BC%95%E5%AF%BC2.0-DMUT_ISW.mp3",import.meta.url).href;function D(d,x){const u=d.includes("?")?"&":"?";return`${d}${u}v=${x}`}function se({userName:d,higherSelfName:x,onComplete:u,backgroundMusicUrl:l,backgroundVideoUrl:k,globalAudio:m,isMusicVideo:_=!1,autoAdvance:M=!0,meditationMode:I=!1}){const g=G(),{flowBase:R}=L(),b=W(),r=b.state,T=d??(r==null?void 0:r.userName)??"",h=x??(r==null?void 0:r.higherSelfName)??"",n=Z({search:b.search,stateMeditation:r==null?void 0:r.meditationMode,propMeditation:I}),y=n,[P,C]=s.useState(!1),[S,z]=s.useState(!1),F=s.useRef(Date.now()),i=s.useRef(null),v=s.useRef(!1),w=s.useRef(!1),c=s.useRef(u);c.current=u;const N=s.useRef({userName:T,higherSelfName:h,routeState:r,flowBase:R,isMeditationActive:n});N.current={userName:T,higherSelfName:h,routeState:r,flowBase:R,isMeditationActive:n},s.useEffect(()=>{if(n)return;const e=document.createElement("link");return e.rel="preload",e.as="video",e.href=Y,e.crossOrigin="anonymous",document.head.appendChild(e),()=>{try{e.parentNode&&document.head.removeChild(e)}catch{}}},[n]);const O="https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4",j=l&&H(l),U=n?D(ee,F.current):j?l:k||O,V=()=>{var A;w.current=!0,z(!0),C(!0);const e=N.current,o={...e.routeState,userName:e.userName,higherSelfName:e.higherSelfName,journalContent:(A=e.routeState)==null?void 0:A.journalContent,meditationMode:!0};window.setTimeout(()=>{c.current?c.current(i.current):g(B(e.flowBase,"/dialogue"),{state:o})},480)};return s.useEffect(()=>{q(),X();let e,o;const E=1e4;return(async()=>{if(v.current)return;v.current=!0;try{if(n){const a=await J(D(te,F.current),.4);i.current=a}else if(m)await K(m),i.current=m;else if(!j){const a=l||"",p=a?`${a}?t=${Date.now()}`:"",f=await Q(p);i.current=f}}finally{v.current=!1}M&&!y&&(e=window.setTimeout(()=>C(!0),E-1e3),o=window.setTimeout(()=>{var p,f;w.current=!0;const a=N.current;c.current?c.current(i.current):g(B(a.flowBase,"/dialogue"),{state:{...a.routeState,userName:a.userName,higherSelfName:a.higherSelfName,journalContent:(p=a.routeState)==null?void 0:p.journalContent,meditationMode:a.isMeditationActive||((f=a.routeState)==null?void 0:f.meditationMode)}})},E))})(),()=>{if(typeof e<"u"&&clearTimeout(e),typeof o<"u"&&clearTimeout(o),i.current&&!w.current){try{i.current.pause(),i.current.src="",i.current.load()}catch{}i.current=null}}},[n,y,M,b.search,g,m,l,k,j]),t.jsxs("div",{className:"min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden",style:{opacity:P?0:1,transition:S?"opacity 0.45s ease":"opacity 2s ease"},children:[t.jsx("div",{className:"fixed inset-0 w-full h-full z-[-1] bg-[#020d0a]",children:t.jsx("video",{autoPlay:!0,loop:!0,muted:n?!0:!_,playsInline:!0,className:"w-full h-full object-cover opacity-60",children:t.jsx("source",{src:U,type:"video/mp4"})})}),n&&t.jsx("div",{className:"meditation-welcome-overlay pointer-events-none",children:"进入 Cindy 的冥想空间"}),t.jsxs("div",{className:"flex flex-col items-center gap-8 z-10 w-full max-w-xl",children:[t.jsxs("div",{className:"relative flex items-center justify-center outline-none border-none bg-transparent p-0 z-10 pointer-events-none","aria-hidden":!0,children:[t.jsx("div",{className:"absolute divine-aura pointer-events-none"}),t.jsx("div",{className:"divine-golden-tree",children:[...Array(12)].map((e,o)=>t.jsx("div",{className:"golden-particle pointer-events-none",style:{animationDelay:`${o*.7}s`,animationDuration:`${6+o%3}s`}},o))})]}),!n&&t.jsxs("div",{className:"text-center",children:[t.jsx("p",{className:"text-[#F7E7CE] text-lg tracking-[0.4em] mb-4",children:"带着问题，闭上眼， 打开心。。。"}),t.jsxs("p",{className:"text-[#F7E7CE] opacity-70 tracking-[0.3em]",children:["正在连接你的 ",h]})]})]}),y&&t.jsx("div",{className:"fixed bottom-[max(1.5rem,6vh)] left-0 right-0 z-30 flex justify-center px-6 pointer-events-auto",children:t.jsx("button",{type:"button",onClick:V,className:"px-10 sm:px-14 py-3.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/30 text-[#F7E7CE] text-sm sm:text-[15px] tracking-[0.28em] sm:tracking-[0.35em] shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:bg-white/16 hover:border-white/45 active:scale-[0.98] transition-all duration-300 font-light max-w-[min(92vw,420px)] w-full sm:w-auto text-center",children:"点击留下智慧"})}),t.jsx("style",{children:`
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
      `})]})}export{se as default};
