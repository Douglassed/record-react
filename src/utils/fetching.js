const summonerId = "NqXg2v-ydklfu2gfps7BO-Ipc2NDMBHxvnU6-QDIDW44E60";
const puuid = "gu2k8KF-R0yebh4et_jNlsIf5xX26lz15KHiKvTndpBrzG6DgZKxUMpieIc7FPbuG34Oy6cW3zyoQA";
const name = "BisousPanthère";
const api_key = {key: 'RGAPI-29c7b99f-d906-482d-af99-3b6a31e10c13'};

export async function setApiKey(key) {
    api_key.key = key;
}

/**
 * Give the timeline of a specific match
 * @returns {Promise<any>}, timeline
 */
export async function getTimeline(gameId) {
    const dummyId = "EUW1_5834888192";
    const requestOptions = {
        method: 'GET',
    };

    return await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/" + gameId + "/timeline?api_key=" + api_key.key, requestOptions)
        .then(response => response.json())
        .catch(error => console.log(error));

}

/**
 * Timestamp of the game
 * @param gameId
 * @returns {Promise<any>}
 */
export async function getMatchInfo(gameId) {
    const dummyId = "EUW1_5834888192";
    const requestOptions = {
        method: 'GET',
    };

    return await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/" + gameId + "?api_key=" + api_key.key, requestOptions)
        .then(response => response.json())
        .catch(error => console.log(error));

}


/**
 * Tells if player in game
 * @returns {Promise<any>}, current gameId
 */
export async function getSpectateInfo() {
    const requestOptions = {
        method: 'GET',
    };

    return await fetch("https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + summonerId + "?api_key=" + api_key.key, requestOptions)
        .then(response => response.json())
        .catch(error => console.log(error));

}

/**
 * Gives last matches
 * @returns {Promise<any>}, [list of last matches]
 */
export async function getMatches() {
    const requestOptions = {
        method: 'GET',
    };

    return await fetch("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=20&api_key=" + api_key.key, requestOptions)
        .then(response => response.json())
        .catch(error => console.log(error));
}
