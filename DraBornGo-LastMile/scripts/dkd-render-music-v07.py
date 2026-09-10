#!/usr/bin/env python3
"""Render DraBornGo / Last Mile v0.7 original game soundtrack as MP3 files.

The soundtrack is generated deterministically in GitHub Actions. It uses layered
harmony, bass, lead melody, arpeggios and restrained percussion so the result
behaves like a game score rather than a bare rhythm loop. No third-party songs,
samples or copyrighted recordings are used.
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


dkd_sample_rate = 24000
dkd_tau = math.tau
dkd_root_dir = Path(__file__).resolve().parents[1]
dkd_audio_dir = dkd_root_dir / "game" / "audio"

dkd_tracks = [
    {
        "file": "dkd-v07-home-kurye-merkezi.mp3",
        "name": "Kurye Merkezi: Gece Ufku",
        "bpm": 82,
        "root": 45,
        "progression": [0, 5, 3, 7],
        "energy": 0.62,
        "home": True,
        "motif": [0, 2, 4, 2, 5, 4, 2, 1],
    },
    {
        "file": "dkd-v07-drive-ankara-gece.mp3",
        "name": "Ankara Gece Hattı",
        "bpm": 118,
        "root": 45,
        "progression": [0, 3, 5, 7],
        "energy": 0.92,
        "motif": [0, 2, 4, 5, 4, 2, 1, 3],
    },
    {
        "file": "dkd-v07-drive-son-kilometre.mp3",
        "name": "Son Kilometre",
        "bpm": 124,
        "root": 43,
        "progression": [0, 5, 7, 3],
        "energy": 1.00,
        "motif": [0, 3, 4, 6, 5, 4, 2, 1],
    },
    {
        "file": "dkd-v07-drive-firtina-hatti.mp3",
        "name": "Fırtına Hattı",
        "bpm": 130,
        "root": 41,
        "progression": [0, 7, 5, 3],
        "energy": 1.08,
        "storm": True,
        "motif": [0, 4, 2, 5, 3, 6, 4, 2],
    },
    {
        "file": "dkd-v07-drive-asfalt-yildizlari.mp3",
        "name": "Asfalt Yıldızları",
        "bpm": 114,
        "root": 48,
        "progression": [0, 5, 2, 7],
        "energy": 0.84,
        "atmosphere": True,
        "motif": [0, 2, 3, 5, 4, 3, 1, 2],
    },
    {
        "file": "dkd-v07-drive-final-kontrat.mp3",
        "name": "Final Kontrat",
        "bpm": 122,
        "root": 40,
        "progression": [0, 3, 7, 5],
        "energy": 0.98,
        "cinematic": True,
        "motif": [0, 3, 5, 4, 6, 5, 3, 2],
    },
]


def dkd_hz(dkd_note: float) -> float:
    return 440.0 * (2.0 ** ((dkd_note - 69.0) / 12.0))


def dkd_mix(
    dkd_left: array,
    dkd_right: array,
    dkd_start: int,
    dkd_signal: list[float],
    dkd_pan: float = 0.0,
) -> None:
    dkd_left_gain = math.sqrt((1.0 - dkd_pan) / 2.0)
    dkd_right_gain = math.sqrt((1.0 + dkd_pan) / 2.0)
    dkd_limit = min(len(dkd_signal), len(dkd_left) - dkd_start)
    if dkd_limit <= 0:
        return
    for dkd_index in range(dkd_limit):
        dkd_value = dkd_signal[dkd_index]
        dkd_left[dkd_start + dkd_index] += dkd_value * dkd_left_gain
        dkd_right[dkd_start + dkd_index] += dkd_value * dkd_right_gain


def dkd_tone(
    dkd_frequency: float,
    dkd_duration: float,
    dkd_amp: float,
    dkd_kind: str = "sine",
    dkd_attack: float = 0.01,
    dkd_release: float = 0.10,
    dkd_detune: float = 0.0,
) -> list[float]:
    dkd_count = max(1, int(dkd_duration * dkd_sample_rate))
    dkd_frequency *= 2.0 ** (dkd_detune / 1200.0)
    dkd_attack_count = max(1, int(dkd_attack * dkd_sample_rate))
    dkd_release_count = max(1, int(dkd_release * dkd_sample_rate))
    dkd_signal = [0.0] * dkd_count
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_phase = dkd_tau * dkd_frequency * dkd_time
        if dkd_kind == "triangle":
            dkd_wave = 2.0 / math.pi * math.asin(math.sin(dkd_phase))
        elif dkd_kind == "saw":
            dkd_wave = 2.0 * ((dkd_frequency * dkd_time) % 1.0) - 1.0
        elif dkd_kind == "soft_square":
            dkd_wave = math.tanh(math.sin(dkd_phase) * 2.4)
        else:
            dkd_wave = math.sin(dkd_phase)
        dkd_envelope = min(1.0, dkd_index / dkd_attack_count)
        if dkd_index >= dkd_count - dkd_release_count:
            dkd_envelope *= max(0.0, (dkd_count - dkd_index - 1) / dkd_release_count)
        dkd_signal[dkd_index] = dkd_wave * dkd_envelope * dkd_amp
    return dkd_signal


def dkd_kick(dkd_amp: float) -> list[float]:
    dkd_count = int(0.30 * dkd_sample_rate)
    dkd_signal = [0.0] * dkd_count
    dkd_phase = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_frequency = 45.0 + 72.0 * math.exp(-dkd_time * 22.0)
        dkd_phase += dkd_tau * dkd_frequency / dkd_sample_rate
        dkd_signal[dkd_index] = math.sin(dkd_phase) * math.exp(-dkd_time * 12.0) * dkd_amp
    return dkd_signal


def dkd_noise(
    dkd_rng: random.Random,
    dkd_duration: float,
    dkd_decay: float,
    dkd_amp: float,
) -> list[float]:
    dkd_count = max(1, int(dkd_duration * dkd_sample_rate))
    dkd_signal = [0.0] * dkd_count
    dkd_previous = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_value = dkd_rng.uniform(-1.0, 1.0)
        dkd_high = dkd_value - dkd_previous * 0.72
        dkd_previous = dkd_value
        dkd_signal[dkd_index] = dkd_high * math.exp(-dkd_time * dkd_decay) * dkd_amp
    return dkd_signal


def dkd_add_chord(
    dkd_left: array,
    dkd_right: array,
    dkd_start_seconds: float,
    dkd_duration: float,
    dkd_notes: list[int],
    dkd_amp: float,
) -> None:
    dkd_pans = [-0.46, -0.14, 0.14, 0.46]
    for dkd_index, dkd_note in enumerate(dkd_notes):
        dkd_frequency = dkd_hz(dkd_note)
        dkd_start = int(dkd_start_seconds * dkd_sample_rate)
        dkd_pan = dkd_pans[dkd_index % len(dkd_pans)]
        dkd_mix(dkd_left, dkd_right, dkd_start, dkd_tone(dkd_frequency, dkd_duration, dkd_amp, "sine", 0.20, 0.46, -5), dkd_pan)
        dkd_mix(dkd_left, dkd_right, dkd_start, dkd_tone(dkd_frequency, dkd_duration, dkd_amp * 0.30, "triangle", 0.24, 0.42, 5), -dkd_pan)
        dkd_mix(dkd_left, dkd_right, dkd_start, dkd_tone(dkd_frequency * 2.0, dkd_duration, dkd_amp * 0.10, "sine", 0.18, 0.38), dkd_pan * 0.35)


def dkd_render_track(dkd_track: dict, dkd_track_index: int, dkd_output: Path) -> None:
    dkd_bpm = float(dkd_track["bpm"])
    dkd_beat = 60.0 / dkd_bpm
    dkd_bars = 12
    dkd_duration = dkd_bars * 4 * dkd_beat
    dkd_count = int(dkd_duration * dkd_sample_rate)
    dkd_left = array("f", [0.0]) * dkd_count
    dkd_right = array("f", [0.0]) * dkd_count
    dkd_rng = random.Random(20260910 + dkd_track_index * 313)
    dkd_root = int(dkd_track["root"])
    dkd_energy = float(dkd_track["energy"])
    dkd_home = bool(dkd_track.get("home"))
    dkd_scale = [0, 2, 3, 5, 7, 8, 10]
    dkd_chord_map = {
        0: [dkd_root, dkd_root + 3, dkd_root + 7, dkd_root + 10],
        2: [dkd_root + 2, dkd_root + 5, dkd_root + 9, dkd_root + 12],
        3: [dkd_root + 3, dkd_root + 7, dkd_root + 10, dkd_root + 15],
        5: [dkd_root + 5, dkd_root + 8, dkd_root + 12, dkd_root + 15],
        7: [dkd_root + 7, dkd_root + 10, dkd_root + 14, dkd_root + 17],
    }

    for dkd_bar in range(dkd_bars):
        dkd_degree = int(dkd_track["progression"][dkd_bar % len(dkd_track["progression"])])
        dkd_notes = dkd_chord_map.get(dkd_degree, dkd_chord_map[0])
        dkd_bar_start = dkd_bar * 4 * dkd_beat
        dkd_add_chord(
            dkd_left,
            dkd_right,
            dkd_bar_start,
            4 * dkd_beat,
            dkd_notes,
            0.052 if dkd_home else 0.043,
        )

        for dkd_quarter in range(4):
            dkd_at = (dkd_bar * 4 + dkd_quarter) * dkd_beat
            dkd_bass_note = dkd_notes[0] - 12
            dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_tone(dkd_hz(dkd_bass_note), dkd_beat * 0.90, 0.090 * dkd_energy, "sine", 0.008, 0.14), -0.08)
            if not dkd_home and dkd_quarter in (0, 2):
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_kick(0.30 * dkd_energy), 0.0)

        if dkd_home:
            if dkd_bar % 2 == 0:
                dkd_at = (dkd_bar * 4 + 2) * dkd_beat
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_noise(dkd_rng, 0.18, 20.0, 0.045), 0.18)
        else:
            for dkd_quarter in (1, 3):
                dkd_at = (dkd_bar * 4 + dkd_quarter) * dkd_beat
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_noise(dkd_rng, 0.20, 18.0, 0.105 * dkd_energy), 0.12)
            for dkd_eighth in range(8):
                if dkd_eighth % 2 == 1 and dkd_rng.random() < 0.28:
                    continue
                dkd_at = (dkd_bar * 4 + dkd_eighth * 0.5) * dkd_beat
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_noise(dkd_rng, 0.055, 62.0, 0.022 * dkd_energy), -0.28 if dkd_eighth % 2 else 0.28)

        dkd_motif = list(dkd_track["motif"])
        dkd_note_count = 4 if dkd_home else 8
        for dkd_step in range(dkd_note_count):
            dkd_scale_index = dkd_motif[(dkd_step + dkd_bar) % len(dkd_motif)] % len(dkd_scale)
            dkd_note = dkd_root + 12 + dkd_scale[dkd_scale_index]
            if dkd_bar >= 8 and not dkd_home:
                dkd_note += 12 if dkd_step in (2, 6) else 0
            dkd_spacing = 1.0 if dkd_home else 0.5
            dkd_at = (dkd_bar * 4 + dkd_step * dkd_spacing) * dkd_beat
            dkd_note_duration = dkd_beat * (0.72 if dkd_home else 0.42)
            dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_tone(dkd_hz(dkd_note), dkd_note_duration, (0.050 if dkd_home else 0.064) * dkd_energy, "triangle", 0.012, 0.24), -0.34 if dkd_step % 2 else 0.34)
            dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_tone(dkd_hz(dkd_note) * 2.0, dkd_note_duration * 0.70, (0.016 if dkd_home else 0.020) * dkd_energy, "sine", 0.006, 0.18), 0.20 if dkd_step % 2 else -0.20)

        if not dkd_home and dkd_bar % 3 == 2:
            dkd_phrase = [0, 3, 4, 2]
            for dkd_phrase_index, dkd_scale_index in enumerate(dkd_phrase):
                dkd_note = dkd_root + 24 + dkd_scale[dkd_scale_index]
                dkd_at = (dkd_bar * 4 + 2 + dkd_phrase_index * 0.5) * dkd_beat
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_tone(dkd_hz(dkd_note), dkd_beat * 0.44, 0.040 * dkd_energy, "sine", 0.01, 0.18), 0.20 if dkd_phrase_index % 2 else -0.20)

    if dkd_track.get("cinematic") or dkd_home:
        for dkd_bar in range(dkd_bars):
            dkd_at = dkd_bar * 4 * dkd_beat
            dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_tone(dkd_hz(dkd_root - 12), 4 * dkd_beat, 0.020 if dkd_home else 0.026, "soft_square", 0.36, 0.58), 0.0)

    if dkd_track.get("atmosphere") or dkd_track.get("storm") or dkd_home:
        dkd_previous = 0.0
        for dkd_index in range(dkd_count):
            dkd_previous = (dkd_previous + dkd_rng.uniform(-1.0, 1.0) * 0.020) / 1.022
            dkd_texture = dkd_previous * (0.010 if dkd_home else 0.013)
            dkd_left[dkd_index] += dkd_texture
            dkd_right[(dkd_index + 53) % dkd_count] += dkd_texture

    for dkd_delay_seconds, dkd_gain in ((0.19, 0.12), (0.38, 0.065), (0.76, 0.035)):
        dkd_delay = int(dkd_delay_seconds * dkd_sample_rate)
        dkd_left_copy = array("f", dkd_left)
        dkd_right_copy = array("f", dkd_right)
        for dkd_index in range(dkd_count):
            dkd_left[dkd_index] += dkd_left_copy[(dkd_index - dkd_delay) % dkd_count] * dkd_gain
            dkd_right[dkd_index] += dkd_right_copy[(dkd_index - dkd_delay) % dkd_count] * dkd_gain

    dkd_peak = max(
        max(abs(dkd_value) for dkd_value in dkd_left),
        max(abs(dkd_value) for dkd_value in dkd_right),
        1e-6,
    )
    dkd_scale_gain = 0.91 / dkd_peak

    with tempfile.TemporaryDirectory(prefix="dkd_v07_music_") as dkd_temp_dir:
        dkd_wav_path = Path(dkd_temp_dir) / "track.wav"
        with wave.open(str(dkd_wav_path), "wb") as dkd_wave:
            dkd_wave.setnchannels(2)
            dkd_wave.setsampwidth(2)
            dkd_wave.setframerate(dkd_sample_rate)
            dkd_pcm = array("h")
            for dkd_index in range(dkd_count):
                dkd_left_sample = max(-1.0, min(1.0, math.tanh(dkd_left[dkd_index] * 1.08) * dkd_scale_gain))
                dkd_right_sample = max(-1.0, min(1.0, math.tanh(dkd_right[dkd_index] * 1.08) * dkd_scale_gain))
                dkd_pcm.append(int(dkd_left_sample * 32767))
                dkd_pcm.append(int(dkd_right_sample * 32767))
            dkd_wave.writeframes(dkd_pcm.tobytes())

        dkd_output.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(dkd_wav_path),
                "-map_metadata",
                "-1",
                "-write_xing",
                "0",
                "-c:a",
                "libmp3lame",
                "-b:a",
                "96k",
                "-ar",
                str(dkd_sample_rate),
                str(dkd_output),
            ],
            check=True,
        )


def dkd_main() -> int:
    dkd_parser = argparse.ArgumentParser()
    dkd_parser.add_argument("--force", action="store_true", help="Render all v0.7 soundtrack files again.")
    dkd_args = dkd_parser.parse_args()
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg bulunamadı; GitHub Actions v0.7 müzik üretimi ffmpeg gerektirir.")

    dkd_audio_dir.mkdir(parents=True, exist_ok=True)
    for dkd_index, dkd_track in enumerate(dkd_tracks):
        dkd_output = dkd_audio_dir / str(dkd_track["file"])
        if dkd_output.exists() and dkd_output.stat().st_size > 100_000 and not dkd_args.force:
            print(f"DKD v0.7 soundtrack ready: {dkd_output.name} ({dkd_output.stat().st_size} bytes)")
            continue
        print(f"DKD v0.7 rendering: {dkd_track['name']} -> {dkd_output.name}")
        dkd_render_track(dkd_track, dkd_index, dkd_output)
        print(f"DKD v0.7 rendered: {dkd_output.name} ({dkd_output.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(dkd_main())
