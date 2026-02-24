export default function VideoBackground() {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed w-full object-cover"
        style={{
          top: '66vh',
          bottom: 0,
          height: '34vh',
          zIndex: -2,
          filter: 'contrast(1.2) brightness(1.1) saturate(1.1)'
        }}
      >
        <source src="https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4" type="video/mp4" />
      </video>

      <div
        className="fixed"
        style={{
          top: '66vh',
          left: 0,
          right: 0,
          bottom: 0,
          height: '34vh',
          backgroundColor: 'rgba(2, 13, 10, 0.15)',
          zIndex: -1,
        }}
      />
    </>
  );
}
