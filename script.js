// =======================
// KONFIGURASI PERSONAL
// =======================

// nama yang harus dia ketik dengan benar
const correctName = "Jenna"; // case-insensitive

// nama panggilan manis yang ditampilkan di headline
const partnerName = "Sayangku, Rizqi";

// nama kamu
const yourName = "Khoironi";

// path lagu (harus ada file ini di repo)
const songSrc = "./ba_sementara.mp3";

// puisi pecah jadi paragraf biar muncul bertahap
const poemParagraphs = [
    `hari ini kamu bertambah umur,
dan aku cuma mau bilang:
terima kasih sudah tetap di sini,
walau kita pernah sama-sama goyah.`,

    `kita pernah keras kepala,
pernah diam karena gengsi,
pernah melukai tanpa tahu bagaimana cara memperbaiki.
tapi aku belajar —
cinta yang bertahan bukan karena tak pernah retak,
tapi karena dua orangnya mau terus menambal,
pelan-pelan, seumur hidupnya.`,

    `aku maafin kamu,
dan aku juga minta dimaafkan.
bukan supaya semua lupa,
tapi supaya semua yang sakit
punya tempat untuk sembuh.`,

    `karena, seperti kata Sal Priadi,
"kita pernah begitu cinta,
begitu cinta,
sampai lupa caranya marah.”`,

    `dan aku mau,
setelah semua ini,
kita belajar lagi cara mencintai
dengan tenang,
dengan sabar,
dengan sadar bahwa nggak ada yang sementara
kalau kita sama-sama jaga.`,

    `selamat ulang tahun, sayang.
semoga setiap detik yang datang
nggak cuma menua,
tapi menumbuhkan kita —
menjadi dua hati yang belajar berpelukan,
meski kadang masih belajar memaafkan.`
];

// =======================
// DOM ELEMENTS
// =======================
const introSection = document.getElementById("introSection");
const nameInput = document.getElementById("nameInput");
const btnStart = document.getElementById("btnStart");
const introError = document.getElementById("introError");

const mainCard = document.getElementById("mainCard");
const nameTarget = document.getElementById("nameTarget");
const footerNameEl = document.querySelector(".footer-note .me");

const poemContainer = document.getElementById("poemContainer");

const photoFrame = document.getElementById("photoFrame");
const photoCoverText = document.getElementById("photoCoverText");

const heartLayer = document.getElementById("float-layer");

const audioEl = document.getElementById("bgAudio");

const canvas = document.getElementById("bokeh-canvas");
const ctx = canvas.getContext("2d");

// =======================
// INIT STATIC TEXT
// =======================
nameTarget.textContent = partnerName;
if (footerNameEl) footerNameEl.textContent = yourName;

audioEl.src = songSrc;
audioEl.loop = true;
audioEl.volume = 0.6;

// =======================
// VALIDATE NAME FLOW
// =======================
let started = false;

btnStart.addEventListener("click", async () => {
    if (started) return;

    const typed = (nameInput.value || "").trim().toLowerCase();

    if (typed.toLowerCase() === correctName.toLowerCase()) {
        started = true;
        introError.textContent = "";

        // play music
        try {
            await audioEl.play();
        } catch (err) {
            // browser might block autoplay, that's okay
        }

        // fade out intro
        introSection.classList.add("hide");

        // show main card
        setTimeout(() => {
            mainCard.classList.remove("hidden");
            // force reflow sebelum add class show (supaya animasi jalan)
            void mainCard.offsetWidth;
            mainCard.classList.add("show");

            // unlock photo (remove blur)
            photoFrame.classList.remove("locked");
            photoFrame.classList.add("unlocked");
            photoCoverText.classList.add("hide");

            // mulai puisi bertahap
            setTimeout(() => {
                revealPoemLinesSequential();
            }, 900);

            // mulai hearts
            startHeartLoop();
        }, 500);

    } else {
        introError.textContent = "hmm... kamu bukan orangnya, kalau salah😌 coba lagi ya";
    }
});

// =======================
// POEM SEQUENCE
// =======================
function revealPoemLinesSequential() {
    let index = 0;

    function showNext() {
        if (index >= poemParagraphs.length) return;

        const block = document.createElement("div");
        block.classList.add("poem-line");
        block.textContent = poemParagraphs[index];
        poemContainer.appendChild(block);

        requestAnimationFrame(() => {
            block.classList.add("show");
        });

        index += 1;
        setTimeout(showNext, 3500); // jeda antar paragraf
    }

    showNext();
}

// =======================
// HEART PARTICLES
// =======================
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart-float");
    heart.textContent = "❤";

    const startLeftVW = rand(10, 90);
    const startTopVH = rand(60, 90);

    heart.style.left = startLeftVW + "vw";
    heart.style.top = startTopVH + "vh";
    heart.style.fontSize = rand(12, 20) + "px";
    heart.style.animationDuration = rand(5, 9) + "s";

    heartLayer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

function startHeartLoop() {
    spawnHeart();
    setInterval(() => {
        spawnHeart();
    }, 2500);
}

// =======================
// BOKEH BACKGROUND
// =======================
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const particles = [];
const PARTICLE_COUNT = 20;

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: rand(40, 120),
        alpha: Math.random() * 0.15 + 0.05,
        dx: Math.random() * 0.4 - 0.2,
        dy: Math.random() * 0.4 - 0.2,
        warm: Math.random() < 0.6
    });
}

function drawBokeh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(
            p.x - p.r * 0.3,
            p.y - p.r * 0.3,
            p.r * 0.1,
            p.x,
            p.y,
            p.r
        );

        if (p.warm) {
            grad.addColorStop(0, `rgba(255,221,172,${p.alpha})`); // warm amber
            grad.addColorStop(1, "rgba(0,0,0,0)");
        } else {
            grad.addColorStop(0, `rgba(255,159,181,${p.alpha})`); // rose
            grad.addColorStop(1, "rgba(0,0,0,0)");
        }

        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // slow drift
        p.x += p.dx;
        p.y += p.dy;

        // wrap edges
        if (p.x - p.r > canvas.width) p.x = -p.r;
        if (p.x + p.r < 0) p.x = canvas.width + p.r;
        if (p.y - p.r > canvas.height) p.y = -p.r;
        if (p.y + p.r < 0) p.y = canvas.height + p.r;
    });

    requestAnimationFrame(drawBokeh);
}

drawBokeh();
