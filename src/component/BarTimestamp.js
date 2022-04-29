import {RiChat3Fill} from "react-icons/ri";
import '../style/BarTimestamp.css'
import React from "react";

export default function BarTimestamp({deathList}) {
    const l = [
        {position: 20},
        {position: 60},
        {position: 75}
    ]
    return (
        <div style={{width: "95%"}}>
            <div style={{padding: "0 16px", display: "flex"}} className={"foo"}>
                {deathList.map((e, i) => (
                    <div key={i} style={{marginLeft: e.position + "%", marginRight: -e.position + "%", width: "0px"}}>
                        <RiChat3Fill className={"iconTimestamp"}/>
                        <div>
                            <img src={"https://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/" + e.killer + ".png"}
                                 alt={e.killer}
                                 className={"imgTimestamp"}/>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}