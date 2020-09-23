import { Domain } from './domain';
import * as fs from 'fs';
import {partial_ratio} from 'fuzzball';



export function onDeleteDomain(name : string, date : string, id : number){
  // console.log(domains.join('\n'));
  var domains : Domain[] = [];
  var historyText : string = fs.readFileSync('./assets/history.txt', 'utf-8');
  // console.log(historyText);
  historyText.split('\n').forEach((line)=>{
    var splittedLine = line.split(';,;');
    if(splittedLine[1]!=undefined){
      var domain : Domain = new Domain(splittedLine[0], splittedLine[1], new Date(Date.parse(splittedLine[2])), splittedLine[3], splittedLine[4]);
      domains.push(domain);
    }
  });
  const index : number = domains.findIndex((value)=>value.name==name && value.sendDate.toString()==date);
  console.log(index);
  document.getElementById('card'+id.toString())?.remove();
  if (index > -1) {
    domains.splice(index, 1);
  }
  fs.writeFileSync('./assets/history.txt', domains.join('\n'), { flag: 'w' });
}

export function loadHistory() : void{
  // console.log('start');
  // var history : Domain[] = [];
  var domains : Domain[] = [];
  var historyText : string = fs.readFileSync('./assets/history.txt', 'utf-8');
  // console.log(historyText);
  historyText.split('\n').forEach((line)=>{
    var splittedLine = line.split(';,;');
    if(splittedLine[1]!=undefined){
      var domain : Domain = new Domain(splittedLine[0], splittedLine[1], new Date(Date.parse(splittedLine[2])), splittedLine[3], splittedLine[4]);
      domains.push(domain);
    }
  });
  let index = 0;
  domains.forEach(domain => {
    let inner = `
        <div class="card-content black-text">
            <span class="card-title">${domain.name}</span>
            <blockquote>
                <p>Beküldő: ${domain.sender}</p>
                <p>Regisztráció időpontja: ${domain.sendDate.toDateString()}</p>
                <p>Panasz benyújtásának határideje: ${domain.deadlineDate.toDateString()}</p>
                <p>Kulcsszó: ${domain.matchingKey}</p>
            </blockquote>
            <div class="row">
                <a class="waves-effect waves-light btn-flat" href="http://www.domain.hu/domain/varolista/${domain.url}" target="_blank">Részletek</a>
                <a class="waves-effect waves-light btn-flat" onclick="onDeleteDomain('${domain.name}', '${domain.sendDate}', ${index})">Törlés</a>
            </div>
        </div>
    `;
    var element = document.createElement('div');
    element.classList.add('card');
    element.id="card"+index.toString();
    element.innerHTML=inner;
    document.getElementById('result-column')?.appendChild(element);
    index++;
  });
}

export function onClick() : void {
  var domains : Domain[] = [];
  let loader = document.getElementById('loadingDiv');
  if(loader){
      loader.style.visibility="visible";
  }
  var request = new XMLHttpRequest();
  request.open('GET', 'http://www.domain.hu/domain/varolista/ido.html', true);
  request.overrideMimeType('text/html; charset=iso-8859-2');
  
  request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
          
          var element = document.createElement('html');
          element.innerHTML=this.response;
          var elements = element.getElementsByTagName('table')[0].getElementsByTagName('tr');
          var alreadyFoundDomains : Domain[] = [];
          var alreadyFound : string = fs.readFileSync('./assets/alreadyFound.txt', 'utf-8');
          alreadyFound.split('\n').forEach((line)=>{
            var splittedLine = line.split(';,;');
            var domain : Domain = new Domain(splittedLine[0], splittedLine[1], new Date(Date.parse(splittedLine[2])), splittedLine[3], splittedLine[4]);
            alreadyFoundDomains.push(domain);
          });
          var keywords : string[] = [];
          fs.readFileSync('./assets/keywords.txt', 'utf-8').split(';').forEach((keyword)=>{
              keywords.push(keyword);
          });
        
          for (let i = 1; i < elements.length; i++) {
              const element = elements[i];
              const tds = element.getElementsByTagName('td');
              var first = tds[4].innerHTML.indexOf('"');
              var last = tds[4].innerHTML.lastIndexOf('"');
              keywords.forEach((keyword)=>{
                  let needs = 100;
                  if (keyword.length > 3)
                  {
                  needs = (keyword.length - 1) * 100 / keyword.length;
                  }
                  if(partial_ratio(keyword, tds[1].innerText)>needs &&
                  !alreadyFoundDomains.some((value) => (value.name==tds[1].innerText && value.sendDate.toDateString()==(new Date(Date.parse(tds[3].innerText)).toDateString())))
                  ){
                      var domain = new Domain(tds[1].innerText, tds[2].innerText, new Date(Date.parse(tds[3].innerText)), tds[4].innerHTML.substring(first+1, last), keyword);
                      domains.push(domain);
                  }
              });
              
          }
          console.log(domains.join('\n'));
          let index = 0;
          domains.forEach(domain => {
              let inner = `
                  <div class="card-content black-text">
                      <span class="card-title">${domain.name}</span>
                      <blockquote>
                          <p>Beküldő: ${domain.sender}</p>
                          <p>Regisztráció időpontja: ${domain.sendDate.toDateString()}</p>
                          <p>Fellebbezés határideje: ${domain.deadlineDate.toDateString()}</p>
                          <p>Kulcsszó: ${domain.matchingKey}</p>
                      </blockquote>
                      <div class="row">
                          <a class="waves-effect waves-light btn-flat" href="http://www.domain.hu/domain/varolista/${domain.url}" target="_blank">Részletek</a>
                          <a class="waves-effect waves-light btn-flat" onclick="onDeleteDomain('${domain.name}', '${domain.sendDate}', ${index})">Törlés</a>
                      </div>
                  </div>
              `;
              var element = document.createElement('div');
              element.classList.add('card');
              element.id="card"+index.toString();
              element.innerHTML=inner;
              document.getElementById('result-column')?.appendChild(element);
              index++;
          });
          if(domains.length>0){
              fs.appendFile('./assets/alreadyFound.txt', domains.join('\n'), function(err) {
                if (err) 
                  return console.error(err);
                console.log('Saved!');
              });
              fs.appendFile('./assets/history.txt', domains.join('\n'), function(err) {
                if (err) 
                  return console.error(err);
                console.log('Saved!');
              });
          }
          if(loader){
              loader.style.visibility="hidden";
          }
      } else {
      }
  };
  request.send();
}
