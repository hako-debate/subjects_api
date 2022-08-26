// deno run --allow-net --watch --allow-read server.js

import { Application, Router, helpers } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import subjects from "./subjects.json" assert { type: "json" };

const app = new Application();
const router = new Router();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

// router.get('/', (ctx) => {
//   ctx.response.body = "Hello World!";
// })

router.get('/:options', (ctx) => {
  console.log(ctx);
  const { options } = helpers.getQuery(ctx, { mergeParams: true });
  var option = options.split('&');

  var year = option[0].split('=')[1];
  var month = option[1].split('=')[1];
  var day = option[2].split('=')[1];
  var hour = option[3].split('=')[1];
  var min = option[4].split('=')[1];

  var time_date = new Date(0, 0, 0, hour, min);

  var date = new Date(year, month - 1, day);
  var dayOfWeekStr = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];
  var dow = dayOfWeekStr[date.getDay()];

  var early_start = new Date('2022-04-08');
  var early_end = new Date('2022-07-28');
  var late_start1 = new Date('2022-09-28');
  var late_end1 = new Date('2022-12-23');
  var late_start2 = new Date('2023-01-11');
  var late_end2 = new Date('2023-02-02');

  var semester;
  var event_name = "school day";
  if (early_start <= date && date <= early_end) {
    // 前期
    semester = "early";
  } else if (early_end < date && date < late_start1) {
    // 夏休み
    event_name = "summer vacation";
  } else if ((late_start1 <= date && date <= late_end1)||(late_start2 <= date && date <= late_end2)) {
    // 後期
    semester = "late";
  } else if (late_end1 < date && date < late_start2) {
    // 冬休み
    event_name = "winter vacation";
  } else {
    // その他
    event_name = "other";
  }

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
    event_name = "after school";
  }

  var result = JSON.stringify([]);
  if (semester) { // 前期・後期
    if (time) { // 放課でない
      result = JSON.stringify(subjects[semester][dow][time]);
    }
  }

  var json = `{"result": ${result}, "break_time": ${break_time}, "event":"${event_name}"}`;
  ctx.response.body = JSON.parse(json);
});




app.use(router.routes());
app.use(router.allowedMethods());

//await app.listen({ port: 8080 });