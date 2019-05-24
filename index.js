const { ipcRenderer } = require('electron')

let hours = 0
let minutes = 0
let seconds = 0
let clicked = false

ipcRenderer.send('user')
ipcRenderer.on('user-data', (event, arg) => {
    document.getElementById('name').innerHTML = 'Bine ai venit, ' + arg.prenume_angajati + '!'
    hours = arg.orar_angajati
})

function print_clock() {
    if (minutes > 9 && seconds > 9)
        document.getElementById('clock').innerHTML = '0' + hours + ' : ' + minutes + ' : ' + seconds
    else if (seconds > 9)
        document.getElementById('clock').innerHTML = '0' + hours + ' : 0' + minutes + ' : ' + seconds
    else if (minutes > 9)
        document.getElementById('clock').innerHTML = '0' + hours + ' : ' + minutes + ' : 0' + seconds
    else document.getElementById('clock').innerHTML = '0' + hours + ' : 0' + minutes + ' : 0' + seconds
}

let x = setInterval(function () {
    if (!clicked) {
        print_clock()
        if (seconds > 0)
            seconds--
        else if (seconds === 0) {
            seconds = 59
            if (minutes > 0)
                minutes--
            else if (minutes === 0) {
                minutes = 59
                if (hours > 0)
                    hours--
            }
        }
    }
    if (hours === 0 && seconds === 0 && minutes === 0) {
        clearInterval(x)
        document.getElementById('logout_button').disabled = false
    }
}, 1000)

document.getElementById('logout_button').onclick = function () {
    ipcRenderer.send('logout-app')
}

document.getElementById('pause_button').onclick = function () {
    if (!clicked) {
        document.getElementById('pause_button').innerHTML = 'Oprește pauza!'
        clicked = true
    }
    else {
        document.getElementById('pause_button').innerHTML = 'Pauză!'
        clicked = false
    }
    
}