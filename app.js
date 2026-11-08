'use strict';
const $ = id => document.getElementById(id);
const letters=['أ','ب','ج','د'];
const credits='أ/ فاطمة هزازي – ملتقى معلمي ومعلمات الرياضيات – ملتقى التعليم التفاعلي';
const stateKey='nujum-nafes-v1';
const profileDefaults=()=>({name:'',school:'',section:'',schoolCode:'٣١٤٢٠٦',studentCode:'١٠٣٧٥٢٤٨٦٩',schoolDigits:Array(6).fill(''),studentDigits:Array(10).fill(''),schoolMarks:Array(6).fill(null),studentMarks:Array(10).fill(null)});
let profile=profileDefaults(), attempt=null, sound=false, route='home', pending=0, profileOnly=false, mode='learn', reviewFilter='all';
let startTime=0, currentReview=0, demoChoice=null, demoLocked=false, toastTimer=0, context;
try{
 const saved=JSON.parse(sessionStorage.getItem(stateKey)||'null');
 if(saved){
   if(saved.profile&&typeof saved.profile.name==='string'&&saved.profile.schoolMarks?.length===6&&saved.profile.studentMarks?.length===10)profile={...profile,...saved.profile};
   sound=saved.sound===true;
   const a=saved.attempt, count=MODELS[a?.model]?.questions.length;
   if(a&&count&&Array.isArray(a.answers)&&a.answers.length===count&&a.answers.every((x,i)=>x===null||Number.isInteger(x)&&x>=0&&x<MODELS[a.model].questions[i].options.length)&&a.locked?.length===count&&a.locked.every((v,i)=>typeof v==='boolean'&&(!v||a.answers[i]!==null))&&Number.isInteger(a.index)&&a.index>=0&&a.index<count)attempt=a;
 }
}catch{}
function save(){try{sessionStorage.setItem(stateKey,JSON.stringify({profile,attempt,sound}));}catch{}}
function toast(message){const n=$('notice');n.textContent=message;n.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.classList.remove('show'),2600);}
function button(label,action,cl='btn',ic='',extra=''){return '<button type="button" class="'+cl+'" data-action="'+action+'" '+extra+'>'+ (ic?icon(ic):'')+'<span>'+label+'</span></button>';}
function stopClock(){if(startTime&&attempt){attempt.elapsed=(attempt.elapsed||0)+Math.max(0,Date.now()-startTime);startTime=0;save();}}
function elapsed(){return (attempt?.elapsed||0)+(startTime?Date.now()-startTime:0);}
function timeString(){let n=Math.floor(elapsed()/1000);return arabic(Math.floor(n/60))+':'+arabic(String(n%60).padStart(2,'0'));}
function tick(){if($('elapsed'))$('elapsed').textContent=timeString();}
setInterval(tick,1000);
window.addEventListener('pagehide',stopClock);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopClock();else if(route==='quiz'&&!startTime)startTime=Date.now();});
function chime(correct=true){
 if(!sound)return;
 try{context=context||new(window.AudioContext||window.webkitAudioContext)();context.resume();const start=context.currentTime; (correct?[523.25,659.25,783.99]:[440,392]).forEach((hz,i)=>{let o=context.createOscillator(),gain=context.createGain();o.type='sine';o.frequency.value=hz;gain.gain.setValueAtTime(.001,start+i*.1);gain.gain.exponentialRampToValueAtTime(.10,start+i*.1+.016);gain.gain.exponentialRampToValueAtTime(.001,start+.24+i*.1);o.connect(gain);gain.connect(context.destination);o.start(start+i*.1);o.stop(start+i*.1+.25);});}catch{}
}
function header(){
 $('header').innerHTML='<div class="topbar"><button class="brand" data-action="home"><img src="'+asset('forum.webp')+'" alt="شعار ملتقى التعليم التفاعلي"><span>نجوم <em>نافس</em></span></button><nav aria-label="التنقل الرئيسي">'+button('الرئيسية','home','nav-link '+(route==='home'?'active':''),'home')+button('نماذج التدريب','models','nav-link','layers')+button('بطاقة البيانات','profile','nav-link '+(route==='profile'?'active':''),'card')+'</nav><div class="toolset">'+button(sound?'كتم الصوت':'تشغيل الصوت','sound','tool',sound?'sound':'mute','aria-pressed="'+sound+'" title="'+(sound?'كتم الصوت':'تشغيل الصوت')+'"')+button('ملء الشاشة','fullscreen','tool','full','title="ملء الشاشة"')+'</div></div>';
 $('footer').innerHTML='<div class="foot-logo">'+icon('star')+'<span>نجوم نافس</span></div><div>'+credits+'</div>';
}
function closeDialog(){if($('dialog').open)$('dialog').close();}
function dialog(title,body,wide=false){const d=$('dialog');d.className=wide?'wide-dialog':'';$('dialogBody').innerHTML='<div class="dialog-head"><h2 id="dialogTitle">'+title+'</h2>'+button('إغلاق','close','tool','close')+'</div>'+body;if(!d.open)d.showModal();}
$('dialog').addEventListener('click',e=>{if(e.target===$('dialog')){const r=$('dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
function change(next){
 if(route==='quiz'&&next!=='quiz')stopClock();
 closeDialog(); route=next;if(route==='quiz'&&!startTime&&!document.hidden)startTime=Date.now();
 render();window.scrollTo(0,0);$('main').focus({preventScroll:true});
}
function render(){header();const pages={home,profile:profileView,quiz:quizView,result:resultView,review:reviewView,certificate:certificateView};$('main').innerHTML=pages[route]();tick();}
function home(){
 const stars=[[6,25,9],[11,57,5],[15,10,4],[24,8,12],[37,19,6],[42,67,8],[46,34,5],[51,73,6],[55,14,6],[63,85,8],[81,19,5],[93,74,7],[97,25,4]];
 const sky='<div class="sky" aria-hidden="true"><i class="orbit o1"></i><i class="orbit o2"></i><i class="orbit o3"></i>'+stars.map(([x,y,s])=>'<i class="spark" style="left:'+x+'%;top:'+y+'%;--s:'+s+'px"></i>').join('')+'</div>';
 const resumed=attempt&&!attempt.finished;
 const cardList=MODELS.map((m,i)=>'<button type="button" class="model-card '+m.color+'" data-action="select" data-id="'+i+'"><span class="model-thumb">'+cardArt(m.art)+'</span><span class="model-copy"><strong>'+m.name+'</strong><span>'+m.subtitle+'</span><small>'+icon('paper')+arabic(m.questions.length)+' '+(m.questions.length<=10?'أسئلة':'سؤالًا')+'</small></span><span class="card-arrow">'+icon('arrow')+'</span></button>').join('');
 return '<div class="container"><section class="hero">'+sky+'<div class="hero-copy"><p class="hero-level">'+icon('book')+' رياضيات الصف الثالث الابتدائي</p><h1>نجوم <span>نافس</span></h1><p class="hero-desc">رافق بسمة وراشد في تحدّي الرياضيات.<br>اقرأ، وظلّل دائرتك، واكتشف خطوات الحل.</p><div class="hero-actions">'+button(resumed?'تابع تدريبك':'ابدأ رحلتك',resumed?'resume':'first','btn gold','arrow')+button('جرّب التظليل','demo','btn ghost-light','pen')+'</div></div><div class="hero-art"><div class="halo"></div>'+goldStar('star-a')+goldStar('star-b')+'<img src="'+asset('companions.webp')+'" alt="بسمة تحمل كتاب الرياضيات وراشد يشير إلى نجمة" class="companions"></div></section><section class="info-strip" aria-label="معلومات التدريب"><div><span class="stat-icon lavender">'+icon('layers')+'</span><p><b>٦ نماذج</b><small>تدريبات متنوّعة</small></p></div><div><span class="stat-icon sea">'+icon('pen')+'</span><p><b>٦٧ سؤالًا</b><small>مع خطوات الحل</small></p></div><div><span class="stat-icon honey">'+icon('trophy')+'</span><p><b>شهادة إنجاز</b><small>عند تحقيق ٨٠٪ فأكثر</small></p></div></section><section id="models" class="models"><div class="section-title"><div><p class="kicker"><i></i> ساحة التدريب</p><h2>اختر نموذجك</h2></div><span class="model-count">٦ نماذج تدريبية</span></div><div class="model-grid">'+cardList+'</div></section>'+(attempt?.finished?'<div class="past">'+button('عرض نتيجة آخر تدريب','last','btn soft','trophy')+'</div>':'')+'</div>';
}
function selectModel(i){pending=i;profileOnly=false;if(attempt&&!attempt.finished&&attempt.model===i){change('quiz');return;}if(attempt&&!attempt.finished){dialog('لديك تدريب قيد التقدّم','<p>ستبدأ محاولة جديدة في «'+MODELS[i].name+'» عند اعتماد البطاقة.</p><div class="actions">'+button('اختيار النموذج الجديد','new-profile','btn primary')+button('متابعة تدريبي الحالي','resume','btn soft')+'</div>');return;}change('profile');}
function subHead(tag,title,details=''){return '<div class="sub-head"><div><p class="kicker"><i></i>'+tag+'</p><h1>'+title+'</h1>'+(details?'<p>'+details+'</p>':'')+'</div>'+button('الرئيسية','home','btn subtle','home')+'</div>';}
function numericForm(kind,title,code,values){
 const word=kind==='school'?'رمز المدرسة':'رقم الطالب';
 return '<fieldset class="bubble-field"><legend>'+title+'</legend><p>الرقم التجريبي <bdi dir="ltr" class="code-example">'+code+'</bdi></p><div class="bubble-matrix '+kind+'">'+Array.from(code,(digit,index)=>'<div class="numeric-column" role="group" aria-label="'+word+'، الخانة '+arabic(index+1)+'، الرقم '+digit+'"><input class="column-digit" type="text" inputmode="numeric" autocomplete="off" data-entry="'+kind+'" data-position="'+index+'" aria-label="'+word+'، اكتب الرقم في الخانة '+arabic(index+1)+'" value="'+esc(profile[kind+'Digits'][index])+'" placeholder="ـ">'+Array.from({length:10},(_,n)=>'<button type="button" data-action="digit" data-kind="'+kind+'" data-col="'+index+'" data-num="'+n+'" aria-label="'+word+'، الخانة '+arabic(index+1)+'، ظلّل '+arabic(n)+'" aria-pressed="'+(values[index]===n)+'" class="num-bubble '+(values[index]===n?'marked':'')+'">'+arabic(n)+'</button>').join('')+'</div>').join('')+'</div></fieldset>';
}
function profileView(){let info=profileOnly?'تدرّب على تعبئة البطاقة كما تفعل في ورقة الاختبار.':'نموذجك المختار · '+MODELS[pending].name;
 return '<div class="container interior">'+subHead('قبل التظليل','بطاقة بيانات الطالب',info)+'<section class="panel"><h2 class="panel-title">'+icon('card')+' بياناتك الدراسية</h2><div class="inputs">'+[['name','اسم الطالب','اكتب الاسم الذي تريده على الشهادة'],['school','اسم المدرسة','اكتب اسم المدرسة'],['section','الفصل','مثال: ثالث أ']].map(([id,label,ph])=>'<label>'+label+'<input id="field-'+id+'" data-field="'+id+'" type="text" maxlength="'+(id==='section'?24:80)+'" value="'+esc(profile[id])+'" placeholder="'+ph+'" autocomplete="off"></label>').join('')+'<label>الصف<input value="الثالث الابتدائي" readonly></label></div><details class="omr" '+(profileOnly?'open':'')+'><summary>'+icon('pen')+' تدريب تظليل أرقام البطاقة <span>افتح أو اطوِ النموذج</span></summary><div class="omr-inner"><p>انقل الرقم التجريبي إلى المربعات، بدءًا بأول أرقامه في الخانة اليمنى. ثم ظلّل تحت كل مربع الدائرة التي تطابق رقمه. يمكنك تعديل أي خانة قبل التحقّق.</p><div class="matrices">'+numericForm('school','رمز المدرسة','٣١٤٢٠٦',profile.schoolMarks)+numericForm('student','رقم السجل المدني أو الإقامة (تجريبي)','١٠٣٧٥٢٤٨٦٩',profile.studentMarks)+'</div>'+button('تحقّق من التظليل','verify-data','btn soft','check')+' <span id="data-status" role="status"></span></div></details></section>'+(profileOnly?'<div class="actions">'+button('اختر نموذج التدريب','models','btn primary','layers')+'</div>':'<section class="panel mode-panel"><h2 class="panel-title">'+icon('layers')+' طريقة التدريب</h2><div class="mode-options">'+[['learn','تدريب مع الشرح','اكتشف خطوات الحل بعد اعتماد كل إجابة.'],['test','محاكاة الاختبار','راجع الحلول بعد ظهور النتيجة.']].map(([k,t,d])=>'<label><input type="radio" name="mode" value="'+k+'" '+(mode===k?'checked':'')+'><span><strong>'+t+'</strong><small>'+d+'</small></span></label>').join('')+'</div></section><div class="actions">'+button('ابدأ الأسئلة','start','btn primary','arrow')+'</div>')+'</div>';
}
function startAttempt(){if(!profile.name.trim()){const f=$('field-name');f.setCustomValidity('اكتب اسمك أو اسمًا تدريبيًا ليظهر على الشهادة.');f.reportValidity();f.focus();return;}
 const qs=MODELS[pending].questions;attempt={model:pending,name:profile.name.trim(),school:profile.school.trim(),section:profile.section.trim(),mode,index:0,answers:qs.map(()=>null),locked:qs.map(()=>false),elapsed:0,finished:false};save();change('quiz');
}
function verifyData(){let missing=0,wrong=0;for(const kind of ['school','student']){const marks=profile[kind+'Marks'];Array.from(profile[kind+'Code']).forEach((c,i)=>{const entry=profile[kind+'Digits'][i];const bad=(entry!==''&&entry!==c)||(marks[i]!==null&&arabic(marks[i])!==c);if(marks[i]===null||entry==='')missing++;if(bad)wrong++;const col=document.querySelector('[data-kind="'+kind+'"][data-col="'+i+'"]').parentElement;col.classList.toggle('error-col',bad);});}
 $('data-status').textContent=wrong||missing? [wrong?'راجع الخانات المحدّدة ('+arabic(wrong)+')':'',missing?'بقيت '+arabic(missing)+' خانات غير مكتملة':''].filter(Boolean).join('، ')+'.':'أحسنت! كتبت الأرقام وظلّلت جميع الخانات الست عشرة بدقة.';chime(!wrong&&!missing);
}
function answerSheet(q,selected,locked=false,act='answer'){
 return '<div class="answer-sheet"><div class="answer-top"><strong>'+icon('pen')+' نموذج التظليل</strong><span>'+(locked?'تم اعتماد إجابتك':'ظلّل دائرة واحدة')+'</span></div><div class="options '+(q.options.some(o=>o.length>18&&!o.startsWith('@'))?'long-options':'')+'" style="--count:'+q.options.length+'" role="group" aria-label="اختيارات الإجابة">'+q.options.map((o,i)=>'<button type="button" class="option '+(selected===i?'selected':'')+'" data-action="'+act+'" data-id="'+i+'" aria-pressed="'+(selected===i)+'" '+(locked?'disabled':'')+'><span class="option-label">'+option(o)+'</span><span class="letter">'+letters[i]+'</span></button>').join('')+'</div></div>';
}
function solution(q,pick){let ok=pick===q.correct;return '<section class="feedback '+(ok?'correct':'wrong')+'" role="status"><div class="feedback-title">'+icon(ok?'check':'bulb')+'<strong>'+(ok?'أحسنت، إجابتك صحيحة!':'لنتعلّم من المحاولة')+'</strong></div>'+(!ok?'<p>اختيارك <b>'+letters[pick]+'</b>، والإجابة الصحيحة <b>'+letters[q.correct]+' · '+prose(answerText(q.options[q.correct]))+'</b>.</p>':'')+'<h3>خطوات الحل</h3><ol>'+q.steps.map(s=>'<li>'+prose(s)+'</li>').join('')+'</ol></section>';}
function quizView(){
 const m=MODELS[attempt.model], n=m.questions.length, i=attempt.index,q=m.questions[i],locked=attempt.locked[i],done=attempt.locked.filter(Boolean).length;
 return '<div class="container interior quiz-container"><div class="quiz-path"><span>'+icon('layers')+' '+m.name+' <i>/</i> '+(attempt.mode==='learn'?'تدريب مع الشرح':'محاكاة الاختبار')+'</span>'+button('خريطة الأسئلة','map','btn subtle','grid')+'</div><div class="quiz-progress"><span>السؤال <b>'+arabic(i+1)+'</b> من '+arabic(n)+'</span><div role="progressbar" aria-valuenow="'+done+'" aria-valuemax="'+n+'" aria-label="عدد الإجابات المعتمدة"><i style="width:'+done/n*100+'%"></i></div><span class="timer">'+icon('clock')+' <bdi dir="ltr" id="elapsed">'+timeString()+'</bdi></span></div><article class="question panel"><p class="kicker"><i></i>'+q.skill+'</p><h1>'+prose(q.question)+'</h1>'+visual(q.visual)+answerSheet(q,attempt.answers[i],locked)+(locked?(attempt.mode==='learn'?solution(q,attempt.answers[i]):'<p class="confirmed">'+icon('check')+' اعتُمدت إجابتك. ستجد الشرح في المراجعة النهائية.</p>'):'')+'<div class="quiz-buttons">'+(!locked?button('اعتمد إجابتي','lock','btn primary','check',attempt.answers[i]===null?'disabled':''):(done===n?button('اعرض نتيجتي','finish','btn gold','trophy'):button(i===n-1?'أكمل الأسئلة المتبقية':'السؤال التالي','next','btn primary','arrow')))+'<div>'+button('السابق','prev','btn subtle','right',i===0?'disabled':'')+(!locked&&i<n-1?button('التالي','move-next','btn subtle','arrow'):'')+'</div></div></article></div>';
}
function updateChoices(action,index){document.querySelectorAll('[data-action="'+action+'"]').forEach(b=>{const selected=Number(b.dataset.id)===index;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});}
function chooseAnswer(i){if(attempt.locked[attempt.index])return;attempt.answers[attempt.index]=i;save();updateChoices('answer',i);document.querySelector('[data-action="lock"]').disabled=false;}
function lockAnswer(){const i=attempt.index;if(attempt.locked[i]||attempt.answers[i]===null)return;attempt.locked[i]=true;save();const q=MODELS[attempt.model].questions[i];if(attempt.mode==='learn')chime(attempt.answers[i]===q.correct);$('main').innerHTML=quizView();document.querySelector('.feedback,.confirmed')?.scrollIntoView({block:'nearest',behavior:'smooth'});}
function jump(i){if(i<0||i>=attempt.answers.length)return;attempt.index=i;save();change('quiz');}
function questionMap(){dialog('خريطة الأسئلة','<p>اختر رقم السؤال للانتقال إليه. تشير علامة الصح إلى أنّ الإجابة اعتُمدت.</p><div class="map-grid">'+attempt.locked.map((yes,i)=>button(arabic(i+1),'jump','map-num '+(yes?'done ':'')+(i===attempt.index?'current':''),yes?'check':'','data-id="'+i+'" aria-label="السؤال '+arabic(i+1)+(yes?'، معتمد':'، لم يُعتمد')+'"')).join('')+'</div>');}
function score(){const qs=MODELS[attempt.model].questions, right=qs.filter((q,i)=>attempt.answers[i]===q.correct).length;const exact=100*right/qs.length;return{right,total:qs.length,wrong:qs.length-right,percent:new Intl.NumberFormat('ar-SA',{maximumFractionDigits:1,useGrouping:false}).format(exact)+'٪',pass:5*right>=4*qs.length};}
function finish(){if(!attempt.locked.every(Boolean))return questionMap();stopClock();attempt.finished=true;attempt.date=new Date().toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric'});save();reviewFilter='all';chime();change('result');}
function resultView(){const s=score(),m=MODELS[attempt.model];return '<div class="container interior">'+subHead('نهاية التدريب','نتيجة '+esc(attempt.name),m.name)+'<section class="panel result-panel"><div class="result-score" style="--p:'+100*s.right/s.total+'%"><strong>'+s.percent+'</strong></div><div><h2>'+(s.pass?'استحققت شهادة الإنجاز!':'أكملت النموذج يا بطل!')+'</h2><p>أجبت إجابة صحيحة عن <b>'+arabic(s.right)+'</b> من <b>'+arabic(s.total)+'</b> سؤالًا.</p><div class="result-tags"><span>'+icon('check')+' '+arabic(s.right)+' صحيحة</span><span>'+icon('pen')+' '+arabic(s.wrong)+' للمراجعة</span></div></div></section><section class="panel"><h2 class="panel-title">'+icon('book')+' خطوتك التالية</h2><p>'+(s.pass?'يمكنك طباعة شهادتك باسمك، أو استكشاف الحلول خطوة بخطوة.':'راجع الأسئلة التي تحتاج إلى تدريب ثم أعد المحاولة. تحصل على شهادتك عند بلوغ ٨٠٪.')+'</p><div class="actions">'+(s.pass?button('شهادة الإنجاز','certificate','btn gold','trophy'):'')+button('مراجعة الإجابات','review','btn primary','eye')+button('محاولة جديدة','retry','btn soft','refresh')+'</div></section></div>';}
function reviewView(){
 const m=MODELS[attempt.model],indices=m.questions.map((_,i)=>i).filter(i=>reviewFilter==='all'||attempt.answers[i]!==m.questions[i].correct);if(!indices.includes(currentReview))currentReview=indices[0]??0;
 const i=currentReview,q=m.questions[i];
 return '<div class="container interior">'+subHead('بعد الاختبار','مراجعة الإجابات',m.name)+'<div class="review-tools">'+button('كل الأسئلة','all','btn '+(reviewFilter==='all'?'primary':'soft'))+button('الأخطاء فقط','errors','btn '+(reviewFilter==='errors'?'primary':'soft'))+button('النتيجة','last','btn subtle','trophy')+'</div>'+(indices.length?'<div class="review-picks">'+indices.map(j=>button(arabic(j+1),'review-q','map-num '+(i===j?'current ':'')+(attempt.answers[j]===m.questions[j].correct?'done':'miss'),'','data-id="'+j+'"')).join('')+'</div><article class="panel question"><p class="kicker"><i></i> السؤال '+arabic(i+1)+' · '+q.skill+'</p><h1>'+prose(q.question)+'</h1>'+visual(q.visual)+answerSheet(q,attempt.answers[i],true,'readonly')+solution(q,attempt.answers[i])+'</article>':'<div class="panel"><h2>كل إجاباتك صحيحة!</h2><p>اختر «كل الأسئلة» للاطلاع على خطوات الحل.</p></div>')+'</div>';
}
function certificateView(){const s=score();if(!s.pass)return resultView();return '<div class="container interior certificate-wrap"><div class="actions no-print">'+button('طباعة الشهادة','print','btn primary','print')+button('العودة إلى النتيجة','last','btn soft','right')+'</div><article class="certificate"><div class="cert-inner"><img class="cert-logo" src="'+asset('forum.webp')+'" alt="شعار ملتقى التعليم التفاعلي"><div class="cert-stars">✦　★　✦</div><p class="cert-brand">نجوم نافس</p><h1>شهادة إنجاز</h1><p>تُمنح هذه الشهادة للطالب</p><h2>'+esc(attempt.name)+'</h2><p>لإتمامه «'+MODELS[attempt.model].name+'» في رياضيات الصف الثالث الابتدائي<br>وتحقيقه نسبة <strong>'+s.percent+'</strong> في الإجابات الصحيحة.</p>'+(attempt.school||attempt.section?'<p class="cert-school">'+[attempt.school,attempt.section].filter(Boolean).map(esc).join(' · ')+'</p>':'')+'<div class="cert-date">'+esc(attempt.date||'')+'</div><div class="cert-credits">'+credits+'</div></div></article></div>';}
const demoQ={skill:'الضرب',question:'كم ملصقًا وضعت سارة؟',options:['١٢','١٨','٢٤','٣٦'],correct:2,steps:['لدى سارة ٦ بطاقات، ووضعت على كل واحدة ٤ ملصقات. عدد القلمين لا يدخل في حساب الملصقات.','نضرب عدد البطاقات في عدد الملصقات على البطاقة. ~٦ × ٤ = ٢٤~ ملصقًا.']};
function demo(){dialog('جرّب التظليل','<div class="demo"><p class="kicker"><i></i> سؤال تجريبي</p><h3>'+demoQ.question+'</h3><p>وضعت سارة ٤ ملصقات على كل بطاقة من بطاقاتها الستّ، واستعملت قلمين لتلوين البطاقات.</p>'+answerSheet(demoQ,demoChoice,demoLocked,'demo-answer')+(demoLocked?solution(demoQ,demoChoice):'')+'<div class="actions">'+(demoLocked?button('اختيار نموذج','models','btn primary','layers')+button('جرّب مجددًا','demo','btn soft','refresh'):button('تحقّق من إجابتي','demo-lock','btn primary','check',demoChoice===null?'disabled':''))+'</div></div>',true);}
function modelsView(){change('home');requestAnimationFrame(()=>document.getElementById('models')?.scrollIntoView({block:'start',behavior:'smooth'}));}
function recordDigits(input,raw){
 const kind=input.dataset.entry, pos=Number(input.dataset.position), values=profile[kind+'Digits'];
 const chars=Array.from(raw).map(c=>{if(/[٠-٩]/.test(c))return c;if(/[0-9]/.test(c))return arabic(c);if(/[۰-۹]/.test(c))return arabic(c.charCodeAt(0)-1776);return '';}).join('');
 if(!chars){values[pos]='';input.value='';}else{
  Array.from(chars.slice(0,values.length-pos)).forEach((digit,j)=>{values[pos+j]=digit;const field=document.querySelector('[data-entry="'+kind+'"][data-position="'+(pos+j)+'"]');field.value=digit;field.parentElement.classList.remove('error-col');});
  const next=document.querySelector('[data-entry="'+kind+'"][data-position="'+(pos+chars.length)+'"]');if(next){next.focus();next.select();}
 }
 $('data-status').textContent='';save();
}
document.addEventListener('focusin',e=>{if(e.target.dataset.entry)e.target.select();});
document.addEventListener('paste',e=>{if(e.target.dataset.entry){e.preventDefault();recordDigits(e.target,e.clipboardData.getData('text'));}});
document.addEventListener('input',e=>{if(e.target.dataset.entry){recordDigits(e.target,e.target.value);return;}const f=e.target.dataset.field;if(f&&['name','school','section'].includes(f)){profile[f]=e.target.value;e.target.setCustomValidity('');save();}if(e.target.name==='mode')mode=e.target.value;});
document.addEventListener('click',async e=>{
 const b=e.target.closest('button[data-action]');if(!b||b.disabled)return;
 const a=b.dataset.action,id=Number(b.dataset.id);
 switch(a){
 case 'home':change('home');break;
 case 'models':modelsView();break;
 case 'profile':profileOnly=true;change('profile');break;
 case 'first':selectModel(0);break;
 case 'select':selectModel(id);break;
 case 'new-profile':change('profile');break;
 case 'resume':if(attempt)change(attempt.finished?'result':'quiz');break;
 case 'start':startAttempt();break;
 case 'verify-data':verifyData();break;
 case 'digit':{const {kind,col,num}=b.dataset;profile[kind+'Marks'][Number(col)]=Number(num);const group=b.parentElement;group.classList.remove('error-col');group.querySelectorAll('button').forEach(x=>{x.classList.toggle('marked',x===b);x.setAttribute('aria-pressed',String(x===b));});$('data-status').textContent='';save();break;}
 case 'answer':chooseAnswer(id);break;
 case 'lock':lockAnswer();break;
 case 'next':jump(attempt.index<attempt.answers.length-1?attempt.index+1:attempt.locked.indexOf(false));break;
 case 'move-next':jump(attempt.index+1);break;
 case 'prev':jump(attempt.index-1);break;
 case 'map':questionMap();break;
 case 'jump':jump(id);break;
 case 'finish':finish();break;
 case 'last':if(attempt?.finished)change('result');break;
 case 'certificate':if(attempt?.finished&&score().pass)change('certificate');break;
 case 'print':window.print();break;
 case 'review':currentReview=0;reviewFilter='all';change('review');break;
 case 'errors':case 'all':reviewFilter=a;currentReview=0;render();break;
 case 'review-q':currentReview=id;render();break;
 case 'retry':pending=attempt.model;profileOnly=false;mode=attempt.mode;change('profile');break;
 case 'demo':demoChoice=null;demoLocked=false;demo();break;
 case 'demo-answer':if(!demoLocked){demoChoice=id;updateChoices(a,id);document.querySelector('[data-action="demo-lock"]').disabled=false;}break;
 case 'demo-lock':if(demoChoice!==null){demoLocked=true;chime(demoChoice===demoQ.correct);demo();}break;
 case 'sound':sound=!sound;save();if(sound)chime();header();toast(sound?'الصوت مفعّل':'الصوت مكتوم');break;
 case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('استخدم خيار ملء الشاشة من قائمة المتصفح.');}catch{toast('استخدم خيار ملء الشاشة من قائمة المتصفح.');}break;
 case 'close':closeDialog();break;
 }
});
render();
