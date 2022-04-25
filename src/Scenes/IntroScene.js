import React, { useState, useEffect } from 'react';
import Lottie from "react-lottie-segments";
import { prePathUrl } from "../components/CommonFunctions";

import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';


let timerList = []



const letterList = [
    { text: '01', l: 0.08, t: 0.23, s: 0.33 },
    { text: '02', l: 0.06, t: 0.25, s: 0.36 },
    { text: '03', l: 0.07, t: 0.26, s: 0.35 },
    { text: '04', l: 0.065, t: 0.24, s: 0.36 },
    { text: '05', l: 0.065, t: 0.25, s: 0.36 },
    { text: '06', l: 0.065, t: 0.25, s: 0.36 },
    { text: '07', l: 0.065, t: 0.25, s: 0.36 },
    { text: '08', l: 0.065, t: 0.25, s: 0.36 },
    { text: '09', l: 0.065, t: 0.23, s: 0.36 },
    { text: '10', l: 0.07, t: 0.23, s: 0.34 },
    { text: '11', l: 0.06, t: 0.22, s: 0.36 },
    { text: '12', l: 0.06, t: 0.23, s: 0.36 },
    { text: '13', l: 0.06, t: 0.23, s: 0.36 },
]

export default function Scene2({ nextFunc, _geo, audioList, _baseGeo, currentLetterNum }) {

    useEffect(

        () => {
            setTimeout(() => {
                nextFunc()
            }, 5000);
            return () => {
            }
        }, []
    )

    return (
        <div className="aniObject"
        >
            <div style={{
                position: "fixed", width: _baseGeo.width + "px",
                height: _baseGeo.height + "px",
                left: _baseGeo.left + "px"
                , bottom: _baseGeo.bottom + 'px',
                pointerEvents: 'none'
            }}>
                <BaseImage
                    scale={0.6}
                    posInfo={{ l: 0.4, t: 0.4 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_02.svg"}
                />
                <BaseImage
                    scale={0.2}
                    posInfo={{ l: 0.52, t: 0.23 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_03.svg"}
                />

                <BaseImage
                    scale={0.1}
                    posInfo={{ l: 0.46, t: 0.05 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_04.svg"}
                />

                <BaseImage
                    scale={0.25}
                    posInfo={{ l: 0.12, t: 0.25 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_05.svg"}
                />



                <BaseImage
                    scale={letterList[currentLetterNum].s}
                    posInfo={{ l: letterList[currentLetterNum].l, t: letterList[currentLetterNum].t }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_" + letterList[currentLetterNum].text + ".svg"}
                />

            </div>

        </div>
    );
}
