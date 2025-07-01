#!/bin/bash
# Claude Code notification wrapper with Ping sound

# Play the Ping sound
afplay /System/Library/Sounds/Ping.aiff

# Also try terminal bell as fallback
echo -e "\a"