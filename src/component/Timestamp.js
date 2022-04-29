import {useEffect, useState} from "react";
import {getMatches, getMatchInfo, getTimeline} from "../utils/fetching";
import {RiRefreshFill} from "react-icons/ri";
import React from "react";


export default function Timestamp({startVideo, deathList, setDeathList}) {
    const puuid = "gu2k8KF-R0yebh4et_jNlsIf5xX26lz15KHiKvTndpBrzG6DgZKxUMpieIc7FPbuG34Oy6cW3zyoQA";
    const summonerId = "NqXg2v-ydklfu2gfps7BO-Ipc2NDMBHxvnU6-QDIDW44E60";

    const [isLoaded, setIsLoaded] = useState("loading") // "true", "error", "loading"

    async function fetchData() {
        const matchIds = await getMatches().then(res => res)
        if (!matchIds) {
            setIsLoaded("error")
            throw new Error("could not fetch getMatches")
        } else if (!matchIds[1]) {
            setIsLoaded("error")
            throw new Error("There is no match founded")
        }

        const lastMatchId = matchIds[0];
        const matchInfo = await getMatchInfo(lastMatchId).then(res => res)
        if (!matchInfo) {
            setIsLoaded("error")
            throw new Error("could not fetch getMatchInfo")
        }
        console.log("match id eve : ", lastMatchId)
        const gameStart = matchInfo.info.gameStartTimestamp;
        const gameDuration = matchInfo.info.gameDuration;
        const participantList = matchInfo.info.participants.map((e, i) => ({
            participantId: i + 1,
            champId: e.championId,
            champName: e.championName
        }))
        const mainSummonerInfo = matchInfo.info.participants.find(e => e.summonerId === summonerId)
        const winner = mainSummonerInfo.win;
        const kda = mainSummonerInfo.kills + "/" + mainSummonerInfo.deaths + "/" + mainSummonerInfo.assits
        const timePlayed = mainSummonerInfo.timePlayed;
        const position = mainSummonerInfo.individualPosition; // TOP, JUNGlE, MIDDLE, BOTTOM, SUPPORT


        console.log("mathc info : ", matchInfo)


        getTimeline(lastMatchId).then(res => {
            console.log("timeline : ", res)
            const participant = res.info.participants.find(e => e.puuid === puuid);
            let participantId;
            if (participant) {
                participantId = participant.participantId;
            } else {
                throw new Error("Could not find the participant : " + puuid)
            }
            console.log("I am the participant : ", participantId)
            const champKilledList = res.info.frames.reduce((prevFrame, currFrame) =>
                currFrame.events.reduce((prevEvent, currEvent) => {
                        if (currEvent.type === "CHAMPION_KILL") {
                            return [...prevEvent, currEvent]
                        }
                        return prevEvent
                    }, []
                ).concat(prevFrame), [])
            console.log("list killed : ", champKilledList)

            let myDeaths = champKilledList
                .filter(e => e.victimId === participantId)
                .map(e => {
                    if (participantList.find(part => part.participantId === e.killerId)) {
                        return {killer: participantList.find(part => part.participantId === e.killerId).champName, timestamp: new Date(e.timestamp)}
                    }else {
                        return {killer: mainSummonerInfo.championName, timestamp: new Date(e.timestamp)}
                    }
                })
                .sort((ev1, ev2) => ev1.timestamp - ev2.timestamp)

            myDeaths = computeTimestamp(gameStart, myDeaths, gameDuration);
            setDeathList(myDeaths)
            setIsLoaded("true")
        })
    }

    useEffect(() => {
        fetchData();
    }, [])

    function computeTimestamp(gameStart, myDeaths, gameDuration) {
        const gapBegin = 0;
        // const gapBegin = gameStart - startVideo;
        // myDeaths.push({killer: "first", timestamp: new Date(0)})
        myDeaths.forEach(e => {
            e.arrangedTimestamp = new Date(e.timestamp - gapBegin)
            e.position = (e.arrangedTimestamp / 1000) / gameDuration * 100;
            console.log(e.arrangedTimestamp.getTime(), gameDuration, gapBegin)
        })
        return myDeaths
    }


    return (
        <div>
            <h3 style={{display: "flex", alignItems: "center"}}>
                <RiRefreshFill
                    onClick={() => {
                        setIsLoaded("loading");
                        fetchData()
                    }}
                    className={"rotate"}
                    style={{fontSize: "1.5em", cursor: "pointer"}}
                />
                {' '}Death :
            </h3>
            {isLoaded === "error" ? "Could not fetch api... Check API key" :
                isLoaded === "loading" ? "Loading..." :
                    deathList.length === 0 ? "No death in this game ! Well Done." :
                        deathList.map((e, i) => (
                            <p key={i} style={{lineHeight: "20px"}}>
                                <img width={20}
                                     src={"https://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/" + e.killer + ".png"}
                                     alt={e.killer}/>
                                {" killed you at " + e.timestamp.getMinutes() + ":" + e.timestamp.getSeconds()}
                            </p>))
            }
        </div>
    )
}