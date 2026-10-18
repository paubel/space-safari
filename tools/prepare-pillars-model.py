"""Build a small indexed mesh from NASA's printable Pillars (positions) STL.

Usage: python3 tools/prepare-pillars-model.py input.stl output.bin
Requires NumPy. The printable lower lattice is deliberately omitted; this is
an adapted visualization mesh, not the original scientific/printing asset.
Binary layout: uint32 vertex/triangle counts, float32 xyz, uint32 indices.
"""
import argparse
from pathlib import Path
import struct
import numpy as np

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
dtype = np.dtype([('normal', '<f4', 3), ('vertices', '<f4', (3, 3)), ('attribute', '<u2')])
triangles = np.fromfile(args.source, dtype=dtype, offset=84)['vertices']
# The source places the pillars along +Z; the open printing lattice is below
# Z=10. Retain the opaque cloud surfaces above it, fading their cut ends in GLSL.
triangles = triangles[triangles[:, :, 2].min(axis=1) >= 10]
vertices = triangles.reshape(-1, 3).astype(np.float64)
cells = np.round(vertices / .32).astype(np.int32)
_, inverse = np.unique(cells, axis=0, return_inverse=True)
count = np.bincount(inverse)
positions = np.column_stack([np.bincount(inverse, weights=vertices[:, i]) / count for i in range(3)])
faces = inverse.reshape(-1, 3)
faces = faces[(faces[:, 0] != faces[:, 1]) & (faces[:, 1] != faces[:, 2]) & (faces[:, 2] != faces[:, 0])]
_, unique = np.unique(np.sort(faces, axis=1), axis=0, return_index=True)
faces = faces[np.sort(unique)]
# +Z -> +Y; source +Y becomes depth (right-handed). Height becomes one unit.
positions = positions[:, [0, 2, 1]] * [1, 1, -1]
positions -= (positions.min(axis=0) + positions.max(axis=0)) / 2
positions /= positions[:, 1].max() - positions[:, 1].min()
args.output.parent.mkdir(parents=True, exist_ok=True)
with args.output.open('wb') as output:
    output.write(struct.pack('<II', len(positions), len(faces)))
    output.write(positions.astype('<f4').tobytes())
    output.write(faces.astype('<u4').tobytes())
print(f'{len(positions):,} vertices; {len(faces):,} triangles; {args.output.stat().st_size:,} bytes')
