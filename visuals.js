/* Educational diagrams are inline so they scale to the classroom display. */
const asset = name => window.NAJM_ASSETS?.[name] || 'assets/'+name;
const arabic = n => String(n).replace(/[0-9]/g, c => '٠١٢٣٤٥٦٧٨٩'[Number(c)]);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function prose(value){
  return String(value).split(/(~[^~]+~)/g).map(part=>{
    if(part.startsWith('~')){
      const tokens=part.slice(1,-1).replace(/\(/g,' ( ').replace(/\)/g,' ) ').trim().split(/\s+/);
      return '<bdi class="math" dir="rtl">'+tokens.map(t=>'<span>'+esc(t)+'</span>').join('')+'</bdi>';
    }
    return esc(part).replace(/[٠-٩]+(?::[٠-٩]+)?/g,n=>'<bdi dir="ltr">'+n+'</bdi>');
  }).join('');
}
function svgBox(w,h,content,label='',cl=''){
  return '<svg class="'+cl+'" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" '+(label?'role="img" aria-label="'+esc(label)+'"':'aria-hidden="true"')+'>'+content+'</svg>';
}
const icons={
 star:'<path d="m12 2.5 2.8 5.9 6.5.9-4.7 4.6 1.1 6.5-5.7-3-5.7 3 1.1-6.5-4.7-4.6 6.5-.9z"/>',
 arrow:'<path d="M20 12H4m7-7-7 7 7 7"/>', right:'<path d="M4 12h16m-7-7 7 7-7 7"/>',
 sound:'<path d="M3 9h4l5-4v14l-5-4H3zM16 8q5 4 0 8m3-11q8 7 0 14"/>',
 mute:'<path d="M3 9h4l5-4v14l-5-4H3zM16 9l5 6m0-6-5 6"/>',
 full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 paper:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8m-8 4h6"/>',
 card:'<rect x="2" y="5" width="20" height="14" rx="3"/><circle cx="8" cy="11" r="2"/><path d="M5 16q3-4 6 0m3-6h5m-5 4h4"/>',
 pen:'<path d="m4 16 12-12q1-1 2 0l2 2q1 1 0 2L8 20l-5 1zM14 6l4 4"/>',
 trophy:'<path d="M7 3h10v6a5 5 0 0 1-10 0zM7 5H3v2q0 5 5 5m9-7h4v2q0 5-5 5m-4 2v5m-4 2h8"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8zm-9 10 9 5 9-5m-18 5 9 4 9-4"/>',
 home:'<path d="m2 11 10-8 10 8m-3-1v11H5V10m4 11v-7h6v7"/>',
 play:'<path d="m9 5 10 7-10 7z"/>',check:'<path d="m4 12 5 5L20 6"/>',
 close:'<path d="m6 6 12 12M18 6 6 18"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 print:'<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6z"/>',
 book:'<path d="M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2zm0 0v15"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 refresh:'<path d="M20 10a8 8 0 1 0-1 7m1-14v7h-7"/>',
 bulb:'<path d="M8 16q0-2-2-4a7 7 0 1 1 12 0q-2 2-2 4zM9 20h6"/>'
};
function icon(name){return '<svg aria-hidden="true" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>';}
const starPath='M50 4 62 34 95 37 70 59 77 92 50 75 22 92 29 59 5 37 38 34Z';
function goldStar(cl=''){return '<svg class="goldstar '+cl+'" aria-hidden="true" viewBox="0 0 100 100"><path d="'+starPath+'" fill="#e89938" transform="translate(0 4)"/><path d="'+starPath+'" fill="#ffce55"/><path d="m50 4 1 47-13-17zm45 33L51 51l19 8zM22 92l29-41-1 24z" fill="#ffeaa1"/><path d="m51 51 26 41-7-33zm-46-14 46 14-22 8z" fill="#f4ab39"/></svg>';}
function cube(x,y,size=16,cols=['#9d91e9','#7360d2','#5240a3']){
 const u=size,v=size*.52;return '<g transform="translate('+x+' '+y+')"><path d="M0 0 '+u+' '+v+' 0 '+2*v+' '+(-u)+' '+v+'Z" fill="'+cols[0]+'"/><path d="M'+(-u)+' '+v+' 0 '+2*v+' 0 '+(2*v+u)+' '+(-u)+' '+(v+u)+'Z" fill="'+cols[1]+'"/><path d="M0 '+2*v+' '+u+' '+v+' '+u+' '+(v+u)+' 0 '+(2*v+u)+'Z" fill="'+cols[2]+'"/></g>';
}
function cardArt(kind){
 let v='';
 if(kind==='blocks'){for(const [x,y] of [[85,46],[107,57],[63,57],[85,68],[85,23]])v+=cube(x,y,22);}
 if(kind==='fraction'){v='<g transform="rotate(-13 88 55)"><ellipse cx="85" cy="66" rx="40" ry="31" fill="#217e79"/><ellipse cx="85" cy="60" rx="40" ry="31" fill="#63c1a2"/><path d="M85 60 114 36a43 33 0 0 1 13 35Z" fill="#d3edca" stroke="#eaf7db" stroke-width="3"/><path d="m85 60-32-18m32 18-8 29m8-29 6-31" stroke="#d6f2df" stroke-width="2.5"/></g>';}
 if(kind==='digits'||kind==='sequence'){const vals=kind==='digits'?['١','٢','٣']:['٢','٤','٦'];const colors=kind==='digits'?['#faad76','#ed8765','#ca624c']:['#99cefd','#77abe5','#487ec9'];vals.forEach((t,i)=>{let x=38+i*31,y=67-i*9;v+='<g transform="rotate(-8 '+x+' '+y+')"><rect x="'+x+'" y="'+(y-19)+'" width="38" height="37" rx="8" fill="'+colors[2]+'"/><rect x="'+(x-2)+'" y="'+(y-22)+'" width="37" height="36" rx="8" fill="'+colors[i]+'"/><text x="'+(x+16)+'" y="'+(y+5)+'" font-size="24" font-family="Arial" fill="white" text-anchor="middle">'+t+'</text></g>';});}
 if(kind==='windows'){v='<g transform="translate(48 14) rotate(-7 40 40)"><path d="M0 76V40a37 37 0 0 1 74 0v36Z" fill="#9d4b70"/><path d="M6 70V39a31 31 0 0 1 62 0v31Z" fill="#9dcdda"/><path d="m10 62 45-42m-28 50 34-33" stroke="#d2f1f3" stroke-width="6"/><path d="M1 40h70M37 4v69" stroke="#df93aa" stroke-width="5"/><path d="M-5 74h84v7H-5Z" fill="#d58da1"/></g>';}
 if(kind==='bags'){v='<g transform="rotate(8 80 50)"><path d="M69 26q0-20 16-20t16 20" fill="none" stroke="#976138" stroke-width="7"/><rect x="51" y="18" width="70" height="72" rx="20" fill="#bd7b3d"/><rect x="47" y="15" width="67" height="70" rx="19" fill="#eab45e"/><rect x="55" y="47" width="52" height="30" rx="9" fill="#b98649"/><path d="M57 54h48" stroke="#f5cc82" stroke-width="3"/><path d="m79 22 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#fff0ba"/></g>';}
 return svgBox(170,100,v,'','card-art');
}
function textAt(x,y,t,size=13){return '<text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#302947" font-family="Arial,sans-serif" font-size="'+size+'">'+esc(t)+'</text>';}
function clockFace(hr,min){let body='<circle cx="65" cy="65" r="60" fill="#fcfbfa" stroke="#625188" stroke-width="4"/>';for(let n=1;n<=12;n++){let a=n*Math.PI/6;body+=textAt(65+47*Math.sin(a),70-47*Math.cos(a),arabic(n),14);}
 for(const [deg,len,width,color] of [[hr*30+min*.5,26,5,'#332c50'],[min*6,39,3,'#146d74']])body+='<path d="M65 65v-'+len+'" stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round" transform="rotate('+deg+' 65 65)"/>';
 return svgBox(130,130,body+'<circle cx="65" cy="65" r="4" fill="#372354"/>');}
function grid(cols,rows){
 let body='';for(let y=0;y<rows+2;y++)for(let x=0;x<cols+2;x++)body+='<rect x="'+(x*23+1)+'" y="'+(y*23+1)+'" width="23" height="23" fill="'+(x&&y&&x<=cols&&y<=rows?'#b2a5e7':'white')+'" stroke="#635680" stroke-width="1.2"/>';return svgBox(23*(cols+2)+2,23*(rows+2)+2,body,arabic(rows)+' صفوف مظللة، في كل منها '+arabic(cols)+' مربعات');}
function wedge(n,filled,colors){let content='';for(let i=0;i<n;i++){let a=-Math.PI/2+i*2*Math.PI/n,b=a+2*Math.PI/n;let pt=t=>(50+42*Math.cos(t))+' '+(50+42*Math.sin(t));content+='<path d="M50 50 L'+pt(a)+' A42 42 0 0 1 '+pt(b)+' Z" fill="'+(colors?colors[i]:(i<filled?'#64b69b':'#fff'))+'" stroke="#3c5151" stroke-width="1.7"/>';}return content;}
const optionNames={cube:'مكعب',cylinder:'أسطوانة',prism:'متوازي مستطيلات طويل',pyramid:'هرم',sphere:'كرة',pie1:'جزء مظلل من أربعة',pie2:'أربعة أجزاء مظللة من ثمانية',pie3:'جزآن مظللان من ستة',pie4:'أربعة أجزاء مظللة من سبعة',smallcircle:'دائرة صغيرة',smallsquare:'مربع صغير',bigcircle:'دائرة كبيرة',bigsquare:'مربع كبير',line1:'النقطة عند التدريجة الأولى بعد الصفر',line3:'النقطة عند التدريجة الثالثة بعد الصفر',line4:'النقطة عند التدريجة الرابعة بعد الصفر',line2:'النقطة عند التدريجة الثانية بعد الصفر',shirts35:'ثلاثة رموز ونصف',shirts40:'أربعة رموز',shirts45:'أربعة رموز ونصف',shirts50:'خمسة رموز'};
function shirt(){return '<svg aria-hidden="true" viewBox="0 0 32 34"><path d="m9 3-8 6 4 7 4-2v17h15V14l4 2 3-7-8-6-4 3h-6z" fill="#ecc867" stroke="#865f2c" stroke-width="1.5"/></svg>';}
function shirts(n){return '<span class="shirts" aria-hidden="true">'+Array.from({length:Math.ceil(n)},(_,i)=>'<i class="'+(i+1>n?'half':'')+'">'+shirt()+'</i>').join('')+'</span>';}
function optionArt(k){let name=optionNames[k],body='';
 if(k.startsWith('shirts'))return '<span role="img" aria-label="'+name+'">'+shirts(Number(k.slice(6))/10)+'</span>';
 if(k.startsWith('pie')){const [n,f]=[[4,1],[8,4],[6,2],[7,4]][Number(k.slice(3))-1];body=wedge(n,f);}
 else if(k.startsWith('line')){let j=Number(k.slice(4));body='<path d="M12 22h126" stroke="#516173" stroke-width="2"/>';for(let i=0;i<8;i++)body+='<path d="M'+(12+i*18)+' 17v10" stroke="#516173"/>';body+='<circle cx="'+(12+18*j)+'" cy="22" r="4.5" fill="#bd435c"/>'+textAt(12,40,'٠')+textAt(138,40,'١');return svgBox(150,46,body,name,'option-line');}
 else if(k.includes('circle')||k.includes('square')){let r=k.startsWith('big')?36:16;body=k.endsWith('circle')?'<circle cx="50" cy="50" r="'+r+'" fill="#79a9d1"/>':'<rect x="'+(50-r)+'" y="'+(50-r)+'" width="'+(2*r)+'" height="'+(2*r)+'" fill="#79a9d1"/>';}
 else if(k==='cube')body=cube(50,13,30,['#b8e0f2','#70b1da','#4486ba']);
 else if(k==='prism')body='<g transform="translate(14 -16) scale(.72 1.45)">'+cube(50,15,30,['#b8e0f2','#70b1da','#4486ba'])+'</g>';
 else if(k==='cylinder')body='<path d="M22 25v50c0 14 56 14 56 0V25" fill="#73b5db" stroke="#386585" stroke-width="2"/><ellipse cx="50" cy="25" rx="28" ry="11" fill="#c2e5ef" stroke="#386585" stroke-width="2"/>';
 else if(k==='pyramid')body='<path d="m50 12 42 59-43 17-40-20Z" fill="#82c9de" stroke="#407288" stroke-width="2"/><path d="m50 12-1 76 43-17Z" fill="#5296b3"/>';
 else if(k==='sphere')body='<circle cx="50" cy="50" r="36" fill="#8ac8e7" stroke="#507e9d" stroke-width="2"/><path d="M15 49q34 24 70 0" stroke="#5287a5" fill="none"/><ellipse cx="39" cy="33" rx="9" ry="5" fill="#cee9f5"/>';
 return svgBox(100,100,body,name,'option-art');}
function answerText(s){return s.startsWith('@')?optionNames[s.slice(1)]:s.startsWith('#')?s.slice(1).split('،').join(' ثم '):s.replace(/~/g,'');}
function sequence(items){return '<span dir="rtl" class="seq">'+items.map(x=>'<span>'+esc(x)+'</span>').join('<i>‹</i>')+'</span>';}
function option(s){if(s.startsWith('@'))return optionArt(s.slice(1));if(s.startsWith('#'))return sequence(s.slice(1).split('،'));return prose(s);}
function smallTable(head,rows){return '<table class="diagram-table"><thead><tr>'+head.map(t=>'<th>'+t+'</th>').join('')+'</tr></thead><tbody>'+rows.map(pair=>'<tr>'+pair.map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('')+'</tbody></table>';}
const sourcePics={cup:'كوب صغير',spoon:'ملعقة شاي',windows:'سبع نوافذ منها ثلاث مفتوحة',pattern:'في كل مجموعة خمسة أشكال متناظرة، وبين الدائرتين الصغيرتين مكان فارغ',picture:'لوحة عليها بطاقة سعر بقيمة ٧ ريالات',bags:'الزرقاء ٧٦٥٢ والحمراء ٥٢٧٦ والصفراء ٦٧٢٥ والخضراء ٢٥٦٧',sail:'شراع أصفر مقسّم إلى مربعات وأنصاف مربعات',lamps:'أربعة أعمدة بمصباحين وثلاثة أعمدة بمصباح واحد',flowers:'تبّاع شمس ثم وردتان جوريتان، ويتكرر النمط'};
function barChart(labels,values,step,limit,ytitle){let s='';for(let i=0;i<=limit;i+=step){let y=163-130*i/limit;s+='<path d="M60 '+y+'h245" stroke="#dedbe9"/>'+textAt(46,y+4,arabic(i),12);}labels.forEach((l,i)=>{let x=76+60*i,h=130*values[i]/limit;s+='<rect x="'+x+'" y="'+(163-h)+'" width="32" height="'+h+'" rx="3" fill="#7465b6"/>'+textAt(x+16,184,l,13);});s+=textAt(168,18,ytitle,14);return svgBox(326,196,s,labels.map((l,i)=>l+' '+arabic(values[i])).join('، '));}
function visual(id){
 if(!id)return '';
 let body='';
 if(sourcePics[id])body='<img class="source-pic image-'+id+'" src="'+asset(id+'.webp')+'" alt="'+esc(sourcePics[id])+'">';
 else if(id==='clock'||id==='clocks')body=id==='clock'?'<div class="clock" role="img" aria-label="العقرب القصير بعد الواحدة والطويل عند أربعة">'+clockFace(1,20)+'</div>':'<div class="two-clocks" role="img" aria-label="بدأ الساعة ٣:٣٠ وانتهى الساعة ٥:٠٠"><div>'+clockFace(3,30)+'<b>بدأ</b></div><div>'+clockFace(5,0)+'<b>انتهى</b></div></div>';
 else if(id==='grid18'||id==='grid20')body=id==='grid18'?grid(6,3):grid(5,4);
 else if(id==='block'){let v='';for(let z=0;z<2;z++)for(let y=0;y<2;y++)for(let x=0;x<3;x++)v+='<g stroke="#45366f" stroke-width=".85">'+cube(74+(x-y)*23,24+(x+y)*12+(1-z)*23,23)+'</g>';body=svgBox(180,130,v,'مجسم من طبقتين، في كل طبقة ثلاثة مكعبات طولًا ومكعبان عرضًا');}
 else if(id==='groups'){let v='';for(let y=0;y<3;y++){v+='<rect x="3" y="'+(4+y*32)+'" width="196" height="29" rx="14" fill="#f6f3ff" stroke="#8e7bc4"/>';for(let x=0;x<7;x++)v+='<circle cx="'+(19+x*27)+'" cy="'+(18+y*32)+'" r="10" fill="#b8a4eb"/>';}body=svgBox(203,100,v,'ثلاث مجموعات من سبع دوائر');}
 else if(id==='smile')body=svgBox(100,100,'<circle cx="50" cy="50" r="43" fill="#a2daba" stroke="#32624e" stroke-width="3"/><g fill="#294d41"><circle cx="34" cy="40" r="5"/><circle cx="66" cy="40" r="5"/></g><path d="M28 60q22 27 44 0" fill="none" stroke="#294d41" stroke-width="4" stroke-linecap="round"/>','وجه دائري بعينين متماثلتين وفم مبتسم');
 else if(id==='bagcubes'){let s='';['y','r','y','y','r','y','y'].forEach((c,i)=>s+=cube(21+32*i,15+(i%2)*15,14,c==='y'?['#ffe589','#edbd3c','#c6961a']:['#f79998','#dd5b63','#b93d4b']));body=svgBox(236,76,s,'خمسة مكعبات صفراء ومكعبان أحمران');}
 else if(id==='perimeter')body=svgBox(245,134,'<path d="M43 87 85 28h71l47 37-26 50Z" fill="#eee7fc" stroke="#7862ad" stroke-width="3"/>'+textAt(119,20,'٣ سم')+textAt(190,41,'٣ سم')+textAt(211,96,'؟ سم')+textAt(99,123,'٦ سم')+textAt(46,50,'٥ سم'),'مضلع أطوال أضلاعه ٥، ٣، ٣، مجهول، ٦ سنتيمترات');
 else if(id==='shapes')body=svgBox(342,50,[0,1].map((_,i)=>'<g transform="translate('+i*170+' 4)"><path d="m4 36 5-29h24l5 29z" fill="#88c6db"/><path d="m46 36 17-33 17 33z" fill="#b482ce"/><path d="m88 16 16-13 16 13-6 20H94z" fill="#79c9aa"/><rect x="128" y="9" width="37" height="27" fill="#db666c"/></g>').join(''),'يتكرر مستطيل أحمر وخماسي ومثلث وشبه منحرف');
 else if(id==='medals'||id==='pies'){const isMedal=id==='medals';const dot='<span class="table-dot '+(isMedal?'medal':'pie-dot')+'" aria-hidden="true"></span>';let symbol=n=>'<span role="img" aria-label="'+arabic(n).replace('٢.٥','رمزان ونصف')+' رموز">'+dot.repeat(Math.floor(n))+(n%1?'<span class="half-dot" aria-hidden="true"></span>':'')+'</span>';body=smallTable([isMedal?'الرياضة':'الفطيرة','الرموز'],isMedal?[['كرة القدم',symbol(2)],['الفروسية',symbol(4)],['السباحة',symbol(1)]]:[['الجبن',symbol(2)],['اللحم',symbol(3)],['الزعتر',symbol(2.5)]])+'<small>الرمز الكامل يمثّل '+(isMedal?'ميداليتين':'طالبين')+'</small>';}
 else if(id==='trapezoid')body=svgBox(210,105,'<path d="M12 12h183l-15 80H66Z" fill="#d4d3ed" stroke="#665787" stroke-width="3"/>','شبه منحرف مختلف الساقين');
 else if(id==='numberline'){let s='<path d="M18 45h324" stroke="#5c477d" stroke-width="2"/>';for(let i=0;i<=20;i++){let x=20+i*16;s+='<path d="M'+x+' '+(i%5?40:37)+'v'+(i%5?10:16)+'" stroke="#5c477d"/>';if(i%5===0)s+=textAt(x,70,arabic(150+2*i));}[[3,'س'],[8,'ص'],[12,'ك'],[18,'م']].forEach(([i,l])=>s+='<circle cx="'+(20+i*16)+'" cy="45" r="4" fill="#77529c"/>'+textAt(20+i*16,29,l));body=svgBox(360,83,s,'خط أعداد من ١٥٠ إلى ١٩٠ بخطوات من اثنين. س عند ١٥٦، ص عند ١٦٦، ك عند ١٧٤، م عند ١٨٦');}
 else if(id==='grades')body=barChart(['٤','٦','٨','١٠'],[5,3,6,4],1,7,'عدد الطلاب لكل درجة');
 else if(id==='birds')body=barChart(['الحمام','الدجاج','البط','العصافير'],[56,38,46,62],10,70,'عدد الطيور');
 else if(id==='spinner')body=svgBox(100,100,wedge(8,0,['#86b5db','#86b5db','#86b5db','#86b5db','#86b5db','#e77879','#e77879','#5cb681'])+'<path d="M50 53v-30m-4 5 4-7 4 7" stroke="#503d4b" stroke-width="3" fill="#edd080"/><circle cx="50" cy="50" r="4" fill="#fff2bd"/>','ثمانية أقسام متساوية، واحد أخضر وخمسة زرقاء واثنان أحمران');
 else if(id==='seq1')body=sequence(['٥','١٠','١٥','□','٢٥']);
 else if(id==='seq2')body=smallTable(['اليوم','السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'],[['الصفحات','٣','٦','٩','١٢','١٥','؟']]);
 else if(id==='seq3')body=sequence(['١٣','□','١٧','١٩','□','٢٣']);
 else if(id==='saving')body=smallTable(['اليوم','الأول','الثاني','الثالث','الرابع'],[['المبلغ بالريال','٤','٨','١٢','١٦']]);
 else if(id==='expand')body=prose('~٨٠٠ + ٥٠ + ٦~');
 else if(id==='missing')body=prose('~٤١١ + ٣٢٢ + □ = ٨٨٨~');
 else if(id==='rects'){let s='';for(let y=0;y<4;y++)for(let x=0;x<11;x++)s+='<rect x="'+(x*22+2)+'" y="'+(y*22+19)+'" width="22" height="22" fill="'+(x>=1&&x<=3&&y>=1&&y<=2?'#99c6e4':x>=6&&x<=9&&y===2?'#e9aaba':'#fff')+'" stroke="#958caa"/>';body=svgBox(248,116,s+textAt(174,15,'المستطيل ١')+textAt(55,15,'المستطيل ٢'),'الأول أربعة مربعات في صف واحد. الثاني ثلاثة مربعات في صفّين');}
 else if(id==='shirts')body=smallTable(['اليوم','القمصان المبيعة'],[['الأول',shirts(5)],['الثاني',shirts(3.5)],['الثالث','؟']])+'<small>كل رمز كامل يمثّل ١٠ قمصان</small>';
 else if(id==='triangle'){body='<div class="towers">'+[['١٢','٢','٦'],['١٥','٣','٥'],['١٨','٦','٣'],['٢١','٧','؟']].map(t=>'<div><b>'+t[0]+'</b><span>'+t[1]+'</span><span>'+t[2]+'</span></div>').join('')+'</div>';}
 else if(id==='photos')body=smallTable(['الطالب','عدد الصور'],[['بدر','١٢٦'],['فهد','١١٢']]);
 return '<div class="visual vis-'+id+'">'+body+'</div>';
}
