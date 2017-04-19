(function() {
  "use strict";

  angular.module('QuizApp', [])
  .controller('QuizController', QuizController)
  .service("QuizQuestionsService", QuizQuestionsService);


// main controller for the quiz application
  QuizController.$inject = ['QuizQuestionsService'];
  function QuizController(QuizQuestionsService) {
    var vm = this;
    vm.currentQuestion = {};
    vm.counter = 0;
    vm.score = 0;
    vm.askedQuestionList = [];

    // Initial service call to get the list of the questions
    getQuestionsFromService();

    // Function that calls the function in the service to get the list of the questions
    function getQuestionsFromService() {
      var promise = QuizQuestionsService.getQuestions();
      promise.then(function(response) {
        // console.log(response);
        vm.questionsList = response.data;
        vm.totalCount = response.data.length;
        getCurrentQuestion();
      });
    }

    // get the question that needs to be displayed on the screen
    function getCurrentQuestion() {
      var index = Math.floor(Math.random() * vm.totalCount);
      // checking if the question has not been asked earlier. Do not want to repeat the questions again
      if(!vm.askedQuestionList.includes(index)) {
        vm.showNextBtn = false;
        vm.currentQuestion = vm.questionsList[index];
        vm.counter++;
        vm.askedQuestionList.push(index);

        $('#answersButtonContainer .button').removeClass('disabledButton');
        $('#answersButtonContainer .button').removeClass('correctAns');
        $('#answersButtonContainer .button').removeClass('wrongAns');

      } else if(vm.askedQuestionList.length < vm.totalCount){
        getCurrentQuestion();
      } else {
        vm.status = "You have completed the quiz with score : " + vm.score;
        $('#navigationContainer .button').remove();
      }
    }

    vm.getNextQuestion = function() {
      getCurrentQuestion();
    };

//  Function to check the answer provided by the candidate and adding the currect class to the button as well as the correct message for the user
    vm.checkAnswer = function(evt, data) {

      if (!$(evt.target).hasClass('disabledButton')) {
        $('#answersButtonContainer .button').addClass('disabledButton');
        vm.showNextBtn = true;
        if(data == vm.currentQuestion.answer) {
          vm.score++;
          vm.status = "Your answer is correct !!";
          $(evt.target).addClass('correctAns');
        } else {
          vm.status = "Your answer is not correct !!";
          $(evt.target).addClass('wrongAns');
        }
      }

    }

  }

// service to get the list of questions from the API
  QuizQuestionsService.$inject = ['$q', '$http'];
  function QuizQuestionsService($q, $http) {
    var quizQuestions = this;

    quizQuestions.getQuestions = function() {
      var deferred = $q.defer();

      $http.get("https://cdn.rawgit.com/santosh-suresh/39e58e451d724574f3cb/raw/784d83b460d6c0150e338c34713f3a1c2371e20a/assignment.json")
      .then(function(data) {
          deferred.resolve(data);
        },
        function(errorMsg) {
          console.log(errorMsg);
        }
      );

      return deferred.promise;

    }

  }

})();
