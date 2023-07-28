// Resize map when left side bar show/hide
vue.$watch("fold_left", function () {
  map.resize();
});
