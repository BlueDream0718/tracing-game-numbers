import "../stylesheets/styles.css";
import "../stylesheets/button.css";

import { useEffect, useRef, useState } from "react";
import { prePathUrl } from "../components/CommonFunctions";
import Phaser from "phaser"
import BaseImage from "../components/BaseImage";
import { Player } from '@lottiefiles/react-lottie-player';

import { isFirefox } from "react-device-detect";
import { startRepeatAudio, setRepeatAudio, stopRepeatAudio, isRepeating } from "../components/CommonFunctions";
import {
    maskInfoList, iconPathList, animtionList, showingLayoutList, titleList, letterPosList,
    lineLengthList, firstPosList, movePath, brushColorList, firstSubPosList, lastSubPosList
} from "../components/CommonVariants"
import { returnAudioPath } from "../utils/loadSound";

let moveObjList = []

var HeavyLengthList = [
]

var repeatStep = 0;
const firstPos = { x: 380, y: 255 }
//state variants
let stepCount = 0;

// drawing variants

var curves = [];
var curve = null;


var subCurves = [];
var subCurve = null;

// lemming varients
var graphics
var subGraphics
var nearestStepNum = 0;
var circleObj

// var yOutLine, wOutLine

var highCurrentNum = 0;

var currentImgNumOriginal = 0;
var currentLingLength = 40

let posList = []
var path
var isSubExist = false;
let prePath

var timerList = []
var isTracingStarted = false;

var rememberX = 0;
var rememberIsLeft = false;

let gameObjectList = []
let lastObjectList = []
let firstObjectList = []

export default function Scene({ nextFunc, _geo, currentLetterNum, startTransition, audioList
}) {

    // const letterNum = currentLetterNum;
    const [letterNum, setLetterNum] = useState(currentLetterNum)

    const explainVoices = ['15', '16', '19']
    const wordList = [audioList.wordAudio1, audioList.wordAudio2, audioList.wordAudio3]


    const preName = prePathUrl() + 'images/SB_03_NT_Number-Interactive/' +
        (letterNum + 1) + '/SB_03_NT_' + (letterNum < 9 ? 'O' : '') + (letterNum + 1) + '_'

    prePath = 'SB_03_NT_Number-Interactive/' +
        (letterNum + 1) + '/SB_03_NT_' + (letterNum < 9 ? 'O' : '') + (letterNum + 1) + '_'

    const parentObject = useRef()
    const drawingPanel = useRef();
    const showingImg = useRef();
    const animationRef = useRef();
    const playerRef = useRef();
    const markParentRef = useRef();

    const subObjectsRef = useRef();
    const whiteHighRef = useRef()
    const yellowHighRef = useRef()
    const iconRef = useRef()
    const highLightlength = letterPosList[letterNum].highlight.length
    const highlightRefList =
        Array.from({ length: 5 }, ref => useRef())

    const sparkBaseRef = useRef()
    const sparkRefList = [useRef(), useRef(), useRef()]

    const markRefList = [useRef(), useRef(), useRef()]
    const reviewImgList = [useRef(), useRef(), useRef()]
    const markBaseList = [useRef(), useRef(), useRef()]
    const showingOriginImgList = [useRef(), useRef(), useRef()]

    const [rendering, setRendering] = useState(0)

    const drawingGaameconfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        parent: 'DrawingDiv',
        mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
        transparent: true,
        physics: {
            default: 'matter',
            matter: {
                gravity: {
                    y: 0.8
                },
                enableSleep: true,
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update

        }
    };

    const highlightGameConfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        transparent: true,
        parent: 'highlightDiv',
        scene: {
            preload: highlight_preload,
            create: highlight_create,
        }
    };

    let currentPath = movePath[letterNum][stepCount]

    useEffect(() => {
        audioList.bodyAudio1.src = returnAudioPath(explainVoices[0])

        drawingPanel.current.className = 'hideObject'
        markParentRef.current.className = 'hideObject'
        subObjectsRef.current.className = 'hideObject'
        // animationRef.current.className = 'hideObject'

        gameObjectList[0] = new Phaser.Game(highlightGameConfig)

        setTimeout(() => {
            gameObjectList[1] = new Phaser.Game(drawingGaameconfig);
        }, 500);

        parentObject.current.className = 'aniObject'
        currentLingLength = lineLengthList[letterNum]

        playAutoAnimation()

        // showingDrawingPanel()

        // goNextLetter()

        return () => {

            // moveObjList = []
            gameObjectList[0].destroy(true)
            gameObjectList[1].destroy(true)

            HeavyLengthList = [
            ]

            repeatStep = 0;

            stepCount = 0;
            curves = [];
            curve = null;

            subCurves = [];
            subCurve = null;

            nearestStepNum = 0;

            circleObj.destroy()
            circleObj = null
            // var yOutLine, wOutLine

            highCurrentNum = 0;

            currentImgNumOriginal = 0;
            currentLingLength = 40

            posList = []
            path = null
            isSubExist = false;
            prePath = null

            timerList = []
            isTracingStarted = false;

            rememberX = 0;
            rememberIsLeft = false;

            stopRepeatAudio();
            graphics.clear()
            subGraphics.clear()

        }

    }, [letterNum])

    const playAutoAnimation = () => {
        setTimeout(() => {
            audioList.bodyAudio1.play();
            setTimeout(() => {
                playerRef.current.play();
                audioList.bodyAudio1.src = returnAudioPath(explainVoices[1])
            }, audioList.bodyAudio1.duration * 1000 + 500);

        }, 1500);
    }


    const showingDrawingPanel = () => {
        startTransition(1)

        highlightRefList.map(
            (value, index) => {
                if (index < highLightlength && value.current) {
                    if (index == 0)
                        value.current.setClass('showObject')
                    else
                        value.current.setClass('hideObject')
                }
            }
        )

        setTimeout(() => {

            animationRef.current.className = 'hideObject'
            drawingPanel.current.className = 'showObject'

            if (currentLetterNum < 10)
                markParentRef.current.className = 'showObject'

            isTracingStarted = true;
        }, 300);

        subObjectsRef.current.className = 'appear'

        setRepeatAudio(audioList.bodyAudio1)
        timerList[1] = setTimeout(() => {
            audioList.bodyAudio1.play();
            startRepeatAudio()
        }, 1000);

    }

    function goNextLetter() {

        drawingPanel.current.className = 'disappear'
        audioList.bodyAudio1.src = returnAudioPath(explainVoices[0])
        audioList.wordAudio1.src = returnAudioPath(letterNum + 2, 'word')
        setTimeout(() => {
            setLetterNum(letterNum + 1)
        }, 300);

        setTimeout(() => {
            animationRef.current.className = 'appear'
            playAutoAnimation()
        }, 1000);

    }

    function preload() {
        // this.load.image('letterBase', preName + 'Grey.svg');  //not svg , png

        letterPosList[letterNum].highlight.map((item, index) => {
            this.load.image('letterHighlight' + (index + 1), preName + 'Arrow-' + (index + 1) + '.svg');
        })
    }


    function create() {

        currentPath = movePath[letterNum][stepCount]

        graphics = this.add.graphics();
        subGraphics = this.add.graphics();

        curve = new Phaser.Curves.Spline([firstPosList[letterNum][0].x, firstPosList[letterNum][0].y]);
        subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);

        circleObj = this.add.circle(movePath[letterNum][0][0].x, movePath[letterNum][0][0].y, 60, 0xffffdd, 0.0)
        rememberX = movePath[letterNum][0][0].x;
        circleObj.setInteractive({ cursor: 'grab' })


        firstSubPosList.map((obj, index) => {
            firstObjectList[index] = (obj[4] == 'rect' ? this.add.rectangle(
                obj[0], obj[1],
                obj[2], obj[3],
                brushColorList[repeatStep]) :
                this.add.circle(
                    obj[0], obj[1],
                    obj[2],
                    brushColorList[repeatStep], 1))
            // if (index != 5)
            firstObjectList[index].visible = false
        })


        lastSubPosList.map((obj, index) => {
            lastObjectList[index] = (obj[4] == 'rect' ? this.add.rectangle(
                obj[0], obj[1],
                obj[2], obj[3],
                brushColorList[repeatStep]) :
                this.add.circle(
                    obj[0], obj[1],
                    obj[2],
                    brushColorList[repeatStep], 1))

            if (obj.length == 6)
                lastObjectList[index].rotation = obj[5]
            // if (index != 1)
            lastObjectList[index].visible = false
        })

        let isMoving = false;

        circleObj.on('pointerdown', function (pointer) {
            if (!isMoving) {
                if (isTracingStarted) {

                    if (firstPosList[letterNum][stepCount].firstObj != null) {
                        firstObjectList[firstPosList[letterNum][stepCount].firstObj].visible = true
                    }

                    circleObj.on('pointermove', moveFunc, this);
                    curves.push(curve);
                    subCurves.push(subCurve);

                    isMoving = true;

                    audioList.bodyAudio1.pause()
                    audioList.bodyAudio1.currentTime = 0;
                    timerList.map(timer => clearTimeout(timer))
                    stopRepeatAudio();
                }
            }
        }, this);


        circleObj.on('pointermove', moveFunc, this);

        function moveFunc(pointer) {
            if (pointer.isDown && isMoving && isTracingStarted) {

                var x = Number(pointer.x.toFixed(2));
                var y = Number(pointer.y.toFixed(2));


                let minDistance = 1000;
                let currentMinDisIndex = nearestStepNum;
                let lastIndex = nearestStepNum + 2;
                if (lastIndex > currentPath.length)
                    lastIndex = currentPath.length

                for (let i = nearestStepNum; i < lastIndex; i++) {
                    if (minDistance > Phaser.Math.Distance.Between(x, y, currentPath[i].x, currentPath[i].y)) {
                        minDistance = Phaser.Math.Distance.Between(x, y, currentPath[i].x, currentPath[i].y)
                        currentMinDisIndex = i;
                    }
                }

                let nextIndex;
                if (currentMinDisIndex == 0)
                    nextIndex = 1;
                else if (currentMinDisIndex == currentPath.length - 1)
                    nextIndex = currentMinDisIndex - 1;

                else {
                    if (Phaser.Math.Distance.Between(x, y, currentPath[currentMinDisIndex + 1].x, currentPath[currentMinDisIndex + 1].y) >
                        Phaser.Math.Distance.Between(x, y, currentPath[currentMinDisIndex - 1].x, currentPath[currentMinDisIndex - 1].y))
                        nextIndex = currentMinDisIndex - 1;
                    else
                        nextIndex = currentMinDisIndex + 1;
                }

                if (currentMinDisIndex >= nearestStepNum && currentMinDisIndex - nearestStepNum <= 1) {

                    let fromIndex = currentPath[currentMinDisIndex].x > currentPath[nextIndex].x ? nextIndex : currentMinDisIndex
                    let toIndex = currentPath[currentMinDisIndex].x > currentPath[nextIndex].x ? currentMinDisIndex : nextIndex

                    let x1 = currentPath[fromIndex].x
                    let x2 = currentPath[toIndex].x
                    let y1 = currentPath[fromIndex].y
                    let y2 = currentPath[toIndex].y

                    let optimizedPosition = currentPath[currentMinDisIndex]
                    minDistance = 1000

                    let isDrawable1 = false;
                    let isDrawable2 = false;


                    if (x1 != x2)
                        for (let i = 0; i < Math.abs(currentPath[fromIndex].x
                            - currentPath[toIndex].x) / 0.1; i += 0.1) {
                            let currentXPos = x1 + i;
                            let currentYPos = y1 + (y2 - y1) / (x2 - x1) * (currentXPos - x1)

                            if (minDistance > Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)) {
                                minDistance = Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)
                                optimizedPosition = { x: currentXPos, y: currentYPos }
                            }
                        }

                    else {
                        let addY = y2 > y1 ? y1 : y2;
                        for (let i = 0; i < Math.abs(y1 - y2) / 0.1; i += 0.1) {
                            let currentXPos = x1;
                            let currentYPos = addY + i

                            if (minDistance > Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)) {
                                minDistance = Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)
                                optimizedPosition = { x: currentXPos, y: currentYPos }
                            }
                        }

                    }

                    if (x1 > x2 && optimizedPosition.x >= x2
                        && optimizedPosition.x <= x1)
                        isDrawable1 = true;

                    if (x1 <= x2 && optimizedPosition.x <= x2 && optimizedPosition.x >= x1)
                        isDrawable1 = true;

                    if (y1 > y2 && optimizedPosition.y >= y2
                        && optimizedPosition.y <= y1)
                        isDrawable2 = true;

                    if (y1 <= y2 && optimizedPosition.y <= y2 && optimizedPosition.y >= y1)
                        isDrawable2 = true;

                    if (isDrawable1 && isDrawable2) {
                        if (currentMinDisIndex >= nearestStepNum) {

                            if (minDistance < 50) {

                                if (nearestStepNum != currentMinDisIndex && currentMinDisIndex > 0) {
                                    subGraphics.lineStyle(currentLingLength, brushColorList[repeatStep]);

                                    subCurve.addPoint(
                                        currentPath[currentMinDisIndex - 1].x,
                                        currentPath[currentMinDisIndex - 1].y
                                    )

                                    subCurves.forEach(function (c) {
                                        c.draw(subGraphics, currentLingLength);
                                    });
                                }


                                x = optimizedPosition.x
                                y = optimizedPosition.y

                                let isPassable = false;

                                if (currentPath.length == 2)
                                    isPassable = true;

                                let fIndex = nearestStepNum > nextIndex ? nextIndex : nearestStepNum
                                let tIndex = nearestStepNum > nextIndex ? nearestStepNum : nextIndex

                                if (currentPath.length > 2 &&
                                    currentPath[fIndex] != null && !isPassable
                                    && currentPath[tIndex] != null) {

                                    if (currentPath[fIndex].x < currentPath[tIndex].x)
                                        rememberIsLeft = false
                                    else if (currentPath[fIndex].x > currentPath[tIndex].x)
                                        rememberIsLeft = true

                                    if ((x > rememberX && !rememberIsLeft) ||
                                        currentPath[fIndex].x == currentPath[tIndex].x
                                        || (x < rememberX && rememberIsLeft))
                                        isPassable = true;
                                }

                                if (isPassable) {

                                    nearestStepNum = currentMinDisIndex
                                    rememberX = x;

                                    let compDistance = Phaser.Math.Distance.Between(x, y, currentPath[currentPath.length - 1].x,
                                        currentPath[currentPath.length - 1].y)

                                    if (compDistance < 40 && currentMinDisIndex == currentPath.length - 1) {


                                        isMoving = false;
                                        x = currentPath[currentPath.length - 1].x
                                        y = currentPath[currentPath.length - 1].y

                                        nearestStepNum = 0;
                                        // for (let i = 0; i < currentMinDisIndex; i++)
                                        //     curve.addPoint(currentPath[i])
                                        curve.addPoint(x, y);

                                        if (stepCount == movePath[letterNum].length - 1) {
                                            if (isSubExist)
                                                subObject.visible = false

                                            yellowHighRef.current.setClass('appear')
                                            graphics.lineStyle(100, brushColorList[repeatStep]);
                                            highlightRefList[highLightlength - 1].current.setClass('disappear')
                                            if (currentLetterNum < 10)
                                                showingImg.current.className = 'appear'

                                            circleObj.y = 10000;
                                            if (!isFirefox) {
                                                moveObjList[repeatStep].y = 10000
                                            }
                                            else {

                                                iconRef.current.setClass('hideObject')
                                                if (repeatStep < 2)
                                                    iconRef.current.setUrl('SB_03_NT_Icons/' + iconPathList[letterNum][repeatStep + 1] + '.svg')
                                            }

                                            curves.forEach(function (c) {
                                                c.draw(graphics, 100);
                                            });

                                            subCurves.forEach(function (c) {
                                                c.draw(subGraphics, 100);
                                            });


                                            if (isSubExist && firstPosList[letterNum][stepCount].isSub)
                                                subObject.visible = false;

                                            markRefList[repeatStep].current.setUrl('SB_04_Progress bar/SB_04_progress bar_03.svg')
                                            audioList.audioTing.play();

                                            setTimeout(() => {
                                                let showIndex = 0;
                                                let showInterval = setInterval(() => {
                                                    sparkRefList[showIndex].current.setClass('hideObject')
                                                    if (showIndex < 2) {
                                                        showIndex++
                                                        sparkRefList[showIndex].current.setClass('showObject')
                                                    }
                                                    else {
                                                        clearInterval(showInterval)
                                                    }
                                                }, 200);
                                            }, 200);


                                            audioList.bodyAudio1.src = returnAudioPath(explainVoices[2])

                                            if (currentLetterNum < 10)
                                                showingImg.current.style.transform = 'scale(1.1)'

                                            setTimeout(() => {
                                                let waitTime = wordList[repeatStep].duration * 1000

                                                if (repeatStep == 2 || letterNum == 19) {
                                                    audioList.audioExcellent.play()
                                                    setTimeout(() => {
                                                        wordList[repeatStep].play();
                                                    }, 1000);
                                                    waitTime += 1000
                                                }
                                                else
                                                    wordList[repeatStep].play();

                                                console.log(waitTime, '::waitTime')
                                                setTimeout(() => {
                                                    if (currentLetterNum < 10)
                                                        showingImg.current.style.transform = 'scale(1)'
                                                    if (repeatStep < 2 && currentLetterNum < 10) {

                                                        if (currentLetterNum < 10)
                                                            showingImg.current.className = 'disapear'
                                                        setTimeout(() => {
                                                            if (currentImgNumOriginal < 2) {
                                                                currentImgNumOriginal++
                                                                setRendering(currentImgNumOriginal);
                                                            }
                                                        }, 500);

                                                        yellowHighRef.current.setClass('disappear')

                                                        highlightRefList.map((highlight, index) => {
                                                            if (index < highLightlength) {
                                                                if (index > 0)
                                                                    highlight.current.setClass('disappear')
                                                                else
                                                                    highlight.current.setClass('appear')
                                                            }
                                                        })

                                                        // fomart values....

                                                        highCurrentNum = 0
                                                        currentLingLength = lineLengthList[letterNum]
                                                        stepCount = 0;

                                                        currentPath = movePath[letterNum][stepCount]

                                                        repeatStep++;

                                                        rememberX = currentPath[0].x

                                                        lastObjectList.map(obj => {
                                                            if (obj != null) {
                                                                obj.visible = false;
                                                                obj.setFillStyle(brushColorList[repeatStep], 1)
                                                            }
                                                        })
                                                        firstObjectList.map(obj => {
                                                            if (obj != null) {
                                                                obj.visible = false;
                                                                obj.setFillStyle(brushColorList[repeatStep], 1)
                                                            }
                                                        })

                                                        nearestStepNum = 0;
                                                        optimizedPosition = movePath[letterNum][0][0]
                                                        //.............

                                                        circleObj.x = optimizedPosition.x;
                                                        circleObj.y = optimizedPosition.y;

                                                        if (!isFirefox) {

                                                            moveObjList[repeatStep].visible = true

                                                            moveObjList[repeatStep].x = optimizedPosition.x;
                                                            moveObjList[repeatStep].y = optimizedPosition.y
                                                        }
                                                        else {


                                                            iconRef.current.setPosInfo({
                                                                l: circleObj.x / 1280 - 0.045,
                                                                t: circleObj.y / 720 - 0.08,
                                                            })
                                                            iconRef.current.setClass('showObject')
                                                        }


                                                        if (isSubExist)
                                                            subObject.visible = true

                                                        graphics.clear();
                                                        subGraphics.clear();

                                                        curve = new Phaser.Curves.Spline([firstPosList[letterNum][0].x, firstPosList[letterNum][0].y]);
                                                        curves = []


                                                        subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                                        subCurves = []

                                                        timerList[0] = setTimeout(() => {
                                                            audioList.bodyAudio1.play();
                                                            startRepeatAudio();
                                                        }, 500);


                                                    }
                                                    else {
                                                        if (currentLetterNum < 10 || letterNum == 19)
                                                            setTimeout(() => {
                                                                nextFunc()
                                                            }, 2000);
                                                        else
                                                            goNextLetter();
                                                        stopRepeatAudio();
                                                    }

                                                }, waitTime + 3000);
                                            }, 1000);
                                        }
                                        else {

                                            if (firstPosList[letterNum][stepCount].lastObj != null) {
                                                lastObjectList[firstPosList[letterNum][stepCount].lastObj].visible = true
                                            }

                                            curves.forEach(function (c) {
                                                c.draw(graphics, 100);
                                            });

                                            subCurves.forEach(function (c) {
                                                c.draw(subGraphics, 100);
                                            });

                                            circleObj.off('pointermove', moveFunc, this);
                                            parentObject.current.style.pointerEvents = 'none'
                                            isTracingStarted = false




                                            stepCount++
                                            let timeDuration = 0
                                            if (firstPosList[letterNum][stepCount].letter_start) {
                                                timeDuration = 750
                                                if (letterPosList[letterNum].lastPosList &&
                                                    letterPosList[letterNum].lastPosList.length > highCurrentNum) {
                                                    let lastPos = letterPosList[letterNum].lastPosList[highCurrentNum]

                                                    circleObj.x = lastPos.x;
                                                    circleObj.y = lastPos.y;

                                                    if (!isFirefox) {
                                                        moveObjList[repeatStep].x = lastPos.x;
                                                        moveObjList[repeatStep].y = lastPos.y;
                                                    }

                                                    else
                                                        iconRef.current.setPosInfo({
                                                            l: circleObj.x / 1280 - 0.045,
                                                            t: circleObj.y / 720 - 0.08,
                                                        })
                                                }

                                            }

                                            setTimeout(() => {

                                                currentPath = movePath[letterNum][stepCount]


                                                setTimeout(() => {

                                                    rememberX = currentPath[0].x


                                                    circleObj.x = movePath[letterNum][stepCount][0].x;
                                                    circleObj.y = movePath[letterNum][stepCount][0].y;

                                                    if (!isFirefox) {
                                                        moveObjList[repeatStep].x = movePath[letterNum][stepCount][0].x;
                                                        moveObjList[repeatStep].y = movePath[letterNum][stepCount][0].y;
                                                    }

                                                    else
                                                        iconRef.current.setPosInfo({
                                                            l: circleObj.x / 1280 - 0.045,
                                                            t: circleObj.y / 720 - 0.08,
                                                        })


                                                    if (firstPosList[letterNum][stepCount].letter_start != null
                                                        && firstPosList[letterNum][stepCount].letter_start) {

                                                        highlightRefList[highCurrentNum].current.setClass('hideObject')

                                                        highCurrentNum++

                                                        highlightRefList[highCurrentNum].current.setClass('appear')
                                                    }

                                                    curve = new Phaser.Curves.Spline([firstPosList[letterNum][stepCount].x, firstPosList[letterNum][stepCount].y]);
                                                    curves = []

                                                    subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                                    subCurves = []

                                                    HeavyLengthList.map(value => {
                                                        if (value[0] == letterNum && value[1] == stepCount) {
                                                            currentLingLength = 90
                                                        }
                                                    })

                                                    curve.addPoint(circleObj.x, circleObj.y);

                                                    parentObject.current.style.pointerEvents = ''
                                                    circleObj.on('pointermove', moveFunc, this);
                                                    isTracingStarted = true

                                                }, 200);

                                            }, timeDuration);

                                        }
                                    }

                                    else {

                                        if (currentPath[currentMinDisIndex].w != null)
                                            currentLingLength = currentPath[currentMinDisIndex].w

                                        graphics.lineStyle(currentLingLength, brushColorList[repeatStep]);
                                        curve.addPoint(x, y);

                                        curves.forEach(function (c) {
                                            c.draw(graphics, 100);
                                        });

                                        circleObj.x = optimizedPosition.x;
                                        circleObj.y = optimizedPosition.y;

                                        if (!isFirefox) {

                                            moveObjList[repeatStep].x = optimizedPosition.x;
                                            moveObjList[repeatStep].y = optimizedPosition.y
                                        }
                                        else {

                                            iconRef.current.setPosInfo({
                                                l: optimizedPosition.x / 1280 - 0.045,
                                                t: optimizedPosition.y / 720 - 0.08,
                                            })
                                        }

                                    }
                                }

                            }
                        }


                    }
                }
            }
        }


        // var fs = this.add.circle(firstPos.x, firstPos.y, 3, 0x000000, 0.5)
        path = new Phaser.Curves.Path(firstPos.x, firstPos.y);

        this.input.on('pointerdown1', function (pointer) {

            posList.push({ x: pointer.x, y: pointer.y })

            posList.map(pos => {
                path.lineTo(pos.x, pos.y);
            })

            console.log('{x:' + pointer.x.toFixed(0) + ', y:' + pointer.y.toFixed(0) + '},')
            // graphics.clear()

            posList = []


            graphics.lineStyle(2, 0x000000, 1);
            path.draw(graphics);
            graphics.fillStyle(0x000000, 1);

            path = new Phaser.Curves.Path(pointer.x, pointer.y);

        }, this);
    }


    function update() {

    }

    // highlight game

    function highlight_preload() {
        if (!isFirefox)
            for (let i = 0; i < 3; i++)
                this.load.image('icon' + (i + 1), prePathUrl() + 'images/SB_03_NT_Icons/' + iconPathList[letterNum][i] + '.svg');

        // this.load.image('wOutLine', preName + 'White-Highlight.svg');
        // this.load.image('yOutLine', preName + 'Yellow-Highlight.svg');
    }

    function highlight_create() {
        if (!isFirefox) {
            for (let i = 0; i < 3; i++) {
                let obj = this.add.sprite(movePath[letterNum][0][0].x, movePath[letterNum][0][0].y, 'icon' + (i + 1));
                obj.setScale(0.75)
                obj.visible = false

                if (moveObjList[i])
                    moveObjList[i].destroy()

                moveObjList[i] = obj
            }
            moveObjList[0].visible = true
        }
    }


    return (
        <div
            className="hideObject"
            ref={parentObject}
        >
            {/* <BaseImage
                    scale={0.05}
                    posInfo={{ r: 0.03 + 0.075, t: 0.05 }}
                    url="SB_04_hand_tool/hand.svg"
                /> */}

            <div

                style={
                    currentLetterNum < 10 ?
                        {}
                        :
                        {
                            transform: 'translateX(-30%)',
                            width: _geo.width,
                            left: _geo.left,
                            top: _geo.top,
                            height: _geo.height,
                            position: 'fixed'
                        }}
            >

                {
                    letterNum < 10 &&
                    <div
                        ref={showingImg}
                        className='hideObject'
                        style={{
                            position: 'fixed', width: _geo.width * 0.25 + 'px',
                            height: _geo.height * 0.25 + 'px',
                            right: _geo.left + _geo.width * 0.06 + 'px',
                            bottom: _geo.top + _geo.height * 0.13 + 'px',
                            pointerEvents: 'none',
                            transform: 'scale(1)'
                        }}>
                        <BaseImage
                            scale={showingLayoutList[letterNum][currentImgNumOriginal].s}
                            posInfo={{
                                b: showingLayoutList[letterNum][currentImgNumOriginal].b,
                                r: showingLayoutList[letterNum][currentImgNumOriginal].r
                            }}
                            url={"SB_03_NT_Prop-Interactive/" + showingLayoutList[letterNum][currentImgNumOriginal].wPath + ".svg"}

                        />

                        <BaseImage
                            style={{
                                transform: 'scale(' + (showingLayoutList[letterNum][currentImgNumOriginal].ts
                                    ? showingLayoutList[letterNum][currentImgNumOriginal].ts : 1) * 1.6 + ')'
                            }}
                            posInfo={{ r: 0.0, b: showingLayoutList[letterNum][currentImgNumOriginal].tb ? showingLayoutList[letterNum][currentImgNumOriginal].tb : 0.0 }}

                            url={"SB_03_NT_Text-Interactive/" + showingLayoutList[letterNum][currentImgNumOriginal].tPath + ".svg"}
                        />

                    </div>
                }
                {
                    letterNum < 10 && [0, 1, 2].map(value =>
                        <div
                            ref={reviewImgList[value]}
                            className='hideObject'
                            style={{
                                position: 'fixed', width: _geo.width * 0.2 + 'px',
                                height: _geo.height * 0.18 + 'px',
                                left: _geo.left + _geo.width * (0.1 + 0.3 * value) + 'px',
                                bottom: _geo.top + _geo.height * 0.2 + 'px',
                                pointerEvents: 'none',
                                transform: 'scale(1)',
                            }}>
                            <BaseImage
                                ref={showingOriginImgList[value]}
                                scale={showingLayoutList[letterNum][value].s}
                                posInfo={{
                                    b: showingLayoutList[letterNum][value].b + 0.3,
                                    r: showingLayoutList[letterNum][value].r
                                }}
                                url={"SB_03_NT_Prop-Interactive/" + showingLayoutList[letterNum][value].wPath + ".svg"}
                            />


                            <BaseImage
                                posInfo={{
                                    r: 0.02,
                                    b: showingLayoutList[letterNum][value].tb ?
                                        (showingLayoutList[letterNum][value].tb + 0.3) : 0.3
                                }}

                                style={{
                                    transform: 'scale(' + (showingLayoutList[letterNum][value].ts
                                        ? showingLayoutList[letterNum][value].ts : 1) * 1.3 + ')'
                                }}
                                url={"SB_03_NT_Text-Interactive/" + showingLayoutList[letterNum][value].tPath + ".svg"}
                            />
                        </div>
                    )
                }
                <div ref={markParentRef}>
                    {
                        [0, 1, 2].map(value =>
                            <div
                                ref={markBaseList[2 - value]}
                                style={{
                                    position: 'fixed',
                                    width: _geo.width * 0.06 + 'px',
                                    height: _geo.width * 0.06 + 'px',
                                    right: _geo.width * (0.03 + 0.075 * value) + 'px',
                                    top: 0.05 * _geo.height + 'px',
                                    pointerEvents: 'none'
                                }}>
                                <BaseImage
                                    ref={markRefList[2 - value]}
                                    url="SB_04_Progress bar/SB_04_progress bar_04.svg"
                                />
                            </div>
                        )
                    }
                </div>

                <div ref={drawingPanel}>
                    <div id='DrawingDiv'
                        style={{
                            position: 'fixed', width: _geo.width,
                            height: _geo.height,
                            left: _geo.left
                            , top: _geo.top,
                            WebkitMaskImage: 'url("' + preName + (letterNum < 10 ? 'Grey' : 'Gray') + '.svg")',
                            WebkitMaskPosition: maskInfoList[letterNum].position,
                            WebkitMaskSize: maskInfoList[letterNum].size,
                            WebkitMaskRepeat: "no-repeat",
                            overflow: 'hidden',
                            background: '#999999'
                        }}
                    >
                    </div>
                    {currentLetterNum > 9 &&
                        <BaseImage
                            scale={showingLayoutList[letterNum].s}
                            posInfo={{
                                b: showingLayoutList[letterNum].b,
                                l: showingLayoutList[letterNum].l
                            }}
                            url={"SB_03_NT_Prop-Interactive/" + showingLayoutList[letterNum].wPath + ".svg"}
                        />
                    }
                    <div
                        ref={subObjectsRef}
                        style={{
                            position: 'fixed',
                            width: _geo.width, height: _geo.height,
                            left: _geo.left, top: _geo.top,
                            pointerEvents: 'none',
                        }}
                    >
                        {
                            letterPosList[letterNum].highlight.map((value, index) =>
                                <BaseImage
                                    ref={highlightRefList[index]}
                                    scale={value.s}
                                    posInfo={{
                                        t: value.t,
                                        l: value.l
                                    }}
                                    className={index > 0 ? 'hideObject' : ''}
                                    url={prePath + 'Arrow-' + (index + 1) + '.svg'}
                                />
                            )
                        }
                        <BaseImage
                            ref={whiteHighRef}
                            scale={letterPosList[letterNum].white.s}
                            posInfo={{
                                t: letterPosList[letterNum].white.t,
                                l: letterPosList[letterNum].white.l
                            }}
                            url={prePath + 'White-Highlight.svg'}
                        />


                        <BaseImage
                            ref={yellowHighRef}
                            scale={letterPosList[letterNum].yellow.s}
                            posInfo={{
                                t: letterPosList[letterNum].yellow.t,
                                l: letterPosList[letterNum].yellow.l
                            }}
                            className='hideObject'
                            url={prePath + 'Yellow-Highlight.svg'}
                        />

                        {isFirefox &&
                            < BaseImage
                                ref={iconRef}
                                scale={0.09}
                                posInfo={{
                                    l: movePath[letterNum][0][0].x / 1280 - 0.045,
                                    t: movePath[letterNum][0][0].y / 720 - 0.08
                                }}
                                // className='hideObject'
                                url={'SB_03_NT_Icons/' + iconPathList[letterNum][0] + '.svg'}
                            />
                        }
                    </div>



                    <div id='highlightDiv'
                        style={{
                            position: 'fixed',
                            width: _geo.width, height: _geo.height,
                            left: _geo.left, top: _geo.top,
                            pointerEvents: 'none',
                        }}
                    >
                    </div>


                    {letterNum < 10 &&
                        <BaseImage
                            scale={0.25}
                            posInfo={{
                                b: 0.35,
                                l: 0.09
                            }}
                            url={"SB_03_NT_Text-Interactive/" + titleList[letterNum].path + ".svg"}
                        />
                    }
                </div>
                <div
                    ref={sparkBaseRef}
                    style={{
                        position: 'absolute', width: _geo.width * 0.2 + 'px',
                        height: _geo.height * 0.15 + 'px',
                        left: _geo.width * 0.47 + 'px',
                        bottom: _geo.height * 0.15 + 'px',
                        pointerEvents: 'none',
                    }}>
                    {[0, 1, 2].map(value =>
                        <BaseImage
                            ref={sparkRefList[value]}
                            className='hideObject'
                            posInfo={{
                                b: 1,
                                l: 0.0
                            }}
                            style={{ transform: 'scale(' + [0.3, 1.7, 2.4][value] + ')' }}
                            url={"Magic/sb_52_magic_wand_sparkels_" + (value + 1) + ".svg"}
                        />
                    )}
                </div>
            </div>

            <div
                ref={animationRef}
            >
                <Player
                    ref={playerRef}
                    onEvent={(e) => {
                        if (e == 'complete')
                            showingDrawingPanel();
                    }}
                    keepLastFrame={true}

                    src={prePathUrl() + 'lottieFiles/main/' + animtionList[letterNum].path + '.json'}
                    style={{
                        position: 'fixed',
                        width: _geo.width * animtionList[letterNum].scale,
                        left: _geo.left + _geo.width * animtionList[letterNum].left,
                        top: _geo.top + _geo.height * animtionList[letterNum].top,
                        pointerEvents: 'none',
                        overflow: 'visible'
                    }}
                >
                    {/* <Controls visible={false} buttons={['play', 'frame', 'debug']} /> */}
                </Player>
            </div>




        </div >
    );
}

