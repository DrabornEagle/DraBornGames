#!/usr/bin/env python3
"""Render the DraBornGo / Last Mile v0.7 original soundtrack as real MP3 files.

The runtime never synthesizes the score. This build-time renderer creates complete
stereo PCM arrangements and ffmpeg encodes them to MP3. No third-party music,
loops, samples, or copyrighted recordings are used.
"""

from __future__ import annotations

import math
import random
import shutil
import subprocess
import tempfile
import wave
from array import array
from pathlib import Path


dkd_sample_rate = 24000
dkd_tau = math.tau
dkd_root = Path(__file__).resolve().parents[1]
dkd_audio_dir = dkd_root / "game" / "audio"

dkd_tracks = [
    {"file": "dkd-menu-ankara-gece.mp3", "name": "Kurye Merkezi / Gece", "bpm": 82, "root": 38, "energy": 0.58, "menu": True, "seed": 701},
    {"file": "dkd-drive-kizilay-hatti.mp3", "name": "Gece Ekspres", "bpm": 128, "root": 38, "energy": 0.96, "seed": 711},
    {"file": "dkd-drive-gece-vardiyasi.mp3", "name": "Asfalt Vardiyası", "bpm": 124, "root": 41, "energy": 0.88, "seed": 721},
    {"file": "dkd-drive-yagmur-asfalti.mp3", "name": "Yağmur Rotası", "bpm": 118, "root": 36, "energy": 0.78, "seed": 731, "rain": True},
    {"file": "dkd-drive-cankaya-pulse.mp3", "name": "Şehir Baskısı", "bpm": 136, "root": 43, "energy": 1.02, "seed": 741, "breakbeat": True},
    {"file": "dkd-drive-son-paket.mp3", "name": "03:17 / Son Teslimat", "bpm": 112, "root": 34, "energy": 0.84, "seed": 751, "cinematic": True},
]


def dkd_clip(dkd_value: float) -> float:
    return math.tanh(dkd_value * 1.22) * 0.82


def dkd_noise(dkd_random: random.Random) -> float:
    return dkd_random.uniform(-1.0, 1.0)


def dkd_pan(dkd_value: float, dkd_position: float) -> tuple[float, float]:
    dkd_left = math.sqrt((1.0 - dkd_position) * 0.5)
    dkd_right = math.sqrt((1.0 + dkd_position) * 0.5)
    return dkd_value * dkd_left, dkd_value * dkd_right


def dkd_kick(dkd_phase: float, dkd_time: float, dkd_energy: float) -> float:
    if dkd_phase > 0.34:
        return 0.0
    dkd_frequency = 46.0 + 92.0 * math.exp(-dkd_phase * 21.0)
    dkd_envelope = math.exp(-dkd_phase * 13.5)
    return math.sin(dkd_tau * dkd_frequency * dkd_time) * dkd_envelope * 0.46 * dkd_energy


def dkd_snare(dkd_phase: float, dkd_random_value: float, dkd_energy: float) -> float:
    if dkd_phase > 0.24:
        return 0.0
    dkd_envelope = math.exp(-dkd_phase * 18.0)
    return dkd_random_value * dkd_envelope * 0.19 * dkd_energy


def dkd_hat(dkd_phase: float, dkd_random_value: float, dkd_energy: float) -> float:
    if dkd_phase > 0.09:
        return 0.0
    return dkd_random_value * math.exp(-dkd_phase * 48.0) * 0.055 * dkd_energy


def dkd_render_track(dkd_track: dict, dkd_output: Path) -> None:
    dkd_bpm = float(dkd_track["bpm"])
    dkd_beat_seconds = 60.0 / dkd_bpm
    dkd_bars = 12 if dkd_track.get("menu") else 16
    dkd_duration = dkd_bars * 4 * dkd_beat_seconds
    dkd_frames = int(dkd_duration * dkd_sample_rate)
    dkd_left = array("h", [0]) * dkd_frames
    dkd_right = array("h", [0]) * dkd_frames
    dkd_random = random.Random(int(dkd_track["seed"]))
    dkd_root_hz = float(dkd_track["root"])
    dkd_energy = float(dkd_track["energy"])
    dkd_noise_state = 0.0

    dkd_bass_steps = [1.0, 1.0, 1.5, 1.0, 1.0, 1.25, 1.5, 0.75]
    dkd_stab_steps = [1.0, 1.5, 2.0, 1.25]

    for dkd_index in range(dkd_frames):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_beat = dkd_time / dkd_beat_seconds
        dkd_beat_index = int(dkd_beat)
        dkd_beat_phase = dkd_beat - dkd_beat_index
        dkd_eighth = dkd_beat * 2.0
        dkd_eighth_index = int(dkd_eighth)
        dkd_eighth_phase = dkd_eighth - dkd_eighth_index
        dkd_sixteenth = dkd_beat * 4.0
        dkd_sixteenth_index = int(dkd_sixteenth)
        dkd_sixteenth_phase = dkd_sixteenth - dkd_sixteenth_index
        dkd_bar = dkd_beat_index // 4

        dkd_raw_noise = dkd_noise(dkd_random)
        dkd_high_noise = dkd_raw_noise - dkd_noise_state * 0.72
        dkd_noise_state = dkd_raw_noise
        dkd_sample = 0.0

        if dkd_track.get("menu"):
            dkd_pad_motion = 0.72 + math.sin(dkd_tau * dkd_time / max(1.0, dkd_duration)) * 0.18
            dkd_sample += math.sin(dkd_tau * dkd_root_hz * dkd_time) * 0.095 * dkd_pad_motion
            dkd_sample += math.sin(dkd_tau * dkd_root_hz * 1.5 * dkd_time + 0.3) * 0.052 * dkd_pad_motion
            dkd_sample += math.sin(dkd_tau * dkd_root_hz * 2.0 * dkd_time + 0.7) * 0.025
            if dkd_beat_index % 4 in (0, 2):
                dkd_sample += dkd_kick(dkd_beat_phase, dkd_time, 0.54)
            if dkd_beat_index % 4 in (1, 3):
                dkd_sample += dkd_snare(dkd_beat_phase, dkd_high_noise, 0.32)
            dkd_sample += dkd_hat(dkd_eighth_phase, dkd_high_noise, 0.26)
            if dkd_eighth_index % 4 == 0:
                dkd_stab_hz = dkd_root_hz * dkd_stab_steps[(dkd_bar // 2) % len(dkd_stab_steps)]
                dkd_stab_env = math.exp(-dkd_eighth_phase * 4.5)
                dkd_sample += math.sin(dkd_tau * dkd_stab_hz * dkd_time) * dkd_stab_env * 0.032
        else:
            dkd_sample += dkd_kick(dkd_beat_phase, dkd_time, dkd_energy)
            if dkd_beat_index % 4 in (1, 3):
                dkd_sample += dkd_snare(dkd_beat_phase, dkd_high_noise, dkd_energy)
            dkd_hat_rate = 8.0 if dkd_track.get("breakbeat") else 4.0
            dkd_hat_phase = (dkd_beat * dkd_hat_rate / 4.0) % 1.0
            dkd_sample += dkd_hat(dkd_hat_phase, dkd_high_noise, dkd_energy)

            dkd_bass_hz = dkd_root_hz * dkd_bass_steps[dkd_eighth_index % len(dkd_bass_steps)]
            dkd_bass_env = 0.48 + 0.52 * math.exp(-dkd_eighth_phase * 4.0)
            dkd_sample += math.sin(dkd_tau * dkd_bass_hz * dkd_time) * dkd_bass_env * 0.21 * dkd_energy
            dkd_sample += math.sin(dkd_tau * dkd_bass_hz * 2.0 * dkd_time) * dkd_bass_env * 0.035

            if dkd_sixteenth_index % 4 == 0:
                dkd_stab_hz = dkd_root_hz * dkd_stab_steps[(dkd_bar + dkd_sixteenth_index // 16) % len(dkd_stab_steps)] * 2.0
                dkd_stab_env = math.exp(-dkd_sixteenth_phase * 7.5)
                dkd_sample += math.sin(dkd_tau * dkd_stab_hz * dkd_time) * dkd_stab_env * 0.055 * dkd_energy

            if dkd_track.get("breakbeat") and dkd_sixteenth_index % 8 in (3, 6):
                dkd_sample += dkd_high_noise * math.exp(-dkd_sixteenth_phase * 25.0) * 0.075
            if dkd_track.get("rain"):
                dkd_sample += dkd_high_noise * 0.018
            if dkd_track.get("cinematic"):
                dkd_swell = 0.5 + 0.5 * math.sin(dkd_tau * dkd_time / 8.0) ** 2
                dkd_sample += math.sin(dkd_tau * dkd_root_hz * 0.5 * dkd_time) * 0.07 * dkd_swell
                dkd_sample += math.sin(dkd_tau * dkd_root_hz * 1.25 * dkd_time + 0.5) * 0.035 * dkd_swell

        dkd_side_motion = math.sin(dkd_tau * 0.11 * dkd_time + float(dkd_track["seed"]) * 0.01) * 0.22
        dkd_left_value, dkd_right_value = dkd_pan(dkd_clip(dkd_sample), dkd_side_motion)
        dkd_left[dkd_index] = max(-32767, min(32767, int(dkd_left_value * 32767)))
        dkd_right[dkd_index] = max(-32767, min(32767, int(dkd_right_value * 32767)))

    with tempfile.TemporaryDirectory(prefix="dkd_v07_music_") as dkd_temp_dir:
        dkd_wav = Path(dkd_temp_dir) / "dkd-track.wav"
        with wave.open(str(dkd_wav), "wb") as dkd_wave:
            dkd_wave.setnchannels(2)
            dkd_wave.setsampwidth(2)
            dkd_wave.setframerate(dkd_sample_rate)
            dkd_interleaved = array("h")
            for dkd_index in range(dkd_frames):
                dkd_interleaved.append(dkd_left[dkd_index])
                dkd_interleaved.append(dkd_right[dkd_index])
            dkd_wave.writeframes(dkd_interleaved.tobytes())
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(dkd_wav), "-codec:a", "libmp3lame", "-b:a", "192k",
            "-ar", "44100", "-ac", "2", str(dkd_output),
        ], check=True)


def dkd_main() -> None:
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg bulunamadı; v0.7 MP3 üretimi yapılamadı.")
    dkd_audio_dir.mkdir(parents=True, exist_ok=True)
    for dkd_track in dkd_tracks:
        dkd_output = dkd_audio_dir / str(dkd_track["file"])
        dkd_render_track(dkd_track, dkd_output)
        print(f"v0.7 MP3 hazır: {dkd_track['name']} -> {dkd_output.name}")


if __name__ == "__main__":
    dkd_main()
