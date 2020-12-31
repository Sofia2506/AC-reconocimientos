const video = document.getElementById('video');
const img = document.getElementById('candado');
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
]).then(startVideo);

function startVideo(){
    navigator.getUserMedia = (navigator.getUserMedia||
    navigator.webkitGetUserMedia||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
    navigator.getUserMedia(
        {video: {} },
        stream =>video.srcObject = stream,
        err =>console.log(err)
    )
    recognizeFaces()
}
    startVideo();

    async function recognizeFaces() {
        const labeledDescriptors = await loadLabeledImages()
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)
        
        video.play()
        video.addEventListener('play', async () => {
            console.log('Playing')
            const canvas = faceapi.createCanvasFromMedia(video)
            document.body.append(canvas)
            img.style.display="none"
            const displaySize = { width: video.width, height: video.height }
            faceapi.matchDimensions(canvas, displaySize)
            let cont = 0
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video)
                .withFaceLandmarks().withFaceDescriptors()
                const resizedDetections = faceapi.resizeResults(detections, displaySize)
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                const results = resizedDetections.map((d) => {
                    return faceMatcher.findBestMatch(d.descriptor)
                })
               
                results.forEach( (result, i) => {
                    const box = resizedDetections[i].detection.box
                    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                    drawBox.draw(canvas)
                    console.log(result.toString())
                    parseInt(cont)
                    
                        if(result.toString().substr(0,result.toString().indexOf(" "))=='Angel'){
                            cont++
                            console.log(cont) 
                        }
                    if(cont==10){
                        location.href ="ReconocimientoVoz.html";
                    }
                })
            }, 100)
    
        })
    }

function loadLabeledImages() {
    const labels = ['Angel'] 
    return Promise.all(
        labels.map(async label=>{
            const descriptions = []
            for(let i=1; i<=4; i++) {
                const img = await faceapi.fetchImage(`labeled_images/${label}/${i}.jpeg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                console.log(label + i)
                descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}