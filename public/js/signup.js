// // TEST TO COMPARE ELEMENTS (this case are dates)
// window.onload = function () {
//   document.getElementById("form1").onsubmit = function () {
//     var name1 = document.getElementById("name1");
//     var name2 = document.getElementById("name2");
//     var date1 = document.getElementById("date1");
//     var date2 = document.getElementById("date2");
//     if ((new Date(date1.value)).getTime() < (new Date(date2.value)).getTime()){
//       console.log(name1.value + " is greater than " + name2.value)}
//     else if ((new Date(date1.value)).getTime() > (new Date(date2.value)).getTime()){
//       console.log(name2.value + " is greater than " + name1.value)}
//     else{
//       console.log(name2.value + " and " + name1.value + " are of same age.")};
//   };
// };

// //this would go on the .hbs file
// <form id="form1">
//   Full name of first person: <input type="text" id="name1"></input><br></br>
//   Birthday: <input type="date" id="date1"></input><br></br>
//   <br></br>
//   Full name of second person: <input type="text" id="name2"></input><br></br>
//   Birthday: <input type="date" id="date2"></input><br></br>
//   <input type="submit" value="Check"></input>
// </form>;

////
////
////
//START OF SIGNUP VALIDATION
class Signup {
  constructor(){
      this.nameInput = document.querySelector("#fullname");
      this.emailInput = document.querySelector("#email");
      this.passwordInput = document.querySelector("#password");
      this.repeatPasswordInput = document.querySelector("#repeat-password");
      this.buttonInput = document.querySelector("#signup-button");
      this.errorsWrapper = document.querySelector(".message-container");

  }

handleEmailInput = (event) => {
  const email = event.target.value;

  validator.validateValidEmail(email);

  const errors = validator.getErrors();

  if (!errors.invalidEmailError) {
    validator.validateUniqueEmail(email);
  }

  this.setErrorMessages();
  this.checkButton();
}

handlePasswordInput = (event) => {
  const password = event.target.value;
  const passwordRepeat = this.repeatPasswordInput.value;

  validator.validatePassword(password);
  validator.validatePasswordRepeat(password, passwordRepeat);

  this.setErrorMessages();

  this.checkButton();
}

handleRepeatPasswordInput = (event) => {
  const passwordRepeat = event.target.value;
  const password = this.passwordInput.value;

  validator.validatePassword(password);
  validator.validatePasswordRepeat(password, passwordRepeat);

  this.setErrorMessages();

  this.checkButton();
}

saveData = (event) => {

  event.preventDefault();

  const name = this.nameInput.value;
  const email = this.emailInput.value;
  const password = this.passwordInput.value;
  const repeatPassword = this.repeatPasswordInput.value;


  const newUser = new User(name, email, password);

  db.saveNewUser( newUser );

  this.nameInput.value = "";
  this.emailInput.value = "";
  this.passwordInput.value = "";
  this.repeatPasswordInput.value = "";

  this.showSuccessMessage();
  this.removeMessages();

  validator.resetValidator();
  this.buttonInput.disabled = true;
}

  addListeners = () => {
  this.emailInput.addEventListener("input", this.handleEmailInput );
  this.passwordInput.addEventListener("input", this.handlePasswordInput);
  this.repeatPasswordInput.addEventListener("input", this.handleRepeatPasswordInput);

  this.buttonInput.addEventListener("click", this.saveData);

}

showSuccessMessage = () => {
  this.errorsWrapper.innerHTML = "";

  const errorsObj = validator.getErrors();
  const errorsStringsArr = Object.values(errorsObj);

  if (errorsStringsArr.length > 1) {
    return;
  }

  const successMessageP = document.createElement('p');
  successMessageP.innerHTML = "Your account has been created! Yey! &#128079";

  this.errorsWrapper.appendChild(successMessageP);

}
  checkButton = () => {
      const errorsObj = validator.getErrors();
      const errorsArr = Object.values(errorsObj);
      
  
      if(errorsArr.length > 0) {
        this.buttonInput.disabled = true;
      }
      else {
        this.buttonInput.disabled = false;
      }
    }
  
    removeMessages = () => {
      setTimeout( () => {
        this.errorsWrapper.innerHTML = "";
      }, 2000)
    }
  
  
    setErrorMessages = () => {
      this.errorsWrapper.innerHTML = "";
      
      const errorsObj = validator.getErrors();
  
      const errorsStringsArr = Object.values(errorsObj);
  
      errorsStringsArr.forEach( (errorStr) => {
        const errorMessageP = document.createElement('p');
        errorMessageP.innerHTML = errorStr;
  
        this.errorsWrapper.appendChild(errorMessageP);
      })
  
    }
  }
  
  const signup = new Signup();
  
  window.addEventListener("load", signup.addListeners );
  //END OF SIGNUP VALIDATION
  ///
  ///
  ///
  ///


  // ///
  // ///
  // ///
  // //START OF LOGIN VALIDATION
  class Login {
    constructor() {
      this.emailInput = document.querySelector("#email");
      this.passwordInput = document.querySelector("#password");
  
      this.loginButton = document.querySelector("#login-button");
      this.messageContainer = document.querySelector(".message-container");
    }
  
  
    submit = (event) => {
      event.preventDefault();
  
      const usersDB = db.getAllUsers();
  
      const email = this.emailInput.value;
      const password = this.passwordInput.value;
  
  
      
      const user = usersDB.find( (userObj) => {
        if (userObj.email === email && userObj.password === password) {
          return true;
        }
      })
  
  
      this.showMessage(user);
    }
  
   
    
    showMessage = (user) => {
  
      this.messageContainer.innerHTML = "";
  
      const message = document.createElement('p');
  
      if (user) {
        
        message.innerHTML = `&#127775 Welcome back, ${user.name}!`;
        message.classList.add("correct-message");
      }
      else {
        // si el inicio de sesión no se ha realizado correctamente
        message.innerHTML = '&#9940 Incorrect e-mail or password, try again.';
      }
  
      this.messageContainer.appendChild(message);
  
      if (user) this.redirect();
    }
  
    redirect = () => {
      setTimeout( ()=> location.assign('./index.html'), 2000);
    }
  
  }
  
  
  const login = new Login();
  
  login.loginButton.addEventListener("click", login.submit);
  //END OF LOGIN VALIDATION
  ///
  ///
  ///
