const { ipcRenderer } = require('electron')

let id_input = document.getElementById('user_input')
let pass_input = document.getElementById('pass_input')

id_input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById('login_button').click()
    }
})

pass_input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById('login_button').click()
    }
})

document.getElementById('login_button').onclick = function () {
    let id = id_input.value
    let pass = pass_input.value
    ipcRenderer.send('login-data', id, pass)
    ipcRenderer.on('login-result', (event, arg) => {
        if (arg === false) {
            document.getElementById('error').innerHTML = "Date de logare invalide"
        }
        else ipcRenderer.send('login-passed')
    })
}


document.getElementById('quit_button').onclick = function () {
    ipcRenderer.sendSync('quit-app')
}
