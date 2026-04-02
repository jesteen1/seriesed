"use client";



import React, { useState, useEffect ,useRef} from 'react';

const Video = ({ MovieLink, episodename }) => {
    const [playerMode, setPlayerMode] = useState('video'); // 'video', 'iframe', 'failed'
   const  links=MovieLink.split(",")
    const playerRef = useRef(null);
    // Reset player mode whenever the movie link changes
    const streamplayer=()=>{

 const existingScript = document.getElementById('webtor-sdk');
        
         if (!existingScript) {
           const script = document.createElement('script');
           script.src = 'https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js';
           script.id = 'webtor-sdk';
           script.async = true;
           script.charset = 'utf-8';
           document.body.appendChild(script);
         }
     
         // Push config to webtor queue
         window.webtor = window.webtor || [];
         window.webtor.push({
           id: 'webtor-player',
           magnet: links[2],   // 👈 your magnet/torrent link
           width: '100%',
           height: '100%',
           
           controls: true,
         });
     
}
    useEffect(() => {
        if (!links[0]) {
            setPlayerMode('iframe');
            return;
        }

    
         // Cleanup on unmount
        
             // Check if the link looks like an iframe-only link (e.g., doesn't end in a video extension)
            

 

       
    }, [links[0]]);

    const handleVideoError = () => {
        if (playerMode === 'video') {
            console.log("Video tag failed, switching to iframe...");
            setPlayerMode('iframe');
        }
    };

    const handleIframeError = () => {
        console.log("Iframe failed as well, showing failure message...");
        setPlayerMode('failed');
    };

    // Prevent loading the app itself in an iframe
    const isInternalLink = MovieLink && (
        MovieLink.startsWith('/') ||
        (typeof window !== 'undefined' && MovieLink.includes(window.location.host))
    );

    if (!MovieLink) return null;

    return (
        <div className="w-full max-w-6xl mx-auto p-4 lg:p-10">
            <div className="relative group overflow-hidden rounded-[2rem] bg-black shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 transition-all duration-700">

                {/* Subtle Animated Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)] animate-pulse"></div>

                <div className="relative">
                    {/* Video Player Section */}
                    <div className="aspect-video w-full bg-[#030303] flex items-center justify-center overflow-hidden">
                        { isInternalLink ? (
                            <div className="flex flex-col items-center gap-6 text-center px-10">
                                <div className="w-20 h-20 rounded-2xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Invalid Link Node</h3>
                                    <p className="text-zinc-400 text-sm mt-2 max-w-sm">
                                        Recursion detected. The selected media node points back to the host application. Please check the source configuration.
                                    </p>
                                </div>
                            </div>
                        ) : playerMode === 'video' ? (

                            <div className='w-full h-full relative group'>
                                

                          <video controls className='w-full h-full object-contain shadow-2xl' src={`/api/stream?magnet=${encodeURIComponent(links[2])}`}></video>
    

                            
                            
                                                  <button
                                    onClick={handleIframeError}
                                    className="z-10 absolute bottom-18   right-4 px-4 py-2  bg-black/50 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border  border-white/10  group-hover/iframe:opacity-100 transition-all duration-300 backdrop-blur-md"
                                >
                                    Report Playback Error
                                </button>
                            </div>
                        )
                        : playerMode === 'torrent' ? (
                            <div className='w-full h-full relative group '>
                            <iframe
                               
                                className="w-full h-full object-contain shadow-2xl"
                                src={links[1]}
                                controls
                                autoPlay
                                onError={handleVideoError}
                                controlsList="nodownload"
                            >
                                Your browser does not support the video tag.
                            </iframe>
                                                <button
                                    onClick={handleIframeError}
                                    className="z-10 absolute bottom-18   right-4 px-4 py-2  bg-black/50 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border  border-white/10  group-hover/iframe:opacity-100 transition-all duration-300 backdrop-blur-md"
                                >
                                    Report Playback Error
                                </button>
                            </div>
                        )
                        
                        : playerMode === 'iframe' ? (
                            <div className="w-full h-full relative group ">
                                <iframe
                                    key={`iframe-${links[0]}`}
                                    src={links[0]}
                                    className="w-full relative h-full border-0 shadow-2xl "
                                    allowFullScreen
                                    onError={handleIframeError}
                                    title={episodename}
                                    allow="autoplay; encrypted-media"
                                />
                                <button
                                    onClick={handleIframeError}
                                    className="z-10 absolute bottom-18   right-4 px-4 py-2  bg-black/50 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border  border-white/10  group-hover/iframe:opacity-100 transition-all duration-300 backdrop-blur-md"
                                >
                                    Report Playback Error
                                </button>
                               
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 text-center px-10">
                                <div className="w-20 h-20 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center animate-bounce">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Server Error</h3>
                                    <p className="text-zinc-400 text-sm mt-2 max-w-sm">
                                        The requested media could not be loaded via standard or secondary protocols. The source link might be broken or restricted.
                                    </p>
                                </div>
                                 
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setPlayerMode('iframe')}
                                        className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all active:scale-95"
                                    >
                                        Retry Primary
                                    </button>
                                      {links[1]?(<button
                                        onClick={() => setPlayerMode('torrent')}
                                        className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all active:scale-95"
                                    >
                                        torrent
                                    </button>):null} 
                                    {links[2]?(<button
                                        onClick={() => setPlayerMode('video') }
                                        className="px-6 py-2 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all active:scale-95"
                                    >
                                        video
                                    </button>):null} 
                                    <a
                                        href={links[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2 bg-zinc-800 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-700 transition-all active:scale-95 border border-white/10"
                                    >
                                        External Browser
                                    </a>
                                </div>
                                
                            </div>
                            
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Video;
