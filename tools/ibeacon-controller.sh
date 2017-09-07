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

# iBeacon UUID 649F1C4B-8EF1-4E5C-A99E-81470F515FF9
BEACONUUID="1E 02 01 1A 1A FF 4C 00 02 15 64 9F 1C 4B 8E F1 4E 5C A9 9E 81 47 0F 51 5F F9"

# iBeacon Major ID
BEACONMAJORID="00 00"

# iBeacon Minor ID
BEACONMINORID="00 00"

# iBeacon RSSI
BEACONPOWER="C8 00"

function init()
{
	sudo $HCICONFIG $HCIDEV up
	sudo $HCICONFIG $HCIDEV name "Open-Garage"
	sudo $HCICONFIG $HCIDEV leadv 3
	sudo $HCICONFIG $HCIDEV noscan
}

function start_advertising
{
	sudo $HCITOOL -i $HCIDEV cmd 0x08 0x0008 $BEACONUUID $BEACONMAJORID $BEACONMINORID $BEACONPOWER
}

function stop_advertising
{
	sudo $HCICONFIG $HCIDEV noleadv
	sudo $HCICONFIG $HCIDEV down
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
