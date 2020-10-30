#!/bin/bash

OUTPUT=lgtvremote.zip
rm -rf $OUTPUT

git archive -o $OUTPUT HEAD

