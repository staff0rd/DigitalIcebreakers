# ensure all borders are transparnet
convert $1 -bordercolor white -border 5 $1 
# trim transparency
convert $1 -trim +repage $1