import {forwardRef, useState} from "react";
import '../style/Video.css'
import {IoPlayBack, IoPlay, IoPlayForward, IoPause} from "react-icons/io5";
import React from "react";


const Video = forwardRef(({url, videoTimeStamp, loading}, ref) => {
    const [playing, setPlaying] = useState(false);
    const [videoTime, setVideoTime] = useState();
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);


    const videoHandler = (control) => {
        if (control === "play") {
            setupVideo();
            ref.current.play();
            setPlaying(true);
            progressBar()
        } else if (control === "pause") {
            ref.current.pause();
            setPlaying(false);
        }
    };

    function setupVideo() {
        ref.current.onpause = function () {
            setPlaying(false)
        };
    }


    async function progressBar() {
        do {
            console.log("", ref.current?.currentTime)
            await new Promise(r => setTimeout(r, 300));
            setCurrentTime(ref.current?.currentTime);
            setProgress((ref.current?.currentTime / videoTimeStamp.duration) * 100);
        } while (!ref.current.paused);
    }

    const fastForward = () => {
        ref.current.currentTime += 5;
        setProgress((ref.current?.currentTime / videoTimeStamp.duration) * 100);
    };

    const revert = () => {
        ref.current.currentTime -= 5;
        setProgress((ref.current?.currentTime / videoTimeStamp.duration) * 100);
    };

    return (
        <div className={"app"}>
            <video className={"video"}
                   id={"video1"}
                   src={url}
                   muted={true}
                   controls
                   ref={ref}/>

            {/*<div className="controlsContainer">*/}
            {/*    <div className="controls">*/}
            {/*        <IoPlayBack className={"controlsIcon"} onClick={() => revert()}/>*/}
            {/*        {playing ? (*/}
            {/*            <IoPause className={"controlsIcon--small"} onClick={() => videoHandler("pause")}/>*/}
            {/*        ) : (*/}
            {/*            <IoPlay className={"controlsIcon--small"} onClick={() => videoHandler("play")}/>*/}
            {/*        )}*/}
            {/*        <IoPlayForward className={"controlsIcon"} onClick={() => fastForward()}/>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className="timeControls">*/}
            {/*    <p className="controlsTime">*/}
            {/*        {Math.floor(currentTime / 60) + ":" + ("0" + Math.floor(currentTime % 60)).slice(-2)}*/}
            {/*    </p>*/}
            {/*    <div className="time_progressbarContainer">*/}
            {/*        <div style={{width: progress + "%"}} className="time_progressBar"></div>*/}
            {/*    </div>*/}
            {/*    <p className="controlsTime">*/}
            {/*        {Math.floor(videoTimeStamp.duration / 60) + ":" + ("0" + Math.floor(videoTimeStamp.duration % 60)).slice(-2)}*/}
            {/*    </p>*/}
            {/*</div>*/}
        </div>

    )
})

export default Video;