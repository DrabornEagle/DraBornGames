#!/usr/bin/env python3
"""Render DraBornGo / Last Mile v0.7 full-mix soundtrack.

Every track is rendered deterministically to a stereo PCM WAV master first and
then encoded as a real MP3 file with ffmpeg. The active soundtrack deliberately
avoids exposed lead-melody / arpeggio loops: it is built from drums, sub bass,
low harmonic beds, industrial percussion, ambience, impacts and transitions so
it behaves like a produced mobile driving-game score. No third-party song,
sample or copyrighted recording is used.
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


dkd_sample_rate = 32000
dkd_tau = math.tau
dkd_root_dir = Path(__file__).resolve().parents[1]
dkd_audio_dir = dkd_root_dir / "game" / "audio"

dkd_tracks = [
    {"file": "dkd-v07-home-kurye-merkezi.mp3", "name": "Kurye Merkezi: Gece Mesaisi", "bpm": 90, "root": 43, "energy": 0.62, "home": True, "shift": [0, 0, -2, 3], "texture": "garage"},
    {"file": "dkd-v07-drive-ankara-gece.mp3", "name": "Ankara: Gece Trafiği", "bpm": 122, "root": 41, "energy": 0.92, "shift": [0, -2, 3, 0], "texture": "traffic"},
    {"file": "dkd-v07-drive-son-kilometre.mp3", "name": "Son Kilometre: Baskı", "bpm": 128, "root": 39, "energy": 1.00, "shift": [0, 0, 3, -2], "texture": "pressure"},
    {"file": "dkd-v07-drive-firtina-hatti.mp3", "name": "Fırtına Altında", "bpm": 132, "root": 38, "energy": 1.08, "shift": [0, -2, 0, 3], "texture": "storm"},
    {"file": "dkd-v07-drive-asfalt-yildizlari.mp3", "name": "Asfalt Nabzı", "bpm": 118, "root": 43, "energy": 0.86, "shift": [0, 3, 0, -2], "texture": "asphalt"},
    {"file": "dkd-v07-drive-final-kontrat.mp3", "name": "Final Kontrat: 03:17", "bpm": 126, "root": 36, "energy": 1.03, "shift": [0, -2, 3, 5], "texture": "final"},
]


def dkd_hz(dkd_note: float) -> float:
    return 440.0 * (2.0 ** ((dkd_note - 69.0) / 12.0))


def dkd_pan_gains(dkd_pan: float) -> tuple[float, float]:
    dkd_safe = max(-1.0, min(1.0, dkd_pan))
    return math.sqrt((1.0 - dkd_safe) / 2.0), math.sqrt((1.0 + dkd_safe) / 2.0)


def dkd_mix(dkd_left: array, dkd_right: array, dkd_start: int, dkd_signal: list[float], dkd_pan: float = 0.0) -> None:
    dkd_left_gain, dkd_right_gain = dkd_pan_gains(dkd_pan)
    dkd_limit = min(len(dkd_signal), len(dkd_left) - dkd_start)
    if dkd_start < 0 or dkd_limit <= 0:
        return
    for dkd_index in range(dkd_limit):
        dkd_value = dkd_signal[dkd_index]
        dkd_left[dkd_start + dkd_index] += dkd_value * dkd_left_gain
        dkd_right[dkd_start + dkd_index] += dkd_value * dkd_right_gain


def dkd_wave(dkd_phase: float, dkd_kind: str) -> float:
    if dkd_kind == "triangle":
        return 2.0 / math.pi * math.asin(math.sin(dkd_phase))
    if dkd_kind == "soft_square":
        return math.tanh(math.sin(dkd_phase) * 2.6)
    if dkd_kind == "saw":
        return 2.0 * ((dkd_phase / dkd_tau) % 1.0) - 1.0
    return math.sin(dkd_phase)


def dkd_tone(dkd_frequency: float, dkd_duration: float, dkd_amp: float, dkd_kind: str = "sine", dkd_attack: float = 0.006, dkd_release: float = 0.08, dkd_drive: float = 0.0) -> list[float]:
    dkd_count = max(1, int(dkd_duration * dkd_sample_rate))
    dkd_attack_count = max(1, int(dkd_attack * dkd_sample_rate))
    dkd_release_count = max(1, int(dkd_release * dkd_sample_rate))
    dkd_output = [0.0] * dkd_count
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_value = dkd_wave(dkd_tau * dkd_frequency * dkd_time, dkd_kind)
        if dkd_drive > 0:
            dkd_value = math.tanh(dkd_value * (1.0 + dkd_drive * 2.2)) / math.tanh(1.0 + dkd_drive * 2.2)
        dkd_envelope = min(1.0, dkd_index / dkd_attack_count)
        if dkd_index >= dkd_count - dkd_release_count:
            dkd_envelope *= max(0.0, (dkd_count - dkd_index - 1) / dkd_release_count)
        dkd_output[dkd_index] = dkd_value * dkd_envelope * dkd_amp
    return dkd_output


def dkd_kick(dkd_amp: float, dkd_variant: int) -> list[float]:
    dkd_count = int(0.34 * dkd_sample_rate)
    dkd_output = [0.0] * dkd_count
    dkd_phase = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_frequency = 43.0 + dkd_variant * 1.4 + 92.0 * math.exp(-dkd_time * 27.0)
        dkd_phase += dkd_tau * dkd_frequency / dkd_sample_rate
        dkd_click = math.sin(dkd_tau * 1650.0 * dkd_time) * math.exp(-dkd_time * 80.0) * 0.16
        dkd_body = math.sin(dkd_phase) * math.exp(-dkd_time * (10.0 + dkd_variant * 0.3))
        dkd_output[dkd_index] = (dkd_body + dkd_click) * dkd_amp
    return dkd_output


def dkd_snare(dkd_rng: random.Random, dkd_amp: float, dkd_dark: bool = False) -> list[float]:
    dkd_count = int((0.30 if dkd_dark else 0.24) * dkd_sample_rate)
    dkd_output = [0.0] * dkd_count
    dkd_low = 150.0 if dkd_dark else 190.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_noise_value = dkd_rng.uniform(-1.0, 1.0)
        dkd_body = math.sin(dkd_tau * dkd_low * dkd_time) * math.exp(-dkd_time * 18.0) * 0.34
        dkd_noise_part = dkd_noise_value * math.exp(-dkd_time * (14.0 if dkd_dark else 20.0)) * 0.72
        dkd_output[dkd_index] = (dkd_body + dkd_noise_part) * dkd_amp
    return dkd_output


def dkd_hat(dkd_rng: random.Random, dkd_amp: float, dkd_open: bool = False) -> list[float]:
    dkd_duration = 0.24 if dkd_open else 0.075
    dkd_count = int(dkd_duration * dkd_sample_rate)
    dkd_output = [0.0] * dkd_count
    dkd_previous = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_noise_value = dkd_rng.uniform(-1.0, 1.0)
        dkd_high = dkd_noise_value - dkd_previous * 0.82
        dkd_previous = dkd_noise_value
        dkd_decay = 16.0 if dkd_open else 55.0
        dkd_output[dkd_index] = dkd_high * math.exp(-dkd_time * dkd_decay) * dkd_amp
    return dkd_output


def dkd_impact(dkd_rng: random.Random, dkd_amp: float) -> list[float]:
    dkd_count = int(0.72 * dkd_sample_rate)
    dkd_output = [0.0] * dkd_count
    dkd_phase = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_frequency = 84.0 - 39.0 * min(1.0, dkd_time / 0.72)
        dkd_phase += dkd_tau * dkd_frequency / dkd_sample_rate
        dkd_noise_value = dkd_rng.uniform(-1.0, 1.0) * math.exp(-dkd_time * 8.0)
        dkd_output[dkd_index] = (math.sin(dkd_phase) * math.exp(-dkd_time * 5.5) * 0.66 + dkd_noise_value * 0.24) * dkd_amp
    return dkd_output


def dkd_texture(dkd_rng: random.Random, dkd_duration: float, dkd_amp: float, dkd_motion: float) -> list[float]:
    dkd_count = max(1, int(dkd_duration * dkd_sample_rate))
    dkd_output = [0.0] * dkd_count
    dkd_low = 0.0
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_noise_value = dkd_rng.uniform(-1.0, 1.0)
        dkd_low += (dkd_noise_value - dkd_low) * 0.018
        dkd_breath = 0.55 + 0.45 * math.sin(dkd_tau * dkd_motion * dkd_time)
        dkd_output[dkd_index] = dkd_low * dkd_breath * dkd_amp
    return dkd_output


def dkd_low_bed(dkd_note: int, dkd_duration: float, dkd_amp: float, dkd_tension: bool = False) -> list[float]:
    dkd_frequency = dkd_hz(dkd_note)
    dkd_count = max(1, int(dkd_duration * dkd_sample_rate))
    dkd_output = [0.0] * dkd_count
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_lfo = 0.72 + 0.28 * math.sin(dkd_tau * 0.14 * dkd_time)
        dkd_base = math.sin(dkd_tau * dkd_frequency * dkd_time)
        dkd_fifth = math.sin(dkd_tau * dkd_frequency * 1.4983 * dkd_time) * 0.42
        dkd_octave = math.sin(dkd_tau * dkd_frequency * 2.0 * dkd_time) * (0.12 if not dkd_tension else 0.19)
        dkd_grit = math.tanh((dkd_base + dkd_fifth + dkd_octave) * (1.3 if dkd_tension else 1.05))
        dkd_output[dkd_index] = dkd_grit * dkd_lfo * dkd_amp
    return dkd_output


def dkd_sub_pulse(dkd_note: int, dkd_duration: float, dkd_amp: float, dkd_variant: int) -> list[float]:
    dkd_frequency = dkd_hz(dkd_note - 12)
    dkd_count = max(1, int(dkd_duration * dkd_sample_rate))
    dkd_output = [0.0] * dkd_count
    for dkd_index in range(dkd_count):
        dkd_time = dkd_index / dkd_sample_rate
        dkd_envelope = math.exp(-dkd_time * (2.2 + dkd_variant * 0.08))
        dkd_fundamental = math.sin(dkd_tau * dkd_frequency * dkd_time)
        dkd_harmonic = math.sin(dkd_tau * dkd_frequency * 2.0 * dkd_time) * 0.19
        dkd_output[dkd_index] = math.tanh((dkd_fundamental + dkd_harmonic) * 1.25) * dkd_envelope * dkd_amp
    return dkd_output


def dkd_section_energy(dkd_bar: int, dkd_home: bool) -> float:
    if dkd_home:
        return [0.72, 0.78, 0.82, 0.76][(dkd_bar // 3) % 4]
    if dkd_bar < 2:
        return 0.70
    if dkd_bar < 6:
        return 1.00
    if dkd_bar < 8:
        return 0.82
    return 1.06


def dkd_render_track(dkd_track: dict, dkd_track_index: int, dkd_output: Path) -> None:
    dkd_bpm = float(dkd_track["bpm"])
    dkd_beat = 60.0 / dkd_bpm
    dkd_bars = 12
    dkd_duration = dkd_bars * 4.0 * dkd_beat
    dkd_count = int(dkd_duration * dkd_sample_rate)
    dkd_left = array("f", [0.0]) * dkd_count
    dkd_right = array("f", [0.0]) * dkd_count
    dkd_rng = random.Random(20260910 + dkd_track_index * 1009)
    dkd_root = int(dkd_track["root"])
    dkd_energy = float(dkd_track["energy"])
    dkd_home = bool(dkd_track.get("home"))
    dkd_texture_name = str(dkd_track.get("texture", "drive"))
    dkd_variant = dkd_track_index + 1

    dkd_mix(dkd_left, dkd_right, 0, dkd_texture(dkd_rng, dkd_duration, 0.038 if dkd_home else 0.030, 0.07 + dkd_track_index * 0.012), -0.46)
    dkd_mix(dkd_left, dkd_right, 0, dkd_texture(dkd_rng, dkd_duration, 0.034 if dkd_home else 0.026, 0.09 + dkd_track_index * 0.010), 0.48)

    for dkd_bar in range(dkd_bars):
        dkd_bar_start = dkd_bar * 4.0 * dkd_beat
        dkd_note = dkd_root + int(dkd_track["shift"][dkd_bar % len(dkd_track["shift"])])
        dkd_section = dkd_section_energy(dkd_bar, dkd_home) * dkd_energy
        dkd_mix(dkd_left, dkd_right, int(dkd_bar_start * dkd_sample_rate), dkd_low_bed(dkd_note, 4.0 * dkd_beat, (0.046 if dkd_home else 0.037) * dkd_section, dkd_texture_name in {"storm", "final", "pressure"}), -0.15 if dkd_bar % 2 == 0 else 0.15)
        if dkd_bar in {0, 6, 8}:
            dkd_mix(dkd_left, dkd_right, int(dkd_bar_start * dkd_sample_rate), dkd_impact(dkd_rng, (0.15 if dkd_home else 0.23) * dkd_section), 0.0)

        for dkd_step in range(16):
            dkd_at = dkd_bar_start + dkd_step * dkd_beat / 4.0
            dkd_step_in_beat = dkd_step % 4
            dkd_beat_in_bar = dkd_step // 4
            if dkd_home:
                dkd_kick_hit = dkd_step in {0, 8}
                dkd_snare_hit = dkd_step in {4, 12}
                dkd_hat_hit = dkd_step % 4 == 2
                dkd_bass_hit = dkd_step in {0, 6, 8, 14}
            else:
                dkd_kick_patterns = [{0, 5, 8, 11, 14}, {0, 3, 8, 10, 13}, {0, 6, 8, 12, 15}, {0, 4, 7, 10, 14}, {0, 5, 9, 12, 14}]
                dkd_kick_hit = dkd_step in dkd_kick_patterns[dkd_track_index % len(dkd_kick_patterns)]
                dkd_snare_hit = dkd_step in {4, 12}
                dkd_hat_hit = dkd_step % 2 == 0 or (dkd_step % 2 == 1 and dkd_rng.random() > 0.54)
                dkd_bass_hit = dkd_step in {0, 3, 6, 8, 11, 14}

            if dkd_kick_hit:
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_kick((0.23 if dkd_home else 0.34) * dkd_section, dkd_variant % 4), 0.0)
            if dkd_snare_hit:
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_snare(dkd_rng, (0.10 if dkd_home else 0.18) * dkd_section, dkd_texture_name in {"storm", "final"}), 0.10 if dkd_beat_in_bar == 1 else -0.10)
            if dkd_hat_hit:
                dkd_open = not dkd_home and dkd_step in {7, 15} and dkd_bar % 2 == 1
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_hat(dkd_rng, (0.026 if dkd_home else 0.050) * dkd_section, dkd_open), -0.36 if dkd_step_in_beat < 2 else 0.36)
            if dkd_bass_hit:
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_sub_pulse(dkd_note, dkd_beat * (0.72 if dkd_home else 0.58), (0.10 if dkd_home else 0.145) * dkd_section, dkd_variant), -0.04)
            if not dkd_home and dkd_step in {2, 10} and dkd_texture_name in {"traffic", "asphalt", "pressure"}:
                dkd_mix(dkd_left, dkd_right, int(dkd_at * dkd_sample_rate), dkd_tone(74 + dkd_track_index * 7, 0.12, 0.055 * dkd_section, "soft_square", 0.002, 0.08, 0.36), 0.28 if dkd_step == 2 else -0.28)

        if not dkd_home and dkd_bar in {5, 11}:
            for dkd_fill in range(4):
                dkd_fill_at = dkd_bar_start + (3.0 + dkd_fill * 0.25) * dkd_beat
                dkd_fill_frequency = 92.0 - dkd_fill * 11.0 + dkd_track_index * 2.0
                dkd_mix(dkd_left, dkd_right, int(dkd_fill_at * dkd_sample_rate), dkd_tone(dkd_fill_frequency, 0.15, 0.075 * dkd_section, "soft_square", 0.001, 0.12, 0.45), -0.35 + dkd_fill * 0.23)

    dkd_peak = max(max(abs(dkd_value) for dkd_value in dkd_left), max(abs(dkd_value) for dkd_value in dkd_right), 0.0001)
    dkd_gain = min(1.0, 0.91 / dkd_peak)
    dkd_pcm = array("h")
    for dkd_index in range(dkd_count):
        dkd_left_value = math.tanh(dkd_left[dkd_index] * dkd_gain * 1.34) / math.tanh(1.34)
        dkd_right_value = math.tanh(dkd_right[dkd_index] * dkd_gain * 1.34) / math.tanh(1.34)
        dkd_pcm.append(int(max(-1.0, min(1.0, dkd_left_value)) * 32767))
        dkd_pcm.append(int(max(-1.0, min(1.0, dkd_right_value)) * 32767))

    with tempfile.TemporaryDirectory(prefix="dkd-v07-audio-") as dkd_temp_dir:
        dkd_wav = Path(dkd_temp_dir) / "dkd-master.wav"
        with wave.open(str(dkd_wav), "wb") as dkd_wave_file:
            dkd_wave_file.setnchannels(2)
            dkd_wave_file.setsampwidth(2)
            dkd_wave_file.setframerate(dkd_sample_rate)
            dkd_wave_file.writeframes(dkd_pcm.tobytes())
        dkd_output.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(dkd_wav), "-map_metadata", "-1", "-vn", "-codec:a", "libmp3lame", "-b:a", "192k", "-ar", str(dkd_sample_rate), "-ac", "2", "-write_xing", "0", str(dkd_output)], check=True)


def dkd_main() -> None:
    dkd_parser = argparse.ArgumentParser()
    dkd_parser.add_argument("--force", action="store_true")
    dkd_args = dkd_parser.parse_args()
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg bulunamadı; v0.7 full-mix MP3 üretimi için ffmpeg gerekli.")
    for dkd_track_index, dkd_track in enumerate(dkd_tracks):
        dkd_output = dkd_audio_dir / str(dkd_track["file"])
        if dkd_output.exists() and not dkd_args.force:
            print(f"DKD audio exists: {dkd_output.name}")
            continue
        dkd_render_track(dkd_track, dkd_track_index, dkd_output)
        print(f"DKD full-mix MP3 ready: {dkd_output.name} · {dkd_track['name']} · {dkd_track['bpm']} BPM")


if __name__ == "__main__":
    dkd_main()
