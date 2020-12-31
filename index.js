const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const texto = document.getElementById("texto");
const playText = document.getElementById("playText");
const limpiarButton = document.getElementById("limpiar");
const GuardarButton = document.getElementById("guardar");
var Nota = document.getElementById("texto");
var guardar = document.getElementById("x");


let recognition = new webkitSpeechRecognition();
recognition.lang = "es-Es";
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
    const results = event.results;
    const frase = results[results.length - 1][0].transcript;
    texto.value += frase;
}

recognition.onend = (event) => {
    console.log("El micrófono ha dejado de escuchar");
}

recognition.onerror = (event) => {
    console.log(event.error);
}

startButton.addEventListener("click", () => {
    recognition.start();
});

stopButton.addEventListener("click", () => {
    recognition.abort();
});

playText.addEventListener("click", () => {
    leerTexto(texto.value);
});

limpiarButton.addEventListener("click", () => {
    texto.value = null;
});

GuardarButton.addEventListener("click", () => {

    //parte de la nota en sí
    console.log(Nota.value);
    document.getElementById("nota").innerHTML = Nota.value;
    //parte de fecha y hora
	var current_date = new Date();

	var fecha = `${current_date.getDate()}/${current_date.getMonth()+1}/${current_date.getFullYear()}`
    var hora = `${current_date.getHours()}:${current_date.getMinutes()}`
    document.getElementById("fecha").innerHTML = fecha;
    document.getElementById("hora").innerHTML = hora;
});

guardar.addEventListener("click", () => {
    //se debería guardar y ... por ende se borra automaticamente la nota :v
    texto.value = null;
});

function leerTexto(texto){
    const speech = new SpeechSynthesisUtterance();
    speech.text = texto;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


