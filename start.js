let quesNo = document.querySelector("#num");
let category = document.querySelector("#category");
let level = document.querySelector("#level");
let submitBtn = document.querySelector(".submit"),
    next = document.querySelector(".next");
let time,
    score = 0,
    timer,
    currentQuestion = 1;
let totalTime = document.querySelector("#time");
let answerWraper = document.querySelector(".answerwrapper");
let sec = document.querySelector(".sec");
let questions = [];

//display quiz page and fetch API
function displayQuiz(){
  document.querySelector(".formPage").style.display = "none";
  document.querySelector(".quizPage").style.display = "block";
  
  fetch(`https://opentdb.com/api.php?amount=${quesNo.value}&category=${category.value}&difficulty=${level.value}`).then(res=> res.json())
  .then((data)=> {
    questions = data.results;
    showQuestion(questions[0]);
  });
}
//To start quiz 
function getQuis(){
  if(quesNo.value > 50 || quesNo.value === "" || quesNo === 0){
     document.querySelector(".form .error").style.display= "block";
    return;
  } 
  else if(totalTime.value > 30 || totalTime.value === "" || totalTime === 0){
    document.querySelector(".form .error1").style.display= "block";
    return;
  }
  displayQuiz();
}

// dispay questions
function showQuestion(question){
  //quiz category
  document.querySelector(".topic h2").innerHTML = `${question.category}`;
  //quiz question
  document.querySelector(".row h1").innerHTML = `${questions.indexOf(question)+1})  ${question.question}`;
  //get list of answers in array
  let answers = [...question.incorrect_answers, question.correct_answer.toString()];
  //shuffle correct_answer
  answers.sort(()=>Math.random() - 0.5);
  //correct answer
  let correctAns = question.correct_answer.toString();
//list of all answers
answerWraper.innerHTML = "";
 answers.forEach(answer=>{
    answerWraper.innerHTML += ` <div class="answer">
          <span class="title">${answer}</span>
          <span class="mark">✓</span>
        </div>`;
  });
  //question pages
  document.querySelector(".pages").innerHTML = `
   <span class="current">Question ${questions.indexOf(question)+1}</span>
        <span>/</span>
        <span class="total">${questions.length}</span>
        `;

let ansList = document.querySelectorAll(".answer");
ansList.forEach((answer)=>{
  answer.addEventListener("click",()=>{
    //answer not already submitted
  if(!answer.classList.contains("checked")){
    //remove selected from other answer
    ansList.forEach((answer)=>{
      answer.classList.remove("selected");
    })
    //add selected on currently clicked
    answer.classList.add("selected");
    //enable submit btn after any answer
    submitBtn.disabled = false;
  }
  });
});

// timer
time = totalTime.value;
startTimer(time);
}

function startTimer(time){
  timer = setInterval(()=>{
    if(time > 0){
      time--;
      sec.innerHTML = "Time: " + time;
    }
    else{
       checkAnswer();
    }
  }, 1000);
}
//submit answer button
submitBtn.addEventListener("click", ()=>{
  checkAnswer();
});

// check answer
function checkAnswer(){
  clearInterval(timer);
  let selectedAns = document.querySelector(".answer.selected");

  if(selectedAns){
    let ans = selectedAns.querySelector(".title");
    if(ans.innerHTML === questions[currentQuestion -1].correct_answer){
      score++;
      selectedAns.classList.add("correct");
    }
    else{
       selectedAns.classList.add("wrong");
     const correctAnswer = document.querySelectorAll(".answer").forEach((answer)=>{
      if(answer.querySelector(".title").innerHTML === questions[currentQuestion - 1].correct_answer){
        answer.classList.add("correct");
      }
     });
    }
  }
  // select answer if user did not select answer on time
  else{
    const correctAnswer = document.querySelectorAll(".answer").forEach((answer)=>{
      if(answer.querySelector(".title").innerHTML === questions[currentQuestion - 1].correct_answer){
        answer.classList.add("correct");
      }
     });
  }
// to select correct answer
  const ansDiv = document.querySelectorAll(".answer");
  ansDiv.forEach((answer)=>{
    answer.classList.add("checked");
  });
//display next button and hide submit btn
  submitBtn.style.display = "none";
  next.style.display="block";
};

//next button
next.addEventListener("click", ()=>{
  nextQuestion();
  // show submit button
  submitBtn.style.display = "block";
  next.style.display="none";
})

function nextQuestion(){
  //if theres remaining question
    if(currentQuestion < questions.length){
      currentQuestion++;

      showQuestion(questions[currentQuestion - 1]);
    }else{
        showResult();
    }
}

function showResult(){
  document.querySelector(".resultPage").style.display = "block";
  document.querySelector(".head").style.display = "none";
  document.querySelector(".quizPage").style.display = "none";
  let percent = (score / questions.length) * 100;
  document.querySelector(".resultPage span").innerHTML = `
 Your Score: ${score} / ${questions.length}
  `;
  document.querySelector(".resultPage .rate").innerHTML = percent + "% Score";
}