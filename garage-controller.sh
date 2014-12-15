#!/bin/bash
###############################################################################
#                                                                             #
# Simple script which communicates with the garage door                       #
#                                                                             #
# @version: 1.0.1                                                             #
# @author: Steiner Patrick <patrick@helmsdeep.at>                             #
# @date: 13.12.2014 13:17                                                     #
#                                                                             #
###############################################################################

# Relay PIN
R1PIN=0

# Door status PIN
I1PIN=7

DATE=`date "+%d.%m.%G-%H:%M"`
LOG=garage-controller.log
GPIO=/usr/local/bin/gpio

function init()
{
	sudo $GPIO export $R1PIN out
	sudo $GPIO export $I1PIN in
	$GPIO mode $I1PIN up
}

function api_toggle()
{
	echo "CMD: toggle $DATE" >> $LOG
	
	# set relay pin to out
	$GPIO mode $R1PIN out
	
	$GPIO write $R1PIN 0
	sleep 1
	$GPIO write $R1PIN 1
}

function api_status()
{
	echo "CMD: status $DATE" >> $LOG
	
	# set door status pin to in
	$GPIO mode $I1PIN in
	
	$GPIO read $I1PIN
}

if [ "$1" = "toggle" ]; then
	api_toggle
elif [ "$1" = "status" ]; then
	api_status
elif [ "$1" = "init" ]; then
	init
else
	echo "Usage: toggle | status | init"
fi

# vim:ts=4:sw=4:
