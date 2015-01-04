#!/bin/bash
FILES=*.svg
for f in $FILES
do
	fn=`echo $f | cut -d "." -f 1`
	echo '<li class="tooltip tooltip--hover"><svg class="icon"><use xlink:href="#'$fn'"></use></svg><span class="tooltip__tip">#'$fn'</span></li>'
done
