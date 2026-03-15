import{r as p,i as G,j as n,a as S}from"./index-BXEqA8xE.js";function C({userName:E,higherSelfName:h,onComplete:m,backgroundMusicUrl:a,backgroundVideoUrl:s,globalAudio:e,isMusicVideo:i=!1,autoAdvance:g=!0}){const[T,f]=p.useState(!1),[w,v]=p.useState(!1),[x,d]=p.useState(null),j="https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4",l=a&&G(a),k=l?a:s&&s.trim()!==""?s:j;p.useEffect(()=>{console.log("🎬 [GoldenTransition] 组件挂载，立即初始化音频"),console.log("🎵 背景音乐 URL:",a),console.log("🎥 背景视频 URL:",s),console.log("🎵 全局音频对象:",e?"有效":"无"),console.log("🎬 媒体类型判断 (内部): isMediaUrlVideo =",l),console.log("🎯 音乐视频标识 (传入): isMusicVideo =",i),console.log("🔊 视频声音策略:",i?"✅ 开启声音 (muted=false, volume=0.3)":"🔇 静音播放 (muted=true)");let t=null,o,u;const b=1e4;return(async()=>{if(console.log("⚡ [GoldenTransition] 开始音频初始化流程"),e){console.log("✅ 使用全局音频对象（已在 validateAccess 中初始化）"),e.preload==="none"&&(console.log('🚀 首次触发音频加载（preload="none" -> "metadata"）'),e.preload="metadata",await new Promise(r=>{const c=()=>{console.log("✅ 音频元数据加载完成"),console.log("⏱️ 音频时长:",e.duration,"秒"),e.removeEventListener("loadedmetadata",c),r()},y=()=>{console.log("✅ 音频可以播放"),e.removeEventListener("canplay",y),r()};e.addEventListener("loadedmetadata",c,{once:!0}),e.addEventListener("canplay",y,{once:!0}),e.load(),console.log("⏳ 音频开始流式加载，等待元数据...")})),console.group("🔥 [GoldenTransition] 强制音频归零断路器");try{e.pause(),console.log("⏸️ 音频已暂停"),e.currentTime=0,console.log("⏮️ 第一次强制归零: currentTime =",e.currentTime),console.log("⏳ 等待 60ms 让浏览器清理音频缓冲区..."),await new Promise(r=>setTimeout(r,60)),e.currentTime=0,console.log("🔄 第二次强制归零: currentTime =",e.currentTime),console.log("📊 音频就绪状态: readyState =",e.readyState),console.log("📡 网络状态: networkState =",e.networkState),console.log("▶️ 开始播放音频..."),await e.play(),console.log("✅ [GoldenTransition] 音乐已从 0 秒强制启动"),console.log("⏱️ 播放后即时位置:",e.currentTime,"秒"),setTimeout(()=>{e.currentTime>.5?(console.warn("⚠️ 检测到播放位置异常 (>0.5s)，第三次强制归零"),e.currentTime=0,console.log("✅ 第三次重置完成，currentTime =",e.currentTime)):console.log("✅ 播放位置验证通过，currentTime =",e.currentTime)},100),t=e,d(e)}catch(r){console.error("❌ App 播放失败，尝试静默恢复:",r);try{e.muted=!0,await e.play(),e.muted=!1,console.log("✅ 静默播放恢复成功"),t=e,d(e)}catch(c){console.error("❌ 静默播放也失败:",c)}}finally{console.groupEnd()}}else l?(console.log("🎬 检测到 MP4 视频作为背景媒体，跳过音频加载"),console.log("📊 视频将在背景中静音播放")):a?(console.log("⚠️ 无全局音频对象，直接加载场景音频..."),console.log("📡 场景音频 URL:",a),console.log("🚫 已禁用主 App 降级"),t=await S(a,!1),t?(console.log("✅ [GoldenTransition] 场景音频加载成功并开始播放"),console.log("⏱️ 当前播放位置:",t.currentTime,"秒"),console.log("🔊 音量:",t.volume),console.log("▶️ 播放状态:",t.paused?"暂停":"播放中"),t.currentTime>.5&&(console.warn("⚠️ 检测到播放位置异常，强制归零"),t.currentTime=0),d(t)):(console.error("❌ [GoldenTransition] 场景音频加载失败"),console.error("💡 请检查 bg_music_url 是否正确配置"))):(console.warn("⚠️ 未配置 backgroundMusicUrl，将在无背景音乐的情况下运行"),console.warn("💡 请到后台 /admin/share-config 配置 bg_music_url"));if(g)o=window.setTimeout(()=>{console.log("🌅 [GoldenTransition] 开始淡出动画"),f(!0)},b-1e3),u=window.setTimeout(()=>{console.log("✅ [GoldenTransition] 过渡完成，传递音频对象给下一步"),console.log("🎵 传递的音频对象:",t?"有效":"无"),m(t)},b);else{const r=window.setTimeout(()=>{console.log("🎯 [GoldenTransition] 显示继续按钮"),v(!0)},3e3);return()=>{clearTimeout(r)}}})(),()=>{console.log("🧹 [GoldenTransition] 组件卸载，清理定时器"),o&&clearTimeout(o),u&&clearTimeout(u)}},[m,a,s,l,e,g]);const N=()=>{console.log("✅ [GoldenTransition] 用户点击继续按钮"),console.log("🎵 传递的音频对象:",x?"有效":"无"),f(!0),setTimeout(()=>{m(x)},1e3)};return n.jsxs("div",{className:"min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden hypnosis-container",style:{opacity:T?0:1,transition:"opacity 2s cubic-bezier(0.4, 0, 0.2, 1)"},children:[n.jsxs("div",{className:"fixed inset-0 w-full h-full",style:{zIndex:-1,backgroundColor:"rgba(2, 13, 10, 0.8)",WebkitTransform:"translate3d(0,0,0)",transform:"translate3d(0,0,0)"},children:[n.jsx("video",{autoPlay:!0,loop:!0,muted:!i,playsInline:!0,preload:"metadata",crossOrigin:"anonymous",poster:"/0_0_640_N.webp",className:"absolute inset-0 w-full h-full object-cover",style:{filter:"contrast(1.2) brightness(1.1) saturate(1.1)",WebkitTransform:"translate3d(0,0,0)",transform:"translate3d(0,0,0)"},ref:t=>{t&&i&&(t.volume=.3,console.log("🔊 [GoldenTransition] 视频音量已设置为 0.3"))},children:n.jsx("source",{src:k,type:"video/mp4"})}),n.jsx("div",{className:"absolute inset-0 w-full h-full",style:{backgroundColor:"rgba(2, 13, 10, 0.15)"}})]}),n.jsx("div",{className:"absolute top-0 left-0 w-full h-[30vh] z-20 pointer-events-none top-vignette"}),n.jsxs("div",{className:"relative flex items-center justify-center mb-12",children:[n.jsx("div",{className:"absolute divine-aura pointer-events-none"}),n.jsx("div",{className:"divine-golden-tree",children:[...Array(12)].map((t,o)=>n.jsx("div",{className:"golden-particle pointer-events-none",style:{animationDelay:`${o*.7}s`,animationDuration:`${6+o%3}s`}},o))})]}),n.jsx("div",{className:"guidance-text-container",style:{minHeight:"120px",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 20px",position:"relative"},children:n.jsx("p",{className:"guidance-text",style:{color:"#F7E7CE",fontSize:"15px",fontWeight:200,letterSpacing:"0.4em",lineHeight:"1.8",textShadow:"0 2px 12px rgba(247, 231, 206, 0.3)",fontFamily:'Georgia, "Times New Roman", serif',opacity:.85,maxWidth:"400px"},children:"带着问题，闭上眼， 打开心。。。"})}),n.jsxs("p",{className:"connection-subtitle",style:{color:"#F7E7CE",fontSize:"14px",fontWeight:200,letterSpacing:"0.35em",opacity:.7,marginTop:"24px",textAlign:"center",fontFamily:'Georgia, "Times New Roman", serif'},children:["正在连接你的 ",n.jsx("span",{className:"highlight-name",children:h})]}),!g&&w&&n.jsx("button",{onClick:N,className:"continue-button",style:{marginTop:"48px",padding:"16px 48px",fontSize:"16px",fontWeight:300,letterSpacing:"0.3em",color:"#000000",backgroundColor:"rgba(247, 231, 206, 0.95)",border:"2px solid rgba(255, 230, 120, 0.8)",borderRadius:"50px",cursor:"pointer",fontFamily:'Georgia, "Times New Roman", serif',boxShadow:"0 4px 20px rgba(255, 230, 120, 0.4)",transition:"all 0.3s ease",animation:"buttonFadeIn 0.8s ease-out"},onMouseEnter:t=>{t.currentTarget.style.transform="scale(1.05)",t.currentTarget.style.boxShadow="0 6px 30px rgba(255, 230, 120, 0.6)",t.currentTarget.style.backgroundColor="rgba(255, 240, 220, 1)"},onMouseLeave:t=>{t.currentTarget.style.transform="scale(1)",t.currentTarget.style.boxShadow="0 4px 20px rgba(255, 230, 120, 0.4)",t.currentTarget.style.backgroundColor="rgba(247, 231, 206, 0.95)"},children:"继续"}),n.jsx("style",{children:`
        .top-vignette {
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.95) 25%,
            rgba(0, 0, 0, 0.8) 50%,
            rgba(0, 0, 0, 0.4) 75%,
            transparent 100%
          );
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

        .guidance-text {
          animation: textFadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .highlight-name {
          font-weight: 300;
          color: #F7E7CE;
          text-shadow: 0 2px 15px rgba(247, 231, 206, 0.5);
          letter-spacing: 0.4em;
          font-family: Georgia, "Times New Roman", serif;
        }

        .connection-subtitle {
          animation: subtlePulse 3s ease-in-out infinite;
        }

        @keyframes subtlePulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes buttonFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .continue-button:active {
          transform: scale(0.98) !important;
        }
      `})]})}export{C as default};
