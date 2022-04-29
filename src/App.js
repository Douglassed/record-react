import './App.css';
import React from "react";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {RiRecordCircleFill} from 'react-icons/ri';
import Timestamp from "./component/Timestamp";
import BarTimestamp from "./component/BarTimestamp";
import Video from "./component/Video";
import {setApiKey} from "./utils/fetching";


async function startRecording() {
    // eslint-disable-next-line no-undef
    const input = await electron.recorderAPI.startStream();
    console.log(input)
}

async function stopRecording() {

}


const VideoPreview = forwardRef(({stream}, ref) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream])

    useImperativeHandle(ref, () => ({
        getDuration() {
            return videoRef.current.currentTime;
        }
    }));

    if (!stream || !stream.active) {
        return null;
    }
    return (
        <>
            <video ref={videoRef} width={500} autoPlay controls/>
        </>)
});

export default function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [showMedia, setShowMedia] = useState(false);
    const [deathList, setDeathList] = useState([]) // {killer: e.killerId, timestamp: new Date(e.timestamp)}
    const [isVideoLoading, setIsVideoLoading] = useState("false")
    const [keyInput, setKeyInput] = useState('');
    const [blob, setBlob] = useState("")


    const videoRef = useRef(null);
    const streamRef = useRef();

    const videoTimestamp = {};

    function onStop() {
        videoTimestamp.end = new Date();
        videoTimestamp.duration = videoTimestamp.end - videoTimestamp.start;
        setIsRecording(false);
        setShowMedia(true);

        async function setupVideo() {
            while (!videoRef.current) {
                await new Promise(r => setTimeout(r, 100))
            }
            while (videoRef.current.duration === Infinity || isNaN(videoRef.current.duration)) {
                await new Promise(r => setTimeout(r, 100))
                videoRef.current.currentTime = 5000000;
            }
            videoRef.current.currentTime = 0;
            return videoRef.current.duration
        }

        setupVideo().then(r => console.log(r));
    }

    function onStart() {
        videoTimestamp.start = new Date();
        setShowMedia(false)
        setIsRecording(true);
    }

    function handleOpen() {
        if (videoRef.current){
            console.log(videoRef.current.duration);
            videoRef.current.currentTime = 500000;
        }
    }

    return (
        <div>
            <h1>Recorder</h1>
            <p>status : TODO </p>
            <button className={"ui button"} disabled={isRecording} onClick={() => {
                startRecording()
                setIsRecording(true)
            }}>Start Recording
            </button>

            <button disabled={!isRecording} onClick={async () => {
                stopRecording()
                const media = new MediaRecorder(streamRef.current.srcObject)
                media.start();
                console.log(media.state);
                await new Promise(r => setTimeout(r, 2000))
                media.stop();
                media.ondataavailable = function(e) {
                    console.log(e.data);
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        const source = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
                        setBlob(source)
                        setShowMedia(true)

                    };
                    reader.readAsDataURL(e.data);

                }

                console.log("stream : ", streamRef.current.srcObject.getTracks())
            }}>Stop Recording
            </button>

            <button onClick={() => {
                setShowMedia(false)
            }}>Remove media
            </button>
            <button onClick={handleOpen}>Open</button>
            <div>
                <br/>
                <label>Please specify key: <a href="https://developer.riotgames.com/">Riot Api</a></label><br/>
                <input value={keyInput} onInput={e => setKeyInput(e.target.value)}/>
                <button onClick={() => setApiKey(keyInput)}>Validate</button>
            </div>
            {isRecording ?
                (<div style={{fontSize: "2em", margin: "10px"}}>
                    <RiRecordCircleFill style={{color: 'red'}} className={"blink_me"}/>
                    <span>{' '}Recording :</span>
                    <div>
                        {/*<VideoPreview stream={previewStream} ref={streamRef}/>*/}
                    </div>
                </div>) : null}


            <video controls ref={streamRef}></video>
            <h2>Media :</h2>
            {showMedia ? (
                <div style={{display: "flex"}}>
                    <div style={{width: "70%"}}>
                        <Video url={blob} ref={videoRef} duration={videoTimestamp.duration / 1000}
                               loading={isVideoLoading}/>
                        <BarTimestamp deathList={deathList}/>
                    </div>
                    <Timestamp startVideo={videoTimestamp.start}
                               deathList={deathList}
                               setDeathList={setDeathList}
                               videoDuration={videoTimestamp.duration}/>
                </div>) : null}


            {/*<ReactPlayer url={mediaBlobUrl} playing controls />*/}
        </div>
    );
}

