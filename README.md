# ai-music-generator
Создай Свою музыку
uture-bass">Future Bass</option>
<option value="synthwave">Synthwave / Cyberpunk</option>
<option value="dubstep">Dubstep</option>
<option value="rock">Acoustic / Rock</option>
</select>
</div>
<div class="form-group">
<label for="bpm">Темп (BPM)</label>
<input type="text" id="bpm" placeholder="Авто (напр. 126)">
</div>
</div>
<div class="form-group">
<label for="lyrics">Текст песни (необязательно)</label>
<textarea id="lyrics" placeholder="Вставьте свой текст или оставьте пустым для автогенерации ИИ v6..." style="min-height: 60px;"></textarea>
</div>
<button class="btn-generate" id="generateBtn" onclick="createMusicTrack()">Сгенерировать трек (v6 engine)</button>
<div class="loader" id="loader">
<div class="spinner"></div>
<p style="color: var(--text-muted); font-size: 0.9rem;">ИИ v6 синтезирует живые инструменты и вокал...</p>
</div>
<div class="result-panel" id="resultArea">
<div class="track-info">
<span class="track-title" id="outputTrackTitle">Сгенерированный Трек #1</span>
<span style="font-size: 0.75rem; color: #34d399;">HQ 320 kbps</span>
</div>
<audio id="audioPlayer" class="audio-player" controls></audio>
</div>
</div>
<script>
function createMusicTrack() {
const btn = document.getElementById('generateBtn');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('resultArea');
const audioPlayer = document.getElementById('audioPlayer');
const promptText = document.getElementById('prompt').value;
const genre = document.getElementById('genre').value;
const model = document.getElementById('model').value;
const trackTitle = document.getElementById('outputTrackTitle');
if (!promptText.trim()) {
alert('Пожалуйста, опишите трек или укажите желаемое настроение.');
return;
}
btn.disabled = true;
btn.style.opacity = '0.5';
loader.style.display = 'block';
resultArea.style.display = 'none';
setTimeout(() => {
audioPlayer.src = 'https://www.w3schools.com/tags/horse.ogg';
trackTitle.textContent = ⁠${genre.toUpperCase()} — Master V6 (${model})⁠;
loader.style.display = 'none';
resultArea.style.display = 'block';
btn.disabled = false;
btn.style.opacity = '1';
audioPlayer.play();
}, 4000);
}
</script>
</body>
</html>"f
