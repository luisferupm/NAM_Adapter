#! /bin/sh

### INFO
# Provides:          UPM
# Author: Luis Fernando Garcia <fgp@gatv.ssr.upm.es>

# 
# Short-Description: Nam Adapter 
# Description:       Starts nam_adapter to allow network active monitoring 
### END INFO

#  temporary command

NAME_FILE=/home/userxifi/XIFI-workspace/NAM_Adapter/NAMadapter.js
LOG_FILE=/var/log/nam/nam.log
LOG_FILE_out=/var/log/nam/nam_out.log
LOG_FILE_err=/var/log/nam/nam_err.log


#	forever start -a -l ${LOG_FILE} -o {LOG_FILE_out} -e {LOG_FILE_err} ${NAME_FILE} 
	node ${NAME_FILE}
