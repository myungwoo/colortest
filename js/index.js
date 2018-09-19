import $ from 'jquery';

import { getHeatmapColorHex, urlParam } from './lib';

$(function(){
  let questions, current_question_id = 0;
  $.getJSON('questions.json', data => {
    if (!data) return;
    questions = data;
    $('#loading').css('display', 'none');
    if (urlParam('r')){
      showResult(urlParam('r').split(',').map(e => Number(e)));
      return;
    }
    $('#introduction-stage').css('display', 'block');
  });

  $('#question-start').click(() => {
    loadQuestion(0);
    $('#introduction-stage').css('display', 'none');
    $('#question-stage').css('display', 'block');
  });

  const used = new Set;
  const scores = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
  };

  const loadQuestion = id => {
    if (id < 0 || id >= questions.length)
      return false;
    current_question_id = id;
    const q = questions[id];
    $('#question-id').html(id+1);
    $('#question-content').html(q.question);
    const order = ['red', 'blue', 'green', 'yellow'];
    order.sort(() => 0.5-Math.random()); // Shuffle order

    const template = $('.choice:first-child').clone();
    $('.choices').empty();
    for (let i=0;i<4;i++){
      const node = template.clone();
      node.find('.content').html(q[order[i]]);
      node.attr('answer-type', order[i]);
      node.click(onChoiceClick);
      $('.choices').append(node);
    }
    reset();

    const percentage = Math.round(id / questions.length * 100);
    $('.progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage).html(`${id} / ${questions.length}`);
    return true;
  }

  const onChoiceClick = evt => {
    const $this = $(evt.currentTarget);
    if ($this.attr('score')) return false;
    for (let i=4;i>0;i--) if (!used.has(i)){
      used.add(i);
      $this.attr('score', i);
      $this.find('.order').html(i);
      break;
    }
    if (used.size === 4) $('#next').removeAttr('disabled');
  };

  const reset = () => {
    used.clear();
    $('.choice').removeAttr('score');
    $('.choice .order').html('&nbsp;&nbsp;');
    $('#next').attr('disabled', true);
  }

  $('#clear').click(reset);

  $('#next').click(() => {
    let invalid = false;
    for (let i=0;i<4;i++){
      const obj = $(`.choice:nth-child(${i+1})`);
      if (!obj.attr('score')){
        invalid = true;
        break;
      }
    }
    if (invalid) return false;
    for (let i=0;i<4;i++){
      const obj = $(`.choice:nth-child(${i+1})`);
      const type = obj.attr('answer-type');
      const score = parseInt(obj.attr('score'));
      scores[type] += score;
    }
    if (!loadQuestion(current_question_id+1)) window.location.href = `?r=${scores['red']},${scores['blue']},${scores['green']},${scores['yellow']}`;
  });

  const showResult = score => {
    const scores = {};
    scores['red'] = score[0];
    scores['blue'] = score[1];
    scores['green'] = score[2];
    scores['yellow'] = score[3];
    // 테스트 완료
    for (const [c, s] of Object.entries(scores)){
      const mn = questions.length, mx = 4*questions.length;
      $(`#${c}-score`).html(s);
      $(`#${c}-score`).css('background-color', getHeatmapColorHex(mn, mx, s));
    }
    $('#copy-url')
      .click(() => {
        const $temp = $("<input>");
        $("body").append($temp);
        $temp.val(window.location.href).select();
        document.execCommand("copy");
        $temp.remove();
      })
      .tooltip()
      .on('shown.bs.tooltip', evt => {
        const $this = $(evt.currentTarget);
        setTimeout(() => $this.tooltip('hide'), 800);
      });

    $('#question-stage').css('display', 'none');
    $('#result-stage').css('display', 'block');
  };
});
