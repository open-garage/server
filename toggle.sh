#!/bin/sh
###############################################################################
#                                                                             #
# Simple script which communicates with the relay for the garage door         #
#                                                                             #
# @version: 1.0.0                                                             #
# @author: Steiner Patrick <patrick@helmsdeep.at>                             #
# @date: 21.10.2014 22:07                                                     #
#                                                                             #
###############################################################################

# LED Pin - wiringPi pin 0 is BCM_GPIO 17.
PIN=0

DATE=`date`
LOG=garagetoggle.log
GPIO=/usr/local/bin/gpio

echo "CMD: toggle $DATE" >> $LOG

$GPIO mode $PIN out
$GPIO write $PIN 0
sleep 1
$GPIO write $PIN 1
