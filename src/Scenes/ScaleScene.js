import "../stylesheets/styles.css";
import "../stylesheets/button.css";

import { useState, useEffect, useRef } from "react";
import BaseImage from "../components/BaseImage";
import { playEnvirAni, pauseEnvirAni, prePathUrl } from "../components/CommonFunctions";
import Lottie from "react-lottie-segments"
import { Player } from '@lottiefiles/react-lottie-player';
import loadAnimation from "../utils/loadAnimation"
import { returnAudioPath } from "../utils/loadSound";

const transformlist = [
    { x: -40, y: 20, s: 1.8 },
    { x: -40, y: 0, s: 1.8 },
    { x: -50, y: 15, s: 2 },
    { x: -30, y: -20, s: 1.6 },
    { x: 35, y: -30, s: 1.8 },
    { x: 0, y: -50, s: 2 },
    { x: -30, y: -50, s: 2 },
    { x: 0, y: -30, s: 2 },
    { x: 5, y: -60, s: 2.4 },
    { x: -5, y: -50, s: 2 },
]

const scaleImageList = [
    "SB03_BG_02",
    "SB03_BG_03_Sky",
    "SB03_BG_04",
    "SB03_BG_05",
    "SB03_BG_06",
    "SB03_BG_07",
    "SB03_BG_08",
    "SB03_BG_09",
    "SB03_BG_10",
    "SB03_BG_11",
    "SB03_BG_12",
]

const propList = [
    {
        path: 'SB03_Train_Engine_FG', s: 0.25, l: 0.6, t: 0.188,
        style: { transform: 'rotate(-3deg)' }
    },
    { path: 'SB03_Bird_FG', s: 0.3, l: 0.6, t: 0.3 },
    { path: 'SB03_Hot_air_balloon_FG', s: 0.35, l: 0.6, t: 0.2 },
    { path: 'SB03_Boat_FG', s: 0.55, l: 0.4, t: 0.4 },
    { path: 'SB03_Rabbit_FG', s: 0.3, l: 0.15, t: 0.4 },
    { path: 'SB03_Tent_FG', s: 0.6, l: 0.2, t: 0.45 },
    { path: 'SB03_Ball_FG', s: 0.2, l: 0.55, t: 0.68 },
    { path: 'SB03_Apple_Tree_FG', s: 0.8, l: 0.1, t: 0.22 },
    { path: 'SB03_Frog_FG', s: 0.4, l: 0.3, t: 0.53 },
    { path: 'SB03_Watermelon_FG', s: 0.6, l: 0.25, t: 0.45 },
]

const audioPathList = [
    '03', '10', '14', '22', '27', '32', '39', '42', '49', '52'
]


let animationData = [];
new loadAnimation('character/intro.json').then(result => {
    animationData[0] = result;
}, () => { });
new loadAnimation('character/p1.json').then(result => {
    animationData[1] = result;
}, () => { });
new loadAnimation('character/p2.json').then(result => {
    animationData[2] = result;
}, () => { });
new loadAnimation('character/p3.json').then(result => {
    animationData[3] = result;
}, () => { });
new loadAnimation('character/bird.json').then(result => {
    animationData[4] = result;
}, () => { });
function returnOption(index) {
    return {
        loop: true,
        autoplay: true,
        animationData: animationData[index],
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
}

let waitingTime = 0

const characterPosList = [
    { s: 1, l: 0, t: 0 },
    { s: 0.85, l: 0.08, t: -0.07 },
    { s: 0.92, l: 0.04, t: -0.08 },
    { s: 0.95, l: 0.025, t: -0.05 },
]

const ballenInfoList = [
    { x: 0, y: 0, n: 1 },
    { x: 0, y: 0, n: 1 },
    { x: 0, y: 0.1, n: 2 },
    { x: 0, y: 0, n: 1 },
    { x: 0.7, y: 0, n: 1, r: true },
    { x: -0.05, y: 0, n: 1 },
    { x: 0, y: 0, n: 1 },
    { x: 0, y: -0.1, n: 1 },
    { x: -0.05, y: 0, n: 1 },
    { x: -0.05, y: -0.1, n: 1 },
]

const movePosList = [
    { fx: -170, at: 4, gt: 4, gx: 80 },
    { fx: -170, at: 4, gt: 4, gx: 80 },
    { fx: -170, at: 4, gt: 4, gx: 80 },
    { fx: -170, at: 4, gt: 4, gx: 80 },
    { fx: 170, at: 4, gt: 4, gx: -80 },
    { fx: -170, at: 4, gt: 4, gx: 60 },
    { fx: -170, at: 4, gt: 3.5, gx: 70 },
    { fx: -170, at: 4, gt: 2.5, gx: 50 },
    { fx: -170, at: 4, gt: 2, gx: 40 },
    { fx: -170, at: 4, gt: 2.5, gx: 50 },
]


let timerList = []

export default function Scene({ nextFunc, _baseGeo, currentLetterNum, audioList, _geo
}) {
    const parentObject = useRef()
    const trainRefList = [useRef(), useRef(), useRef(), useRef()]
    const characterRef = useRef()
    const birdRef = useRef()

    const [playerSegment, setPlaySegment] = useState(
        {
            segments: [0, 77],
            forceFlag: true
        }
    )
    const [isAniStop, setAniStop] = useState(true)
    const [aniNum, setAniNum] = useState(0)

    useEffect(() => {

        moveFunc(0, movePosList[currentLetterNum].fx)

        timerList[0] = setTimeout(() => {
            parentObject.current.style.transform = 'translate(0%,0%) scale(1)'
            parentObject.current.style.transition = '0s'
        }, 1000);

        timerList[1] = setTimeout(() => {
            appearFunc()
        }, 1800);


        return () => {
            audioList.audioPick.pause()
            audioList.audioPick.currentTime = 0

            audioList.bodyAudio1.pause()
            audioList.bodyAudio2.pause()
            audioList.bodyAudio3.pause()

            audioList.bodyAudio3.currentTime = 0
            audioList.bodyAudio2.currentTime = 0

            timerList.map(timer => clearTimeout(timer))
        }

    }, [])

    const moveFunc = (transition, translateX) => {
        characterRef.current.style.transition = transition + 's'
        characterRef.current.style.transform = 'translateX(' + translateX + '%)'
    }

    const appearFunc = () => {
        audioList.bodyAudio1.src = returnAudioPath('01')
        audioList.bodyAudio2.src = returnAudioPath('02')

        audioList.bodyAudio3.src = returnAudioPath(audioPathList[currentLetterNum])

        moveFunc(movePosList[currentLetterNum].at, 0)
        timerList[2] = setTimeout(() => {
            introFunc()
        }, movePosList[currentLetterNum].at * 1000);
    }
    const introFunc = () => {
        let duration = (audioList.bodyAudio1.duration + audioList.bodyAudio2.duration) * 1000

        audioList.bodyAudio1.play();
        timerList[3] = setTimeout(() => {
            setPlaySegment({
                segments: [80, 125],
                forceFlag: true
            })
            audioList.bodyAudio2.play()
        }, audioList.bodyAudio1.duration * 1000);

        setAniStop(false)
        timerList[4] = setTimeout(() => {
            setAniStop(true)
            setTimeout(() => {

                goFunc()
            }, 1000);
        }, duration);

    }

    const goFunc = () => {

        if (currentLetterNum == 0) {
            audioList.audioPick.play()
            playEnvirAni(trainRefList, 300)
        }
        setAniNum(ballenInfoList[currentLetterNum].n)
        setPlaySegment({
            segments: [0, 100],
            forceFlag: true
        })

        moveFunc(movePosList[currentLetterNum].gt, movePosList[currentLetterNum].gx)
        timerList[5] = setTimeout(() => {
            pointerFunc()
        }, movePosList[currentLetterNum].gt * 1000 - 500);

        if (currentLetterNum == 1) {
            timerList[6] = setTimeout(() => {
                birdRef.current.style.transition = '20s'
                birdRef.current.style.transform = 'translateX(-500%)'
            }, 2000);
        }
    }

    const pointerFunc = () => {

        setAniStop(false)
        audioList.bodyAudio3.play();
        waitingTime = 7500

        if (audioList.bodyAudio3.duration * 1000 > waitingTime)
            waitingTime = audioList.bodyAudio3.duration * 1000
        timerList[7] = setTimeout(() => {
            scaleFunc()
        }, 1000);

        timerList[8] = setTimeout(() => {
            setAniStop(true)
        }, audioList.bodyAudio3.duration * 1000);

    }

    const scaleFunc = () => {
        parentObject.current.style.transition = '5s'
        parentObject.current.style.transform =
            'translate(' + transformlist[currentLetterNum].x +
            '%,' + transformlist[currentLetterNum].y +
            '%) scale(' + transformlist[currentLetterNum].s + ')'
        timerList[9] = setTimeout(() => {
            nextFunc()
        }, waitingTime);
    }



    return (
        <div>
            <div
                className="aniObject"
                ref={parentObject}
                style={{
                    position: "fixed", width: _baseGeo.width + "px"
                    , height: _baseGeo.height + "px",
                    left: _baseGeo.left + 'px',
                    top: _baseGeo.top + 'px',
                }}
            >
                <div
                    style={{
                        position: "absolute", width: '100%'
                        , height: '100%',
                        left: '0%',
                        top: '0%'
                    }} >
                    <img
                        width={'100%'}
                        style={{
                            position: 'absolute',
                            left: '0%',
                            top: '0%',

                        }}
                        src={prePathUrl() + "images/SB_03_NT_BG/" + scaleImageList[currentLetterNum] + ".svg"}
                    />
                </div>
                {
                    currentLetterNum == 0 &&
                    trainRefList.map((value, index) =>
                        <BaseImage
                            ref={trainRefList[index]}
                            className={index > 0 ? 'hideObject' : ''}
                            url={'ani/0' + (index + 1) + '.svg'}
                            scale={propList[0].s}
                            style={propList[0].style ? propList[0].style : null}
                            posInfo={{ l: propList[0].l, t: propList[0].t }}
                        />
                    )
                }
                {
                    currentLetterNum == 1 &&
                    <div
                        ref={birdRef}
                        style={{
                            position: 'fixed',
                            width: _baseGeo.width * 0.15,
                            left: _baseGeo.left + _baseGeo.width * 1,
                            top: _baseGeo.bottom + _baseGeo.height * 0.55,
                            pointerEvents: 'none',
                        }}
                    >
                        <Lottie
                            options={returnOption(4)}
                            mouseDown={false}
                            isClickToPauseDisabled={true}
                            autoplay
                            loop
                        />
                    </div>
                }

                {
                    currentLetterNum > 1 &&
                    <BaseImage
                        url={'SB_03_NT_FG/' + propList[currentLetterNum].path + '.svg'}
                        scale={propList[currentLetterNum].s}
                        style={propList[currentLetterNum].style ? propList[currentLetterNum].style : null}
                        posInfo={{ l: propList[currentLetterNum].l, t: propList[currentLetterNum].t }}
                    />
                }


                {/* character List */}

                <div
                    className="movingTopDown"
                    style={{
                        position: 'fixed',
                        width: _geo.width * 0.3,
                        height: _geo.width * 0.3,
                        left: _geo.left + _geo.width * (0.0 + ballenInfoList[currentLetterNum].x),
                        top: _geo.top + _geo.height * (-0.2 + ballenInfoList[currentLetterNum].y),
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        ref={characterRef}

                        style={{ position: 'absolute', width: '100%', height: '100%', left: '0%', top: '0%' }}
                    >
                        {
                            [0, 1, 2, 3].map((value, index) =>
                                <div
                                    className={value === aniNum ? 'showObject' : 'hideObject'}
                                    style={{
                                        position: 'absolute',
                                        width: characterPosList[index].s * 100 + '%',
                                        left: characterPosList[index].l * 100 + '%',
                                        top: characterPosList[index].t * 100 + '%',
                                        transform: 'rotateY(' + (ballenInfoList[currentLetterNum].r ? '180deg)' : '0deg)'),
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <Lottie
                                        options={returnOption(value)}
                                        mouseDown={false}
                                        isClickToPauseDisabled={true}
                                        playSegments={value == 0 ? playerSegment : {
                                            segments: [0, 300],
                                            forceFlag: false
                                        }}
                                        isStopped={isAniStop}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <div
                className="aniObject"
                onClick={() => {
                    setTimeout(() => {
                        nextFunc();
                    }, 200);
                }}
                style={{
                    position: "fixed", width: _geo.width * 0.055 + "px",
                    height: _geo.width * 0.055 + "px",
                    right: "2%"
                    , bottom: "5%", cursor: "pointer",
                }}>
                <img
                    draggable={false}
                    width={"100%"}
                    src={prePathUrl() + 'images/Buttons/Skip_blue.svg'}
                />
            </div>

        </div>
    );
}

