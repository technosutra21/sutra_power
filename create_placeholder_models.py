#!/usr/bin/env python3
"""
Create placeholder GLB files for the Buddhist character models.
These are minimal GLB files that can be loaded by model-viewer.
"""

import os
import struct
import json

def create_minimal_glb(output_path, character_name="Buddhist Character"):
    """Create a minimal GLB file with a simple cube geometry."""
    
    # Create a minimal glTF JSON structure
    gltf_data = {
        "asset": {
            "version": "2.0",
            "generator": "Python GLB Generator"
        },
        "scene": 0,
        "scenes": [
            {
                "nodes": [0]
            }
        ],
        "nodes": [
            {
                "mesh": 0,
                "name": character_name
            }
        ],
        "meshes": [
            {
                "primitives": [
                    {
                        "attributes": {
                            "POSITION": 0
                        },
                        "indices": 1
                    }
                ]
            }
        ],
        "accessors": [
            {
                "bufferView": 0,
                "componentType": 5126,  # FLOAT
                "count": 8,
                "type": "VEC3",
                "min": [-1.0, -1.0, -1.0],
                "max": [1.0, 1.0, 1.0]
            },
            {
                "bufferView": 1,
                "componentType": 5123,  # UNSIGNED_SHORT
                "count": 36,
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            {
                "buffer": 0,
                "byteOffset": 0,
                "byteLength": 96
            },
            {
                "buffer": 0,
                "byteOffset": 96,
                "byteLength": 72
            }
        ],
        "buffers": [
            {
                "byteLength": 168
            }
        ]
    }
    
    # Convert to JSON bytes
    json_bytes = json.dumps(gltf_data, separators=(',', ':')).encode('utf-8')
    
    # Pad JSON to 4-byte boundary
    json_padding = (4 - len(json_bytes) % 4) % 4
    json_bytes += b' ' * json_padding
    
    # Create cube vertices (8 vertices of a cube)
    vertices = [
        -1.0, -1.0, -1.0,  # 0
         1.0, -1.0, -1.0,  # 1
         1.0,  1.0, -1.0,  # 2
        -1.0,  1.0, -1.0,  # 3
        -1.0, -1.0,  1.0,  # 4
         1.0, -1.0,  1.0,  # 5
         1.0,  1.0,  1.0,  # 6
        -1.0,  1.0,  1.0   # 7
    ]
    
    # Create indices for 12 triangles (6 faces * 2 triangles each)
    indices = [
        0, 1, 2, 0, 2, 3,  # front
        4, 5, 6, 4, 6, 7,  # back
        0, 4, 5, 0, 5, 1,  # bottom
        3, 2, 6, 3, 6, 7,  # top
        0, 3, 7, 0, 7, 4,  # left
        1, 5, 6, 1, 6, 2   # right
    ]
    
    # Pack binary data
    vertex_data = struct.pack('<' + 'f' * len(vertices), *vertices)
    index_data = struct.pack('<' + 'H' * len(indices), *indices)
    
    # Combine binary data
    binary_data = vertex_data + index_data
    
    # Pad binary data to 4-byte boundary
    binary_padding = (4 - len(binary_data) % 4) % 4
    binary_data += b'\x00' * binary_padding
    
    # GLB header
    magic = b'glTF'
    version = struct.pack('<I', 2)
    total_length = struct.pack('<I', 12 + 8 + len(json_bytes) + 8 + len(binary_data))
    
    # JSON chunk
    json_chunk_length = struct.pack('<I', len(json_bytes))
    json_chunk_type = b'JSON'
    
    # Binary chunk
    binary_chunk_length = struct.pack('<I', len(binary_data))
    binary_chunk_type = b'BIN\x00'
    
    # Write GLB file
    with open(output_path, 'wb') as f:
        f.write(magic)
        f.write(version)
        f.write(total_length)
        f.write(json_chunk_length)
        f.write(json_chunk_type)
        f.write(json_bytes)
        f.write(binary_chunk_length)
        f.write(binary_chunk_type)
        f.write(binary_data)

if __name__ == "__main__":
    # Character names for each model
    character_names = {
        1: "Buda Śākyamuni",
        2: "Samantabhadra",
        3: "Manjuśrī",
        4: "Meghaśrī",
        5: "Sāgaramegha",
        6: "Supratiṣṭhita",
        7: "Avalokiteśvara",
        8: "Maitreya",
        9: "Vajrapāṇi",
        10: "Kṣitigarbha"
    }
    
    public_dir = "/app/frontend/public"
    
    # Create GLB files for each character
    for i in range(1, 11):
        output_path = f"{public_dir}/modelo{i}.glb"
        character_name = character_names.get(i, f"Buddhist Character {i}")
        
        print(f"Creating {output_path} for {character_name}")
        create_minimal_glb(output_path, character_name)
        
    print("✅ All placeholder GLB models created successfully!")