#!/bin/bash
FILES=*.svg
for f in $FILES
do
	fn=`echo $f | cut -d "." -f 1`
	echo '<li><svg class="icon"><use xlink:href="#'$fn'"></use></svg></li>'
done
