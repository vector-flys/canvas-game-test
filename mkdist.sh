#!/bin/bash
#
# Copy files from shared libraries
#
OSPREF="$( uname -s | cut -c1-3 | tr "[A-Z]" "[a-z]" )"
outDIR="dist/${OSPREF}"

libDirs=(
  "@kmamal/sdl/dist"
  "canvas/build/Release"
)

getLibs() {
	rm -rf "${outDIR}"
	mkdir -p "${outDIR}/lib"

	for dir in "${libDirs[@]}"; do
		echo "Copy libs from ${dir}..."
		while read fil; do
			cp -a "${fil}" "${outDIR}/lib/"
		done < <(find "node_modules/${dir}" \( -type f -o -type l \) -maxdepth 1)
	done
}

# Use node 18.19 because that's the latest pkg supports
. ~/.nvm/nvm.sh
nvm use 18.19
node --version

# Make sure we have pkg
which pkg || npm install -g @yao-pkg/pkg

rm -rf node_modules/ build/
yarn build-prod

getLibs

pkg --out-path ${outDIR}/ .
