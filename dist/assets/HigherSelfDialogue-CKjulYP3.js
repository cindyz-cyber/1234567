import{c,r as a,j as e,P as k,G as v}from"./index-CjTV2LxW.js";import{C as j}from"./chevron-left-xqiut3l-.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=c("Volume2",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07",key:"ltjumu"}],["path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14",key:"1kegas"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=c("VolumeX",[["polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5",key:"16drj5"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]);function G({userName:S,higherSelfName:C,journalContent:R,backgroundMusic:s,onComplete:u,onBack:l}){const[t,b]=a.useState(""),[r,p]=a.useState(""),[P,d]=a.useState(!1),[i,T]=a.useState(s||null),[n,g]=a.useState(!!s),[x,h]=a.useState(!1),f=a.useRef(null),m=a.useRef(null);a.useEffect(()=>{if(t.length>r.length){d(!0);const o=setTimeout(()=>{p(t.slice(0,r.length+1))},50);return()=>clearTimeout(o)}else t.length<r.length?p(t):d(!1)},[t,r]);const y=()=>{i&&(n?(i.pause(),g(!1)):(i.play().catch(o=>console.error("Audio play error:",o)),g(!0)))},w=()=>{t.trim()&&(h(!0),setTimeout(()=>{u(t.trim(),i)},800))};return e.jsxs("div",{className:"min-h-screen flex flex-col relative overflow-hidden",children:[e.jsx(k,{videoSrc:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/fe2rqfs27y-1772615676760.mp4",posterImg:"/assets/ecb075f8800e9ca0b7ffce2ee54c75ac.jpg"}),e.jsxs("div",{className:"portal-video-container",style:{display:"none"},children:[e.jsx("video",{ref:f,autoPlay:!1,loop:!1,muted:!0,playsInline:!0,preload:"none",crossOrigin:"anonymous",className:"portal-video",style:{WebkitTransform:"translate3d(0,0,0)",transform:"translate3d(0,0,0)"},children:e.jsx("source",{src:"https://sipwtljnvzicgexlngyc.supabase.co/storage/v1/object/public/videos/backgrounds/tq3r5bzzfbj-1772600548434.mp4",type:"video/mp4"})}),e.jsx("div",{className:"portal-glow-effect"}),e.jsx("div",{className:"mesh-gradient-transition"})]}),l&&e.jsx("button",{onClick:l,className:"absolute top-8 left-6 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110",style:{backgroundColor:"rgba(235, 200, 98, 0.1)",border:"1px solid rgba(235, 200, 98, 0.3)",backdropFilter:"blur(10px)"},children:e.jsx(j,{size:24,color:"#EBC862"})}),e.jsx("div",{className:"dialogue-content-container",children:e.jsxs("div",{className:"dialogue-inner",children:[e.jsx("h2",{className:"dialogue-greeting",children:"亲爱的，请留下你的感受"}),e.jsxs("div",{className:"zen-dialogue-box",children:[e.jsx("textarea",{ref:m,value:t,onChange:o=>b(o.target.value),className:"dialogue-textarea-input",placeholder:"倾听内在的声音...",autoFocus:!0}),e.jsx("div",{className:"breathing-cursor"})]}),e.jsx("div",{className:"mt-8",children:e.jsx(v,{onClick:w,disabled:!t.trim(),className:"w-full",children:"完成对话"})})]})}),x&&e.jsx("div",{className:"completion-ripple"}),e.jsxs("button",{onClick:y,className:"portal-audio-toggle",title:n?"关闭背景音乐":"开启背景音乐",children:[e.jsx("div",{className:"audio-toggle-glow"}),n?e.jsx(z,{size:22,color:"rgba(200, 220, 255, 0.9)",strokeWidth:1.5}):e.jsx(N,{size:22,color:"rgba(255, 255, 255, 0.3)",strokeWidth:1.5})]}),e.jsx("style",{children:`
        .home-background-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background-color: transparent !important;
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
          -webkit-overflow-scrolling: touch;
        }

        .home-background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) contrast(1.15) saturate(0.9);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .home-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(5, 10, 20, 0.4) 66.666vh,
            rgba(2, 5, 12, 0.7) 100%
          );
        }

        .portal-video-container {
          position: fixed;
          top: 1cm;
          left: 0;
          width: 100%;
          height: 33.333vh;
          overflow: hidden;
          z-index: 1;
          background-color: transparent !important;
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
          -webkit-overflow-scrolling: touch;
        }

        .portal-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.95) contrast(1.05) saturate(1.15);
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }

        .portal-glow-effect {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 140%;
          height: 160px;
          background: radial-gradient(
            ellipse at center,
            rgba(180, 200, 255, 0.18) 0%,
            rgba(150, 170, 220, 0.12) 30%,
            rgba(120, 140, 180, 0.06) 50%,
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
          animation: portalGlowPulse 5s ease-in-out infinite;
        }

        @keyframes portalGlowPulse {
          0%, 100% {
            opacity: 0.5;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1.15);
          }
        }

        .mesh-gradient-transition {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(180, 200, 255, 0.02) 15%,
            rgba(150, 170, 220, 0.03) 30%,
            rgba(120, 140, 180, 0.04) 50%,
            rgba(90, 110, 140, 0.06) 70%,
            rgba(5, 10, 20, 0.4) 100%
          );
          pointer-events: none;
        }

        .dialogue-content-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          padding-top: 33.333vh;
        }

        .dialogue-inner {
          max-width: 600px;
          margin: 0 auto;
          padding: 80px 24px 100px;
        }

        .dialogue-greeting {
          color: rgba(255, 255, 255, 0.85);
          font-size: 19px;
          font-weight: 200;
          letter-spacing: 0.2em;
          line-height: 2.4;
          text-align: center;
          margin-bottom: 70px;
          text-shadow: 0 0 40px rgba(180, 200, 255, 0.2);
          font-family: 'Noto Serif SC', serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          opacity: 0.9;
        }

        .user-name-highlight {
          color: rgba(200, 220, 255, 0.95);
          font-weight: 300;
          letter-spacing: 0.25em;
          text-shadow: 0 0 30px rgba(200, 220, 255, 0.3);
        }

        .zen-dialogue-box {
          position: relative;
          background: rgba(255, 255, 255, 0.015) !important;
          backdrop-filter: blur(60px) saturate(120%);
          -webkit-backdrop-filter: blur(60px) saturate(120%);
          border: 0.5px solid rgba(200, 220, 255, 0.08);
          border-radius: 4px;
          padding: 48px;
          box-shadow:
            inset 0 0 80px rgba(180, 200, 255, 0.01),
            0 8px 40px rgba(0, 0, 0, 0.4);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .zen-dialogue-box::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 4px;
          background: linear-gradient(
            135deg,
            rgba(200, 220, 255, 0.06) 0%,
            rgba(180, 200, 240, 0.03) 30%,
            rgba(160, 180, 220, 0.01) 60%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 1s ease;
          pointer-events: none;
        }

        .zen-dialogue-box:focus-within {
          background: rgba(255, 255, 255, 0.025);
          border-color: rgba(200, 220, 255, 0.15);
          box-shadow:
            inset 0 0 100px rgba(180, 200, 255, 0.02),
            0 12px 60px rgba(0, 0, 0, 0.5);
        }

        .zen-dialogue-box:focus-within::before {
          opacity: 1;
        }

        .dialogue-textarea-input {
          width: 100%;
          min-height: 360px;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.88);
          font-size: 16.5px;
          font-weight: 200;
          line-height: 2.3;
          letter-spacing: 0.15em;
          font-family: 'Noto Serif SC', serif;
          resize: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          caret-color: transparent;
          text-shadow: 0 0 2px rgba(200, 220, 255, 0.1);
        }

        .dialogue-textarea-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
          letter-spacing: 0.2em;
          font-weight: 200;
        }

        .breathing-cursor {
          position: absolute;
          width: 1.5px;
          height: 22px;
          background: linear-gradient(
            to bottom,
            rgba(200, 220, 255, 0.7),
            rgba(180, 200, 240, 0.4)
          );
          bottom: 48px;
          left: 48px;
          animation: breathingCursor 3s ease-in-out infinite;
          pointer-events: none;
          filter: blur(0.3px);
          box-shadow: 0 0 8px rgba(200, 220, 255, 0.3);
        }

        @keyframes breathingCursor {
          0%, 100% {
            opacity: 0.2;
            transform: scaleY(0.9);
          }
          50% {
            opacity: 0.9;
            transform: scaleY(1);
          }
        }

        .completion-ripple {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(200, 220, 255, 0.12) 0%,
            rgba(180, 200, 240, 0.08) 30%,
            transparent 60%
          );
          animation: completionRippleExpand 1.5s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }

        @keyframes completionRippleExpand {
          0% {
            transform: scale(0);
            opacity: 0;
            filter: blur(0);
          }
          30% {
            opacity: 1;
            filter: blur(20px);
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
            filter: blur(40px);
          }
        }

        .portal-audio-toggle {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(40px) saturate(150%);
          -webkit-backdrop-filter: blur(40px) saturate(150%);
          border: 0.5px solid rgba(200, 220, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            inset 0 0 20px rgba(180, 200, 255, 0.03),
            0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 100;
          position: relative;
        }

        .audio-toggle-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(200, 220, 255, 0.15),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
          filter: blur(8px);
        }

        .portal-audio-toggle:hover {
          transform: scale(1.08);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(200, 220, 255, 0.2);
          box-shadow:
            inset 0 0 30px rgba(180, 200, 255, 0.05),
            0 6px 30px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(200, 220, 255, 0.15);
        }

        .portal-audio-toggle:hover .audio-toggle-glow {
          opacity: 1;
          animation: audioGlowPulse 2s ease-in-out infinite;
        }

        .portal-audio-toggle:active {
          transform: scale(0.96);
          transition: all 0.15s ease;
        }

        @keyframes audioGlowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .dialogue-inner {
            padding: 60px 20px 80px;
          }

          .dialogue-greeting {
            font-size: 18px;
            padding: 0 12px;
            margin-bottom: 48px;
          }

          .zen-dialogue-box {
            padding: 32px 24px;
          }

          .dialogue-textarea-input {
            font-size: 15.5px;
            min-height: 320px;
          }

          .breathing-cursor {
            bottom: 32px;
            left: 24px;
          }

          .portal-audio-toggle {
            bottom: 28px;
            right: 28px;
            width: 48px;
            height: 48px;
          }
        }
      `})]})}export{G as default};
