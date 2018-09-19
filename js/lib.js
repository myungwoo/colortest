export const getHeatmapColorHex = (min, max, value) => {
  /**
   * RGB 값 3 색조
   * 248 105 107
   * 255 235 132
   * 99 190 123
   */
  if (value < min || value > max || min === max) return '#ffffff';
  const calc = (from, to, ratio) => Math.round((to-from)*ratio + from);
  let ratio = (value-min) / (max-min);
  let r, g, b;
  if (ratio < 0.5){
    ratio *= 2;
    [r, g, b] = [calc(248, 255, ratio), calc(105, 235, ratio), calc(107, 132, ratio)];
  }else{
    ratio = (ratio-0.5)*2;
    [r, g, b] = [calc(255, 99, ratio), calc(235, 190, ratio), calc(132, 123, ratio)];
  }
  const hex = v => (v < 16 ? '0' : '') + v.toString(16);
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

export const urlParam = name => {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
