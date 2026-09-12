#!/usr/bin/env python3
import binascii
import pathlib
import struct
import zlib


dkd_size = 1024
dkd_dark = (8, 14, 21)
dkd_lime = (228, 255, 94)
dkd_mark = (13, 33, 46)
dkd_output = pathlib.Path(__file__).resolve().parents[1] / 'assets' / 'dkd-last-mine-icon.png'


def dkd_inside_round_square(dkd_x, dkd_y):
    dkd_left = 128
    dkd_top = 128
    dkd_right = 895
    dkd_bottom = 895
    dkd_radius = 160
    if dkd_left + dkd_radius <= dkd_x <= dkd_right - dkd_radius and dkd_top <= dkd_y <= dkd_bottom:
        return True
    if dkd_top + dkd_radius <= dkd_y <= dkd_bottom - dkd_radius and dkd_left <= dkd_x <= dkd_right:
        return True
    for dkd_center_x, dkd_center_y in ((dkd_left + dkd_radius, dkd_top + dkd_radius), (dkd_right - dkd_radius, dkd_top + dkd_radius), (dkd_left + dkd_radius, dkd_bottom - dkd_radius), (dkd_right - dkd_radius, dkd_bottom - dkd_radius)):
        if (dkd_x - dkd_center_x) ** 2 + (dkd_y - dkd_center_y) ** 2 <= dkd_radius ** 2:
            return True
    return False


def dkd_cross(dkd_point_a, dkd_point_b, dkd_point_c):
    return (dkd_point_b[0] - dkd_point_a[0]) * (dkd_point_c[1] - dkd_point_a[1]) - (dkd_point_b[1] - dkd_point_a[1]) * (dkd_point_c[0] - dkd_point_a[0])


def dkd_inside_triangle(dkd_x, dkd_y, dkd_first, dkd_second, dkd_third):
    dkd_point = (dkd_x, dkd_y)
    dkd_one = dkd_cross(dkd_first, dkd_second, dkd_point)
    dkd_two = dkd_cross(dkd_second, dkd_third, dkd_point)
    dkd_three = dkd_cross(dkd_third, dkd_first, dkd_point)
    return (dkd_one >= 0 and dkd_two >= 0 and dkd_three >= 0) or (dkd_one <= 0 and dkd_two <= 0 and dkd_three <= 0)


def dkd_chunk(dkd_name, dkd_payload):
    dkd_name_bytes = dkd_name.encode('ascii')
    return struct.pack('>I', len(dkd_payload)) + dkd_name_bytes + dkd_payload + struct.pack('>I', binascii.crc32(dkd_name_bytes + dkd_payload) & 0xFFFFFFFF)


dkd_rows = bytearray()
for dkd_y in range(dkd_size):
    dkd_rows.append(0)
    for dkd_x in range(dkd_size):
        dkd_color = dkd_lime if dkd_inside_round_square(dkd_x, dkd_y) else dkd_dark
        if dkd_inside_triangle(dkd_x, dkd_y, (270, 280), (770, 220), (570, 770)):
            dkd_color = dkd_mark
        if 470 <= dkd_x <= 535 and 515 <= dkd_y <= 705:
            dkd_color = dkd_lime
        dkd_rows.extend(dkd_color)

dkd_header = struct.pack('>IIBBBBB', dkd_size, dkd_size, 8, 2, 0, 0, 0)
dkd_png = b'\x89PNG\r\n\x1a\n' + dkd_chunk('IHDR', dkd_header) + dkd_chunk('IDAT', zlib.compress(bytes(dkd_rows), 9)) + dkd_chunk('IEND', b'')
dkd_output.parent.mkdir(parents=True, exist_ok=True)
dkd_output.write_bytes(dkd_png)
print(f'DKD Android icon ready: {dkd_output} · {len(dkd_png)} bytes')
