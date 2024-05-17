#!/bin/bash
#
# pull a copy of ../canvas-shapes-plus
#
pushd ../canvas-shapes-plus
yarn build
popd
tar cf - -C ../canvas-shapes-plus/dist/mjs . | \
	tar xf - -C node_modules/shapes-plus/
