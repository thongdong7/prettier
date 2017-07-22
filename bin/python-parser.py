#!/usr/bin/env python

# encoding=utf-8
import json
from ast import parse
from base64 import b64decode
from importlib import import_module
import sys

_map = {}
m = import_module('_ast')


# print(dir(m))

def _build_map():
    attrs = []
    for item in dir(m):
        item_str = str(item)

        if item_str.startswith('__'):
            continue

        attrs.append(item_str)

    for item in attrs:
        print(item)
        _map[getattr(m, item)] = 'Py%s' % item


def node_to_dict(node):
    if isinstance(node, list):
        return [node_to_dict(_) for _ in node]

    if not hasattr(node, '_fields'):
        return node

    type_ = node.__class__.__name__
    # pprint(type_)
    # print('n',node.__class__.__name__)
    # print(_map[node.__class__.__name__])

    ret = dict(type=type_)

    for field in node._fields:
        # print('f', field, getattr(node, field))
        ret[field] = node_to_dict(getattr(node, field))

    return ret


source = b64decode(sys.argv[1])
tree = parse(source)

ast = node_to_dict(tree)
print(json.dumps(ast))
# print(tree)
# print(tree.body)

# pprint(export_dict(tree))
