#!/bin/sh

if grep -r ".only(" test/node; then
    echo found .only in test file
    exit 1
fi
