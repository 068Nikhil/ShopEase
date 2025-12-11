BASE_URL = "http://localhost:8080"; 

//register
async function register() {
    
    try {
        let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passPattern = /^.{6,}$/;


    if(name == "")  {
        document.getElementById("error-name").innerText = "*Name can't be empty";
        document.getElementById("name").focus();
        return;
    }
    document.getElementById("error-name").innerText = "";

    if(email == "")  {
        document.getElementById("error-email").innerText = "*Email can't be empty";
        document.getElementById("email").focus();
        return;
    }
    if(!emailPattern.test(email)) {
        document.getElementById("error-email").innerText = "*Please enter a valid Email";
        document.getElementById("email").focus();
        return;
    }

    document.getElementById("error-email").innerText = "";

    if(pass == "")  {
        document.getElementById("error-pass").innerText = "*Please give a Password";
        document.getElementById("password").focus();
        return;
    }
    if(!passPattern.test(pass)) {
        document.getElementById("error-pass").innerText = "*Password should be minimum 6 characters";
        document.getElementById("password").focus();
        return;
    }

    document.getElementById("error-pass").innerText = "";
    
    
    

    const response = await fetch(BASE_URL + "/users/register", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            name : name,
            email : email,
            password : pass,
        }),
    });

     const text = await response.text();
     const result = text ? JSON.parse(text) : null;

    if(result != null) {
        console.log("New User Registered");
        alert("Registration Successful, Go to Login Page");
        window.location.href = "login.html";
    } else {
        alert("User already exists!");
    }
    } catch(error) {
        console.log("error while registering")
    }
}




//login
async function login() {

  try {

    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

    if (email == "") {
      document.getElementById("error-email").innerText =
        "*Email can't be empty";
      document.getElementById("email").focus();
      return;
    }
    if (!emailPattern.test(email)) {
      document.getElementById("error-email").innerText = "*Invalid Email Id";
      document.getElementById("email").focus();
      return;
    }
    document.getElementById("error-email").innerText = "";


    if (pass == "") {
      document.getElementById("error-pass").innerText =
        "*Please enter your Password";
      document.getElementById("password").focus();
      return;
    }
    document.getElementById("error-pass").innerText = "";


    const response = await fetch(BASE_URL + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
      credentials : "include"
    });


    if(response.ok) {

//      alert("Logged in successfully");
      window.location.href = "welcome.html";

    } else if(response.status == 401){

      alert("Invalid Credentials!");

    } else {

      alert("Something went wrong: " + response.status);

    }


  } catch (error) {
    console.error("error logging in:", error);
  }
}



//logout
async function logout() {
  try {

    let response = await fetch(BASE_URL + "/users/logout", {
      method: "POST",
      credentials: "include"
    });

    if(response.ok) {
      alert("Logged out successfully");
      window.location.href = "index.html";
    } else {
      let msg = await response.text();
      alert("Error: " + msg);
    }
    
  } catch (error) {
    console.log("error logging out :", error);
  }
}




//get current user
async function getCurrentUser() {
    
    try {
        let response = await fetch(BASE_URL + "/users/currentUser", {
            method: "GET",
            credentials: "include"
        });

        if(response.ok) {
            return await response.json();
        } else {
            return null;
        }
    } catch(error) {
        console.log("error getting current user :", error);
        return null;
    }
    
}

