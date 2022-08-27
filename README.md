# subjects_api

main ブランチに PUSH されたら自動で Deno Deploy にデプロイされます。  
https://fukuchiyama-subjects-api.deno.dev/


- 使い方  
`https://fukuchiyama-subjects-api.deno.dev/?year={西暦}&month={月}&day={日}&hour={時}&min={分}`  
例：2022年10月5日13時55分の場合（数字は一桁，二桁表記のどちらでも構いません）  
https://fukuchiyama-subjects-api.deno.dev/?year=2022&month=10&day=5&hour=13&min=55  
レスポンスはJSON．  
"result"：講義の名前，学年，担当教員，教室，単位数，学部，必修有無を格納した辞書の配列  
"break_time"：休み時間か否かをbool値で．resultは直近もしくは最中の講義情報を返す．始業前はtrue，放課後はfalse  
"event"：長期休暇などのイベント情報．平常時はschool day．休暇中などはresultは空．  

- memo  
「今の時間帯の次の講義情報」オプションとかは簡単に実装できるから要望があれば  
1000行以上のJSONを参照してるが，情報更新が若干面倒．データベースとかスプレッドシートみたいなので管理できれば良いかも．  
（更新頻度が少ないから別にこのままでも良い気がするが）  
開講日や休暇開始日をハードコーディングしているため外部参照にしたい．  
あと，いずれ祝日対応したい．  
Deno Deployの一日あたりのリクエスト回数上限は10万であるため，それを超える場合はラズパイか何かでサーバー建てる．  
なんちゃってWeb APIもどきだからちゃんと作り直したい気もする（が，問い合わせ目的だけならもうこれでいいのでは？）．  
FastAPIとかかな．  

