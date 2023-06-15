function Authentication() {
    // Game API key
    const gameAPIKey = 'your-game-API-key-here'

    // Leaderboard key
    const leaderboardKey = 'your-leaderboard-key-here'

    // Development mode true/false
    const developmentMode = 'true'

    // Authentication request
    const AuthHttp = new XMLHttpRequest()
    const auth_url = 'https://api.lootlocker.io/game/v2/session/guest'
    AuthHttp.open('POST', auth_url)
    AuthHttp.setRequestHeader('Content-Type', 'application/json')

    //This is used to ensure that a new player is not created if one already exists when starting a session
    const playerIdentifier = localStorage.getItem('player_identifier')

    if (playerIdentifier == null) {
        // No player identifier was found, start new session
        AuthHttp.send(
            JSON.stringify({ game_key: gameAPIKey, game_version: '0.1.0.0', development_mode: developmentMode })
        )
    } else {
        // Player identifier was found, continue with this player
        AuthHttp.send(
            JSON.stringify({
                game_key: gameAPIKey,
                player_identifier: playerIdentifier,
                game_version: '0.1.0.0',
                development_mode: developmentMode,
            })
        )
    }

    AuthHttp.onreadystatechange = e => {
        // Log server response
        console.log(AuthHttp.responseText)

        // Parse json
        const text = JSON.parse(AuthHttp.responseText)

        // Save player identifier to storage
        localStorage.setItem('player_identifier', text.player_identifier)

        // Save session_token to a global variable
        runtimeScene.getGame().getVariables().get('session_token').setString(text.session_token)
        // Save player ID
        runtimeScene.getGame().getVariables().get('player_id').setString(text.player_id)

        // Get leaderboard data
        const leaderboardHTTP = new XMLHttpRequest()
        const amountOfEntries = 10
        const leaderboardUrl =
            'https://api.lootlocker.io/game/leaderboards/' + leaderboardKey + '/list?count=' + amountOfEntries
        leaderboardHTTP.open('GET', leaderboardUrl)
        leaderboardHTTP.setRequestHeader('Content-Type', 'application/json')

        // Add session token
        leaderboardHTTP.setRequestHeader(
            'x-session-token',
            runtimeScene.getGame().getVariables().get('session_token').getValue()
        )
        // Send leaderboard request
        leaderboardHTTP.send('')
        leaderboardHTTP.onreadystatechange = e => {
            let leaderboardData = ''
            const leaderboardResponseText = JSON.parse(leaderboardHTTP.responseText)
            for (let i = 0; i < leaderboardResponseText.items.length; i++) {
                leaderboardData += leaderboardResponseText.items[i].rank + '. '
                leaderboardData += leaderboardResponseText.items[i].player.id
                leaderboardData += '        '
                leaderboardData += leaderboardResponseText.items[i].score
                leaderboardData += '\n'
            }
            // Save leaderboard data to sceneVariable
            runtimeScene.getVariables().get('leaderboardData').setValue(leaderboardData)
        }
    }
}