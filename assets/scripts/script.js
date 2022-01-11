blockEvents() // Bloqueia interações com o tabuleiro

function start() {
    let initialScreen = document.getElementsByClassName('initial-screen')[0]
    initialScreen.style.height = 0

    fillBoard()
    cleanCemetery()
    // setPlayers() // Offline mode
    unlockEvents()
    configTimer('i')

}

function setPlayers() { // Update posteriormente
    let player1 = document.getElementById('player-white')
    let player2 = document.getElementById('player-black')

    player1.innerText = window.prompt('Player 1:') || 'Player 1'
    player2.innerText = window.prompt('Player 2:') || 'Player 2'
}


function restartGame() {
    fillBoard()
    cleanCemetery()
    cleanAuxiliaryInput()
    unlockEvents()
    configTimer('r')
    socket.emit('refreshGame', document.querySelector('#board').innerHTML, document.querySelector('#play-counter').value) //Atualizar jogo e contador
}

function cleanAuxiliaryInput() {
    if (document.getElementById('selected-piece').value != "")
        document.getElementById(document.getElementById('selected-piece').value).style.opacity = 1 // Limpa a seleção da peça

    document.getElementById('play-counter').value = 1 // Zera contador
    document.getElementById('selected-piece').value = '' // Limpa peça selecionada
    document.getElementById('destiny-selected').value = ''  // Limpa destiny selecionado
}

function invitePlayer2() {
    let aux = document.createElement('input')

    aux.setAttribute("Value", window.location.href)
    aux.setAttribute("id", 'clipboard')
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    // document.removeChild(aux) //Deveria excluir o componente
    aux.style.visibility = 'hidden'
}

function setInfoAndImageInHelpScreen(opcao) {
    let title = document.querySelector('.help-screen-body-inner h3')
    let infoArea = document.querySelector('.help-screen-info p')
    let imageArea = document.querySelector('.help-screen-image img')

    switch (opcao) {
        case 'Peão': {
            title.innerText = opcao
            infoArea.innerText = `De maneira geral, os peões se movem somente para frente, uma casa por vez, apenas o primeiro movimento permite pular duas casas. O peão não pode pular outras peças. O peão é a única peça que não pode mover-se para trás. Os peões capturam a peça adversária movendo-se diagonalmente uma casa, ele não pode capturar movendo-se para frente. O peão conta com um movimento especial chamado ‘promoção’, que permite o peão ser promovido para outra peça quando ele atinge o final do tabuleiro.`
            imageArea.src = './assets/img/movimentos-peao.jpeg'
            break
        }
        case 'Torre': {
            title.innerText = opcao
            infoArea.innerText = `A torre se move em row reta horizontalmente e verticalmente pelo número de casas não ocupadas, até atingir o final do tabuleiro ou ser bloqueado por outra peça. Ele não pode pular outras peças. A torre captura no mesmo caminho em que se move, ocupando a casa onde se encontra a peça adversária. A torre pode parar em qualquer casa do tabuleiro, sendo por isso uma das peças mais poderosas.`
            imageArea.src = './assets/img/movimentos-torre.jpeg'
            break
        }
        case 'Cavalo': {
            title.innerText = opcao
            infoArea.innerText = `O cavalo é a peça mais especial no xadrez, possuindo uma flexibilidade que o torna poderoso. O cavalo move-se por duas casas horizontalmente ou verticalmente e então uma casa a mais em uma ângulo reto. O movimento do cavalo forma um “L”. O cavalo sempre termina seu movimento em uma casa de cor oposta à inicial. O cavalo pode pular sobre peças de qualquer cor enquanto vai para sua casa de destiny, mas ele não captura nenhuma das peças que pula. O cavalo captura quando termina seu movimento na casa de uma peça adversária. O cavalo não pode terminar seu movimento em uma casa ocupada por uma peça da mesma cor. Uma vez que o movimento do cavalo não é em row reta, ele pode atacar uma rainha, bispo ou torre sem ser atacado reciprocamente por esta peça.`
            imageArea.src = './assets/img/movimentos-cavalo.jpeg'
            break
        }
        case 'Bispo': {
            title.innerText = opcao
            infoArea.innerText = `O bispo se move em uma row reta diagonalmente no tabuleiro. Ele pode mover-se por tantas casas quantas quiser, até encontrar o final do tabuleiro ou outra peça. O bispo não pode pular outras peças. O bispo captura no mesmo caminho em que ele se move, parando na casa da peça adversária. Devido à maneira como os bispos se movem, ele sempre permanece em casas da cor em que ele iniciou. Cada jogador começa com dois bispos, um nas casas pretas e outro nas brancas.`
            imageArea.src = './assets/img/movimentos-bispo.jpeg'
            break
        }
        case 'Rainha': {
            title.innerText = opcao
            infoArea.innerText = `A rainha é considerada a peça mais poderosa do tabuleiro. Ela pode mover-se qualquer número de casas em row reta - verticalmente, horizontalmente ou diagonalmente. A rainha se move como a torre e o bispo combinados. A menos que esteja realizando uma captura, o movimento deve terminar em uma casa desocupada e ela não pode pular outras peças. A rainha captura no mesmo caminho em que se move, ocupando a casa da peça adversária.`
            imageArea.src = './assets/img/movimentos-rainha.jpeg'
            break
        }
        case 'Rei': {
            title.innerText = opcao
            infoArea.innerText = `O rei é a peça mais importante do xadrez. Se o rei for encurralado de modo que sua captura seja inevitável, o jogo termina e o este jogador perde. O rei tem pouca mobilidade, assim ele é considerado também uma das peças mais fracas no jogo. O rei pode se mover para qualquer casa vizinha. Ele não pode se mover para uma casa ocupada por uma peça da mesma cor. O rei captura outra peça da mesma maneira que se move, ocupando a casa da peça adversária. O rei não pode se mover para uma casa que o coloque sob ataque de uma peça adversária (chamado em “cheque”). Como resultado desta limitação, dois reis nunca poderão estar ao lado um do outro - uma vez que mover-se para o lado do outro rei o colocaria em cheque.`
            imageArea.src = './assets/img/movimentos-rei.jpeg'
            break
        }
        case 'Vitória': {
            title.innerText = opcao
            infoArea.innerText = `O Objetivo do jogo é dar xeque-mate no rei. Um xeque é quando uma peça “inimiga” ataca o rei. São formas de um rei escapar de um xeque: 

                    - Capturar a peça que está dando o xeque no rei.
                    
                    - Fugir com o rei para uma casa que não estaja sendo atacada por uma peça inimiga e colocar uma peça entre o rei e a peça adversária.
            Caso o rei seja atacado e não possa ir para outras casas, pois estas estão sendo atacadas por outras peças adversárias o rei está em xeque-mate e o jogo termina.`
            break
        }
        case 'Promoção': {
            title.innerText = opcao
            infoArea.innerText = `Ocorre quando o peão ocupa uma casa da primeira row do adversário. Essa peça deverá ser sbstituída por uma dama, uma torre, um bispo ou um cavalo. A peça escolhida irá substutuir o peão.`
            break
        }
    }
}

function configMenuItems() {
    let menuItem = document.querySelectorAll('.help-screen-aside li')

    menuItem.forEach(item => {
        item.onclick = function (event) {
            let opcao = event.target.innerText
            setInfoAndImageInHelpScreen(opcao)
        }
    })
}

function showHelpScreen() {
    let helpScreen = document.querySelector('.help-screen')
    helpScreen.style.display = 'flex'
    helpScreen.style.height = '600px'
    blockEvents()

    let flexMenu = document.querySelectorAll('.help-screen-aside ul')
    flexMenu.forEach(menu => {
        menu.onmouseover = function (event) {
            menu.style.height = '255px'
        }

        menu.onmouseout = function (event) {
            menu.style.height = '34px'
        }

        configMenuItems()
    })

    document.querySelector('#bt-close-help-screen').onclick = function (event) {
        helpScreen.style.height = '0px'
        unlockEvents()
    }
}

function aboutXadrez() {
    window.open('https://pt.wikipedia.org/wiki/Xadrez')
}

function setFirstRow(position, pieceColor) {
    let firstRow = 1 // Primeira de cada jogador

    if (pieceColor == 'black') {
        firstRow = 8
    }

    if (position == `a${firstRow}` || position == `h${firstRow}`) { // Primeira fileira /Torres
        document.getElementById(position).style.backgroundImage = `url(./assets/img/torre-${pieceColor}.png)`
    }
    if (position == `b${firstRow}` || position == `g${firstRow}`) { // Primeira fileira /Cavalos
        document.getElementById(position).style.backgroundImage = `url(./assets/img/cavalo-${pieceColor}.png)`
    }
    if (position == `c${firstRow}` || position == `f${firstRow}`) { // Primeira fileira /Bisposition
        document.getElementById(position).style.backgroundImage = `url(./assets/img/bispo-${pieceColor}.png)`
    }
    if (position == `d${firstRow}`) { // Primeira fileira /Rainha
        document.getElementById(position).style.backgroundImage = `url(./assets/img/rainha-${pieceColor}.png)`
    }
    if (position == `e${firstRow}`) { // Primeira fileira /Rei
        document.getElementById(position).style.backgroundImage = `url(./assets/img/rei-${pieceColor}.png)`
    }
}

function setPeons(position, pieceColor) {
    document.getElementById(position).style.backgroundImage = `url(./assets/img/peon-${pieceColor}.png)` // url(./assets/img/peon-${pieceColor}.png)
}

function fillBoard() {
    let pieceColor = 'white' // Colocar para fora do for (testar)

    for (let line = 1; line <= 8; line++) {
        let column = 'a' // Reseta column apos percorer toda a row com o 'for'
        while (column != 'i') {
            let position = (column + line)

            if (line > 2 && line < 7) { // Espaços vagos
                document.getElementById(position).style.backgroundImage = 'unset'
            } else {
                if (line == 7) { // row 7 correspositionde as peças pretas
                    pieceColor = 'black'
                }
                if (line == 2 || line == 7) { // Peões
                    setPeons(position, pieceColor)
                } else {
                    setFirstRow(position, pieceColor)
                }
            }
            column = String.fromCodePoint(column.charCodeAt() + 1)
        }
    }
}

function cleanCemetery() {
    let target = ['white', 'black']
    for (let j = 0; j <= 1; j++) {
        for (let i = 0; i <= 15; i++) {
            document.querySelectorAll(`.${target[j]}-cemetery .cemetery-position`)[i].style.backgroundImage = `unset`
            document.querySelectorAll(`.${target[j]}-cemetery .cemetery-position`)[i].style.pointerEvents = 'none'
        }
    }
}

function formatTimer(time) {
    return time < 10 ? '0' + time.toString() : time.toString()
}

function configTimer(command) {

    switch (command) {
        case 'i': setInterval(() => {
            let timer = document.getElementById('timer')
            let time = (timer.innerText).split(':')

            let hours = time[0]// Posições 2 e 5 representam os dois pontos
            let minutes = time[1] || '00'
            let seconds = time[2] || '00'

            if (seconds <= 58) {
                seconds = parseInt(seconds) + 1
                if (seconds < 10) {
                    seconds = formatTimer(seconds)
                }
            }

            if (seconds == 59) {
                minutes = parseInt(minutes) + 1
                seconds = formatTimer(0)
                if (minutes < 10) {
                    minutes = formatTimer(minutes)
                }
            }

            if (minutes == 60) {   //minutes é gerado pelo laço condicional anterior
                hours = parseInt(hours) + 1
                minutes = formatTimer(0)
                if (hours < 10) {
                    hours = formatTimer(hours)
                }
            }
            console.log(`${hours}:${minutes}:${seconds}`)
            timer.innerText = `${hours}:${minutes}:${seconds}`
        }, 1000)
            break
        case 'r': document.getElementById('timer').innerText = '00:00:00' //Zera o timer
            break
    }
}

function selectDestiny(position) {
    let destinySelected = document.getElementById('destiny-selected')
    destinySelected.value = position

    accomplishMovement()
}

function currentPlayer() {
    let playCounter = document.getElementById('play-counter')
    if (Number.parseInt(playCounter.value) % 2 == 1) {        // Verifica a jogada corrente
        return 'w' // 'W'hite 
    } else {
        return 'k' //Blac'K'
    }
}

function selectPiece(position) {
    // let playCounter = Number.parseInt(document.getElementById('play-counter').value)
    let selectedPiece = document.getElementById('selected-piece')
    let player = currentPlayer()

    if (position.style.backgroundImage == 'unset') {       // Verifica se há peça na position
        if (selectedPiece.value == '') {
            showAlert('Selecione uma peça para jogar!')
        } else {
            selectDestiny(position.id) // Movimento Passivo
        }
    } else {
        if (position.style.backgroundImage.indexOf(player) != -1) { // Verifica se a peca selecionada é da mesma cor
            if (selectedPiece.value != '') {
                document.getElementById(selectedPiece.value).style.opacity = '1' // Remove opacidade da ultima peça selecionada
            }
            document.getElementById(position.id).style.opacity = '0.6' // Adicionar opacidade a peça selecionada
            selectedPiece.value = position.id
        } else {
            if (selectedPiece.value == '') {
                showAlert(`Selecione suas peças!`)
            } else {
                selectDestiny(position.id) // Movimento Ofensivo
            }
        }
    }
}

function getPieceType() {
    let piece = document.getElementById(document.getElementById('selected-piece').value) //Peca selecionada armazena a position da peca selecionada

    let type = piece.style.backgroundImage.substring(18, 20) //Retorna as 2 primeiras letras do nome da peca
    //window.alert(type)
    return type
}

function getDirectionOfPlay(pieceType) {
    let origin = document.getElementById('selected-piece').value
    let destiny = document.getElementById('destiny-selected').value
    let [columnO, rowO] = [origin.substring(0, 1), origin.substring(1, 2)] // Dividindo position de origin
    let [columnD, rowD] = [destiny.substring(0, 1), destiny.substring(1, 2)] // Dividindo position de destiny

    //window.alert(`${origin}, ${destiny}, ${columnO}, ${rowO}, ${columnD}, ${rowD}` )

    switch (pieceType) {
        case 'pe': {
            if (columnO == columnD && rowO < rowD && currentPlayer() == 'w') {
                return 'acima'
            }
            if (columnO > columnD && rowO < rowD) {
                return 'diagonal-esq-sup'
            }
            if (columnO < columnD && rowO < rowD) {
                return 'diagonal-dir-sup'
            }
            if (columnO < columnD && rowO > rowD) {
                return 'diagonal-dir-inf'
            }
            if (columnO == columnD && rowO > rowD && currentPlayer() == 'k') {
                return 'tras'
            }
            if (columnO > columnD && rowO > rowD) {
                return 'diagonal-esq-inf'
            }
            break
        }

        case 'to': {
            if (columnO == columnD && rowO < rowD) {
                return 'acima'
            }
            if (columnO < columnD && rowO == rowD) {
                return 'direita'
            }
            if (columnO == columnD && rowO > rowD) {
                return 'tras'
            }
            if (columnO > columnD && rowO == rowD) {
                return 'esquerda'
            }
            break
        }

        case 'ca': {
            let posicoesValidasCavalo = []
            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) - 1)) + (Number.parseInt(rowO) + 2)) // Para cima à esquerda
            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) + 1)) + (Number.parseInt(rowO) + 2)) // Para cima à direita

            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) + 2)) + (Number.parseInt(rowO) + 1)) // Para direita acima
            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) + 2)) + (Number.parseInt(rowO) - 1)) // Para direita abaixo

            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) + 1)) + (Number.parseInt(rowO) - 2)) // Para baixo à direita
            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) - 1)) + (Number.parseInt(rowO) - 2)) // Para baixo à esquerda

            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) - 2)) + (Number.parseInt(rowO) - 1)) // Para esquerda abaixo
            posicoesValidasCavalo.push(String.fromCodePoint(((columnO.charCodeAt()) - 2)) + (Number.parseInt(rowO) + 1)) // Para esquerda acima

            return posicoesValidasCavalo
            break
        }
        case 'bi': {
            if (columnO < columnD && rowO < rowD) {
                return 'diagonal-dir-sup'
            }
            if (columnO < columnD && rowO > rowD) {
                return 'diagonal-dir-inf'
            }
            if (columnO > columnD && rowO > rowD) {
                return 'diagonal-esq-inf'
            }
            if (columnO > columnD && rowO < rowD) {
                return 'diagonal-esq-sup'
            }
            break
        }
        case 'ra': {
            if (columnO == columnD && rowO < rowD) {
                return 'acima'
            }
            if (columnO < columnD && rowO < rowD) {
                return 'diagonal-dir-sup'
            }
            if (columnO < columnD && rowO == rowD) {
                return 'direita'
            }
            if (columnO < columnD && rowO > rowD) {
                return 'diagonal-dir-inf'
            }
            if (columnO == columnD && rowO > rowD) {
                return 'tras'
            }
            if (columnO > columnD && rowO > rowD) {
                return 'diagonal-esq-inf'
            }
            if (columnO > columnD && rowO == rowD) {
                return 'esquerda'
            }
            if (columnO > columnD && rowO < rowD) {
                return 'diagonal-esq-sup'
            }
            break
        }
        case 're': {
            if (columnO == columnD && rowO < rowD) {
                return 'acima'
            }
            if (columnO < columnD && rowO < rowD) {
                return 'diagonal-dir-sup'
            }
            if (columnO < columnD && rowO == rowD) {
                return 'direita'
            }
            if (columnO < columnD && rowO > rowD) {
                return 'diagonal-dir-inf'
            }
            if (columnO == columnD && rowO > rowD) {
                return 'tras'
            }
            if (columnO > columnD && rowO > rowD) {
                return 'diagonal-esq-inf'
            }
            if (columnO > columnD && rowO == rowD) {
                return 'esquerda'
            }
            if (columnO > columnD && rowO < rowD) {
                return 'diagonal-esq-sup'
            }
            break
        }
    }
}

const nextPosition = (position, column, row) => {
    nextPosi = (String.fromCodePoint((((position.substring(0, 1)).charCodeAt()) + column)) + (Number.parseInt((position.substring(1, 2))) + row))
    return nextPosi
}

function makePlay(origin, destiny, position, displacement) {
    if (position == destiny) {
        document.getElementById(destiny).style.backgroundImage = document.getElementById(origin).style.backgroundImage // Realizando movimento
        document.getElementById(origin).style.backgroundImage = 'unset' // Limpando position anterior
        incrementPlayCounter() // Jogada bem sucedida, incremento no contador
    } else {
        if (nextPosition(position, displacement[0], displacement[1]) == destiny) { // Essa função deve ser alterada a  cada tipo de movimento
            sendToCemetery(destiny) // Encaminhar a peça comida ao cemiterio
            document.getElementById(destiny).style.backgroundImage = document.getElementById(origin).style.backgroundImage // Realizando movimento
            document.getElementById(origin).style.backgroundImage = 'unset' // Limpando position anterior
            incrementPlayCounter() // Jogada bem sucedida, incremento no contador
        }
        else {
            showAlert(`Posição Inválida!
            Está com dúvidas? Acesse ajuda ao lado`)
        }
    }
}

function blockEvents() {
    document.querySelectorAll('.position').forEach(position => {
        position.style.pointerEvents = 'none'
    })

    let buttons = Array.from(document.querySelectorAll('.menu-option input'))
    buttons.forEach(button => {
        button.style.pointerEvents = 'none'
    })
}

function unlockEvents() {
    document.querySelectorAll('.position').forEach(position => {
        position.style.pointerEvents = 'auto'
    })

    let buttons = Array.from(document.querySelectorAll('.menu-option input'))
    buttons.forEach(button => {
        button.style.pointerEvents = 'auto'
    })
}

function showAlert(msg) {
    let alert = document.querySelector('.alert-screen')
    let errorMessage = document.querySelector('.error-message')

    alert.style.display = 'flex'
    alert.style.opacity = '1'
    errorMessage.innerText = msg

    setTimeout(() => {
        alert.style.opacity = '0'
        setTimeout(() => alert.style.display = 'none', 1000)
    }, 2000)
}

function showVictoryScreen(pieceColor) {
    let victoryScreen = document.querySelector('.victory-screen')
    let winningLog = document.querySelector('.winning-log')

    victoryScreen.style.height = '470px'
    victoryScreen.style.opacity = '1'
    victoryScreen.style.backgroundImage = `url(./assets/img/pecas-${pieceColor}.jpg)`

    let vencedor = document.querySelector(`#jogador-${pieceColor}`).innerText
    winningLog.innerText = `Parabéns ${vencedor}!` // Jogador Corrente

    document.querySelector('#bt-close-victory-screen').onclick = (event) => {
        victoryScreen.style.height = '0px'
        victoryScreen.style.opacity = '0'
    }
    blockEvents()
}

function sendToCemetery(destiny) {
    let target

    if (currentPlayer() == 'w') {
        target = 'white'
    } else {
        target = 'black'
    }

    if (document.getElementById(destiny).style.backgroundImage.indexOf('rei') != -1) { //Verifica se foi xeque-mate
        showVictoryScreen(target)
    }

    for (let i = 0; i <= 15; i++) {
        if (document.querySelectorAll(`.${target}-cemetery .cemetery-position`)[i].style.backgroundImage == 'unset') { // Percorer o cemitério em busca de uma local vazio
            document.querySelectorAll(`.${target}-cemetery .cemetery-position`)[i].style.backgroundImage = document.getElementById(destiny).style.backgroundImage
            break
        }
    }
}

function changePiece(destiny) {
    let changePieceArea = document.querySelector('.change-piece')
    let pieceColor
    let gradient

    if (currentPlayer() == 'w') {
        pieceColor = 'white'
        gradient = 'white, black, white'
    } else {
        pieceColor = 'black'
        gradient = 'black, white, black'
    }

    changePieceArea.style.backgroundImage = `linear-gradient(${gradient})` // Aplica o gradient relativo a cor da peça
    changePieceArea.style.height = '200px' /* Configura animação de entrada */
    changePieceArea.style.padding = '20px'

    document.querySelectorAll('.exchange-pieces').forEach((piece, i) => {
        let pieces = [`url(./assets/img/torre-${pieceColor}.png)`, `url(./assets/img/cavalo-${pieceColor}.png)`, `url(./assets/img/bispo-${pieceColor}.png)`, `url(./assets/img/rainha-${pieceColor}.png)`]
        piece.style.backgroundImage = pieces[i]

        piece.onclick = (event) => {
            document.querySelector(`#${destiny}`).style.backgroundImage = piece.style.backgroundImage
            changePieceArea.style.height = '0'
            changePieceArea.style.padding = '0'
            unlockEvents()
            socket.emit('refreshGame', document.querySelector('#board').innerHTML, document.querySelector('#play-counter').value) //Atualizar jogo e contador
        }

        blockEvents()
    })

}

function performSingleMovement(origin, destiny, displacement, pieceType) {
    let nextPosi = nextPosition(origin, displacement[0], displacement[1])
    if (pieceType == 'pe') {

        if (displacement[0] == 0) { // Verifica se ele se moveu para cima ou para baixo(column)
            if (destiny == nextPosition(nextPosi, displacement[0], displacement[1])) {
                if (origin.substring(1, 2) == '2' || origin.substring(1, 2) == '7') {
                    nextPosi = nextPosition(nextPosi, displacement[0], displacement[1])
                }
            }

            if (nextPosi == destiny && document.getElementById(nextPosi).style.backgroundImage == 'unset') {
                document.getElementById(destiny).style.backgroundImage = document.getElementById(origin).style.backgroundImage // Realizando movimento
                document.getElementById(origin).style.backgroundImage = 'unset' // Limpando position anterior
                if (nextPosi.substring(1, 2) == '8' || nextPosi.substring(1, 2) == '1') { // Verifica se o peão chegou ao outro lado
                    changePiece(destiny)
                }
                incrementPlayCounter()
            } else {
                showAlert(`Jogada Inválida!
                            Está com dúvidas? Acesse ajuda ao lado`)
            }
        } else { //Se o peão não se moveu para cima, então ele tentou atacar alguma peça
            if (document.getElementById(nextPosi).style.backgroundImage != 'unset') {
                sendToCemetery(destiny) // Encaminhar a peça comida ao cemiterio
                document.getElementById(destiny).style.backgroundImage = document.getElementById(origin).style.backgroundImage // Realizando movimento
                document.getElementById(origin).style.backgroundImage = 'unset' // Limpando position anterior
                if (nextPosi.substring(1, 2) == '8' || nextPosi.substring(1, 2) == '1') { // Verifica se o peão chegou ao outro lado
                    changePiece(destiny)
                }
                incrementPlayCounter()
            } else {
                showAlert(`Jogada Inválida!
                            Está com dúvidas? Acesse ajuda ao lado`)
            }
        }

    } else {                                  //Rei
        if (nextPosi == destiny) {
            if (document.getElementById(destiny).style.backgroundImage.indexOf('rei') == -1) {
                if (document.getElementById(destiny).style.backgroundImage != 'unset') {
                    sendToCemetery(destiny) // Encaminhar a peça comida ao cemiterio
                }
                document.getElementById(destiny).style.backgroundImage = document.getElementById(origin).style.backgroundImage // Realizando movimento
                document.getElementById(origin).style.backgroundImage = 'unset' // Limpando position anterior
                incrementPlayCounter() // Jogada bem sucedida, incremento no contador
            } else {
                showAlert(`Jogada Inválida!
                                  Está com dúvidas? Acesse ajuda ao lado`)
            }
        } else {
            showAlert(`Jogada Inválida!
                                Está com dúvidas? Acesse ajuda ao lado`)
        }
    }
}

function incrementPlayCounter() {
    playCounter = document.getElementById('play-counter')
    playCounter.value = parseInt(playCounter.value) + 1
}

function accomplishMovement() {
    let origin = document.getElementById('selected-piece').value
    let destiny = document.getElementById('destiny-selected').value
    let pieceType = getPieceType()
    let directionOfPlay = getDirectionOfPlay(pieceType)
    let collided
    let position
    let displacement = []

    // window.alert(pieceType)               // Usado para fins de teste
    // window.alert(`${directionOfPlay}`) 

    if (directionOfPlay != undefined) {
        switch (directionOfPlay) {
            case 'acima': {
                collided = false
                position = origin
                displacement.push(0, 1) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 'pe' || pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }
                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (/* position.substring(0, 1) == 'h' ||  */position.substring(1, 2) == '8') {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            } // Acima

            case 'diagonal-dir-sup': {
                collided = false
                position = origin
                displacement.push(1, 1) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 'pe' || pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }

                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (position.substring(0, 1) == 'h' || position.substring(1, 2) == '8') {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            }   // Diagonal direita superior

            case 'direita': {
                collided = false
                position = origin
                displacement.push(1, 0) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }

                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (position.substring(0, 1) == 'h'/*  ||  position.substring(1, 2) == '8' */) {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            } // Direita

            case 'diagonal-dir-inf': {
                collided = false
                position = origin
                displacement.push(1, -1) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 'pe' || pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }

                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (position.substring(0, 1) == 'h' || position.substring(1, 2) == '1') {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            } // Diagonal direita inferior

            case 'tras': {
                collided = false
                position = origin
                displacement.push(0, -1) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 'pe' || pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }

                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (/* position.substring(0, 1) == 'h' ||  */position.substring(1, 2) == '1') {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }
                //window.alert(`pos ${position}, ${destiny}`)

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            } // Tras

            case 'diagonal-esq-inf': {
                collided = false
                position = origin
                displacement.push(-1, -1) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 'pe' || pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }

                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (position.substring(0, 1) == 'a' || position.substring(1, 2) == '1') {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            } // Diagonal esquerda inferior

            case 'esquerda': {
                collided = false
                position = origin
                displacement.push(-1, 0) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }

                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (position.substring(0, 1) == 'a' /* || position.substring(1, 2) == '1' */) {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            } // Esquerda

            case 'diagonal-esq-sup': {
                collided = false
                position = origin
                displacement.push(-1, 1) // Incremento em columns e rows para seguir para proxima position

                if (pieceType == 'pe' || pieceType == 're') {
                    performSingleMovement(origin, destiny, displacement, pieceType) // Efetuar jogada para peças que se movem apenas uma casa
                    break
                }

                while (collided == false) {
                    if (document.getElementById(nextPosition(position, displacement[0], displacement[1])).style.backgroundImage == 'unset' && position != destiny) {
                        position = nextPosition(position, displacement[0], displacement[1])
                        if (position.substring(0, 1) == 'a' || position.substring(1, 2) == '8') {
                            collided = true
                            // window.alert('Limite')
                        }
                    } else {
                        collided = true
                        // window.alert('destiny ou colisão')
                    }
                }

                makePlay(origin, destiny, position, displacement) // Troca a peça de lugar se for possível
                break
            } // Diagonal esquerda superior

            default: { //Cavalo // Acessa isso quando é retornado um array
                let positionValida = false
                directionOfPlay.forEach(i => {
                    if (i == destiny) {
                        sendToCemetery(destiny)
                        document.getElementById(destiny).style.backgroundImage = document.getElementById(origin).style.backgroundImage // Realizando movimento
                        document.getElementById(origin).style.backgroundImage = 'unset' // Limpando position anterior
                        positionValida = true
                        incrementPlayCounter()
                    }
                })

                if (positionValida == false) {
                    showAlert(`Posição Inválida!
                                        Está com dúvidas? Acesse ajuda ao lado`)
                }

            } // Cavalo

        }

    } else {
        showAlert(`Posição Inválida!
                        Está com dúvidas? Acesse ajuda ao lado`)
    }

    // Ações ao fim de cada jogada, bem sucedida ou não
    document.getElementById(origin).style.opacity = '1'   // Tira marcação de seleção
    document.getElementById('selected-piece').value = ''
    document.getElementById('destiny-selected').value = ''

    socket.emit('refreshGame', document.querySelector('#board').innerHTML, document.querySelector('#play-counter').value) //Atualizar jogo e contador

}

