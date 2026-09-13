"""Shared traversal for the PSD asset exporters."""


def find_group(group, target_name: str):
    for layer in group:
        if layer.is_group() and (layer.name or "").strip().lower() == target_name:
            return layer
        if layer.is_group():
            match = find_group(layer, target_name)
            if match is not None:
                return match
    return None

