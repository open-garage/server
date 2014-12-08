#!/bin/bash
###############################################################################
#                                                                             #
# Simple script which communicates with the relay for the garage door         #
#                                                                             #
# @version: 1.0.0                                                             #
# @author: Steiner Patrick <patrick@helmsdeep.at>                             #
# @date: 21.10.2014 22:07                                                     #
#                                                                             #
###############################################################################

# Relay PIN
R1PIN=0

# Door status PIN
I1PIN=7

DATE=`date "+%d.%m.%G-%H:%M"`
LOG=garage-controller.log
GPIO=/usr/local/bin/gpio


function api_toggle()
{
	echo "CMD: toggle $DATE" >> $LOG
	
	$GPIO mode $R1PIN out
	$GPIO write $R1PIN 0
	sleep 1
	$GPIO write $R1PIN 1
}

function api_status()
{
	echo "CMD: status $DATE" >> $LOG
	$GPIO read $I1PIN
}

if [ "$1" = "toggle" ]; then
	api_toggle
elif [ "$1" = "status" ]; then
	api_status
fi

# vim:ts=4:sw=4:
