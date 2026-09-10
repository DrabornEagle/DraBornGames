#!/usr/bin/env python3
"""Render DraBornGo / Last Mile v0.5 original soundtrack MP3 assets.

No third-party songs or samples are used. The script synthesizes a full multi-layer
instrumental arrangement offline, writes PCM WAV, then encodes MP3 with ffmpeg.
It is intended for GitHub Actions; generated MP3 files are committed to the repo so
Termux/Expo Go never needs Python or ffmpeg at runtime.
"""

from __future__ import annotations

import argparse
import math
import random
import shutil
import subprocess
import tempfile
import wave
from array import array
from pathlib import Path

DKD_SR = 24000
DKD_TAU = math.tau
DKD_ROOT = Path(__file__).resolve().parents[1]
DKD_AUDIO_DIR = DKD_ROOT / "game" / "audio"

DKD_TRACKS = [
    {"file": "dkd-menu-ankara-gece.mp3", "name": "Ankara Gece Merkezi", "bpm": 96, "root": 45, "prog": [0, 5, 3, 7], "energy": .72, "menu": True},
    {"file": "dkd-drive-kizilay-hatti.mp3", "name": "Kızılay Hattı", "bpm": 128, "root": 45, "prog": [0, 3, 5, 7], "energy": 1.00},
    {"file": "dkd-drive-gece-vardiyasi.mp3", "name": "Gece Vardiyası", "bpm": 122, "root": 43, "prog": [0, 5, 7, 3], "energy": .92},
    {"file": "dkd-drive-yagmur-asfalti.mp3", "name": "Yağmur Asfaltı", "bpm": 116, "root": 48, "prog": [0, 7, 5, 3], "energy": .84, "texture": True},
    {"file": "dkd-drive-cankaya-pulse.mp3", "name": "Çankaya Pulse", "bpm": 132, "root": 50, "prog": [0, 5, 2, 7], "energy": 1.05, "breakbeat": True},
    {"file": "dkd-drive-son-paket.mp3", "name": "Son Paket", "bpm": 118, "root": 41, "prog": [0, 3, 7, 5], "energy": .88, "cinematic": True},
]


def dkd_midi_hz(dkd_note: float) -> float:
    return 440.0 * (2.0 ** ((dkd_note - 69.0) / 12.0))


def dkd_mix(dkd_left: array, dkd_right: array, dkd_start: int, dkd_signal: list[float], dkd_pan: float = 0.0) -> None:
    dkd_left_gain = math.sqrt((1.0 - dkd_pan) / 2.0)
    dkd_right_gain = math.sqrt((1.0 + dkd_pan) / 2.0)
    dkd_limit = min(len(dkd_signal), len(dkd_left) - dkd_start)
    for dkd_index in range(max(0, dkd_limit)):
        dkd_value = dkd_signal[dkd_index]
        dkd_left[dkd_start + dkd_index] += dkd_value * dkd_left_gain
        dkd_right[dkd_start + dkd_index] += dkd_value * dkd_right_gain


def dkd_tone(dkd_frequency: float, dkd_duration: float, dkd_amp: float, dkd_kind: str = "sine", dkd_attack: float = .01, dkd_release: float = .08, dkd_detune: float = 0.0) -> list[float]:
    dkd_count = max(1, int(dkd_duration * DKD_SR))
    dkd_frequency *= 2.0 ** (dkd_detune / 1200.0)
    dkd_attack_count = max(1, int(dkd_attack * DKD_SR))
    dkd_release_count = max(1, int(dkd_release * DKD_SR))
    dkd_values = [0.0] * dkd_count
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / DKD_SR
        dkd_phase = DKD_TAU * dkd_frequency * dkd_time
        if dkd_kind == "triangle":
            dkd_wave = 2.0 / math.pi * math.asin(math.sin(dkd_phase))
        elif dkd_kind == "saw":
            dkd_wave = 2.0 * ((dkd_frequency * dkd_time) % 1.0) - 1.0
        elif dkd_kind == "square":
            dkd_wave = 1.0 if math.sin(dkd_phase) >= 0 else -1.0
        else:
            dkd_wave = math.sin(dkd_phase)
        dkd_env = 1.0
        if dkd_index < dkd_attack_count:
            dkd_env *= dkd_index / dkd_attack_count
        if dkd_index >= dkd_count - dkd_release_count:
            dkd_env *= max(0.0, (dkd_count - dkd_index - 1) / dkd_release_count)
        dkd_values[dkd_index] = dkd_wave * dkd_env * dkd_amp
    return dkd_values


def dkd_kick(dkd_amp: float) -> list[float]:
    dkd_count = int(.32 * DKD_SR)
    dkd_values = [0.0] * dkd_count
    dkd_phase = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / DKD_SR
        dkd_frequency = 46.0 + 85.0 * math.exp(-dkd_time * 24.0)
        dkd_phase += DKD_TAU * dkd_frequency / DKD_SR
        dkd_env = math.exp(-dkd_time * 12.0)
        dkd_click = math.exp(-dkd_time * 90.0) * math.sin(DKD_TAU * 120.0 * dkd_time)
        dkd_values[dkd_index] = (math.sin(dkd_phase) * dkd_env + .18 * dkd_click) * dkd_amp
    return dkd_values


def dkd_noise_hit(dkd_rng: random.Random, dkd_duration: float, dkd_decay: float, dkd_amp: float, dkd_tone_hz: float | None = None) -> list[float]:
    dkd_count = int(dkd_duration * DKD_SR)
    dkd_values = [0.0] * dkd_count
    dkd_previous = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / DKD_SR
        dkd_noise = dkd_rng.uniform(-1.0, 1.0)
        dkd_high = dkd_noise - dkd_previous * .68
        dkd_previous = dkd_noise
        dkd_value = dkd_high * .58
        if dkd_tone_hz:
            dkd_value += math.sin(DKD_TAU * dkd_tone_hz * dkd_time) * .42
        dkd_values[dkd_index] = dkd_value * math.exp(-dkd_time * dkd_decay) * dkd_amp
    return dkd_values


def dkd_add_pad(dkd_left: array, dkd_right: array, dkd_start_s: float, dkd_duration: float, dkd_notes: list[int], dkd_amp: float) -> None:
    dkd_pans = [-.42, -.14, .14, .42]
    for dkd_index, dkd_note in enumerate(dkd_notes):
        dkd_frequency = dkd_midi_hz(dkd_note)
        dkd_start = int(dkd_start_s * DKD_SR)
        dkd_mix(dkd_left, dkd_right, dkd_start, dkd_tone(dkd_frequency, dkd_duration, dkd_amp, "sine", .18, .35, -4), dkd_pans[dkd_index % len(dkd_pans)])
        dkd_mix(dkd_left, dkd_right, dkd_start, dkd_tone(dkd_frequency, dkd_duration, dkd_amp * .38, "saw", .22, .40, 5), -dkd_pans[dkd_index % len(dkd_pans)])
        dkd_mix(dkd_left, dkd_right, dkd_start, dkd_tone(dkd_frequency * 2.0, dkd_duration, dkd_amp * .13, "sine", .15, .35), dkd_pans[dkd_index % len(dkd_pans)] * .4)


def dkd_render_track(dkd_track: dict, dkd_track_index: int, dkd_output: Path) -> None:
    dkd_bpm = float(dkd_track["bpm"])
    dkd_beat = 60.0 / dkd_bpm
    dkd_bars = 8
    dkd_duration = dkd_bars * 4 * dkd_beat
    dkd_count = int(dkd_duration * DKD_SR)
    dkd_left = array("f", [0.0]) * dkd_count
    dkd_right = array("f", [0.0]) * dkd_count
    dkd_rng = random.Random(20260909 + dkd_track_index * 97)
    dkd_root = int(dkd_track["root"])
    dkd_scale = [0, 2, 3, 5, 7, 8, 10]
    dkd_chords = {
        0: [dkd_root, dkd_root + 3, dkd_root + 7, dkd_root + 10],
        2: [dkd_root + 2, dkd_root + 5, dkd_root + 9, dkd_root + 12],
        3: [dkd_root + 3, dkd_root + 7, dkd_root + 10, dkd_root + 15],
        5: [dkd_root + 5, dkd_root + 8, dkd_root + 12, dkd_root + 15],
        7: [dkd_root + 7, dkd_root + 10, dkd_root + 14, dkd_root + 17],
    }
    dkd_energy = float(dkd_track["energy"])
    dkd_menu = bool(dkd_track.get("menu"))

    for dkd_bar in range(dkd_bars):
        dkd_degree = int(dkd_track["prog"][dkd_bar % len(dkd_track["prog"])])
        dkd_notes = dkd_chords.get(dkd_degree, [dkd_root + dkd_degree, dkd_root + dkd_degree + 3, dkd_root + dkd_degree + 7, dkd_root + dkd_degree + 10])
        dkd_add_pad(dkd_left, dkd_right, dkd_bar * 4 * dkd_beat, 4 * dkd_beat, dkd_notes, .048 if dkd_menu else .038)

        for dkd_quarter in range(4):
            dkd_at = (dkd_bar * 4 + dkd_quarter) * dkd_beat
            dkd_bass = dkd_midi_hz(dkd_notes[0] - 12)
            dkd_mix(dkd_left, dkd_right, int(dkd_at * DKD_SR), dkd_tone(dkd_bass, dkd_beat * .88, .13 * dkd_energy, "sine", .004, .08), -.12)
            dkd_mix(dkd_left, dkd_right, int(dkd_at * DKD_SR), dkd_tone(dkd_bass * 2, dkd_beat * .52, .025 * dkd_energy, "triangle", .004, .12), .08)

        if dkd_menu:
            for dkd_quarter in (0, 2):
                dkd_mix(dkd_left, dkd_right, int((dkd_bar * 4 + dkd_quarter) * dkd_beat * DKD_SR), dkd_kick(.40), 0)
            for dkd_quarter in (1, 3):
                dkd_mix(dkd_left, dkd_right, int((dkd_bar * 4 + dkd_quarter) * dkd_beat * DKD_SR), dkd_noise_hit(dkd_rng, .22, 18, .13, 190), .12)
            for dkd_eighth in range(8):
                dkd_mix(dkd_left, dkd_right, int((dkd_bar * 4 + dkd_eighth * .5) * dkd_beat * DKD_SR), dkd_noise_hit(dkd_rng, .055, 60, .028), -.3 if dkd_eighth % 2 else .3)
        else:
            for dkd_quarter in range(4):
                dkd_mix(dkd_left, dkd_right, int((dkd_bar * 4 + dkd_quarter) * dkd_beat * DKD_SR), dkd_kick(.54 * dkd_energy), 0)
            for dkd_quarter in (1, 3):
                dkd_mix(dkd_left, dkd_right, int((dkd_bar * 4 + dkd_quarter) * dkd_beat * DKD_SR), dkd_noise_hit(dkd_rng, .23, 17, .26 * dkd_energy, 190), .10)
            dkd_steps = 16 if dkd_track.get("breakbeat") else 8
            for dkd_step in range(dkd_steps):
                if dkd_steps == 16 and dkd_step % 2 and dkd_rng.random() < .25:
                    continue
                dkd_step_at = (dkd_bar * 4 + dkd_step * (4 / dkd_steps)) * dkd_beat
                dkd_mix(dkd_left, dkd_right, int(dkd_step_at * DKD_SR), dkd_noise_hit(dkd_rng, .07, 55, .045 * dkd_energy), -.35 if dkd_step % 2 else .35)

        dkd_pattern = [0, 2, 4, 3, 5, 4, 2, 1]
        for dkd_eighth in range(8):
            if dkd_menu and dkd_eighth % 2:
                continue
            dkd_scale_index = dkd_pattern[(dkd_eighth + dkd_bar + dkd_track_index) % len(dkd_pattern)]
            dkd_note = dkd_root + 12 + dkd_scale[dkd_scale_index % len(dkd_scale)] + (dkd_degree if dkd_eighth in (2, 6) else 0)
            dkd_at = (dkd_bar * 4 + dkd_eighth * .5) * dkd_beat
            dkd_mix(dkd_left, dkd_right, int(dkd_at * DKD_SR), dkd_tone(dkd_midi_hz(dkd_note), .34, (.043 if dkd_menu else .060) * dkd_energy, "triangle", .004, .29), -.42 if dkd_eighth % 2 else .42)
            dkd_mix(dkd_left, dkd_right, int(dkd_at * DKD_SR), dkd_tone(dkd_midi_hz(dkd_note) * 2, .22, .014 * dkd_energy, "sine", .003, .18), .25 if dkd_eighth % 2 else -.25)

        if not dkd_menu and dkd_bar % 2 == 1:
            for dkd_phrase_index, dkd_scale_index in enumerate((0, 3, 4, 2)):
                dkd_note = dkd_root + 24 + dkd_scale[dkd_scale_index]
                dkd_at = (dkd_bar * 4 + 2 + dkd_phrase_index * .5) * dkd_beat
                dkd_mix(dkd_left, dkd_right, int(dkd_at * DKD_SR), dkd_tone(dkd_midi_hz(dkd_note), .42 * dkd_beat, .034 * dkd_energy, "sine", .01, .14), .16 if dkd_phrase_index % 2 else -.16)

    if dkd_track.get("cinematic"):
        for dkd_bar in range(dkd_bars):
            dkd_mix(dkd_left, dkd_right, int(dkd_bar * 4 * dkd_beat * DKD_SR), dkd_tone(dkd_midi_hz(dkd_root - 12), 4 * dkd_beat, .022, "saw", .35, .55), 0)

    if dkd_track.get("texture") or dkd_menu:
        dkd_previous = 0.0
        for dkd_index in range(dkd_count):
            dkd_previous = (dkd_previous + dkd_rng.uniform(-1, 1) * .025) / 1.025
            dkd_value = dkd_previous * .012
            dkd_left[dkd_index] += dkd_value
            dkd_right[(dkd_index + 37) % dkd_count] += dkd_value

    for dkd_delay_s, dkd_gain in ((.18, .13), (.36, .075), (.72, .04)):
        dkd_delay = int(dkd_delay_s * DKD_SR)
        dkd_left_copy = array("f", dkd_left)
        dkd_right_copy = array("f", dkd_right)
        for dkd_index in range(dkd_count):
            dkd_left[dkd_index] += dkd_left_copy[(dkd_index - dkd_delay) % dkd_count] * dkd_gain
            dkd_right[dkd_index] += dkd_right_copy[(dkd_index - dkd_delay) % dkd_count] * dkd_gain

    dkd_peak = max(max(abs(dkd_value) for dkd_value in dkd_left), max(abs(dkd_value) for dkd_value in dkd_right), 1e-6)
    dkd_scale_gain = .92 / dkd_peak

    with tempfile.TemporaryDirectory(prefix="dkd_music_") as dkd_tmp:
        dkd_wav = Path(dkd_tmp) / "track.wav"
        with wave.open(str(dkd_wav), "wb") as dkd_wave:
            dkd_wave.setnchannels(2)
            dkd_wave.setsampwidth(2)
            dkd_wave.setframerate(DKD_SR)
            dkd_pcm = array("h")
            for dkd_index in range(dkd_count):
                dkd_left_sample = max(-1.0, min(1.0, math.tanh(dkd_left[dkd_index] * 1.10) * dkd_scale_gain))
                dkd_right_sample = max(-1.0, min(1.0, math.tanh(dkd_right[dkd_index] * 1.10) * dkd_scale_gain))
                dkd_pcm.append(int(dkd_left_sample * 32767))
                dkd_pcm.append(int(dkd_right_sample * 32767))
            dkd_wave.writeframes(dkd_pcm.tobytes())

        dkd_output.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error", "-i", str(dkd_wav),
            "-map_metadata", "-1", "-write_xing", "0", "-c:a", "libmp3lame",
            "-b:a", "80k", "-ar", str(DKD_SR), str(dkd_output),
        ], check=True)


def dkd_main() -> int:
    dkd_parser = argparse.ArgumentParser()
    dkd_parser.add_argument("--force", action="store_true", help="Regenerate MP3 assets even when they already exist.")
    dkd_args = dkd_parser.parse_args()
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg bulunamadı; GitHub Actions müzik render adımı ffmpeg gerektirir.")

    DKD_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    for dkd_index, dkd_track in enumerate(DKD_TRACKS):
        dkd_output = DKD_AUDIO_DIR / dkd_track["file"]
        if dkd_output.exists() and dkd_output.stat().st_size > 100_000 and not dkd_args.force:
            print(f"DKD music ready: {dkd_output.name} ({dkd_output.stat().st_size} bytes)")
            continue
        print(f"DKD rendering: {dkd_track['name']} -> {dkd_output.name}")
        dkd_render_track(dkd_track, dkd_index, dkd_output)
        print(f"DKD rendered: {dkd_output.name} ({dkd_output.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(dkd_main())