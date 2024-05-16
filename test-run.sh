#!/bin/bash
#
#
OSPREF="$( uname -s | cut -c1-3 | tr "[A-Z]" "[a-z]" )"
runDIR="dist/${OSPREF}"

SCRIPTDIR=$(dirname ${0})
SCRIPTDIR="${SCRIPTDIR%.}"
[[ "${SCRIPTDIR}" != /* ]] && \
    SCRIPTDIR=$(pwd)/${SCRIPTDIR}
SCRIPTDIR="${SCRIPTDIR%/}"

appDIR="${SCRIPTDIR}/${runDIR}"
app="${appDIR}/$( jq -r '.name' "${SCRIPTDIR}/package.json" )"
echo "app: ${app}" #; exit 0
[[ ! -f "${app}" ]] && "${SCRIPTDIR}/mkdist.sh"

export DYLD_LIBRARY_PATH="${appDIR}/lib"
# echo "$DYLD_LIBRARY_PATH"; ls -l "${DYLD_LIBRARY_PATH}"; exit 0

"${app}"
