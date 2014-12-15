#!/bin/bash
###############################################################################
#                                                                             #
# Simple script which communicates ble bluetooth dongle                       #
#                                                                             #
# @version: 1.0.0                                                             #
# @author: Steiner Patrick <patrick@helmsdeep.at>                             #
# @date: 15.12.2014 21:17                                                     #
#                                                                             #
###############################################################################

HCIDEV="hci0"

HCICONFIG=/usr/local/bin/hciconfig
HCITOOL=/usr/local/bin/hcitool

function init()
{
	$HCICONFIG $HCIDEV up
	$HCICONFIG $HCIDEV leadav 3
	$HCICONFIG $HCIDEV noscan
}

function start_advertising
{
	$HCITOOL -i $HCIDEV cmd 0x08 0x0008 1E 02 01 1A 1A FF 4C 00 02 15 63 6F 3F 8F 64 91 4B EE 95 F7 D8 CC 64 A8 63 B5 00 00 00 00 C8
}

function start_advertising
{
	killall $HCITOOL
}

if [ "$1" = "start" ]; then
	init
	start_advertising
elif [ "$1" = "stop" ]; then
	stop_advertising
elif [ "$1" = "init" ]; then
	init
else
	echo "Usage: start | stop | init"
fi

# vim:ts=4:sw=4:
