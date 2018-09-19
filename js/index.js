import $ from 'jquery';

import { urlParam } from './lib';
import WebController from './WebController';

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
