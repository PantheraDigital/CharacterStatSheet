const statMap = new Map();
var profBonus = document.getElementById("prof").value;

FillSkillBlock();
FillSavingThrowBlock();

//add event listners to stat inputs and set scores in statMap
document.querySelectorAll(".stat-box").forEach((element) => {
  element.addEventListener("input", function (e) {
    CheckInputValueInRange(element.querySelector(".ability-score"), 1, 30);
    UpdateStatMod(e);
    UpdateSavingThrows(element.querySelector(".ability-score").id);
    UpdateSkill("all");
  });

  var score = element.querySelector(".ability-score");
  statMap.set(score.id, score.value);
  //console.log(score.id + " " + statMap.get(score.id));
});

//add event listener to proficiency bonus input
document.getElementById("prof").addEventListener("input", function (e) {
  CheckInputValueInRange(e.currentTarget, 2, 6);
  UpdateProfBonus(e);
  UpdateSavingThrows("all");
  UpdateSkill("all");
});

//add event listeners to saving throws checkboxes
document.getElementById("saving-throws").querySelectorAll('input[type="checkbox"]').forEach((element) => {
  if(element.id.split('-')[1] === "save"){
    element.addEventListener("input", function (e) {
      UpdateSavingThrows(element.id.split('-')[0]);
    });
  }
});


document.getElementById("skills").querySelectorAll('input[type="checkbox"]').forEach((element) => {
    element.addEventListener("input", function (e) {
      UpdateSkill(element.id);
    });
});

UpdateSavingThrows("all");
UpdateSkill("all");


function CalcStatMod(score){
  return Math.floor((score - 10) / 2);
}
function CalcStatBonus(stat, hasProf){
  if(statMap.has(stat)){
    var bonus = CalcStatMod(statMap.get(stat));
    return hasProf ? Number(bonus) + Number(profBonus) : Number(bonus);
  }
  else{
    return 0;
  }
}

function CheckInputValueInRange(inputElement, min, max){
  if(inputElement.value > max){
    inputElement.value = max;
  }
  if(inputElement.value < min){
    inputElement.value = min;
  }
}

function UpdateStatMod(event) {
  var score = event.currentTarget.querySelector(".ability-score");
  var mod = event.currentTarget.querySelector(".stat-mod");
  if (score !== null && mod !== null && score.value >= 1 && score.value < 31) {
    var modValue = CalcStatMod(score.value);
    if (modValue >= 0) 
      modValue = "+" + modValue;

    mod.innerHTML = modValue;
    statMap.set(score.id, score.value);
  }
}

function UpdateProfBonus(event){
  profBonus = event.currentTarget.value;
}

function UpdateSavingThrows(stat){
  if(stat === "all"){
    var labels = document.getElementById("saving-throws").getElementsByTagName('label');
    for(var i = 0; i < labels.length; i++){
      var prefix = labels[i].htmlFor.split('-')[0];
      if(statMap.has(prefix)){
        var checkboxChecked = document.getElementById(labels[i].htmlFor).checked;
        var bonus = CalcStatBonus(prefix, checkboxChecked);
        if(bonus >= 0)
          labels[i].getElementsByTagName('span')[0].innerHTML = '+' + bonus;
        else
          labels[i].getElementsByTagName('span')[0].innerHTML = bonus;
      }
    }
  }
  else{
    var label = FindLableForSaveStat(stat);
    var checkboxChecked = document.getElementById(label.htmlFor).checked;
    var bonus = CalcStatBonus(stat, checkboxChecked);
    if(bonus >= 0)
      label.getElementsByTagName('span')[0].innerHTML = '+' + bonus;
    else
      label.getElementsByTagName('span')[0].innerHTML = bonus;
  }
}

function UpdateSkill(skill){
  if(skill === "all"){
    var labels = document.getElementById("skills").getElementsByTagName('label');
    for(var i = 0; i < labels.length; i++){
      var checkboxChecked = document.getElementById(labels[i].htmlFor).checked;
      var bonus = CalcStatBonus(labels[i].getAttribute("data-stat-type"), checkboxChecked);
      if(bonus >= 0)
        labels[i].getElementsByTagName('span')[0].innerHTML = '+' + bonus;
      else
        labels[i].getElementsByTagName('span')[0].innerHTML = bonus;
    }
  }
  else{
    var label = FindLableForSkill(skill);
    var checkboxChecked = document.getElementById(label.htmlFor).checked;
    var bonus = CalcStatBonus(label.getAttribute("data-stat-type"), checkboxChecked);
    if(bonus >= 0)
      label.getElementsByTagName('span')[0].innerHTML = '+' + bonus;
    else
      label.getElementsByTagName('span')[0].innerHTML = bonus;
  }
}


function FindLableForSaveStat(stat) {
  var labels = document.getElementById("saving-throws").getElementsByTagName('label');
  for( var i = 0; i < labels.length; i++ ) {
    var prefix = labels[i].htmlFor.split('-')[0];
    if(statMap.has(prefix) && prefix === stat)
      return labels[i];
  }
}
function FindLableForSkill(skill){
  var labels = document.getElementById("skills").getElementsByTagName('label');
  for( var i = 0; i < labels.length; i++ ) {
    if(labels[i].htmlFor === skill)
      return labels[i];
  }
}


function FillSkillBlock(){
  /*
  skill structure
  <input type="checkbox" class="buble-check" id="acrobatics"/>
  <label for="acrobatics" data-stat-type="dex" class="capitalize">
    <span>_</span> acrobatics <span class="skill-type">(dex)</span>
  </label>
  <br> 
   */
  var skillBlock = document.getElementById("skills");
  const skills = ["acrobatics_dex", "animal-handling_wis", "arcana_int", "athletics_str", "deception_cha", "history_int", "insight_wis", "intimidation_cha", "investigation_int", "medicine_wis", "nature_int", "perception_wis", "performance_cha", "persuasion_cha", "religion_int", "sleight-of-hand_dex", "stealth_dex", "survival_wis"];

  for(var i = skills.length - 1; i >= 0; i--){
    var skill = skills[i].split("_");
    //<input type="checkbox" class="buble-check" id="acrobatics"/>
    var inputNode = document.createElement("input");
    inputNode.type = "checkbox";
    inputNode.className = "buble-check";
    inputNode.id = skill[0];

    //<label for="acrobatics" data-stat-type="dex"><span>_</span> Acrobatics (dex)</label>
    var inputLabel = document.createElement("label");
    inputLabel.htmlFor = skill[0];
    inputLabel.setAttribute("data-stat-type", skill[1]);
    inputLabel.className = "capitalize";
    inputLabel.innerHTML = `<span>_</span> ${skill[0].replace(/-/g, " ")} <span class="skill-type">(${skill[1]})</span>`;
    
    
    skillBlock.insertBefore(document.createElement("br"), skillBlock.firstChild);
    skillBlock.insertBefore(inputLabel, skillBlock.firstChild);
    skillBlock.insertBefore(inputNode, skillBlock.firstChild);
  }
}
function FillSavingThrowBlock(){
  /*
  save structure
  <input type="checkbox" class="buble-check" id="str-save"/>
  <label for="str-save">
    <span>_</span> Strength
  </label>
  <br>
  */
  var savingThrowBlock = document.getElementById("saving-throws");
  const saves = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  for(var i = saves.length - 1; i >= 0; i--){
    var inputNode = document.createElement("input");
    inputNode.type = "checkbox";
    inputNode.className = "buble-check";
    inputNode.id = saves[i].substring(0, 3) + "-save";

    var inputLabel = document.createElement("label");
    inputLabel.htmlFor = saves[i].substring(0, 3) + "-save";
    inputLabel.className = "capitalize";
    inputLabel.innerHTML = `<span>_</span> ${saves[i]}`;

    savingThrowBlock.insertBefore(document.createElement("br"), savingThrowBlock.firstChild);
    savingThrowBlock.insertBefore(inputLabel, savingThrowBlock.firstChild);
    savingThrowBlock.insertBefore(inputNode, savingThrowBlock.firstChild);
  }
}



const dropdownArray = document.getElementsByClassName("dropdown-wrapper");
for (let i = 0; i < dropdownArray.length; i++) {
  var body = dropdownArray[i].querySelector(".dropdown-body");
  var header = dropdownArray[i].querySelector(".dropdown-header");

  //add folding logic
  header.querySelector("span").addEventListener("touchstart", FoldDropdownText);
  header.querySelector("span").addEventListener("mouseup", function(e) {
      if(e.button == 0)
          FoldDropdownText(e);
  });

  //add ability trackers
  var addCheck = header.querySelector('input[name="add-check"]');
  if(addCheck)
    addCheck.addEventListener("click", AddBubleCheck);
  //remove ability tracker
  var removeCheck = header.querySelector('input[name="remove-check"]');
  if(removeCheck)
    removeCheck.addEventListener("click", RemoveBubleCheck);

  //text spellcheck logic
  var txt = body.querySelector(".editable-text");
  if(txt !== null){
    txt.addEventListener("focus", function (e) {e.currentTarget.spellcheck = true;});
    txt.addEventListener("blur", function (e) {e.currentTarget.spellcheck = false;});
  }
}



function FoldDropdownText(event) {
  var header = event.currentTarget.parentElement;
    var body = header.parentElement.querySelector(".dropdown-body");

    if (header !== null && body !== null) {
        var spn = header.querySelector("span");
        if (spn !== null) {
            if (spn.innerHTML == "-")
                spn.innerHTML = "+";
            else
                spn.innerHTML = "-";
        }
        if(body.classList.contains("folded-body")){
          body.classList.remove("folded-body");
          body.querySelector(".editable-text").contentEditable = true;
        }
        else if(body.classList.contains("folded-body-small")){
          body.classList.remove("folded-body-small");
          body.querySelector(".editable-text").contentEditable = true;
        }
        else{
          body.querySelector(".editable-text").contentEditable = false;
          if(body.querySelector("ul").getElementsByTagName("li").length > 0){
            body.classList.add("folded-body");
          }
          else{
            body.classList.add("folded-body-small");
          }
        }
    }
    event.preventDefault();
}

function AddBubleCheck(event){
  var body = event.currentTarget.parentElement.parentElement.querySelector(".dropdown-body");
  var ul = body.querySelector("ul");

  //<li><input type="checkbox" class="buble-check"/></li>
  var check = document.createElement("input");
  check.type = "checkbox";
  check.name = "ability-tracker-buble";
  check.className = "buble-check";

  var li = document.createElement("li");
  li.appendChild(check);
  li.style.display = "inline-block";

  ul.appendChild(li);

  if(body.classList.contains("folded-body-small")){
    body.classList.remove("folded-body-small");
    body.classList.add("folded-body");
  }

  event.preventDefault();
}

function RemoveBubleCheck(event){
  var body = event.currentTarget.parentElement.parentElement.querySelector(".dropdown-body");
  var ul = body.querySelector("ul");
  if(ul && ul.lastChild)
    ul.removeChild(ul.lastChild);

  if(ul.getElementsByTagName("li").length <= 0){
    if(body.classList.contains("folded-body")){
      body.classList.add("folded-body-small");
      body.classList.remove("folded-body");
    }
  }

  event.preventDefault();
}


document.getElementById("abilities").querySelector('input[value="+"]').addEventListener("click", function (e) {
  /*<div class="dropdown-wrapper">
      <div class="dropdown-header">
        <span>-</span>
        <input type="text" name="ability-name" value="Ability">
        <input type="button" name="add-check" value="+">
        <input type="button" name="remove-check" value="-">
      </div>
      <div class="dropdown-body">
        <ul class="ability-uses"></ul>
        <div contenteditable="true" class="editable-text">Ability description</div>
        <input type="button" name="remove-dropdown" value="remove">
      </div>
    </div> */
    var wrapper = document.createElement("div");
    wrapper.className = "dropdown-wrapper";
    //
    var header = document.createElement("div");
    header.className = "dropdown-header";
    ////
    var spn = document.createElement("span");
    spn.innerHTML = '-';

    var abilityName = document.createElement("input");
    abilityName.type = "text";
    abilityName.name = "ability-name";
    abilityName.value = "Ability Name";

    var addCheck = document.createElement("input");
    addCheck.type = "button";
    addCheck.name = "add-check";
    addCheck.value = '+';

    var removeCheck = document.createElement("input");
    removeCheck.type = "button";
    removeCheck.name = "remove-check";
    removeCheck.value = '-';
    ////
    var body = document.createElement("div");
    body.className = "dropdown-body";
    ////
    var ul = document.createElement("ul");
    ul.className = "ability-uses";

    var abilityDesc = document.createElement("div");
    abilityDesc.contentEditable = true;
    abilityDesc.className = "editable-text";
    abilityDesc.innerHTML = "Ability Description";

    var removeDropdown = document.createElement("input");
    removeDropdown.type = "button";
    removeDropdown.name = "remove-dropdown";
    removeDropdown.value = 'remove';
    ////
    //
    
    header.append(spn, abilityName, addCheck, removeCheck);
    body.append(ul, abilityDesc, removeDropdown);

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    e.currentTarget.parentElement.appendChild(wrapper);

    spn.addEventListener("touchstart", FoldDropdownText);
    spn.addEventListener("mouseup", function(e) { if(e.button == 0){FoldDropdownText(e)} });

    addCheck.addEventListener("touchstart", AddBubleCheck);
    addCheck.addEventListener("mouseup", AddBubleCheck);

    removeCheck.addEventListener("touchstart", RemoveBubleCheck);
    removeCheck.addEventListener("mouseup", RemoveBubleCheck);

    abilityDesc.addEventListener("focus", function (e) {e.currentTarget.spellcheck = true;});
    abilityDesc.addEventListener("blur", function (e) {e.currentTarget.spellcheck = false;});

    removeDropdown.addEventListener("touchstart", function(e) {e.currentTarget.parentElement.parentElement.remove(); e.preventDefault();});
    removeDropdown.addEventListener("mouseup", function(e) {e.currentTarget.parentElement.parentElement.remove(); e.preventDefault();});
  });