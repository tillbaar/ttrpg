import WaveSurfer from "./vendor/wavesurfer.esm.js";

const setup = (player) => {
  const container = player.querySelector(".waveform");

  const colorred =
    getComputedStyle(player).getPropertyValue("--heading-color").trim() ||
    "#58180d";
  const colorgrey =
    getComputedStyle(player).getPropertyValue("--muted-color").trim() ||
    "#808080";

  const wavesurfer = WaveSurfer.create({
    container,
    url: container.dataset.src,
    height: "auto",
    waveColor: colorred,
    cursorColor: colorred,
    progressColor: colorgrey,
    cursorWidth: 2,

    // Render a waveform as a squiggly line, see https://css-tricks.com/
    // making-an-audio-waveform-visualizer-with-vanilla-javascript/
    renderFunction: (channels, ctx) => {
      const { width, height } = ctx.canvas
      const scale = channels[0].length / width
      const step = 10

      ctx.translate(0, height / 2)
      ctx.strokeStyle = ctx.fillStyle
      ctx.lineWidth = 1.5
      ctx.beginPath()

      for (let i = 0; i < width; i += step * 2) {
        const index = Math.floor(i * scale)
        const value = Math.abs(channels[0][index])
        let x = i
        let y = value * height

        ctx.moveTo(x, 0)
        ctx.lineTo(x, y)
        ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true)
        ctx.lineTo(x + step, 0)

        x = x + step
        y = -y
        ctx.moveTo(x, 0)
        ctx.lineTo(x, y)
        ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false)
        ctx.lineTo(x + step, 0)
      }

      ctx.stroke()
      ctx.closePath()
    },
  });

  const btn = player.querySelector(".ap-play");
  const current = player.querySelector(".ap-current");
  const total = player.querySelector(".ap-total");

  // Formats a number of seconds as a time string
  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
  };

// Takes a time string such as 12:34 and wraps every character in its own HTML
// element, so that the CSS assigns each character to a fixed-width box.
const cells = (s) =>
  [...s].map((c) => c === ":" ? "<i>:</i>" : `<b>${c}</b>`).join("");

  let lastCur = "", lastTotal = "";

  const updateTime = () => {
    const cur = fmt(wavesurfer.getCurrentTime());
    const tot = fmt(wavesurfer.getDuration() || 0);
    if (cur !== lastCur) { current.innerHTML = cells(cur); lastCur = cur; }
    if (tot !== lastTotal) { total.innerHTML = cells(tot); lastTotal = tot; }
  };

  btn.addEventListener("click", () => wavesurfer.playPause());

  const setPlaying = (playing) => {
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-label", playing ? "Pause" : "Play");
  };

  wavesurfer.on("play", () => setPlaying(true));
  wavesurfer.on("pause", () => setPlaying(false));
  wavesurfer.on("finish", () => setPlaying(false));
  
  wavesurfer.on("ready", updateTime);
  wavesurfer.on("timeupdate", updateTime);

  // Download button's click handler.
  const dl = player.querySelector(".ap-download");
  dl.addEventListener("click", async () => {
    const url = container.dataset.src;
    const name = url.split("/").pop().split("?")[0] || "audio.mp3";
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const blobUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  });

  // Audio player native HTML fallback.
  wavesurfer.on("error", () => player.classList.remove("go"));
  player.classList.add("go");
};

document.querySelectorAll(".audioplayer").forEach((player) => {
  try {
    setup(player);
  } catch (err) {
    console.error("Custom audio player failed, using native HTML element", err);
    player.classList.remove("go");
  }
});