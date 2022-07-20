// ==UserScript==
// @name 可可英语听力辅助
// @namespace http://tampermonkey.net/
// @version 1.0
// @description try to take over the world!
// @author we731236993@163.com
// @match http://www.kekenet.com/broadcast/*
// @require https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant none
// ==/UserScript==

(function () {
    'use strict';
    // 快进快退时间间隔
    var iv_time = 3;

    var btn_prev = $('#prev');
    var btn_next = $('#next');
    var btn_single = $('#single_play');

    var the_audio = $('#myaudio')[0];

    var single_play_start_time = 0;

    function prev_one() {
        var ev = document.createEvent('HTMLEvents');
        ev.clientX = btn_prev.offset().left;
        ev.clientY = btn_prev.offset().top;
        ev.initEvent('click', false, true);
        btn_prev[0].dispatchEvent(ev);

        single_play_start_time = the_audio.currentTime;

        setTimeout(function () {
            single_play();
        }, 500);
    }

    function next_one() {
        var ev = document.createEvent('HTMLEvents');
        ev.clientX = btn_next.offset().left;
        ev.clientY = btn_next.offset().top;
        ev.initEvent('click', false, true);
        btn_next[0].dispatchEvent(ev);

        single_play_start_time = the_audio.currentTime;
        
        // 经过测试
        // 通过按钮跳转到下一句的时候
        // 需要手动点击一下“仅该句”
        // 0.5s后自动执行
        setTimeout(function () {
            single_play();
        }, 500);

    }

    function single_play() {
        var ev = document.createEvent('HTMLEvents');
        // 这里不计算中心坐标应该也可以，这里只是作为演示
        ev.clientX = btn_single.offset().left + btn_single.width() / 2;
        ev.clientY = btn_single.offset().top + btn_single.height() / 2;
        ev.initEvent('click', false, true);
        btn_single[0].dispatchEvent(ev);
    }

    function audio_forward(the_time) {
        // 经过测试
        // 即使时间超过可取时间，也不会报错
        // 内置范围自动限制，故不在此额外设置
        var temp_time = the_audio.currentTime + the_time;

        if (temp_time < 0) {
            the_audio.currentTime = 0;
        }

        // 经过测试
        // 快进不会快进到下一句
        // 但快退会返回到一句
        // 故进行检测，不要返回上一句
        if (temp_time < single_play_start_time) {
            the_audio.currentTime = single_play_start_time;
        }
        else {
            the_audio.currentTime = temp_time;
        }

    }

    function audio_toggle() {
        if (the_audio.paused) {
            the_audio.play();
        }
        else {
            the_audio.pause();
        }
    }

    $(document).keydown(function (event) {
        switch (event.keyCode) {
            case 100: {
                // console.log('小键盘4');
                prev_one();
                break;
            }
            case 102: {
                // console.log('小键盘6');
                next_one();
                break;
            }
            case 101: {
                // console.log('小键盘5');
                single_play();
                break;
            }
            case 97: {
                // console.log('小键盘1');
                audio_forward(-iv_time);
                break;
            }
            case 98: {
                // console.log('小键盘2');
                audio_toggle();
                break;
            }
            case 99: {
                // console.log('小键盘3');
                audio_forward(iv_time);
                break;
            }
        }
    });
})();
