#!/bin/bash

MANIFEST=manifest.json

new_minor=0

function bumpVersion
{
    file=$1
    major=$(grep "\"version\"" $file | awk '{print $2}' | tr -d "\"," | awk 'BEGIN{FS=".";}{print $1}')
    minor=$(grep "\"version\"" $file | awk '{print $2}' | tr -d "\"," | awk 'BEGIN{FS=".";}{print $2}')

    ((new_minor = minor + 1))

    sed -i 's/"version": ".*"/"version": "'$major'.'$new_minor'"/' $file

    echo "version changed from $major.$minor to $major.$new_minor"

    git add $MANIFEST
    git commit -m "$major.$new_minor version bump"
}

bumpVersion $MANIFEST

