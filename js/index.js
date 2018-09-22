import $ from 'jquery';

import { urlParam } from './lib';
import WebController from './WebController';

window.Kakao.init('fdc5c09f32b3dec3a996db6e87a777e5');

$(function(){
  $.getJSON('questions.json', data => {
    if (!data) return;
    WebController.init(data);
    if (urlParam('r')){
      WebController.showResultStage(urlParam('r').split(',').map(e => Number(e)));
    }else{
      WebController.showIntroductionStage();
    }
  });
});
