import { getHeatmapColorHex } from './lib';

import $ from 'jquery';

class WebController {
  init = questions => {
    this.questions = questions;
    this.currentQuestionId = 0;
    this.used = new Set;
    this.scores = {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
    };
  };

  showIntroductionStage = () => {
    $('#question-start').click(this.showQuestionStage);

    $('#loading').css('display', 'none');
    $('#introduction-stage').css('display', 'block');
  };

  showQuestionStage = () => {
    $('#clear').click(this.reset);
    $('#next').click(this.goNextQuestion);

    this.loadQuestion(0);
    $('#introduction-stage').css('display', 'none');
    $('#question-stage').css('display', 'block');
  };

  reset = () => {
    this.used.clear();
    $('.choice').removeAttr('score');
    $('.choice .order').html('&nbsp;&nbsp;');
    $('#next').attr('disabled', true);
  };

  loadQuestion = id => {
    const { questions } = this;
    if (id < 0 || id >= questions.length) return false;

    this.currentQuestionId = id;
    const q = questions[id];
    $('#question-id').html(id+1);
    $('#question-content').html(q.question);

    const order = ['red', 'blue', 'green', 'yellow'];
    order.sort(() => 0.5-Math.random()); // Shuffle order

    const $template = $('.choice:first-child').clone();
    $('.choices').empty();
    for (let i=0;i<4;i++){
      const $node = $template.clone();
      $node.find('.content').html(q[order[i]]);
      $node.attr('answer-type', order[i]);
      $node.click(evt => {
        const $this = $(evt.currentTarget);
        if ($this.attr('score')) return false;
        for (let i=4;i>0;i--) if (!this.used.has(i)){
          this.used.add(i);
          $this.attr('score', i);
          $this.find('.order').html(i);
          break;
        }
        if (this.used.size === 4) $('#next').removeAttr('disabled');
      });
      $('.choices').append($node);
    }
    this.reset();

    const percentage = Math.round(id / questions.length * 100);
    $('.progress-bar').css('width', percentage + '%').attr('aria-valuenow', percentage).html(`${id} / ${questions.length}`);

    return true;
  };

  goNextQuestion = () => {
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
      this.scores[type] += score;
    }
    if (!this.loadQuestion(this.currentQuestionId+1)){
      // 테스트 종료
      window.location.href = `?r=${this.scores['red']},${this.scores['blue']},${this.scores['green']},${this.scores['yellow']}`;
    }
  };

  showResultStage = score => {
    const { questions } = this;
    const scores = {};
    scores['red'] = score[0];
    scores['blue'] = score[1];
    scores['green'] = score[2];
    scores['yellow'] = score[3];
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

    $('#kakao-share').click(() => {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '나의 색 검사 테스트 결과 공유',
          description: `빨강: ${scores['red']}, 파랑: ${scores['blue']}, 초록: ${scores['green']}, 노랑: ${scores['yellow']}`,
          imageUrl: '',
          link: {
            webUrl: window.location.href,
            mobileWebUrl: window.location.href,
          },
        },
        buttons: [
          { title: '결과보기', link: { webUrl: window.location.href, mobileWebUrl: window.location.href } },
          { title: '검사하기', link: { webUrl: window.location.href.split('?')[0], mobileWebUrl: window.location.href.split('?')[0] } },
        ],
      });
    });

    $('#loading').css('display', 'none');
    $('#result-stage').css('display', 'block');
  };
}

export default new WebController;
