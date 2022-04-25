
import React, { useState } from "react";
import "../stylesheets/styles.css";
import { prePathUrl } from "./CommonFunctions";


var isFullScreen = false;
var elem = document.documentElement;

const FullScreenBtn = React.forwardRef((prop, ref) => {

    if (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen) {

        isFullScreen = true;
    }
    else
        isFullScreen = false;


    function screenControlFunc(prop) {
        if (!isFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem = window.top.document.body; //To break out of frame in IE
                elem.msRequestFullscreen();
            }
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                window.top.document.msExitFullscreen();
            }
        }
        isFullScreen = !isFullScreen
    }

    return (
        <div
            ref={ref}
            style={{
                position: "fixed", position: "fixed", width: '4%',
                left: '2%',
                top: "2%",
                cursor: 'pointer',
            }}>
            <img
                onClick={() => { setTimeout(screenControlFunc, 200) }}
                width={"100%"}
                draggable={false}
                src={prePathUrl() + "images/Buttons/" + (!isFullScreen ? "fullscreen-svgrepo-com" : "exit-full-screen-svgrepo-com") + ".svg"}
            />
        </div>
    )
});

const MusicButton = React.forwardRef((prop, ref) => {

    const [_isBackSoundPlaying, _setBackgroundPlaying] = useState(true);
    function controlBacksound() {
        if (_isBackSoundPlaying) {
            _setBackgroundPlaying(false);
            prop.backAudio.pause();
        }
        else {
            _setBackgroundPlaying(true);
            prop.backAudio.play().catch(error=>{});
        }
    }

    return (
        <div
            ref={ref}
            className='playBtn'
            style={{
                position: "fixed", position: "fixed", width: '5%',
                left: '2%',
                top: "47.5%",
                cursor: 'pointer',
                display: 'none'
            }}>
            {!_isBackSoundPlaying &&
                <img
                    className="aniObject"
                    onClick={controlBacksound}
                    width={"100%"}
                    draggable={false}
                    src={prePathUrl() + "images/Buttons/Audio_mute.svg"}
                />
            }
            {_isBackSoundPlaying &&
                <img
                    className="aniObject"
                    onClick={controlBacksound}
                    width={"100%"}
                    draggable={false}
                    src={prePathUrl() + "images/Buttons/Audio_unmute.svg"}
                />
            }
        </div>
    )
});



const LoadingCircleBar = React.forwardRef((prop, ref) => {
    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: '0px',
                top: '0px',
                background: 'rgb(241 242 243)',
                width: window.innerWidth,
                height: window.innerHeight,
                pointerEvents: 'none'
            }}
        >
            <img
                style = {{ position: 'absolute', width: '10%', top: '40%', left: '45%' }}
                src = {prePathUrl() + "images/Buttons/loadingBar.gif"}
            />
        </div>
    )
})

export { FullScreenBtn, MusicButton, LoadingCircleBar }