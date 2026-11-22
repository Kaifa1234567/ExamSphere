const $=id=>document.getElementById(id);
const sets={
"Computer Science":[
["What does HTML stand for?",["HyperText Markup Language","HighText Machine Language","HyperTool Multi Language","Home Tool Markup Language"],0],
["Which language styles web pages?",["Python","CSS","SQL","C++"],1],
["What does CPU stand for?",["Central Process Unit","Central Processing Unit","Computer Personal Unit","Core Program Utility"],1],
["Which is an input device?",["Monitor","Printer","Keyboard","Speaker"],2],
["Which number system uses 0 and 1?",["Decimal","Binary","Octal","Hexadecimal"],1],
["What does URL stand for?",["Uniform Resource Locator","Universal Record Link","User Reference Line","Unified Resource Link"],0],
["Which is a JavaScript data type?",["Boolean","Browser","Website","Keyboard"],0],
["What is the full form of RAM?",["Read Access Memory","Random Access Memory","Run All Memory","Rapid Action Module"],1],
["Which brackets are used for HTML tags?",["( )","[ ]","< >","{ }"],2],
["Which is a database query language?",["SQL","CSS","HTML","XML"],0]],
"General Knowledge":[
["Which is the largest planet?",["Earth","Jupiter","Mars","Venus"],1],
["What is the capital of Japan?",["Seoul","Beijing","Tokyo","Bangkok"],2],
["How many days are in a leap year?",["364","365","366","367"],2],
["Which is the largest ocean?",["Atlantic","Indian","Arctic","Pacific"],3],
["Which gas do plants absorb?",["Oxygen","Carbon dioxide","Nitrogen","Hydrogen"],1],
["How many sides has a hexagon?",["Five","Six","Seven","Eight"],1],
["Where are the pyramids of Giza?",["Greece","Egypt","Mexico","Italy"],1],
["What is the UK currency?",["Euro","Dollar","Pound sterling","Yen"],2],
["Which star is closest to Earth?",["Sirius","The Sun","Polaris","Vega"],1],
["At what temperature does water freeze?",["0°C","10°C","32°C","100°C"],0]],
"English":[
["Choose the plural of child.",["Childs","Childes","Children","Childrens"],2],
["Synonym of happy?",["Joyful","Angry","Tired","Afraid"],0],
["Choose the correct spelling.",["Beautifull","Beutiful","Beautiful","Beautifal"],2],
["Identify the verb: Sara writes a letter.",["Sara","Writes","A","Letter"],1],
["Opposite of ancient?",["Old","Historic","Modern","Past"],2],
["Choose the article: ___ apple a day.",["A","An","Thee","No article"],1],
["Choose the correct sentence.",["He go to school.","He going school.","He goes to school.","He gone to school."],2],
["Past tense of teach?",["Teached","Taught","Teaching","Teaches"],1],
["Which is a pronoun?",["Quickly","Beautiful","They","Running"],2],
["Complete: I have ___ my homework.",["Done","Do","Did","Doing"],0]]
};
let name="",subject="",qs=[],answers=[],at=0,left=600,clock=null,startAt=0,finished=false;
const views=["registerView","instructionView","examView","resultView"];
function show(id){views.forEach(v=>$(v).classList.toggle("hide",v!==id));}
$("studentForm").addEventListener("submit",e=>{e.preventDefault();name=$("name").value.trim();subject=$("subject").value;if(name)show("instructionView");});
$("editDetails").onclick=()=>show("registerView");
$("startBtn").onclick=()=>{
 qs=sets[subject];answers=Array(qs.length).fill(null);at=0;left=600;finished=false;startAt=Date.now();
 $("subjectLabel").textContent=subject.toUpperCase();show("examView");render();tick();clearInterval(clock);
 clock=setInterval(()=>{left--;tick();if(left<=0)finish(true);},1000);
};
function tick(){let m=String(Math.floor(left/60)).padStart(2,"0"),s=String(left%60).padStart(2,"0");$("timer").textContent=m+":"+s;$("timer").style.color=left<=60?"#d94f57":"";}
function render(){
 let q=qs[at];$("qNumber").textContent="QUESTION "+String(at+1).padStart(2,"0");$("question").textContent=q[0];
 $("questionCount").textContent=`Question ${at+1} of ${qs.length}`;$("answered").textContent=answers.filter(x=>x!==null).length+" answered";
 $("progressBar").style.width=((at+1)/qs.length*100)+"%";$("choices").innerHTML="";
 q[1].forEach((txt,i)=>{let b=document.createElement("button");b.className="choice"+(answers[at]===i?" selected":"");let l=document.createElement("span");l.textContent=String.fromCharCode(65+i);let t=document.createElement("div");t.textContent=txt;b.append(l,t);b.onclick=()=>{answers[at]=i;render();};$("choices").append(b);});
 $("prev").disabled=at===0;$("next").disabled=at===qs.length-1;
}
$("prev").onclick=()=>{if(at>0){at--;render();}};$("next").onclick=()=>{if(at<qs.length-1){at++;render();}};
$("submit").onclick=()=>{let n=answers.filter(x=>x===null).length;if(n&&!confirm(n+" question(s) are unanswered. Submit anyway?"))return;finish(false);};
function finish(auto){
 if(finished)return;finished=true;clearInterval(clock);
 let correct=answers.reduce((sum,a,i)=>sum+(a===qs[i][2]?1:0),0),pct=Math.round(correct/qs.length*100),used=Math.min(600,Math.floor((Date.now()-startAt)/1000));
 $("resultHeading").textContent=pct>=80?"Excellent work!":pct>=50?"Good effort!":"Keep practising!";
 $("resultMessage").textContent=`${name}, your ${subject} assessment ${auto?"was submitted automatically":"has been submitted"}.`;
 $("correct").textContent=correct+" / 10";$("marks").textContent=correct+" / 10";$("percent").textContent=pct+"%";$("scoreCircle").style.background=`conic-gradient(var(--purple) ${pct*3.6}deg,#e6e1f1 0deg)`;
 $("used").textContent=String(Math.floor(used/60)).padStart(2,"0")+":"+String(used%60).padStart(2,"0");$("reviewList").classList.add("hide");$("review").textContent="Review answers";show("resultView");
}
$("review").onclick=()=>{
 let box=$("reviewList");if(!box.classList.contains("hide")){box.classList.add("hide");$("review").textContent="Review answers";return;}
 box.innerHTML="<h3>Answer review</h3>";
 qs.forEach((q,i)=>{let item=document.createElement("div");item.className="review-item";let title=document.createElement("b");title.textContent=(i+1)+". "+q[0];let yours=document.createElement("p");yours.textContent="Your answer: "+(answers[i]===null?"Not answered":q[1][answers[i]]);yours.className=answers[i]===q[2]?"right":"wrong";let right=document.createElement("p");right.textContent="Correct answer: "+q[1][q[2]];right.className="right";item.append(title,yours,right);box.append(item);});
 box.classList.remove("hide");$("review").textContent="Hide review";
};
$("again").onclick=()=>{clearInterval(clock);$("name").value=name;$("subject").value=subject;show("registerView");};
$("themeBtn").onclick=()=>document.body.classList.toggle("dark");
