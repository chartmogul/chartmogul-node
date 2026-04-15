#!/bin/bash
npx eslint . 2>&1
npm test 2>&1
npm pack --dry-run 2>&1

exit 0
