// 3:19:49
console.log("Let's write some Javascript");

let currentnasheed = new Audio();
let nasheeds;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getnasheeds() {
    let response = await fetch("/nasheeds");
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let nasheeds = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            nasheeds.push(element.href.split("/nasheeds")[1]);
        }
    }
    return nasheeds;
}

const playnasheed = (track, pause = false) => {
    currentnasheed.src = "/nasheeds/" + track
    if (!pause) {
        currentnasheed.play()
        play.src = "svg/pause.svg";
    }

    document.querySelector(".playinfo").innerHTML = decodeURI(track);
    document.querySelector(".playtime").innerHTML = "00:00 / 00:00";
};

async function main() {
    nasheeds = await getnasheeds();
    playnasheed(nasheeds[0], true)

    let nasheedsul = document.querySelector(".nasheedslist").getElementsByTagName("ul")[0];
    for (const nasheed of nasheeds) {
        nasheedsul.innerHTML += `
            <li>
                <img style="right: -14px; position: relative;" src="svg/music.svg" alt="music-icon">
                <div class="info">
                    <div style="font-weight: 600;">${nasheed.replaceAll("%20", " ")}</div>
                    <div style="color: gray; font-weight: 342;font-size:15px">Arham Hussain</div>
                </div>
                <div class="playnow">
                    <span>Play</span>
                    <img id="play-${nasheed}" style="position: relative; left: -5px;" src="svg/play.svg" alt="play-button">
                </div>
            </li>`;
    }

    Array.from(document.querySelector(".nasheedslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            const nasheedTrack = e.querySelector(".info").firstElementChild.innerHTML;
            playnasheed(nasheedTrack);
            document.getElementById(`play-${nasheedTrack}`).src = "svg/pause.svg";
        });
    });

    play.addEventListener("click", () => {
        if (currentnasheed.paused) {
            currentnasheed.play();
            play.src = "svg/pause.svg";
        } else {
            currentnasheed.pause();
            play.src = "svg/play.svg";
        }
    });

    currentnasheed.addEventListener("timeupdate", () => {
        document.querySelector(".playtime").innerHTML = `${secondsToMinutesSeconds(currentnasheed.currentTime)}/${secondsToMinutesSeconds(currentnasheed.duration)}`
        document.querySelector(".circle").style.left = currentnasheed.currentTime / currentnasheed.duration * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentnasheed.currentTime = (currentnasheed.duration) * percent / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    prev.addEventListener("click", () => {
        let index = nasheeds.indexOf(currentnasheed.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playnasheed(nasheeds[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentnasheed.pause()
        let index = nasheeds.indexOf(currentnasheed.src.split("/").slice(-1)[0])
        if ((index + 1) < nasheeds.length - 1) {
            playnasheed(nasheeds[index + 1])
        }
    })
}

const scrollTopButton = document.getElementById("scroll-top-button");
const progressCircle = document.getElementById("progress-circle");

const svgLength = 2 * Math.PI * 40; // Calculate circle length

window.addEventListener("scroll", function () {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    const progress = (scrollTop / (scrollHeight - windowHeight)) * 100;

    progressCircle.style.strokeDashoffset = svgLength - (progress / 100) * svgLength;

    if (scrollTop > 100) {
        scrollTopButton.classList.add("show");
    } else {
        scrollTopButton.classList.remove("show");
    }
});

function calcscrollValue() {
    let scrollprogress = document.getElementById("progress");
    let progressvalue = document.getElementById("progress-value");
    let pos = document.documentElement.scrollTop;
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    if (pos > 100) {
        scrollprogress.style.display = "grid";
    } else {
        scrollprogress.style.display = "none";
    }
    scrollprogress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });
    scrollprogress.style.background = `conic-gradient(#dc143c ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
}

window.onscroll = calcscrollValue;
window.onload = calcscrollValue;
main();
