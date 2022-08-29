// deno run --allow-net --watch --allow-read server.js
import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import subjects from "./data/subjects.json" assert { type: "json" };
import config from "./data/config.json" assert { type: "json" };
import { CSV } from "https://js.sabae.cc/CSV.js";
const holidays = CSV.toJSON(await CSV.fetch("https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv"));


serve(async (req) => {
  const pathname = req.url.split('/')[req.url.split('/').length - 1];

  if (pathname != "favicon.ico") {
    var option = pathname.split('&');
    var year = option[0].split('=')[1];
    var month = option[1].split('=')[1];
    var day = option[2].split('=')[1];
    var hour = option[3].split('=')[1];
    var min = option[4].split('=')[1];

    var time_date = new Date(0, 0, 0, hour, min);

    var date = new Date(year, month - 1, day);
    var dayOfWeekStr = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var dow = dayOfWeekStr[date.getDay()];

    var early_start = new Date(config.early_start);
    var early_end = new Date(config.early_end);
    var late_start1 = new Date(config.late_start1);
    var late_end1 = new Date(config.late_end1);
    var late_start2 = new Date(config.late_start2);
    var late_end2 = new Date(config.late_end2);

    // 日付検証
    var semester;
    var event_name = "school day";

    if (dow == "sun" || dow == "sat") { // 休日
      event_name = "holiday"
    } else if (early_start <= date && date <= early_end) { // 前期
      semester = "early";
    } else if (early_end < date && date < late_start1) { // 夏休み
      event_name = "summer vacation";
    } else if ((late_start1 <= date && date <= late_end1) || (late_start2 <= date && date <= late_end2)) { // 後期
      semester = "late";
    } else if (late_end1 < date && date < late_start2) { // 冬休み
      event_name = "winter vacation";
    } else if (date < early_start || late_start2 < date){ // 春休み
      event_name = "spring vacation";
    };

    for (var i in holidays) { // 祝日
      if (holidays[i]["国民の祝日・休日月日"] == year+ '/' + Number(month) + '/' + Number(day)) {
        event_name = holidays[i]["国民の祝日・休日名称"];
        semester = "";
      }
    }


    // 時間帯検証
    var c1_start = new Date(0, 0, 0, 8, 50);
    var c1_end = new Date(0, 0, 0, 10, 20);
    var c2_start = new Date(0, 0, 0, 10, 30);
    var c2_end = new Date(0, 0, 0, 12, 0);
    var c3_start = new Date(0, 0, 0, 12, 50);
    var c3_end = new Date(0, 0, 0, 14, 20);
    var c4_start = new Date(0, 0, 0, 14, 30);
    var c4_end = new Date(0, 0, 0, 16, 0);
    var c5_start = new Date(0, 0, 0, 16, 10);
    var c5_end = new Date(0, 0, 0, 17, 40);

    var break_time = false;
    var time;

    if (time_date < c1_start) {
      // 始業前
      break_time = true;
      time = "1";
    } else if (c1_start <= time_date && time_date <= c1_end) {
      // 1限
      time = "1";
    } else if (c1_end < time_date && time_date < c2_start) {
      // 1限後休み時間
      break_time = true;
      time = "2";
    } else if (c2_start <= time_date && time_date <= c2_end) {
      // 2限
      time = "2";
    } else if (c2_end < time_date && time_date < c3_start) {
      // 2限後休み時間
      break_time = true;
      time = "3";
    } else if (c3_start <= time_date && time_date <= c3_end) {
      // 3限
      time = "3";
    } else if (c3_end < time_date && time_date < c4_start) {
      // 3限後休み時間
      break_time = true;
      time = "4";
    } else if (c4_start <= time_date && time_date <= c4_end) {
      // 4限
      time = "4";
    } else if (c4_end < time_date && time_date < c5_start) {
      // 4限後休み時間
      break_time = true;
      time = "5";
    } else if (c5_start <= time_date && time_date <= c5_end) {
      // 5限
      time = "5";
    } else if (c5_end < time_date) {
      // 放課
      break_time = true;
      if (event_name == "school day") {
        event_name = "after school";
      }
    }


    var result = JSON.stringify([]);
    if (semester) { // 前期・後期
      if (time) { // 放課でない
        result = JSON.stringify(subjects[semester][dow][time]);
      }
    }

    var json = `{"result": ${result}, "break_time": ${break_time}, "event":"${event_name}", "dow":"${dow}", "hour":"${time}"}`;
    console.log(json);
    return new Response(json, { headers: { 'Access-Control-Allow-Origin': '*' , 'content-type': 'application/json' } });
  }
});