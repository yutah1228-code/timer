

const timeText=document.getElementById('time');
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startButton=document.getElementById('startButton');
const stopButton=document.getElementById('stopButton');
const resetButton=document.getElementById('resetButton');

let count=0;
let timerId=null;
let remainingTime=0;
let endTime = null;

function formatTime(totalSeconds){
    const hours=Math.floor(totalSeconds/3600);
    const minutes=Math.floor(
        (totalSeconds%3600)/60
    );
    const seconds=Math.floor(totalSeconds%60);
    return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function notifyTimerEnd() {
  if (!("Notification" in window)) {
    alert("このブラウザは通知に対応していません");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("タイマー終了", {
      body: "設定した時間になりました"
    });
  } else {
    alert("通知が許可されていません");
  }
}

startButton.addEventListener("click",function(){
    console.log("スタートボタンが押されました");
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
    

    if (timerId !== null) {
    return;
    }

    if(hoursInput.value === "" &&
        minutesInput.value === "" &&
        secondsInput.value === ""){
        timerId=setInterval(function(){
            count++;
            timeText.textContent=formatTime(count);
        },1000);
    }

    else{
        if(remainingTime===0){
        remainingTime=Number(hoursInput.value||0)*3600+Number(minutesInput.value||0)*60+Number(secondsInput.value||0);
        endTime = Date.now() + remainingTime * 1000;
        }
        timeText.textContent=formatTime(remainingTime);
        timerId=setInterval(()=>{
            remainingTime = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
    );
            timeText.textContent=formatTime(remainingTime);

            if(remainingTime<=0){
                clearInterval(timerId);
                timerId=null;
                endTime = null;
                notifyTimerEnd();
                alert("時間になりました")
            }

        },1000);

    }

    
    
});
stopButton.addEventListener("click",function(){
    console.log("ストップボタンが押されました");

    clearInterval(timerId);
    timerId=null;
});

resetButton.addEventListener("click",function(){
    console.log("リセットボタンが押されました");

    clearInterval(timerId);
    timerId=null;
    count=0;
    remainingTime=0;
    timeText.textContent=formatTime(0);
})