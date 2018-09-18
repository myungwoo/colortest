import $ from 'jquery';

$(function(){
  let questions, current_question_id = 0;
  $.getJSON('questions.json', data => {
    if (!data) return;
    questions = data;
    $('#loading').css('display', 'none');
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
    for (let i=0;i<4;i++){
      $(`.choice:nth-child(${i+1}) .content`).html(q[order[i]]);
      $(`.choice:nth-child(${i+1})`).attr('answer-type', order[i]);
    }
    reset();

    const percentage = Math.round(id / questions.length * 100);
    $('.progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage).html(`${id} / ${questions.length}`);
    return true;
  }

  const reset = () => {
    used.clear();
    $('.choice').removeAttr('score');
    $('.choice .order').html('&nbsp;&nbsp;');
    $('#next').attr('disabled', true);
  }

  $('.choice').click(evt => {
    const $this = $(evt.currentTarget);
    if ($this.attr('score')) return false;
    for (let i=4;i>0;i--) if (!used.has(i)){
      used.add(i);
      $this.attr('score', i);
      $this.find('.order').html(i);
      break;
    }
    if (used.size === 4) $('#next').removeAttr('disabled');
  });

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
    if (loadQuestion(current_question_id+1)){
    }else{
      // 테스트 완료
      for (const [c, s] of Object.entries(scores)){
        $(`#${c}-score`).html(s);
      }
      $('#question-stage').css('display', 'none');
      $('#result-stage').css('display', 'block');
    }
  });
});
